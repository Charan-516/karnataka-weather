import os
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from services import iot_manager
from services.prediction_utils import ENGINEERED_FEATURES, engineer_features, apply_rule_overrides
import pandas as pd
import numpy as np

router = APIRouter(prefix="/iot", tags=["IoT"])

model = None
label_encoder = None


def init(model_ref, encoder_ref):
    global model, label_encoder
    model = model_ref
    label_encoder = encoder_ref


def _verify_api_key(x_api_key: Optional[str] = Header(None)):
    expected = os.environ.get("IOT_API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


class SensorData(BaseModel):
    session_id: str
    temperature: float
    humidity: float
    pressure: float
    wind_speed: float


class SessionCreate(BaseModel):
    district: str
    session_id: str


@router.post("/create-session")
async def create_session(data: SessionCreate, x_api_key: Optional[str] = Header(None)):
    _verify_api_key(x_api_key)
    session = iot_manager.create_session(data.session_id, data.district)
    return {"session_id": session["session_id"], "status": session["status"]}


@router.post("/sensor-data")
async def receive_sensor_data(data: SensorData, x_api_key: Optional[str] = Header(None)):
    _verify_api_key(x_api_key)
    session = iot_manager.update_sensor_data(data.session_id, {
        "temperature": data.temperature,
        "humidity": data.humidity,
        "pressure": data.pressure,
        "wind_speed": data.wind_speed,
    })
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    prediction = None
    if model is not None and label_encoder is not None:
        try:
            # Estimate min/max range from single sensor reading
            min_temp = data.temperature - 3.0
            max_temp = data.temperature + 3.0

            raw = pd.DataFrame([[
                min_temp,
                max_temp,
                data.humidity,
                data.pressure,
                data.wind_speed,
            ]], columns=["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"])
            eng = engineer_features(raw)
            input_arr = eng[ENGINEERED_FEATURES].values
            pred_idx = model.predict(input_arr)[0]
            ml_label = label_encoder.inverse_transform([pred_idx])[0]
            probs = model.predict_proba(input_arr)[0]
            ml_confidence = float(max(probs))
            final_label, final_confidence = apply_rule_overrides(
                data.humidity, data.wind_speed, min_temp, max_temp,
                ml_label, ml_confidence,
            )
            prediction = {
                "condition": final_label,
                "confidence": final_confidence,
            }
        except Exception as e:
            print(f"[IoT] Prediction error: {e}")
            prediction = {"condition": "Unknown", "confidence": 0.5}

    if prediction:
        iot_manager.set_prediction(data.session_id, prediction)

    return {
        "session_id": data.session_id,
        "status": session["status"],
        "prediction": prediction,
    }


@router.get("/session/{session_id}")
async def get_session(session_id: str, x_api_key: Optional[str] = Header(None)):
    _verify_api_key(x_api_key)
    session = iot_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
