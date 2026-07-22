# Karnataka Weather Prediction — Full Project Context

> **Purpose:** Self-contained reference describing the entire Karnataka Weather application — architecture, tech stack, folder structure, every source file's purpose, color palette, user workflow, API contracts, data schemas, and known issues.

---

## 1. Project Overview

**Karnataka Weather** is a cinematic weather prediction platform for the 30 districts of Karnataka, India. It combines:

- A **Next.js 15 (App Router)** frontend with glassmorphic UI, Framer Motion animations, custom Canvas 2D weather backgrounds (Sunny, Cloudy, Rainy, Stormy, Foggy, Windy), and CometCard 3D tilt portal cards.
- A **Python FastAPI backend** on Render free tier running **XGBoost** with 15 engineered features, 500 trees, SMOTE oversampling, and 7 meteorological rule overrides.
- **Three prediction modes**: Manual (orbital sliders), IoT (live ESP32/Wokwi sensor data), and Intelligence (multi-source RAG reports).
- **IoT integration** with Wokwi ESP32 simulator (DHT22, BMP180, potentiometer wind sensor, OLED display) using API key authentication.
- **Weather Intelligence** system pulling from Open-Meteo, OpenStreetMap/Overpass, Wikipedia, Wikivoyage, Wikimedia Commons, and RSS news feeds, with LLM-powered summaries (Gemini first, Groq fallback).
- **3D CSS loading screens** (spinning cube + letter cubes) that mask the Render cold start, with separate loaders for each mode.
- **Supabase** for authentication (email/password + Google OAuth), prediction history storage, and user profile management.
- **Prediction history** stored in Supabase, filterable by mode (manual, IoT, intelligence).

**Core user flow:** Login → Select district on SVG map → Choose mode (Manual / IoT / Intelligence) → Receive prediction → View cinematic result page with parallax zoom, condition-stickman, travel cards, and scroll-reveal content.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | ^15 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Backend | Python, FastAPI, XGBoost, SMOTE | Python 3.11 |
| Animation | Framer Motion | ^12.40.0 |
| Scroll | Lenis | ^1.3.23 |
| Icons | Lucide React | ^1.17.0 |
| Auth | Supabase (`@supabase/ssr`) | ^0.10.3 |
| CSS | Tailwind v4 + inline styles | ^4 |
| Loading screens | Pure CSS 3D transforms + keyframes | — |
| IoT | Wokwi ESP32 (DHT22, BMP180, Potentiometer, OLED) | Arduino/C++ |
| LLM | Gemini 2.0 Flash → Groq Llama 3.1 8B fallback | — |
| Rate limiting | slowapi | ^0.1.9 |

---

## 3. Folder Structure

