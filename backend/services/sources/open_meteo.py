import httpx
from typing import Optional
from services.cache import weather_cache


async def fetch_weather(lat: float, lng: float) -> Optional[dict]:
    key = f"{lat:.4f},{lng:.4f}"
    cached = weather_cache.get(key)
    if cached is not None:
        return cached

    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lng,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
            "timezone": "Asia/Kolkata",
            "forecast_days": 3,
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            weather_cache.set(key, data)
            return data
    except Exception as e:
        print(f"[Open-Meteo] Error: {e}")
        return None
