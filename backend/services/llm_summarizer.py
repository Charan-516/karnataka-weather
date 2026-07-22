import os
from typing import Optional


def _get_providers() -> list:
    providers = []

    groq_key = os.environ.get("GROQ_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")

    if groq_key:
        providers.append({
            "name": "Groq",
            "url": "https://api.groq.com/openai/v1/chat/completions",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {groq_key}",
            },
            "build_body": lambda prompt: {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
            },
            "parse": lambda data: (
                data.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
            ),
        })

    if gemini_key:
        providers.append({
            "name": "Gemini",
            "url": (
                "https://generativelanguage.googleapis.com/v1beta/"
                "models/gemini-2.0-flash:generateContent"
            ),
            "headers": {
                "Content-Type": "application/json",
                "x-goog-api-key": gemini_key,
            },
            "build_body": lambda prompt: {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": 200},
            },
            "parse": lambda data: (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
            ),
        })

    return providers


async def generate_summary(district: str, context: dict) -> Optional[str]:
    providers = _get_providers()
    if not providers:
        return None

    avails = context.get("_available", [])
    weather_str = ""
    if "weather" in avails:
        w = context.get("weather", {})
        current = w.get("current", {})
        weather_str = (
            f"Current: {current.get('temperature_2m')}°C, "
            f"humidity {current.get('relative_humidity_2m')}%, "
            f"wind {current.get('wind_speed_10m')} km/h. "
        )

    places_str = ""
    if "places" in avails:
        names = [p.get("name") for p in (context.get("places") or [])[:5]]
        if names:
            places_str = "Places: " + ", ".join(names) + ". "

    wiki_str = ""
    if "knowledge" in avails:
        wp = context.get("wikipedia") or {}
        wv = context.get("wikivoyage") or {}
        extracts = []
        if wp.get("extract"):
            extracts.append(wp["extract"][:500])
        if wv.get("extract"):
            extracts.append(wv["extract"][:500])
        if extracts:
            wiki_str = "Info: " + " ".join(extracts) + " "

    prompt = (
        f"You are a weather and travel assistant for Karnataka, India. "
        f"Provide a concise 3-4 sentence summary about {district} district. "
        f"{weather_str}{places_str}{wiki_str}"
        f"Focus on current conditions and what visitors should know. "
        f"Keep it warm and informative."
    )

    import httpx

    async with httpx.AsyncClient(timeout=15) as client:
        for p in providers:
            try:
                resp = await client.post(
                    p["url"],
                    headers=p["headers"],
                    json=p["build_body"](prompt),
                )
                if resp.status_code == 429:
                    print(f"[LLM] {p['name']} rate-limited, trying next")
                    continue
                resp.raise_for_status()
                text = p["parse"](resp.json())
                if text.strip():
                    return text.strip()
            except Exception as e:
                print(f"[LLM] {p['name']} failed: {e}")
                continue

    return None