```
karnataka-weather/
├── .env.example                     # Template (sanitized secrets + NEXT_PUBLIC_API_URL + NEXT_PUBLIC_IOT_API_KEY)
├── .gitignore
├── package.json
├── tsconfig.json                    # ES2017, bundler, @/* → ./src/*
├── next.config.mjs                  # Security headers + Wikimedia image domain
├── postcss.config.mjs               # @tailwindcss/postcss
├── eslint.config.mjs                # next core-web-vitals + TS
├── public/                          # SVG icons (file, globe, next, vercel, window)
├── backend/                         # Python ML training + FastAPI server (deployed on Render)
│   ├── main.py                      # FastAPI: trains XGBoost + SMOTE, /predict, /intelligence, CORS, rate limiting
│   ├── requirements.txt             # Python dependencies (fastapi, xgboost, slowapi, httpx, etc.)
│   ├── .env                         # Backend secrets (GEMINI_API_KEY, GROQ_API_KEY, CORS_ORIGINS, IOT_API_KEY)
│   ├── .env.example                 # Template for backend secrets
│   ├── karnataka_weather_500.csv    # 500-record training dataset
│   ├── pyrightconfig.json           # Python type-checking config
│   ├── wokwi/
│   │   ├── sketch.ino               # ESP32 Arduino sketch (DHT22, BMP180, potentiometer, OLED)
│   │   └── wokwi.toml               # Wokwi simulator config
│   └── services/
│       ├── __init__.py
│       ├── cache.py                # TTLCache: per-source + district-level caching
│       ├── prediction_utils.py      # Feature engineering (15 features) + rule overrides (8 rules)
│       ├── iot_gateway.py           # FastAPI router: /iot/create-session, /iot/sensor-data (API key auth)
│       ├── iot_manager.py           # In-memory IoT session management (thread-safe, auto-cleanup)
│       ├── weather_intelligence.py  # Orchestrator: concurrent data fetching + district-level caching + priority wait
│       ├── llm_summarizer.py        # LLM fallback chain: Gemini → Groq with 2-min TTL cache
│       ├── response_merger.py       # Merges multi-source responses + builds _available array
│       ├── static_places.py         # Static place data per district (30 districts, Overpass fallback)
│       └── sources/
│           ├── __init__.py
│           ├── open_meteo.py        # Open-Meteo weather API (current + 7-day forecast)
│           ├── overpass.py          # OpenStreetMap Overpass API (nearby places)
│           ├── wikipedia.py         # Wikipedia + Wikivoyage summary fetcher
│           ├── wikimedia.py         # Wikimedia Commons image fetcher
│           └── rss_news.py          # RSS news feed aggregator
└── src/
    ├── app/
    │   ├── globals.css              # ~40 lines essential CSS + keyframes + range thumb
    │   ├── layout.tsx               # Root <html>, LenisProvider, AuthPreloader, Google Fonts
    │   ├── page.tsx                 # "/" — Login/Signup with 6-split weather backgrounds
    │   ├── favicon.ico
    │   ├── map/page.tsx             # "/map" — SVG district selector (30 districts, scaled 0.67)
    │   ├── portal/page.tsx          # "/portal?city=X" — Mode selection (Manual, IoT, Intelligence)
    │   ├── predict/page.tsx         # "/predict?city=X" — Orbital sliders + loading overlay
    │   ├── result/page.tsx          # "/result?city=X&condition=Y&..." — Cinematic result page
    │   ├── iot/page.tsx             # "/iot?city=X" — IoT live dashboard (sensor simulation + prediction)
    │   ├── intelligence/page.tsx    # "/intelligence?city=X" — Intelligence analysis (weather, places, wiki, news)
    │   ├── intelligence/portal/page.tsx  # "/intelligence/portal?city=X" — Beyond-the-fold: District vs Place cards
    │   ├── intelligence/select/page.tsx  # "/intelligence/select?city=X" — Combobox place selector
    │   ├── history/page.tsx         # "/history" — Prediction history (filterable by mode)
    │   ├── api/
    │   │   └── image/route.ts       # GET /api/image — Image proxy route
    │   └── auth/
    │       └── callback/route.ts    # GET /auth/callback — Supabase OAuth exchange
    ├── lib/
    │   ├── auth.ts                  # Supabase AuthManager (signup, login, Google OAuth, profile update)
    │   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
    │   ├── weatherContent.ts        # 6-condition content (title, subtitle, cards, travel, tips)
    │   ├── districtContent.ts       # 30-district travel content (heritage, nature, tips)
    │   ├── places.ts                # Static places data (30 districts, with lat/lng coordinates)
    │   ├── karnatakaDistricts.ts    # 30-district GeoJSON-style polygon data
    │   ├── history.ts               # Supabase prediction_history CRUD (save, fetch, delete)
    │   └── weatherIntelligence.ts   # TypeScript client for /intelligence endpoint
    ├── components/
    │   ├── layout/
    │   │   ├── LenisProvider.tsx    # Conditional smooth scroll (skips on non-scrollable pages)
    │   │   └── AuthPreloader.tsx    # Background Supabase client preload on app mount
    │   ├── portals/
    │   │   ├── WeatherPortal.tsx    # CometCard with 3D tilt, cursor-following glare, hover reveal
    │   │   └── PortalGlow.tsx       # Cursor-following ambient glow overlay
    │   └── ui/
    │       ├── loading-screen.tsx   # 3D CSS loading screen (big spinning cube + LOADING letter cubes)
    │       ├── loader-iot.tsx       # IoT-specific loading animation
    │       ├── loader-wi.tsx        # Weather Intelligence loading animation
    │       ├── animated-list.tsx    # Animated list component
    │       ├── button.tsx           # SolidButton + OutlineButton (styled pill buttons)
    │       └── combobox.tsx         # Place search combobox (for intelligence place selection)
    └── systems/
        ├── sliders/
        │   └── OrbitalPredict.tsx   # 5 orbiting variable nodes with click-to-expand card + range
        └── weather/
            ├── WeatherBackground.tsx     # Dynamic import switcher for 6 Canvas2D backgrounds
            └── backgrounds/
                ├── SunnyBackground.tsx   # Sun rays + 60 floating particles
                ├── CloudyBackground.tsx  # 3-layer drifting ellipses
                ├── RainyBackground.tsx   # 200 raindrops + ground ripples
                ├── StormyBackground.tsx  # 200 vortex particles + lightning bolts
                ├── FoggyBackground.tsx   # 12 fog patches + 80 mist particles
                └── WindyBackground.tsx   # 120 wind streaks + 20 tumbling leaves
```

