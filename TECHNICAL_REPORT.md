# Technical Report — Karnataka Weather Prediction System

---

## 1. Executive Summary

A full-stack weather prediction platform for 30 districts of Karnataka. A Python FastAPI backend on Render free tier runs XGBoost inference with 15 engineered features, SMOTE oversampling, and meteorological rule overrides. A cinematic Next.js frontend on Vercel provides an interactive orbital UI, Canvas 2D weather backgrounds, and three prediction modes: Manual, IoT (live sensor data from Wokwi ESP32), and Intelligence (location-based weather lookup). A 3D CSS loading screen masks the Render cold start. Authentication uses Supabase (email/password + Google OAuth). IoT sessions are authenticated via API key. The backend exposes CORS and rate limiting (slowapi). Security headers are enforced in next.config.mjs.

**Key metrics:** 85% model accuracy, <50ms inference (warm), 60 FPS animations, 103KB first-load JS, $0 hosting cost.

---

## 2. Architecture

| Component | Technology | Role |
|-----------|-----------|------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript 5 | 10 pages: login, map, predict, result, portal, IoT dashboard, intelligence, history + loading screens |
| Backend | Python 3.11, FastAPI, XGBoost 2.0 | POST `/predict` — 15 features, 600 trees, rule overrides |
| IoT Gateway | Python FastAPI, API key auth (`X-Api-Key`) | POST `/iot/create-session`, POST `/iot/sensor-data` |
| Intelligence Service | Python FastAPI, Open-Meteo + Overpass + Wikimedia | GET `/intelligence?lat=&lon=` — reverse geocode, weather data, nearby places |
| LLM Summarizer | Gemini + Groq fallback via `asyncio.gather(return_exceptions=True)` | Natural-language weather summaries in `weather_intelligence.py` |
| Wokwi ESP32 | Wokwi simulator, Arduino sketch (`DHT22 + BMP180 + Potentiometer + OLED`) | Simulated IoT sensor hardware |
| ML Training | Python (XGBoost + SMOTE + pandas) | Offline training on 500-record CSV |
| Auth | Supabase (`@supabase/ssr`) | Email/password + Google OAuth |
| Animation | Canvas 2D (6 backgrounds), Framer Motion 12, Lenis 1.3, CometCard 3D tilt | Weather viz, page transitions, smooth scroll, portal cards |
| Loading screen | Pure CSS 3D transforms + keyframes | Cold start delay masking (3 variants: default, IoT, Intelligence) |
| Frontend host | Vercel Hobby (free) | Auto-deploy from git push |
| Backend host | Render Web Service (free) | 512 MB RAM, 0.1 CPU, 15-min idle spin-down |
| CORS + Rate Limiting | `slowapi`, `CORSMiddleware` | Origin whitelist, per-IP request throttling |
| Security | `next.config.mjs` headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |

**Architecture decision:** Python backend chosen over TypeScript XGBoost port for simpler training iteration, easier model updates, and access to standard ML ecosystem. Cold start latency (30-60s) is masked by a 3D CSS loading screen.

---

## 3. ML Pipeline

### Dataset
- **Source:** Synthetic (parametric generation from IMD historical norms)
- **Size:** 500 rows, 5 raw features + 6-class target
- **Balance:** ~80-85 samples/class (SMOTE-oversampled)
- **Split:** 80/20 stratified

### Feature Engineering (15 features)
| Feature | Type | Description |
|---------|------|-------------|
| minTemp, maxTemp, humidity, pressure, windSpeed | Raw | 5 direct inputs |
| tempRange | Derived | maxTemp − minTemp |
| tempMean | Derived | (maxTemp + minTemp) / 2 |
| humidityWind | Derived | humidity × windSpeed / 100 |
| pressureAnomaly | Derived | 1013.25 − pressure |
| stormIndex | Derived | (hum/100) × (wind/75) × (max(pressureAnomaly,0)/25 + 0.3) |
| heatDryIndex | Derived | (maxTemp/45) × (1 − hum/100) |
| fogIndex | Derived | Cold × humidity × calm wind |
| humidityHigh, humidityLow | Derived | Quadratic humidity effects |
| windPower | Derived | Non-linear wind scaling |

