import httpx
from typing import Optional
from services.cache import wiki_cache


_HEADERS = {
    "User-Agent": "KarnatakaWeather/1.0 (weather-app; contact@example.com) httpx"
}

async def fetch_wikipedia_summary(query: str) -> Optional[dict]:
    key = f"wiki_{query}"
    cached = wiki_cache.get(key)
    if cached is not None:
        return cached

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
            result = {
                "title": data.get("title"),
                "extract": data.get("extract"),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page"),
                "thumbnail": data.get("thumbnail", {}).get("source"),
            }
            wiki_cache.set(key, result)
            return result
    except Exception as e:
        print(f"[Wikipedia] Error: {e}")
        return None


async def fetch_wikivoyage(query: str) -> Optional[dict]:
    key = f"voy_{query}"
    cached = wiki_cache.get(key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10, headers=_HEADERS) as client:
            resp = await client.get(
                "https://en.wikivoyage.org/api/rest_v1/page/summary/" + query,
            )
            if resp.status_code == 404:
                return None
            resp.raise_for_status()
            data = resp.json()
            result = {
                "title": data.get("title"),
                "extract": data.get("extract"),
                "url": data.get("content_urls", {}).get("desktop", {}).get("page"),
            }
            wiki_cache.set(key, result)
            return result
    except Exception as e:
        print(f"[Wikivoyage] Error: {e}")
        return None