---

## 4. User Workflow (Page-by-Page)

### Page 1: Login (`/` → `src/app/page.tsx`)
- 6 Canvas 2D weather backgrounds displayed in vertical split strips via `clipPath`.
- Season labels at bottom with condition-specific accent colors.
- Glassmorphic card with Login/Signup toggle (name field appears for signup).
- Auth via Supabase `AuthManager`: email/password + Google OAuth.
- On success: exit animation → redirect to `/map`.
- If already logged in: auto-redirect to `/map`.

### Page 2: District Map (`/map` → `src/app/map/page.tsx`)
- Full-viewport warm radial gradient background.
- SVG map rendering all 30 districts from `karnatakaDistricts.ts`, wrapped in `scale(0.67)` for better fit.
- Hover: tooltip follows cursor showing district name + "Click to select".
- Click: selects district (highlighted fill + border).
- Bottom bar shows selected district name + "Continue →" pill button.
- On continue: navigates to `/portal?city={districtName}`.
- Auth guard: redirects to `/` if not logged in.

### Page 3: Portal (`/portal?city=X` → `src/app/portal/page.tsx`)
- Mode selection screen with 3 CometCard portal cards:
  - **Manual Prediction** — Adjust atmospheric parameters manually, XGBoost predicts.
  - **Live IoT Sensors** — Connect ESP32/Wokwi sensors for real-time data.
  - **Weather Intelligence** — Multi-source RAG district report.
- Each card has CometCard 3D tilt animation (cursor-tracked rotateX/Y via Framer Motion springs), cursor-following glare overlay, hover reveal of description, and portal glow ambient overlay.
- Intelligence mode checks place count: if district has ≤2 places, goes directly to `/intelligence`; otherwise → `/intelligence/portal` for District vs Place selection.
- Bottom actions: "← BACK TO MAP" and "HISTORY →".
- Auth guard: redirects to `/` if not logged in.

### Page 4a: Predict (`/predict?city=X` → `src/app/predict/page.tsx`)
- Wrapped in `<Suspense>` for `useSearchParams()`.
- Reads `city` from URL query params.
- **OrbitalPredict**: 5 variable nodes (Humidity, Pressure, Wind Speed, Min/Max Temp) orbit around a pulsing center.
  - Click any node → orbit rotates to bring it to 12-o'clock → expanded card with description + range slider.
  - Slider changes update the energy ring (SVG dashoffset).
  - Auto-rotate resumes when card closes.
- Background gradient tints dynamically based on slider values.
- **Quick Preview**: 6 preset buttons (Sunny/Cloudy/Rainy/Stormy/Foggy/Windy) that navigate directly to `/result` with hardcoded values.
- **On submit**: `POST <NEXT_PUBLIC_API_URL>/predict` → **Loading screen overlay** appears (AnimatePresence with 3D CSS cube animation) → navigates to `/result` on response.
- **Cold start UX**: Render free tier spins down after 15 min idle. First request takes 30-60s. Loading screen masks this delay.
- **Fallback logic**: If API fails or returns 503, client-side rules mirror the backend exactly.

### Page 4b: IoT (`/iot?city=X` → `src/app/iot/page.tsx`)
- Creates a session via `POST /iot/create-session` with `X-Api-Key` header.
- **Connection states**: connecting → connected → processing → completed / disconnected.
- Shows live sensor readings (Temperature, Humidity, Pressure, Wind Speed) in a glassmorphic card.
- **"Simulate Sensor Data"** button generates random realistic values and sends to `POST /iot/sensor-data`.
- Backend receives sensor data, estimates min/max range (±3°C), runs XGBoost prediction + rule overrides.
- On prediction received: displays result card with condition + confidence, option to "VIEW FULL RESULT" or "NEW READING".
- Saves prediction to Supabase history via `savePrediction()`.
- Uses `loader-iot.tsx` for connection/processing states.

