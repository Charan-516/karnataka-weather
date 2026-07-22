import httpx
from typing import Optional


_HEADERS = {
    "User-Agent": "KarnatakaWeather/1.0 (weather-app; contact@example.com) httpx"
}

async def fetch_wikipedia_summary(query: str) -> Optional[dict]:
    try:
        async with httpx.AsyncClient(timeout=10, headers=_HEADERS) as client:
            resp = await client.get(
                "https://en.wikipedia.org/api/rest_v1/page/summary/" + query,
            )
            if resp.status_code == 404:
                resp = await client.get(
                    "https://en.wikipedia.org/api/rest_v1/page/summary/" + query + "_district",
                )
            if resp.status_code == 404:
                resp = await client.get(
                    "https://en.wikipedia.org/api/rest_v1/page/summary/" + query + ",_Karnataka",
                )
            resp.raise_for_status()
            data = resp.json()
            return {
                "title": data.get("title"),
                "extract": data.get("extract"),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page"),
                "thumbnail": data.get("thumbnail", {}).get("source"),
            }
    except Exception as e:
        print(f"[Wikipedia] Error: {e}")
        return None


async def fetch_wikivoyage(query: str) -> Optional[dict]:
    try:
        async with httpx.AsyncClient(timeout=10, headers=_HEADERS) as client:
            resp = await client.get(
                "https://en.wikivoyage.org/api/rest_v1/page/summary/" + query,
            )
            if resp.status_code == 404:
                return None
            resp.raise_for_status()
            data = resp.json()
            return {
                "title": data.get("title"),
                "extract": data.get("extract"),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page"),
            }
    except Exception as e:
        print(f"[Wikivoyage] Error: {e}")
        return None
