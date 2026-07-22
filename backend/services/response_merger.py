def merge_responses(
    weather: dict | None,
    places: list | None,
    wikipedia: dict | None,
    wikivoyage: dict | None,
    images: list | None,
    news: list | None,
) -> dict:
    merged = {}

    if weather:
        merged["weather"] = weather
    if places:
        merged["places"] = places
    if wikipedia:
        merged["wikipedia"] = wikipedia
    if wikivoyage:
        merged["wikivoyage"] = wikivoyage
    if images:
        merged["images"] = images
    if news:
        merged["news"] = news

    avails = []
    if weather:
        avails.append("weather")
    if places:
        avails.append("places")
    if wikipedia or wikivoyage:
        avails.append("knowledge")
    if images:
        avails.append("images")
    if news:
        avails.append("news")

    merged["_available"] = avails

    return merged