### Page 4c: Intelligence (`/intelligence?city=X` → `src/app/intelligence/page.tsx`)
- Wrapped in `<Suspense>` for `useSearchParams()`.
- Calls `GET /intelligence?district=X` (optionally with `&place=Y&lat=...&lng=...`).
- Displays sections based on `_available` array:
  - **Current Weather** — Temperature, humidity, wind, pressure, WMO code icon, 7-day forecast.
  - **Places to Visit** — Nearby places from Overpass API (name, type).
  - **About the District** — Wikipedia extract + link.
  - **Travel Guide** — Wikivoyage extract + link.
  - **Gallery** — Wikimedia Commons images in a responsive grid.
  - **Recent News** — RSS news feed items with source and date.
- LLM-generated summary displayed below the header.
- Saves prediction to Supabase history.
- Uses `loader-wi.tsx` loading animation.

### Page 4c-i: Intelligence Portal (`/intelligence/portal?city=X` → `src/app/intelligence/portal/page.tsx`)
- "Beyond the Fold" screen for districts with >2 places.
- Two CometCard options:
  - **Continue with District** — Full district-wide report.
  - **Select a Specific Place** — Pick a specific location for focused report.

### Page 4c-ii: Intelligence Select (`/intelligence/select?city=X` → `src/app/intelligence/select/page.tsx`)
- Combobox search interface for selecting a specific place within the district.
- On selection: navigates to `/intelligence?city=X&place=Y&lat=...&lng=...`.
- Uses `PlaceCombobox` component.

### Page 5: Result (`/result?...` → `src/app/result/page.tsx`)
- Reads all params from URL: city, condition, confidence, slider values.
- **WeatherBackground** (Canvas 2D) renders behind content.
- **ParallaxSection**: sticky hero with zoom-out (1→0.88) and fade as user scrolls.
- **WeatherStickman**: condition-specific SVG stick figure (Sunny=lying, Cloudy=walking, Rainy=umbrella, Stormy=crouching+lightning, Foggy=arms out, Windy=leaning).
- **Weather content cards**: 3 image+text cards with scroll-reveal (`IntersectionObserver`).
- **Travel cards**: 3 destination cards with image, description, best time, tip.
- **Tips**: 5 condition-specific tips with numbered counters.
- **Profile button** (top-right): opens centered modal with avatar upload, name edit, logout.
- All colors use `CONDITION_TEXT_COLORS` per condition (e.g., Rainy=`#f5c8a0` peach text on dark teal bg).
- Auth guard: redirects to `/` if not logged in.

### Page 6: History (`/history` → `src/app/history/page.tsx`)
- Prediction history fetched from Supabase `prediction_history` table.
- Filter tabs: All, Manual, IoT, Intelligence.
- Each entry shows: condition, mode badge, district, confidence, timestamp.
- Click entry → navigate to result page.
- Delete button with hover reveal.
- Auth guard: redirects to `/` if not logged in.

---

## 5. Color System

### CSS Custom Properties (globals.css)
| Token | Value |
|-------|-------|
| `--color-accent` | `#8b4513` |
| `--color-bg` | `#f5f0e8` |

### Condition Text Colors (result page, login labels)
| Condition | Color | Background |
|-----------|-------|------------|
| Sunny | `#3b2d8a` (deep indigo) | Warm golden |
| Cloudy | `#b8860b` (goldenrod) | Cool grey |
| Rainy | `#f5c8a0` (warm peach) | Dark teal |
| Stormy | `#b8d44a` (lime green) | Deep purple |
| Foggy | `#8b5a3a` (chestnut) | Muted blue-grey |
| Windy | `#9a5a7a` (dusty rose) | Soft green |

### Portal Card Colors (WeatherPortal.tsx)
| Portal Type | Color | Description |
|-------------|-------|-------------|
| manual | `#6b7fa3` | Muted dusty blue |
| iot | `#5a8a6a` | Muted sage green |
| intelligence | `#c49a3c` | Warm antique gold |
| district | `#b8855a` | Warm copper |
| place | `#7a9a7a` | Muted sage |

