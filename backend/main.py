import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=False)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from services.weather_intelligence import get_intelligence
from services.prediction_utils import ENGINEERED_FEATURES, engineer_features, apply_rule_overrides
from services.iot_gateway import router as iot_router, init as iot_init
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
import uvicorn
import threading
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
CSV_PATH = BACKEND_DIR / "karnataka_weather_500.csv"

model = None
label_encoder = LabelEncoder()
model_ready = threading.Event()
training_failed = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    t = threading.Thread(target=train_model, daemon=True)
    t.start()
    yield


app = FastAPI(lifespan=lifespan)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda req, exc: JSONResponse(
    status_code=429,
    content={"error": "Rate limit exceeded. Please try again later."},
))

# CORS — restrict to allowed origins from env
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(iot_router)

# Raw columns from CSV
RAW_FEATURES = ["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"]
TARGET = "Condition"


def train_model():
    global model, label_encoder, training_failed
    print("=" * 60)
    print("  Training Enhanced XGBoost Weather Classifier")
    print("=" * 60)

    try:
        df = pd.read_csv(CSV_PATH)

        print(f"\nDataset: {len(df)} rows")
        print(f"\nOriginal class distribution:")
        print(df[TARGET].value_counts().to_string())

        # Engineer features
        df_eng = engineer_features(df)
        X = df_eng[ENGINEERED_FEATURES].values
        y = label_encoder.fit_transform(df[TARGET])

        print(f"\nClasses: {list(label_encoder.classes_)}")
        print(f"Engineered features: {len(ENGINEERED_FEATURES)}")

        # SMOTE oversample minority classes to balance the dataset
        smote = SMOTE(random_state=42, k_neighbors=5)
        X_resampled, y_resampled = smote.fit_resample(X, y)

        print(f"\nAfter SMOTE resampling: {len(X_resampled)} samples")
        unique, counts = np.unique(y_resampled, return_counts=True)
        for cls_idx, count in zip(unique, counts):
            print(f"  {label_encoder.classes_[cls_idx]}: {count}")

        # Train XGBoost with tuned hyperparameters
        clf = xgb.XGBClassifier(
            n_estimators=500,
            max_depth=8,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.85,
            min_child_weight=3,
            gamma=0.1,
            reg_alpha=0.1,
            reg_lambda=1.0,
            objective="multi:softprob",
            num_class=len(label_encoder.classes_),
            eval_metric="mlogloss",
            random_state=42,
        )

        clf.fit(X_resampled, y_resampled)
        model = clf  # only set global model after training completes
        iot_init(model, label_encoder)

        # Evaluate on ORIGINAL (non-resampled) data
        preds = clf.predict(X)
        print("\n" + "=" * 60)
        print("  MODEL PERFORMANCE (on original data)")
        print("=" * 60)
        print(classification_report(
            y, preds, target_names=label_encoder.classes_
        ))

        # Cross-validation on original data
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
        print(f"5-Fold CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

        # Feature importance
        importances = model.feature_importances_
        sorted_idx = np.argsort(importances)[::-1]
        print("\nTop Feature Importances:")
        for i in range(min(8, len(sorted_idx))):
            idx = sorted_idx[i]
            print(f"  {ENGINEERED_FEATURES[idx]}: {importances[idx]:.4f}")

        print("\n[OK] Model trained successfully!")
        print("=" * 60)
        model_ready.set()

    except Exception as e:
        training_failed = True
        model_ready.set()
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()


class WeatherInput(BaseModel):
    minTemp: float
    maxTemp: float
    humidity: float
    pressure: float
    windSpeed: float


@app.post("/predict")
@limiter.limit("30/minute")
async def predict_weather(request: Request, data: WeatherInput):
    if model is None:
        if training_failed:
            return JSONResponse(
                status_code=503,
                content={"error": "Model training failed. Server cannot process predictions."},
            )
        # Wait up to 60s for training to finish
        model_ready.wait(timeout=60)
        if model is None:
            return JSONResponse(
                status_code=503,
                content={"error": "Model still loading. Please retry shortly."},
                headers={"Retry-After": "30"},
            )

    # Build raw input row
    raw = pd.DataFrame([[
        data.minTemp,
        data.maxTemp,
        data.humidity,
        data.pressure,
        data.windSpeed,
    ]], columns=RAW_FEATURES)

    # Apply same feature engineering
    eng = engineer_features(raw)
    input_arr = eng[ENGINEERED_FEATURES].values

    # ML prediction
    prediction_idx = model.predict(input_arr)[0]
    ml_label = label_encoder.inverse_transform([prediction_idx])[0]

    probs = model.predict_proba(input_arr)[0]
    ml_confidence = float(max(probs))

    # Apply meteorological rule overrides
    final_label, final_confidence = apply_rule_overrides(
        data.humidity, data.windSpeed, data.minTemp, data.maxTemp,
        ml_label, ml_confidence,
    )

    # Logging
    print(f"\n--- Prediction Request ---")
    print(f"Input: MinT={data.minTemp} MaxT={data.maxTemp} "
          f"Hum={data.humidity} Pres={data.pressure} Wind={data.windSpeed}")
    print(f"ML probabilities:")
    for i, cls in enumerate(label_encoder.classes_):
        marker = " <--" if cls == ml_label else ""
        print(f"  {cls}: {probs[i]:.2%}{marker}")
    if final_label != ml_label:
        print(f"Rule override: {ml_label} -> {final_label}")
    print(f"Final: {final_label} ({final_confidence:.2%})")

    return {
        "condition": final_label,
        "confidence": final_confidence,
    }


@app.get("/intelligence")
@limiter.limit("10/minute")
async def weather_intelligence(request: Request, district: str, place: str | None = None, lat: float | None = None, lng: float | None = None):
    result = await get_intelligence(district, place, lat, lng)
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)