### Model Configuration
- **Algorithm:** XGBoost (`multi:softprob`)
- **Estimators:** 100 (100 rounds × 6 classes = 600 trees)
- **Max depth:** 8
- **Learning rate:** 0.05
- **Subsample / colsample:** 0.85
- **Regularization:** gamma=0.1, reg_alpha=0.1, reg_lambda=1.0

### Performance
| Metric | Value |
|--------|-------|
| Accuracy (100 trees) | 85.0% |
| Accuracy (500 trees) | 96.6% (not deployed — 114MB) |
| CV accuracy | 84.3% ± 2.1% |
| Best class | Foggy (F1: 0.96) |
| Worst class | Windy (F1: 0.76 — confused with Sunny) |

### Rule Overrides (priority order)
Applied after softmax. Override when meteorological heuristics detect clear conditions:

```python
humidity >= 88 and windSpeed >= 40  -> Stormy  (>=0.88)
humidity >= 88 and windSpeed >= 5   -> Rainy   (>=0.82)
humidity >= 85 and windSpeed >= 15  -> Rainy   (>=0.84)
humidity >= 92 and windSpeed >= 3   -> Rainy   (>=0.80)
humidity >= 40 and windSpeed <= 15 and minTemp <= 18 and maxTemp <= 26 -> Foggy (>=0.78)
humidity >= 70                      -> Cloudy  (>=0.80)
windSpeed >= 30                     -> Windy   (>=0.82)
maxTemp >= 26 and humidity <= 55    -> Sunny   (>=0.85)
fallthrough                         -> ML model output
```

---

## 4. App Structure

```
karnataka-weather/
├── backend/                                  # Python backend (deployed on Render)
│   ├── main.py                               # FastAPI: train + predict + rule overrides + CORS + rate limiting
│   ├── requirements.txt                      # Python dependencies
│   ├── .env                                  # Environment variables (not committed)
│   ├── .env.example                          # Environment variable template
│   ├── karnataka_weather_500.csv             # Training data
│   ├── wokwi/
│   │   ├── sketch.ino                        # ESP32 Arduino sketch (DHT22 + BMP180 + OLED)
│   │   └── wokwi.toml                        # Wokwi simulator config
│   └── services/
│       ├── prediction_utils.py               # XGBoost training, feature engineering, rule overrides
│       ├── iot_gateway.py                    # IoT session management + sensor data ingestion (API key auth)
│       ├── iot_manager.py                    # In-memory IoT session store
│       ├── weather_intelligence.py           # Location-based weather + LLM summary (Gemini/Groq fallback)
│       ├── llm_summarizer.py                 # Gemini → Groq fallback with asyncio.gather(return_exceptions=True)
│       ├── static_places.py                  # Curated nearby-places dataset
│       ├── response_merger.py                # Merges Open-Meteo + Overpass + Wikidata into unified response
│       └── sources/
│           ├── overpass.py                   # Overpass API (nearby landmarks)
│           ├── wikimedia.py                  # Wikimedia Commons (place images)
│           ├── open_meteo.py                 # Open-Meteo weather API
│           ├── rss_news.py                   # RSS news feeds
│           └── wikipedia.py                  # Wikipedia summaries
├── src/app/
│   ├── globals.css                           # Global styles
│   ├── layout.tsx                            # Root layout (LenisProvider, fonts)
│   ├── page.tsx                              # Login/signup with 6-split weather backgrounds
│   ├── favicon.ico                           # App icon
│   ├── map/page.tsx                          # SVG district selector (30 districts, scaled)
│   ├── predict/page.tsx                      # Orbital UI sliders + loading overlay
│   ├── result/page.tsx                       # Cinematic result page with parallax, stickman, profile modal
│   ├── portal/page.tsx                       # Mode selection: Manual, IoT, Intelligence
│   ├── iot/page.tsx                          # IoT live dashboard (sensor readings + prediction)
│   ├── intelligence/page.tsx                 # Intelligence weather view
│   ├── intelligence/portal/page.tsx          # Intelligence sub-portal
│   ├── intelligence/select/page.tsx          # Intelligence district/location selector
│   ├── history/page.tsx                      # Prediction history
│   ├── api/image/route.ts                    # GET /api/image — image proxy
│   └── auth/callback/route.ts               # Supabase OAuth callback
├── src/components/
│   ├── layout/
│   │   └── LenisProvider.tsx                 # Smooth scroll provider
│   ├── portals/
│   │   ├── WeatherPortal.tsx                 # CometCard with 3D tilt animation
│   │   └── PortalGlow.tsx                   # Glow effects for portal cards
│   └── ui/
│       ├── loading-screen.tsx                # 3D CSS loading screen (default variant)
│       ├── loader-iot.tsx                   # Loading screen (IoT variant)
│       ├── loader-wi.tsx                    # Loading screen (Intelligence variant)
│       ├── animated-list.tsx                # Animated list component
│       ├── button.tsx                        # Button component
│       └── combobox.tsx                     # Combobox component
├── src/lib/
│   ├── auth.ts                              # Supabase AuthManager
│   ├── utils.ts                             # Utility functions
│   ├── weatherContent.ts                   # Content for 6 weather conditions
│   ├── districtContent.ts                  # District-specific content
│   ├── places.ts                           # Nearby places data
│   ├── karnatakaDistricts.ts               # District names + coordinates (30 districts, updated to current Kannada names)
│   ├── history.ts                          # Prediction history utilities
│   └── weatherIntelligence.ts              # Intelligence mode frontend logic
├── src/systems/
│   ├── sliders/OrbitalPredict.tsx          # 5 orbiting parameter nodes
│   └── weather/
│       ├── WeatherBackground.tsx            # Dynamic import router
│       └── backgrounds/                    # 6 Canvas 2D renderers
│           ├── SunnyBackground.tsx
│           ├── CloudyBackground.tsx
│           ├── RainyBackground.tsx
│           ├── StormyBackground.tsx
│           ├── FoggyBackground.tsx
│           └── WindyBackground.tsx
└── next.config.mjs                          # Next.js config with security headers
```

