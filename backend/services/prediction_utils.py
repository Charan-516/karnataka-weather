import pandas as pd
import numpy as np

RAW_FEATURES = ["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"]

ENGINEERED_FEATURES = [
    "MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed",
    "TempRange", "TempMean", "HumidityWind", "PressureAnomaly",
    "StormIndex", "HeatDryIndex", "FogIndex",
    "HumidityHigh", "HumidityLow", "WindPower",
]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["TempRange"] = out["MaxTemp"] - out["MinTemp"]
    out["TempMean"] = (out["MaxTemp"] + out["MinTemp"]) / 2.0
    out["HumidityWind"] = out["Humidity"] * out["WindSpeed"] / 100.0
    out["PressureAnomaly"] = 1013.25 - out["Pressure"]
    out["StormIndex"] = (
        (out["Humidity"] / 100.0)
        * (out["WindSpeed"] / 75.0)
        * (out["PressureAnomaly"].clip(lower=0) / 25.0 + 0.3)
    )
    out["HeatDryIndex"] = (out["MaxTemp"] / 45.0) * (1.0 - out["Humidity"] / 100.0)
    out["FogIndex"] = (
        (1.0 - (out["MinTemp"] - 10.0) / 18.0).clip(0, 1)
        * (out["Humidity"] / 100.0)
        * (1.0 - out["WindSpeed"] / 75.0).clip(0, 1)
    )
    out["HumidityHigh"] = ((out["Humidity"] - 70).clip(lower=0) / 30.0) ** 2
    out["HumidityLow"] = ((50 - out["Humidity"]).clip(lower=0) / 50.0) ** 2
    out["WindPower"] = (out["WindSpeed"] / 75.0) ** 1.5
    return out


def apply_rule_overrides(humidity: float, wind: float, min_temp: float, max_temp: float,
                         ml_label: str, ml_confidence: float) -> tuple:
    if humidity >= 88 and wind >= 40:
        return "Stormy", max(ml_confidence, 0.88)
    if humidity >= 88 and wind >= 5:
        return "Rainy", max(ml_confidence, 0.82)
    if humidity >= 85 and wind >= 15:
        return "Rainy", max(ml_confidence, 0.84)
    if humidity >= 92 and wind >= 3:
        return "Rainy", max(ml_confidence, 0.80)
    if humidity >= 40 and wind <= 15 and min_temp <= 18 and max_temp <= 26:
        return "Foggy", max(ml_confidence, 0.78)
    if humidity >= 70:
        return "Cloudy", max(ml_confidence, 0.80)
    if wind >= 30:
        return "Windy", max(ml_confidence, 0.82)
    if max_temp >= 26 and humidity <= 55:
        return "Sunny", max(ml_confidence, 0.85)
    return ml_label, ml_confidence
