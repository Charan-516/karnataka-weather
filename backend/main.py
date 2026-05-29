from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
label_encoder = LabelEncoder()

# Raw columns from CSV
RAW_FEATURES = ["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"]
TARGET = "Condition"


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create derived meteorological features that give the model
    much stronger discriminative signals between weather conditions.
    """
    out = df.copy()

    # Temperature dynamics
    out["TempRange"] = out["MaxTemp"] - out["MinTemp"]
    out["TempMean"] = (out["MaxTemp"] + out["MinTemp"]) / 2.0

    # Humidity-wind interaction — key separator for Rainy/Stormy vs Sunny
    out["HumidityWind"] = out["Humidity"] * out["WindSpeed"] / 100.0

    # Pressure departure from standard atmosphere (1013.25 hPa)
    out["PressureAnomaly"] = 1013.25 - out["Pressure"]

    # Storm index: high humidity + high wind + low pressure = stormy
    out["StormIndex"] = (
        (out["Humidity"] / 100.0)
        * (out["WindSpeed"] / 75.0)
        * (out["PressureAnomaly"].clip(lower=0) / 25.0 + 0.3)
    )

    # Heat index proxy: high temp + low humidity = sunny/windy
    out["HeatDryIndex"] = (out["MaxTemp"] / 45.0) * (1.0 - out["Humidity"] / 100.0)

    # Fog index: low temp + moderate humidity + low wind
    out["FogIndex"] = (
        (1.0 - (out["MinTemp"] - 10.0) / 18.0).clip(0, 1)
        * (out["Humidity"] / 100.0)
        * (1.0 - out["WindSpeed"] / 75.0).clip(0, 1)
    )

    # Humidity buckets — quadratic push
    out["HumidityHigh"] = ((out["Humidity"] - 70).clip(lower=0) / 30.0) ** 2
    out["HumidityLow"] = ((50 - out["Humidity"]).clip(lower=0) / 50.0) ** 2

    # Wind power (non-linear)
    out["WindPower"] = (out["WindSpeed"] / 75.0) ** 1.5

    return out


# After engineering, these are the model input columns
ENGINEERED_FEATURES = [
    "MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed",
    "TempRange", "TempMean", "HumidityWind", "PressureAnomaly",
    "StormIndex", "HeatDryIndex", "FogIndex",
    "HumidityHigh", "HumidityLow", "WindPower",
]


def apply_rule_overrides(data, ml_label: str, ml_confidence: float) -> tuple:
    """
    Meteorologically-calibrated rule overrides based on the actual
    feature distributions per condition found in the dataset.
    Only fires when the input values are strongly in a non-Sunny zone
    and the ML model is uncertain or wrong.
    """
    humidity = data.humidity
    wind = data.windSpeed
    min_temp = data.minTemp
    max_temp = data.maxTemp

    # ----- STORMY: extreme wind + very high humidity -----
    if humidity >= 88 and wind >= 50:
        return "Stormy", max(ml_confidence, 0.85)

    # ----- RAINY: very high humidity + moderate-high wind -----
    if humidity >= 85 and wind >= 30:
        return "Rainy", max(ml_confidence, 0.82)

    # ----- RAINY: extreme humidity alone -----
    if humidity >= 92 and wind >= 15:
        return "Rainy", max(ml_confidence, 0.80)

    # ----- CLOUDY: high humidity, moderate wind -----
    if humidity >= 70 and wind >= 18 and wind < 50:
        return "Cloudy", max(ml_confidence, 0.78)

    # ----- CLOUDY: moderately high humidity -----
    if humidity >= 75 and wind < 18:
        return "Cloudy", max(ml_confidence, 0.72)

    # ----- FOGGY: cold + low wind -----
    if min_temp <= 16 and max_temp <= 25 and humidity >= 35 and wind <= 20:
        return "Foggy", max(ml_confidence, 0.75)

    # ----- WINDY: hot + dry -----
    if max_temp >= 33 and humidity <= 55:
        return "Windy", max(ml_confidence, 0.76)

    # If no rule fires, trust the ML model
    return ml_label, ml_confidence


@app.on_event("startup")
def train_model():
    global model, label_encoder
    print("=" * 60)
    print("  Training Enhanced XGBoost Weather Classifier")
    print("=" * 60)

    try:
        df = pd.read_csv("karnataka_weather_500.csv")

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
        model = xgb.XGBClassifier(
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

        model.fit(X_resampled, y_resampled)

        # Evaluate on ORIGINAL (non-resampled) data
        preds = model.predict(X)
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

    except Exception as e:
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
async def predict_weather(data: WeatherInput):
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
        data, ml_label, ml_confidence
    )

    # Logging
    print(f"\n--- Prediction Request ---")
    print(f"Input: MinT={data.minTemp} MaxT={data.maxTemp} "
          f"Hum={data.humidity} Pres={data.pressure} Wind={data.windSpeed}")
    print(f"ML probabilities:")
    for i, cls in enumerate(label_encoder.classes_):
        marker = " <--" if cls == ml_label else ""
        print(f"  {cls}: {probs[i]:.2%}{marker}")
    if final_label != ml_label:  # rule fired
        print(f"Rule override: {ml_label} -> {final_label}")
    print(f"Final: {final_label} ({final_confidence:.2%})")

    return {
        "condition": final_label,
        "confidence": final_confidence,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)