### Loading Screen Palette (CSS 3D cubes)
| Token | Color |
|-------|-------|
| Primary cyan | `#06b6d4` |
| Glow cyan | `#22d3ee` |
| Dark cyan | `#0891b2` |
| Purple accent | `#a78bfa` |
| Indigo accent | `#818cf8` |
| Overlay bg | `#f0ffff` |

### Typography
| Font | Usage |
|------|-------|
| Playfair Display (serif) | Headings, district names, big condition text, portal card titles |
| Space Mono (monospace) | Labels, eyebrows, metadata, buttons, portal subtitles |
| Montserrat (sans-serif) | Body text (fallback from Tailwind), card descriptions |
| Courier New (monospace) | Loading screen letter cubes, subtitle |

---

## 6. API Contract

### Backend Base URL
```
NEXT_PUBLIC_API_URL (defaults to http://localhost:8000)
```

Deployed at: `https://karnataka-weather-uxdg.onrender.com`

### Endpoint 1: `POST /predict`

**Rate limit:** 30/minute

**Request:**
```json
{
  "minTemp": 18.0,
  "maxTemp": 30.0,
  "humidity": 60.0,
  "pressure": 1010.0,
  "windSpeed": 12.0
}
```

**Response (200):**
```json
{
  "condition": "Sunny",
  "confidence": 0.87
}
```

**Response (503 — model not ready):**
```json
{
  "error": "Model still loading. Please retry shortly."
}
```

**Possible `condition` values:** `"Sunny"`, `"Cloudy"`, `"Rainy"`, `"Stormy"`, `"Foggy"`, `"Windy"`

### Endpoint 2: `POST /iot/create-session`

**Rate limit:** Shared with IoT router
**Auth:** `X-Api-Key` header required

**Request:**
```json
{
  "session_id": "sensor_1720000000_abc123",
  "district": "Bengaluru"
}
```

**Response (200):**
```json
{
  "session_id": "sensor_1720000000_abc123",
  "status": "waiting"
}
```

### Endpoint 3: `POST /iot/sensor-data`

**Rate limit:** Shared with IoT router
**Auth:** `X-Api-Key` header required

**Request:**
```json
{
  "session_id": "sensor_1720000000_abc123",
  "temperature": 28.5,
  "humidity": 65.0,
  "pressure": 1012.3,
  "wind_speed": 15.0
}
```

**Response (200):**
```json
{
  "session_id": "sensor_1720000000_abc123",
  "status": "received",
  "prediction": {
    "condition": "Cloudy",
    "confidence": 0.82
  }
}
```

**Note:** Backend estimates min/max temperature range (±3°C from single reading) before running prediction.

### Endpoint 4: `GET /intelligence`

**Rate limit:** 10/minute

**Query params:**
| Param | Required | Description |
|-------|----------|-------------|
| `district` | Yes | District name |
| `place` | No | Specific place name |
| `lat` | No | Latitude (used with place) |
| `lng` | No | Longitude (used with place) |

**Response (200):**
```json
{
  "weather": {
    "current": {
      "temperature_2m": 28.5,
      "relative_humidity_2m": 65,
      "apparent_temperature": 30.1,
      "weather_code": 2,
      "wind_speed_10m": 12.3,
      "pressure_msl": 1012.5
    },
    "daily": {
      "time": ["2026-07-20", ...],
      "temperature_2m_max": [32, ...],
      "temperature_2m_min": [22, ...]
    }
  },
  "places": [
    { "name": "Lalbagh Botanical Garden", "type": "park", "lat": 12.9507, "lng": 77.5848 }
  ],
  "wikipedia": {
    "title": "Bengaluru",
    "extract": "Bengaluru is the capital of Karnataka...",
    "url": "https://en.wikipedia.org/wiki/Bengaluru"
  },
  "wikivoyage": {
    "title": "Bengaluru",
    "extract": "Bengaluru (formerly Bangalore) is the capital...",
    "url": "https://en.wikivoyage.org/wiki/Bengaluru"
  },
  "images": [
    { "title": "Bangalore Palace", "url": "https://upload.wikimedia.org/..." }
  ],
  "news": [
    { "title": "Weather alert for Karnataka", "url": "...", "source": "...", "published": "2026-07-20T..." }
  ],
  "summary": "Bengaluru currently has partly cloudy skies at 28.5°C...",
  "_available": ["weather", "places", "knowledge", "images", "news"]
}
```

