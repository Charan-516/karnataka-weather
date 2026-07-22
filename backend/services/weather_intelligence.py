import asyncio
from services.sources import open_meteo, overpass, wikipedia, wikimedia, rss_news
from services.response_merger import merge_responses
from services.llm_summarizer import generate_summary
from services.cache import intelligence_cache, computing

DISTRICT_COORDS: dict[str, tuple[float, float]] = {
    "BengaluruUrban": (12.9716, 77.5946),
    "BengaluruRural": (13.1, 77.6),
    "DakshinaKannada": (12.87, 74.88),
    "Udupi": (13.34, 74.75),
    "UttaraKannada": (14.8, 74.5),
    "Shivamogga": (13.93, 75.57),
    "Chikkamagaluru": (13.32, 75.77),
    "Tumakuru": (13.34, 77.10),
    "Kolar": (13.13, 78.13),
    "Chikkaballapura": (13.43, 77.73),
    "Ramanagara": (12.72, 77.28),
    "Mysuru": (12.30, 76.64),
    "Chamarajanagara": (11.92, 76.94),
    "Mandya": (12.52, 76.89),
    "Hassan": (13.00, 76.10),
    "Kodagu": (12.42, 75.74),
    "Dharwad": (15.46, 75.01),
    "Belagavi": (15.85, 74.50),
    "Bagalkote": (16.18, 75.70),
    "Vijayapura": (16.83, 75.71),
    "Gadag": (15.43, 75.63),
    "Haveri": (14.79, 75.40),
    "Raichur": (16.20, 77.35),
    "Koppala": (15.35, 76.15),
    "Ballari": (15.15, 76.93),
    "Vijayanagara": (15.27, 76.50),
    "Kalaburagi": (17.33, 76.84),
    "Yadgir": (16.77, 77.13),
    "Bidar": (17.91, 77.52),
}

DEFAULT_COORDS = (12.97, 77.59)


async def get_intelligence(
    district: str,
    place: str | None = None,
    place_lat: float | None = None,
    place_lng: float | None = None,
) -> dict:
    norm = district.replace(" ", "").replace("-", "")

    if not place:
        cached = intelligence_cache.get(norm)
        if cached is not None:
            print(f"[Intelligence] Cache hit for {district}")
            return cached

        if norm in computing:
            print(f"[Intelligence] Waiting for pre-warm: {district}")
            for _ in range(100):
                cached = intelligence_cache.get(norm)
                if cached is not None:
                    print(f"[Intelligence] Pre-warm complete for {district}")
                    return cached
                await asyncio.sleep(0.1)

    coords = DISTRICT_COORDS.get(norm, DEFAULT_COORDS)
    lat, lng = coords

    query_name = district.replace(" ", "_")

    weather_task = open_meteo.fetch_weather(
        place_lat if place_lat else lat,
        place_lng if place_lng else lng,
    )

    if place and place_lat and place_lng:
        places_task = overpass.fetch_places_nearby(place_lat, place_lng)
    else:
        places_task = overpass.fetch_places(district)

    wiki_task = wikipedia.fetch_wikipedia_summary(query_name)

    if place:
        place_query = place.replace(" ", "_")
        place_wiki_task = wikipedia.fetch_wikipedia_summary(place_query)
    else:
        place_wiki_task = None

    voy_query = place.replace(" ", "_") if place else query_name
    voy_task = wikipedia.fetch_wikivoyage(voy_query)

    img_query = place.replace(" ", "_") if place else query_name
    images_task = wikimedia.fetch_images(img_query)

    news_task = rss_news.fetch_news(district, place)

    results = await asyncio.gather(
        weather_task, places_task, wiki_task, voy_task, images_task, news_task,
        return_exceptions=True,
    )

    task_names = ["weather", "places", "wiki", "voyage", "images", "news"]

    def _safe(val, default=None):
        if isinstance(val, Exception):
            idx = results.index(val) if val in results else -1
            name = task_names[idx] if 0 <= idx < len(task_names) else "unknown"
            print(f"[Intelligence] {name} task failed: {val}")
            return default
        return val

    weather = _safe(results[0])
    places = _safe(results[1])
    wiki = _safe(results[2])
    voy = _safe(results[3])
    images = _safe(results[4])
    news = _safe(results[5])

    if place_wiki_task:
        try:
            place_wiki = await place_wiki_task
            if place_wiki and place_wiki.get("extract"):
                wiki = place_wiki
        except Exception as e:
            print(f"[Wikipedia] Error fetching place wiki: {e}")

    merged = merge_responses(weather, places, wiki, voy, images, news)

    if place:
        merged["focus_place"] = place
        merged["_available"].append("focus_place")

    summary = await generate_summary(place if place else district, merged)
    if summary:
        merged["summary"] = summary

    if not place:
        intelligence_cache.set(norm, merged)
        print(f"[Intelligence] Cached result for {district}")

    return merged
