# Karnataka Weather Application: Updates & Execution Guide

This document logs all structural updates, architectural enhancements, and provides step-by-step instructions on how to run both the frontend Next.js server and the backend FastAPI service correctly.

---

> [!IMPORTANT]
> **Directory Context Warning**
> The project files are housed within the `karnataka-weather` subdirectory. Running commands like `npm run dev`, `cd backend`, or `python main.py` directly from the parent workspace folder (`latest karnataka-weather`) will fail. 
> Always navigate to the correct subdirectory using the commands provided below.

---

## Summary of All Updates

### Phase 1: Critical Dependencies & Security

- **requirements.txt** — Added `slowapi` for rate limiting
- **package.json** — Added `lenis` smooth scroll dependency
- **.gitignore** — Comprehensive coverage: `.env*`, `node_modules`, `venv`, `__pycache__`, `*.csv`, `*.ubj`, `*.pyc`
- **.env.example** — Sanitized template with placeholder values

### Phase 2: Critical Bugs

- **IoT ±3°C temperature bound fix** — Backend now returns temperature estimate ±3°C range
- **CORS + rate limiting** — Added `slowapi` rate limiter (10 requests/minute on prediction, IoT, and intelligence endpoints)
- **`/predict` wait logic** — Frontend waits server-side until model training completes before accepting predictions

### Phase 3: High-Severity Fixes

- **Dead XGBoost client code deleted** — Removed `src/lib/xgboost.ts` (393 lines) and `src/lib/xgboost_model.json` (6.8MB). Client-side inference was dead code; fallback is inline `if/else` rules.
- **IoT cleanup** — Removed unused IoT control commands
- **`asyncio.gather` return_exceptions** — LLM provider race condition fixed
- **Overpass district filter** — API queries now filter by district name
- **LLM race condition fix** — Proper `asyncio.gather(return_exceptions=True)` for timeout isolation
- **Gemini header fix** — Correct API header format
- **IoT API key auth** — Added `X-Api-Key` header verification for all IoT endpoints via `_verify_api_key()` in `iot_gateway.py`

### Phase 4: Medium-Severity Fixes