### Slider Ranges (frontend — Manual mode)
| Parameter | Min | Max | Step | Default | Unit |
|-----------|-----|-----|------|---------|------|
| Humidity | 20 | 100 | 1 | 60 | % |
| Pressure | 980 | 1025 | 0.5 | 1010 | hPa |
| Wind Speed | 0 | 80 | 1 | 20 | km/h |
| Min Temp | 5 | 25 | 0.5 | 18 | °C |
| Max Temp | 20 | 45 | 0.5 | 30 | °C |

---

## 7. ML Inference (`backend/main.py` + `backend/services/prediction_utils.py`)

### Training Pipeline
1. Reads `karnataka_weather_500.csv` (500 rows, 6 classes).
2. Engineers 15 features from 5 raw inputs via `prediction_utils.engineer_features()`.
3. Applies SMOTE oversampling for class balance.
4. Trains XGBoost classifier (500 trees, max_depth=8, lr=0.05, subsample=0.85, colsample_bytree=0.85, min_child_weight=3, gamma=0.1, reg_alpha=0.1, reg_lambda=1.0).
5. Model trained in background thread on Render startup via `lifespan` context manager.
6. After training: initializes IoT gateway with model reference.

### Engineered Features (15 total)
| Feature | Formula |
|---------|---------|
| MinTemp, MaxTemp, Humidity, Pressure, WindSpeed | Raw inputs |
| TempRange | MaxTemp − MinTemp |
| TempMean | (MaxTemp + MinTemp) / 2 |
| HumidityWind | Humidity × WindSpeed / 100 |
| PressureAnomaly | 1013.25 − Pressure |
| StormIndex | (Humidity/100) × (WindSpeed/75) × (clip(PressureAnomaly, 0)/25 + 0.3) |
| HeatDryIndex | (MaxTemp/45) × (1 − Humidity/100) |
| FogIndex | clip(1−(MinTemp−10)/18, 0, 1) × (Humidity/100) × clip(1−WindSpeed/75, 0, 1) |
| HumidityHigh | (clip(Humidity−70, 0)/30)² |
| HumidityLow | (clip(50−Humidity, 0)/50)² |
| WindPower | (WindSpeed/75)^1.5 |

### Prediction Pipeline
1. Receives 5 raw inputs via POST.
2. Engineers 15 features (identically to training).
3. Runs XGBoost predict + predict_proba.
4. Applies 8 rule overrides (priority order, in `prediction_utils.py`).

### Rule Overrides (priority order)
| Rule | Output | Confidence |
|------|--------|-----------|
| humidity ≥ 88 AND windSpeed ≥ 40 | Stormy | ≥0.88 |
| humidity ≥ 88 AND windSpeed ≥ 5 | Rainy | ≥0.82 |
| humidity ≥ 85 AND windSpeed ≥ 15 | Rainy | ≥0.84 |
| humidity ≥ 92 AND windSpeed ≥ 3 | Rainy | ≥0.80 |
| humidity ≥ 40 AND windSpeed ≤ 15 AND minTemp ≤ 18 AND maxTemp ≤ 26 | Foggy | ≥0.78 |
| humidity ≥ 70 | Cloudy | ≥0.80 |
| windSpeed ≥ 30 | Windy | ≥0.82 |
| maxTemp ≥ 26 AND humidity ≤ 55 | Sunny | ≥0.85 |
| (fallthrough) | ML model | ML confidence |

### Performance
- Sub-50ms inference on Render 512 MB RAM (after warm).
- First request triggers cold start (30-60s) due to Render free tier spin-down.

---

## 8. Loading Screens

### Main Loading Screen (`src/components/ui/loading-screen.tsx`)
- **Big cube**: 96×96px 3D cube (cyan/purple/indigo faces) with blurred core and floor shadow — spins continuously.
- **Letter cubes**: 7 cubes (40×40px) spelling L-O-A-D-I-N-G in a flex row with `perspective: 700px`.
- **Subtitle**: "Preparing your experience, please wait…"
- `zapFade` on each `.cube`: Z-axis translate + opacity with staggered delay (wave effect).
- `glowFade` on `.l-front`: cyan box-shadow (`#22d3ee`) ramps in sync with `zapFade`.
- Used on Manual mode prediction loading.