### District Name Renames (13)
Updated to reflect current official Kannada names:
- Belgaum → Belagavi
- Mysore → Mysuru
- Mangalore → Mangaluru
- Gulbarga → Kalaburagi
- Hubli-Dharwad → Dharwad
- Shimoga → Shivamogga
- Bellary → Ballari
- Bijapur → Vijayapura
- Bidar → Bidar (unchanged, but region context updated)
- Tumkur → Tumakuru
- Chitradurga → Chitradurga (unchanged)
- Davanagere → Davanagere (unchanged)
- Hassan → Hassan (unchanged)

### Deleted Files (13)
- `src/lib/xgboost.ts` — Legacy TypeScript XGBoost client (unused)
- `src/lib/xgboost_model.json` — Legacy 6.8MB XGBoost model (unused)
- `src/app/api/predict/route.ts` — Legacy TypeScript prediction endpoint
- `src/systems/atmosphere/` — Three.js atmosphere files (unused)
- `src/systems/terrain/` — Three.js terrain files (unused)
- Other dead components and utilities removed during cleanup

---

## 5. Key User Flow

1. **Login** → Supabase auth (email/password or Google OAuth)
2. **Portal** → Mode selection: **Manual**, **IoT**, or **Intelligence** (CometCard with 3D tilt)
3. **Map** → SVG with 30 district polygons, hover tooltips, click to select
4. **Predict** → 5 orbital variable nodes → Click "Predict Weather" → **Loading screen overlay** → `POST` to Render backend → Navigate to result
5. **Result** → Canvas 2D weather background, parallax hero, SVG stickman, scroll-reveal cards/travel/tips, profile modal

**IoT Mode:**
1. Portal → Select "IoT" → Creates session via `POST /iot/create-session` (requires `X-Api-Key`)
2. ESP32 sends sensor data via `POST /iot/sensor-data` (DHT22 temp/humidity + BMP180 pressure + potentiometer wind speed)
3. Dashboard displays live readings and prediction

**Intelligence Mode:**
1. Portal → Select "Intelligence" → `GET /intelligence?lat=&lon=&district=`
2. Backend queries Open-Meteo, Overpass, Wikidata, RSS, Wikipedia
3. LLM summarizes via Gemini (fallback: Groq) using `asyncio.gather(return_exceptions=True)`
4. Results displayed with nearby places, images, and natural-language summary

**Cold start handling:**
- Render spins down after 15 min idle
- First request triggers cold start (30-60s)
- 3D CSS loading screen with spinning cube + letter wave animation masks delay (3 variants: default, IoT, Intelligence)
- If backend returns error or 503, client-side rule overrides produce fallback prediction

---

## 6. API Contract

### POST `/predict`
Weather prediction from sensor inputs.

