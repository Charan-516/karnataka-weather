import httpx
import xml.etree.ElementTree as ET
from typing import Optional


async def fetch_news(district: str, place: Optional[str] = None) -> Optional[list]:
    try:
        if place:
            query = f"{place.replace(' ', '%20')}%20{district.replace(' ', '%20')}%20Karnataka"
        else:
            query = district.replace(" ", "%20") + "%20Karnataka"
        url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            root = ET.fromstring(resp.content)
            items = []
            for i, item in enumerate(root.iter("item")):
                if i >= 8:
                    break
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", "")
                source = item.findtext("source", "")
                items.append({
                    "title": title,
                    "url": link,
                    "source": source,
                    "published": pub_date,
                })
            return items if items else None
    except Exception as e:
        print(f"[RSS News] Error: {e}")
        return None