### IoT Loader (`src/components/ui/loader-iot.tsx`)
- Used during IoT connection establishment and sensor data processing states.

### Intelligence Loader (`src/components/ui/loader-wi.tsx`)
- Used during Weather Intelligence data fetching (multi-source concurrent requests).

---

## 9. Authentication (`src/lib/auth.ts`)

- **Supabase** browser client via `@supabase/ssr`.
- Lazy initialization (`getClient()` caches singleton).
- Methods: `signup()`, `login()`, `signInWithGoogle()`, `logout()`, `current()`, `updateProfile()`, `uploadAvatar()`.
- Avatar upload: resizes to 150px JPEG thumbnail, stores in Supabase `user_metadata` + localStorage fallback.
- OAuth callback: `auth/callback/route.ts` exchanges code for session, redirects to `/map`.
- Guard: each protected page calls `AuthManager.current()` in `useEffect`.

### Prediction History (`src/lib/history.ts`)
- Stored in Supabase `prediction_history` table.
- `savePrediction()` — Inserts entry with user_id, district, mode, condition, confidence, input_params.
- `fetchHistory()` — Fetches up to 50 entries, ordered by created_at descending.
- `deleteHistoryEntry()` — Deletes by row ID.

---

## 10. IoT System

### Wokwi ESP32 Integration (`backend/wokwi/sketch.ino`)
- **Sensors:** DHT22 (temperature + humidity), BMP180 (pressure via I2C), Potentiometer on GPIO34 (simulates wind speed 0-50 km/h).
- **Display:** SSD1306 OLED (128×64) showing live sensor readings + connection status.
- **Connectivity:** WiFi → HTTP POST to backend with `X-Api-Key` header.
- **Flow:** Boot → WiFi connect → Create session → Every 10s: read sensors → POST sensor-data → OLED update.
- **Configurable:** `API_HOST`, `API_KEY`, `SESSION_ID`, `DISTRICT`, `POST_INTERVAL` as `#define` constants.

### Backend IoT Gateway (`backend/services/iot_gateway.py`)
- FastAPI router mounted at `/iot` prefix.
- API key verification via `X-Api-Key` header against `IOT_API_KEY` env var.
- `POST /create-session` — Creates in-memory session (auto-cleanup after 5 min idle).
- `POST /sensor-data` — Receives readings, estimates min/max temp range (±3°C), runs XGBoost prediction, returns result.
- `GET /session/{session_id}` — Retrieve session state.

### IoT Session Manager (`backend/services/iot_manager.py`)
- Thread-safe in-memory session store with `threading.Lock`.
- Auto-cleanup of sessions older than 300 seconds on each new session creation.

---

## 11. Weather Intelligence System

### Orchestrator (`backend/services/weather_intelligence.py`)
- Concurrent fetching via `asyncio.gather()` from 6 sources.
- Source timeout handling — individual failures don't block other sources.
- `_safe()` wrapper logs failures and returns defaults.
- **District-level intelligence cache** (2-min TTL) — caches full district responses, giving 60x speedup (2.39s → 0.04s) for cached districts.
- **Priority wait logic** — if user requests a district being pre-warmed, waits up to 10s for cache to populate.
- **Priority cache pre-warming** — background thread pre-caches all 31 districts on server start with 30s timeout per district.

### Caching Layer (`backend/services/cache.py`)
- `TTLCache` class (pure Python, no external dependencies) with `get()`, `set()`, `invalidate()`, and `is_cached()` methods.
- Per-source caches with optimized TTLs: weather 2min, places 6hr, wiki 24hr, wikimedia 6hr, news 30min, LLM 2min.
- `district_intelligence_cache` — district-level 2-min cache storing full aggregated responses.
- `computing` set tracks districts currently being pre-warmed to prevent duplicate work.

### Data Sources (`backend/services/sources/`)
| Source | Module | Data |
|--------|--------|------|
| Open-Meteo | `open_meteo.py` | Current weather + 7-day forecast |
| Overpass API | `overpass.py` | Nearby places (POIs from OpenStreetMap) |
| Wikipedia | `wikipedia.py` | District + place summaries, Wikivoyage travel guides |
| Wikimedia | `wikimedia.py` | Commons image URLs |
| RSS News | `rss_news.py` | Recent news articles about the district |