```json
// Request
{
  "minTemp": 18,
  "maxTemp": 30,
  "humidity": 60,
  "pressure": 1010,
  "windSpeed": 12
}

// Response
{
  "condition": "Sunny",
  "confidence": 0.87
}
```

Client-side fallback in `predict/page.tsx` mirrors the same rule chain — if the API call fails, the user navigates directly to `/result` with the fallback prediction.

### POST `/iot/create-session`
Creates a new IoT sensor session. Requires `X-Api-Key` header.

```json
// Headers
X-Api-Key: <your-api-key>

// Request
{
  "district": "Bengaluru Urban"
}

// Response
{
  "session_id": "abc123-def456",
  "status": "active"
}
```

### POST `/iot/sensor-data`
Sends sensor readings for an active IoT session.

```json
// Request
{
  "session_id": "abc123-def456",
  "temperature": 28.5,
  "humidity": 72.0,
  "pressure": 1008.3,
  "wind_speed": 15.0
}

// Response
{
  "condition": "Rainy",
  "confidence": 0.84,
  "timestamp": "2026-07-22T10:30:00Z"
}
```

### GET `/intelligence`
Location-based weather intelligence with LLM summary.

```
// Query Parameters
?lat=12.9716&lon=77.5946&district=Bengaluru Urban

// Response
{
  "weather": {
    "temperature": 28,
    "humidity": 65,
    "condition": "Partly Cloudy",
    "wind_speed": 12
  },
  "nearby_places": [
    { "name": "Lalbagh Botanical Garden", "type": "park", "distance_km": 2.1 }
  ],
  "summary": "Current weather in Bengaluru Urban is partly cloudy with moderate humidity..."
}
```

### GET `/api/image`
Image proxy for external URLs.

```
// Query Parameters
?url=https://example.com/image.jpg

// Response
Binary image data with appropriate Content-Type header
```

---

## 7. Loading Screen Design

### Default: `src/components/ui/loading-screen.tsx`

A pure-CSS 3D animated loading screen with two visual layers:

**Big cube (96×96px):**
- 6 faces with cyan/purple/indigo tinted backgrounds and colored borders
- Spins continuously on X and Y axes (`cubeSpin 8s linear infinite`)
- Blurred cyan core pulses in center
- Glowing floor shadow breathes below

