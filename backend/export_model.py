import json
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE

RAW_FEATURES = ["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"]
TARGET = "Condition"

def engineer_features(df):
    out = df.copy()
    out["TempRange"] = out["MaxTemp"] - out["MinTemp"]
    out["TempMean"] = (out["MaxTemp"] + out["MinTemp"]) / 2.0
    out["HumidityWind"] = out["Humidity"] * out["WindSpeed"] / 100.0
    out["PressureAnomaly"] = 1013.25 - out["Pressure"]
    out["StormIndex"] = (
        (out["Humidity"] / 100.0)
        * (out["WindSpeed"] / 75.0)
        * (np.clip(out["PressureAnomaly"], 0, None) / 25.0 + 0.3)
    )
    out["HeatDryIndex"] = (out["MaxTemp"] / 45.0) * (1.0 - out["Humidity"] / 100.0)
    out["FogIndex"] = (
        np.clip(1.0 - (out["MinTemp"] - 10.0) / 18.0, 0, 1)
        * (out["Humidity"] / 100.0)
        * np.clip(1.0 - out["WindSpeed"] / 75.0, 0, 1)
    )
    out["HumidityHigh"] = (np.clip(out["Humidity"] - 70, 0, None) / 30.0) ** 2
    out["HumidityLow"] = (np.clip(50 - out["Humidity"], 0, None) / 50.0) ** 2
    out["WindPower"] = (out["WindSpeed"] / 75.0) ** 1.5
    return out

ENGINEERED_FEATURES = [
    "MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed",
    "TempRange", "TempMean", "HumidityWind", "PressureAnomaly",
    "StormIndex", "HeatDryIndex", "FogIndex",
    "HumidityHigh", "HumidityLow", "WindPower",
]

df = pd.read_csv("karnataka_weather_500.csv")
le = LabelEncoder()
df_eng = engineer_features(df)
X = df_eng[ENGINEERED_FEATURES].values
y = le.fit_transform(df[TARGET])

smote = SMOTE(random_state=42, k_neighbors=5)
X_resampled, y_resampled = smote.fit_resample(X, y)

model = xgb.XGBClassifier(
    n_estimators=500, max_depth=8, learning_rate=0.05,
    subsample=0.85, colsample_bytree=0.85, min_child_weight=3,
    gamma=0.1, reg_alpha=0.1, reg_lambda=1.0,
    objective="multi:softprob", num_class=len(le.classes_),
    eval_metric="mlogloss", random_state=42,
)
model.fit(X_resampled, y_resampled)

# Dump model as JSON (list of trees)
model_json = model.get_booster().get_dump(dump_format="json")
trees = [json.loads(t) for t in model_json]

# Save everything needed for JS port
payload = {
    "trees": trees,
    "classes": le.classes_.tolist(),
    "feature_names": ENGINEERED_FEATURES,
    "n_estimators": model.n_estimators,
    "num_class": len(le.classes_),
    "learning_rate": 0.05,  # needed for shrinkage
}

with open("xgboost_model.json", "w") as f:
    json.dump(payload, f, indent=2)

print(f"Exported {len(trees)} trees over {len(le.classes_)} classes")
print(f"Classes: {le.classes_.tolist()}")
print(f"Feature count: {len(ENGINEERED_FEATURES)}")

# Test a prediction to verify JS port later
test_input = pd.DataFrame([[
    22.0, 30.0, 65.0, 1012.0, 15.0
]], columns=RAW_FEATURES)
test_eng = engineer_features(test_input)
test_arr = test_eng[ENGINEERED_FEATURES].values
pred_idx = model.predict(test_arr)[0]
pred_label = le.inverse_transform([pred_idx])[0]
probs = model.predict_proba(test_arr)[0]
print(f"\nTest prediction: {pred_label} (confidence: {max(probs):.4f})")
print(f"All probs: {dict(zip(le.classes_, probs))}")