### Response Merger (`backend/services/response_merger.py`)
- Combines all source results into unified response object.
- Builds `_available` array indicating which data sources returned results.

### LLM Summarizer (`backend/services/llm_summarizer.py`)
- **Provider chain:** Gemini 2.0 Flash (primary) → Groq Llama 3.1 8B Instant (fallback).
- Falls through on 429 rate limit or any error.
- Generates 3-4 sentence summary about the district's weather and visitor information.
- Returns `None` if all providers fail (summary is optional, not required for response).
- **LLM cache** (2-min TTL) — caches summary per district+place combination to avoid redundant LLM calls.

---

## 12. CometCard Portal System

### WeatherPortal (`src/components/portals/WeatherPortal.tsx`)
- Reusable portal card component supporting 5 types: manual, iot, intelligence, district, place.
- **3D tilt:** Cursor-tracked `rotateX`/`rotateY` via Framer Motion `useSpring` (stiffness: 150, damping: 20).
- **Glare overlay:** Radial gradient follows cursor position, blends via `mix-blend-mode: overlay`.
- **Hover reveal:** Description text + CTA clip open with staggered opacity/y/blur animations.
- **Float animation:** CSS class-based GPU float animation per portal type index.
- **Portal glow:** Full-viewport amber overlay on hover via React Portal to `document.body`.

### PortalGlow (`src/components/portals/PortalGlow.tsx`)
- Cursor-following ambient glow effect rendered behind the card.

---

## 13. Security

### CORS (`backend/main.py`)
- Configurable via `CORS_ORIGINS` env var (comma-separated).
- Defaults to `http://localhost:3000` for development.
- Allows GET and POST methods.

### Rate Limiting (`backend/main.py`)
- `slowapi` with `get_remote_address` key function.
- `/predict`: 30 requests/minute.
- `/intelligence`: 10 requests/minute.
- Returns 429 with JSON error message on limit exceeded.

### Security Headers (`next.config.mjs`)
| Header | Value |
|--------|-------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| Referrer-Policy | strict-origin-when-cross-origin |
| X-DNS-Prefetch-Control | on |

---

## 14. Known Issues & Technical Debt

1. **IoT sessions are in-memory only** — Sessions stored in Python dict are lost on server restart. Render free tier restarts periodically, clearing all active sessions.
2. **`<img>` instead of `<Image />`** — External Unsplash/Pexels images use native `<img>` tags (triggers Next.js build warning). Acceptable for decorative backgrounds but should use `next/image` for performance.
3. **Profile photo size limit** — Supabase `user_metadata` has size limits. The 150px JPEG thumbnail (~5-15KB) stays within limits, but very large metadata updates may be silently dropped. localStorage provides fallback persistence.
4. **No `onError` fallback for external images** — Unsplash/Pexels URLs could fail silently; the intelligence page has `onError` hide-fallback but result page cards do not.
5. **Render free tier cold start** — First request after 15 min idle takes 30-60s. Loading screens mask this but user must wait.
6. **Cache memory usage on free tier** — 31 districts × ~50KB per cached response ≈ 1.5MB extra RAM on Render's 512MB free tier. Acceptable but should be monitored.
7. **Overpass API remains flaky** — Static place fallback handles failures but quality is lower than live Overpass data.

---

## 15. Run Commands

```powershell
# Frontend
npm install              # First time
npm run dev              # Frontend at http://localhost:3000
npm run build            # Production build
npm run lint             # ESLint

# Backend (local Python)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # Backend at http://localhost:8000

# Wokwi Simulator
# Open backend/wokwi/ in Wokwi IDE (https://wokwi.com)
# Requires wokwi.toml + sketch.ino
```

---

## 16. Environment Variables

### Frontend (`.env`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_API_URL` | Python backend URL (defaults to `http://localhost:8000`) |
| `NEXT_PUBLIC_IOT_API_KEY` | API key for IoT endpoints (shared with backend `IOT_API_KEY`) |

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (primary LLM provider) |
| `GROQ_API_KEY` | Groq API key (fallback LLM provider) |
| `CORS_ORIGINS` | Comma-separated allowed origins (defaults to `http://localhost:3000`) |
| `IOT_API_KEY` | API key for IoT gateway authentication (shared with frontend `NEXT_PUBLIC_IOT_API_KEY`) |

---

*Document updated: 2026-07-22. Keep updated when making changes.*