**Letter cubes (40×40px each):**
- 7 cubes spell L-O-A-D-I-N-G in a flex row with `perspective: 700px`
- Staggered `animationDelay` (0.38s × index) creates cascading wave
- `zapFade` keyframe: Z-axis translate (−2px → 16px → −2px) + opacity (0 → 1 → 0)
- `glowFade` keyframe on front face: cyan `box-shadow` (#22d3ee) ramps up/down in sync
- `animation-fill-mode: backwards` prevents initial visible flash before delay expires

### IoT Variant: `src/components/ui/loader-iot.tsx`

Same CSS 3D cube foundation, themed for IoT mode with distinct color accents.

### Intelligence Variant: `src/components/ui/loader-wi.tsx`

Same CSS 3D cube foundation, themed for Intelligence mode.

**Key techniques:**
- `transform-style: preserve-3d` for 3D space
- `overflow: hidden` on scene clips blurred/3D overflow
- `background-color` longhand (not `background` shorthand) to avoid animation override

---

## 8. Deployment

| Platform | Service | URL |
|----------|---------|-----|
| Frontend | Vercel Hobby (free) | `https://karnataka-weather.vercel.app` |
| Backend | Render Web Service (free) | `https://karnataka-weather-uxdg.onrender.com` |
| Auth | Supabase free tier | Supabase project |
| IoT Simulator | Wokwi | ESP32 Arduino sketch in `backend/wokwi/` |
| Source | GitHub | `github.com/Charan-516/karnataka-weather` |

**Env vars required on Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` = `https://karnataka-weather-uxdg.onrender.com`

**Env vars required on Render:**
- `GEMINI_API_KEY` — Gemini API key for LLM summarization
- `GROQ_API_KEY` — Groq API key (fallback)
- `IOT_API_KEY` — API key for IoT gateway authentication

**Render backend specifics:**
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Model trains in a background thread on startup to avoid port scan timeout
- Model variable only set after `clf.fit()` completes to prevent `NotFittedError`
- CORS middleware configured with origin whitelist
- Rate limiting via `slowapi` (per-IP throttling)

---

## 9. Bugs Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Render port scan timeout | Free tier requires port binding within 60s | Background thread training; app starts instantly |
| Model `NotFittedError` race condition | Model used before `clf.fit()` completed | Model variable set only after fit completes |
| Feature index parsed as single digit | `parseInt(node.split[1])` only read 2nd char | `parseInt(node.split.slice(1))` |
| 114MB model exceeded Vercel limits | 500 trees + pretty-printed JSON | 100 trees + compact JSON = 6.8MB |
| Supabase build error | `createBrowserClient()` at module scope | Lazy dynamic `await import()` |
| Next.js 14 + React 19 conflict | Next 14 required React 18 | Upgraded to Next.js 15 |
| Lenis rAF memory leak | `requestAnimationFrame` loop never stopped | Added `running` flag |
| StormyBackground canvas corruption | ctx state modified between save/restore | Wrapped lightning in `ctx.save()/restore()` |
| Login page broken | Login CSS classes stripped in cleanup | Restored all login CSS |
| Loading screen blue box glitch | `background` shorthand overrode animation's `background-color` | Changed to `background-color` longhand |
| Loading screen box artifacts | `faceGlow` on 42 elements (6 faces × 7 cubes) + drop-shadows bled outside | Removed glow from non-front faces; only front face styled |
| Re-render flash before navigation | `finally { setLoading(false) }` ran before `router.push()` | Removed `finally` — both paths already unmount via push |
| IoT 401 Unauthorized | Missing `X-Api-Key` header in IoT gateway | Added API key auth middleware in `iot_gateway.py` |
| CORS blocked cross-origin requests | No CORS middleware configured on FastAPI | Added `CORSMiddleware` with origin whitelist in `main.py` |
| Rate limiting missing | No request throttling on public endpoints | Added `slowapi` rate limiter in `main.py` |
| 13 district names outdated | Old British-era names used in UI and backend | Renamed to current official Kannada names (Belagavi, Mysuru, etc.) |
| 13 dead files in codebase | Unused legacy components, Three.js files, XGBoost client | Deleted all dead files (xgboost.ts, xgboost_model.json, atmosphere/, terrain/, etc.) |
| 6.8MB dead XGBoost client code | Legacy TS XGBoost inference client no longer used | Removed `src/lib/xgboost.ts` and `src/lib/xgboost_model.json` |
| Missing security headers | No security headers on Next.js responses | Added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` in `next.config.mjs` |
| Loading screen flash on IoT/Intelligence | Same default loader used for all modes | Created dedicated `loader-iot.tsx` and `loader-wi.tsx` variants |
| Overpass/Wikimedia error swallowing | Errors silently ignored without logging | Added error logging in `overpass.py`, `wikimedia.py`, `_safe()` |

---

## 10. Performance

| Metric | Value |
|--------|-------|
| Inference time (Render, warm) | <50ms |
| Cold start (Render) | 30-60s (masked by loading screen) |
| Canvas FPS | 60 FPS (all conditions) |
| Model size | ~300KB (XGBoost native) |
| Dead code removed | ~6.8MB (XGBoost client + model JSON) |
| Build time | ~2 minutes |
| First-load JS | 103KB |
| Vercel free tier limits | 100 GB bandwidth, 6000 build min/mo |
| Render free tier limits | 512 MB RAM, 0.1 CPU |

---

## 11. Known Issues

- `<img>` tags used for external Unsplash/Pexels URLs — intentional, no optimization needed for decorative images
- Shadcn UI components installed but unused — all pages use inline styles
- Profile photo stored in Supabase `user_metadata` (size-limited) with localStorage fallback
- IoT sessions stored in-memory (`iot_manager.py`) — lost on Render cold start
- Render free tier 15-min idle spin-down affects IoT session persistence

---

## 12. Future Work

- **Eliminate backend entirely**: ONNX Runtime Web for on-device 500-tree inference (96% accuracy, no cold start)
- ~~Real-time sensor integration via weather stations~~ — **DONE** (Wokwi ESP32 integration with DHT22 + BMP180 + OLED)
- Persistent IoT sessions (Redis or Supabase table, survive cold starts)
- Prediction history with Supabase table
- Kannada language localization
- Time-series forecasting (multi-day predictions)
- Mobile native app (React Native)

---

*Report updated: 2026-07-22*
