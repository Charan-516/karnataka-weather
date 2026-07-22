import httpx
from typing import Optional
from services.static_places import PLACES_BY_DISTRICT
from services.cache import places_cache

_HEADERS = {
    "User-Agent": "KarnatakaWeather/1.0 (weather-app; contact@example.com) httpx",
    "Accept": "application/json",
}

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
OVERPASS_MIRROR = "https://overpass.kumi.systems/api/interpreter"


async def _try_overpass(query: str) -> Optional[list]:
    for url in (OVERPASS_URL, OVERPASS_MIRROR):
        try:
            async with httpx.AsyncClient(timeout=20, headers=_HEADERS) as client:
                resp = await client.post(url, data={"data": query})
                if resp.status_code == 200:
                    data = resp.json()
                    elements = data.get("elements", [])
                    places = []
                    for e in elements[:20]:
                        tags = e.get("tags", {})
                        name = tags.get("name")
                        if not name:
                            continue
                        place_type = (
                            tags.get("tourism")
                            or tags.get("historic")
                            or tags.get("leisure")
                            or "place"
                        )
                        places.append({
                            "name": name,
                            "type": place_type,
                            "lat": e.get("lat"),
                            "lng": e.get("lon"),
                        })
                    if places:
                        return places
        except Exception as e:
            print(f"[Overpass] Error for {url}: {e}")
            continue
    return None


def _static_fallback(district: str) -> Optional[list]:
    key = district.replace(" ", "").replace("-", "").lower()
    for k, v in PLACES_BY_DISTRICT.items():
        if k.replace(" ", "").replace("-", "").lower() == key:
            return v
    return None


async def fetch_places(district: str) -> Optional[list]:
    key = f"places_{district}"
    cached = places_cache.get(key)
    if cached is not None:
        return cached

    query = f"""
    [out:json][timeout:15];
    area[name="Karnataka"]->.a;
    (
      node(area.a)[tourism=attraction][name~"{district}",i];
      node(area.a)[historic=monument][name~"{district}",i];
      node(area.a)[leisure=park][name~"{district}",i];
    );
    out body 20;
    """
    places = await _try_overpass(query)
    if places:
        places_cache.set(key, places)
        return places
    fallback = _static_fallback(district)
    if fallback:
        print(f"[Overpass] Fallback to static data for {district}")
        places_cache.set(key, fallback)
        return fallback
    return None


async def fetch_places_nearby(lat: float, lng: float, radius: int = 3000) -> Optional[list]:
    key = f"nearby_{lat:.4f},{lng:.4f}_{radius}"
    cached = places_cache.get(key)
    if cached is not None:
        return cached

    query = f"""
    [out:json][timeout:15];
    (
      node(around:{radius},{lat},{lng})[tourism=attraction];
      node(around:{radius},{lat},{lng})[historic=monument];
      node(around:{radius},{lat},{lng})[leisure=park];
    );
    out body 10;
    """
    places = await _try_overpass(query)
    if places:
        places_cache.set(key, places)
        return places
    # Fallback: return nearest static places sorted by distance
    all_places = []
    for district_places in PLACES_BY_DISTRICT.values():
        for p in district_places:
            dlat = (p.get("lat") or 0) - lat
            dlng = (p.get("lng") or 0) - lng
            p["_dist"] = dlat * dlat + dlng * dlng
            all_places.append(p)
    if all_places:
        all_places.sort(key=lambda x: x["_dist"])
        return [{k: v for k, v in p.items() if k != "_dist"} for p in all_places[:10]]
    return None