- **District content verified** — All 30 districts have complete travel guides
- **Places data verified** — All 30 districts have complete place listings
- **Duplicate keys in weather_intelligence.py fixed** — Removed duplicate function definitions
- **`engineer_features()` deduplicated** — Single canonical implementation in `prediction_utils.py`
- **Error logging added** — Overpass, Wikimedia, and `_safe()` now log errors to stderr
- **Security headers in next.config.mjs** — Added `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- **Image remotePatterns** — Added `images.unsplash.com` and `images.pexels.com` to allowed domains
- **dotenv migration in main.py** — Uses `os.path.join` for reliable `.env` loading

### Phase 5a: Dead File Cleanup (13 files deleted)

- `backend/check_data.py` — Debug script
- `backend/debug_trees.py` — Debug script
- `backend/debug_trees2.py` — Debug script
- `backend/debug_trees3.py` — Debug script
- `backend/export_model.py` — Legacy model export
- `src/app/api/predict/route.ts` — Legacy TS XGBoost route (unused)
- `src/components/ui/badge.tsx` — Unused shadcn component
- `src/components/ui/card.tsx` — Unused shadcn component
- `src/components/ui/glass-button.tsx` — Unused component
- `src/lib/cities.ts` — Legacy city data (21 cities, replaced by 30-district system)
- `src/lib/karnatakaBorder.ts` — Legacy border polygon (for deleted 3D terrain)
- `src/lib/xgboost.ts` — Dead client-side XGBoost (393 lines)
- `src/lib/xgboost_model.json` — Dead 6.8MB model file
- `src/systems/atmosphere/AtmosphereEngine.tsx` — Legacy Three.js (unused)
- `src/systems/atmosphere/FogLayer.tsx` — Legacy Three.js (unused)
- `src/systems/atmosphere/ParticleField.tsx` — Legacy Three.js (unused)
- `src/systems/sliders/EnvironmentalSlider.tsx` — Unused component
- `src/systems/terrain/DistrictNodes.tsx` — Legacy Three.js (unused)
- `src/systems/terrain/KarnatakaTerrain.tsx` — Legacy Three.js (unused)

### Phase 5b: Console.log Cleanup

- Removed 2 `console.log` statements from `src/app/predict/page.tsx`

### Phase 5c: .gitignore Update

- Added `backend/*.csv` to prevent training data from being committed

### Phase 5d: District Name Standardization

**13 renames in `src/lib/karnatakaDistricts.ts`:**
| Old Name | New Name |
|---|---|
| Belgaum | Belagavi |
| Bangalore Urban | Bengaluru Urban |
| Bangalore Rural | Bengaluru Rural |
| Bijapur | Vijayapura |
| Chamarajanagar | Chamarajanagara |
| Gadag | Gadag-Betageri |
| Davangere | Davanagere |
| Mysore | Mysuru |
| Shimoga | Shivamogga |
| Tumkur | Tumakuru |
| Bagalkot | Bagalkote |
| Bellary | Ballari |
| Koppal | Koppala |

**11 renames in `src/lib/places.ts`** — Matching updates for all renamed districts.

**11 renames in `backend/services/static_places.py`** — Matching updates for all renamed districts.

**Missing aliases added in `src/app/result/page.tsx` CITY_ALIAS:**
- `Belgaum` → `Belagavi`
- `Chamrajnagar` → `Chamarajanagara`
- `Bangalore Rural` → `BengaluruRural`
- `Koppal` → `Koppala`
- `Bagalkot` → `Bagalkote`

### Phase 5e: README Rewrite

- Full README rewrite reflecting actual architecture (IoT, Intelligence, Wokwi, portals, etc.)

### Phase 5 Verification

- Python `ast.parse()` — All `.py` files pass syntax check
- TypeScript `tsc --noEmit` — All `.ts`/`.tsx` files pass type check

### CometCard 3D Tilt Animation

- Merged into `src/components/portals/WeatherPortal.tsx`
- Mouse-tracking `rotateX`/`rotateY` via `useMotionValue` + `useSpring`
- Glare overlay with `mix-blend-overlay`
- All existing effects preserved: PortalGlow, amber overlay, text reveal, icon lift, float CSS

### IoT 401 Fix + Wokwi ESP32 Integration

- **Frontend fix** — Added `X-Api-Key` header to both fetch calls in `src/app/iot/page.tsx`
- **Environment variables** — Added `NEXT_PUBLIC_IOT_API_KEY` to `.env.local` and `.env.example`
- **Wokwi ESP32 sketch** — Created `backend/wokwi/sketch.ino` with DHT22 (GPIO4), BMP180 (I2C), Potentiometer (GPIO34), OLED SSD1306 (I2C), WiFi, HTTP POST every 10s
- **Wokwi config** — Created `backend/wokwi/wokwi.toml` with all component wiring
- **API_HOST** — Set to `https://karnataka-weather-uxdg.onrender.com` (live Render backend)

### Phase 6: TTL Caching Layer + Frontend Performance

#### Backend Caching (8 files modified +1 new)

- **`backend/services/cache.py`** (NEW) — `TTLCache` class (pure Python, no external dependencies) with `get()`, `set()`, `invalidate()`, `is_cached()` methods. 7 cache instances + `computing` set.
- **Per-source caches** with optimized TTLs:
  - Weather (Open-Meteo): 2 minutes
  - Places (Overpass): 6 hours
  - Wikipedia: 24 hours
  - Wikimedia Commons: 6 hours
  - News (RSS): 30 minutes
  - LLM summaries: 2 minutes
- **District-level intelligence cache** (`district_intelligence_cache`): 2-minute TTL, caches full aggregated responses per district — verified 60x speedup (2.39s → 0.04s).
- **Priority cache pre-warming**: `prewarm_cache()` background thread pre-caches all 31 districts on server start with 30s timeout per district. `computing` set prevents duplicate work.
- **Priority wait logic**: If user requests a district being pre-warmed, waits up to10s for cache to populate.
- **Files modified**: `main.py` (prewarm thread), `services/cache.py` (new), `services/weather_intelligence.py` (cache + priority wait), `services/llm_summarizer.py` (LLM cache), `services/sources/open_meteo.py` (weather cache), `services/sources/overpass.py` (places cache), `services/sources/wikipedia.py` (wiki cache), `services/sources/wikimedia.py` (wikimedia cache), `services/sources/rss_news.py` (news cache)

#### Frontend Performance (3 fixes across 4 files +1 new)

- **Fix 1: Dynamic import WeatherPortal** — `src/app/portal/page.tsx` and `src/app/intelligence/portal/page.tsx` use `next/dynamic` to load `WeatherPortal`. Cards render as full HTML first, animations load after.
- **Fix 2: Conditional Lenis** — `src/components/layout/LenisProvider.tsx` checks current pathname. Skips smooth scroll rAF loop on non-scrollable pages: `/portal`, `/intelligence/portal`, `/intelligence/select`, `/intelligence`.
- **Fix 3: Auth preloading** — New `src/components/layout/AuthPreloader.tsx` component mounted in `src/app/layout.tsx`. Preloads Supabase browser client in background on app mount to prevent layout shift on first auth check.
- **Static place fallback** — `backend/services/static_places.py` provides 10-20 hardcoded popular places per district as fallback when Overpass API times out (flaky on shared Render VPS IPs).

---

## Correct Execution Protocol

### 1. Starting the Next.js Frontend Server

```powershell
# Navigate into the Next.js project directory
cd karnataka-weather

# Run the development server
npm run dev
```

*The frontend will boot up and be accessible locally at [http://localhost:3000](http://localhost:3000).*

### 2. Starting the FastAPI XGBoost Backend

```powershell
# Navigate into the backend directory
cd karnataka-weather/backend

# Activate the virtual environment
.\venv\Scripts\activate

# Start the FastAPI backend server
python main.py
```

*Upon execution, the backend will train the XGBoost classifier on the 500-sample dataset, print classification metrics (precision, recall, f1-score) to confirm model validity, and start serving weather predictions on port `8000`.*

### 3. Running Wokwi ESP32 Simulator

1. Go to [wokwi.com](https://wokwi.com)
2. Create a new ESP32 project
3. Paste the contents of `backend/wokwi/sketch.ino` into the code editor
4. Add dependencies in the Wokwi panel:
   - `Adafruit BMP085` (1.2.1)
   - `Adafruit SSD1306` (2.5.7)
   - `Adafruit GFX` (1.11.5)
   - `DHT sensor` (1.4.4)
5. Wire components:
   - DHT22 → GPIO4
   - BMP180 → I2C (GPIO21/22)
   - Potentiometer → GPIO34
   - OLED SSD1306 → I2C (GPIO21/22)
6. Click Start — sensor data is sent to the backend every 10 seconds

---

## Key Architecture Overview

```mermaid
graph TD
    A[Next.js Client] -->|Interactive Selection| B[District Map SVG]
    A -->|Mode Selection| C[Portal - 3 Cards]
    C -->|Manual| D[Predict Screen]
    C -->|IoT| E[IoT Dashboard]
    C -->|Intelligence| F[Intelligence Portal]
    D -->|POST /predict| G[FastAPI Backend :8000]
    E -->|POST /iot/sensor-data| G
    F -->|GET /intelligence| G
    G -->|Feature Evaluation| H[XGBoost Classifier]
    G -->|TTL Cache Layer| N[Cache Manager]
    N -->|Cache Hit (0.04s)| K[Intelligence Response]
    N -->|Cache Miss (2.39s)| O[6-Source Fetch + LLM]
    O --> K
    H -->|Inverses Label| I[Predict Response]
    I -->|Renders Result| J[Result Screen]
    G -->|Open-Meteo + Overpass + Wikimedia + LLM| K[Intelligence Response]
    K -->|Renders| L[Intelligence Result]
    G -->|IoT API Key Auth| M[Wokwi ESP32 Simulator]
    M -->|DHT22 + BMP180 + Potentiometer| G
    
    style A fill:#fde8d8,stroke:#d4845a,stroke-width:2px
    style G fill:#e8eef5,stroke:#a0b8cc,stroke-width:2px
    style H fill:#dde8f0,stroke:#8aaabb,stroke-width:2px
    style M fill:#d4f0d4,stroke:#5a8a5a,stroke-width:2px
```
