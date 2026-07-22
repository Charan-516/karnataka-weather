import httpx
from typing import Optional
from services.cache import wikimedia_cache

_HEADERS = {
    "User-Agent": "KarnatakaWeather/1.0 (weather-app; contact@example.com) httpx"
}


async def fetch_images(query: str, limit: int = 6) -> Optional[list]:
    key = f"img_{query}_{limit}"
    cached = wikimedia_cache.get(key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=15, headers=_HEADERS) as client:
            resp = await client.get(
                "https://commons.wikimedia.org/w/api.php",
                params={
                    "action": "query",
                    "generator": "search",
                    "gsrsearch": query + " Karnataka",
                    "gsrlimit": limit,
                    "gsrnamespace": "6",
                    "prop": "imageinfo",
                    "iiprop": "url",
                    "iiurlwidth": 800,
                    "format": "json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            results = []
            for pid, page in pages.items():
                if pid == "-1":
                    continue
                title = page.get("title", "").replace("File:", "")
                info = page.get("imageinfo", [])
                if info:
                    results.append({
                        "title": title,
                        "url": info[0].get("url"),
                    })
            final = results if results else None
            if final:
                wikimedia_cache.set(key, final)
            return final
    except Exception as e:
        print(f"[Wikimedia] Error: {e}")
        return None


async def _get_image_url(title: str) -> Optional[str]:
    try:
        async with httpx.AsyncClient(timeout=5, headers=_HEADERS) as client:
            resp = await client.get(
                "https://commons.wikimedia.org/w/api.php",
                params={
                    "action": "query",
                    "titles": title,
                    "prop": "imageinfo",
                    "iiprop": "url",
                    "iiurlwidth": 800,
                    "format": "json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            pages = data.get("query", {}).get("pages", {})
            for pid, page in pages.items():
                if pid == "-1":
                    continue
                info = page.get("imageinfo", [])
                if info:
                    return info[0].get("url")
    except Exception as e:
        print(f"[Wikimedia] Error fetching URL for {title}: {e}")
    return None
