import pandas as pd

df = pd.read_csv("karnataka_weather_500.csv")

print("=== TOTAL ROWS ===")
print(len(df))

print("\n=== CONDITIONS COUNT ===")
print(df["Condition"].value_counts())

print("\n=== AVERAGE BY CONDITION ===")
print(df.groupby("Condition")[["MinTemp", "MaxTemp", "Humidity", "Pressure", "WindSpeed"]].mean())