import time
from typing import Any, Optional


class TTLCache:
    def __init__(self, ttl: int):
        self._ttl = ttl
        self._cache: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            value, ts = self._cache[key]
            if time.time() - ts < self._ttl:
                return value
            del self._cache[key]
        return None

    def set(self, key: str, value: Any):
        self._cache[key] = (value, time.time())

    def has(self, key: str) -> bool:
        if key in self._cache:
            _, ts = self._cache[key]
            if time.time() - ts < self._ttl:
                return True
            del self._cache[key]
        return False


weather_cache = TTLCache(120)
places_cache = TTLCache(21600)
wiki_cache = TTLCache(86400)
wikimedia_cache = TTLCache(21600)
news_cache = TTLCache(1800)
llm_cache = TTLCache(120)
intelligence_cache = TTLCache(120)

computing: set[str] = set()
