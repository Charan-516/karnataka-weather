# Karnataka Weather

A cinematic weather prediction platform for all 30 districts of Karnataka, India. Users select a district on an interactive SVG map, choose a prediction mode (Manual, IoT, or Intelligence), and receive a weather classification displayed on a full-screen page with Canvas 2D weather animations, parallax scrolling, and district-specific travel content.

The system uses a **Python FastAPI backend** with an XGBoost ML model for inference, and a **Next.js 15 frontend** for the UI.

## Architecture

```
Frontend (Next.js 15, port 3000)           Backend (FastAPI, port 8000)
┌───────────────────────────┐              ┌──────────────────────────────┐
│  SVG Map (30 districts)   │              │  XGBoost ML Model            │
│  Portal (3 mode cards)    │──── fetch ──│  /predict                    │
│  Predict (orbital sliders)│              │  LLM Summarizer (Gemini/Groq)│
│  Result (cinematic)       │              │  /iot/create-session         │
│  IoT Live Dashboard       │──── fetch ──│  /iot/sensor-data            │
│  Intelligence Portal      │──── fetch ──│  /intelligence               │
│  Intelligence Select      │              │  Open-Meteo + Overpass       │
│  History                  │              │  Wikimedia Commons API       │
│  Supabase Auth            │              │  IoT API key auth            │
│  Canvas 2D Backgrounds    │              │  CORS + rate limiting        │
│  District/Place Data      │              │  Security headers            │
│  CometCard 3D tilt        │              │                              │
└───────────────────────────┘              └──────────────────────────────┘
         │                                          │
         │         Wokwi ESP32 Simulator            │
         │    ┌─────────────────────────┐           │
         │    │  DHT22 (temp + humidity) │──HTTP POST──┘
         │    │  BMP180 (pressure)       │
         │    │  Potentiometer (wind)    │
         │    │  OLED SSD1306 (display)  │
         │    └─────────────────────────┘
```

## Prediction Modes

- **Manual** — Users adjust 5 atmospheric variables (humidity, pressure, wind speed, min/max temperature) via orbital sliders. XGBoost inference runs on the Python backend; an inline fallback handles server failures.
- **IoT** — Live sensor data from Wokwi ESP32 simulator (DHT22 + BMP180 + potentiometer) or physical hardware. The backend returns ±3°C temperature bounds from the estimate. Controls allow pause/resume/reset/stop. API key authentication required.
- **Intelligence** — AI-powered analysis that queries Open-Meteo forecast APIs, OpenStreetMap (Overpass) for local infrastructure, Wikimedia Commons for landmarks, and an LLM (Gemini or Groq) for natural language summaries. Returns 7-day forecast, landmarks, places, and a narrative summary.

## Techniques

- **SVG map with mouse-following tooltip** — [`src/app/map/page.tsx`](src/app/map/page.tsx) renders 30 GeoJSON-derived polygons as SVG `<path>` elements. Hover tracking via `onMouseMove` positions a tooltip at cursor coordinates.
- **Orbital UI with click-to-expand cards** — [`src/systems/sliders/OrbitalPredict.tsx`](src/systems/sliders/OrbitalPredict.tsx) arranges five parameter nodes in a circle. Clicking a node triggers `requestAnimationFrame`-based rotation that snaps to 12-o'clock, then reveals an expanded card with a range slider.
- **Canvas 2D weather backgrounds** — Six condition-specific components in [`src/systems/weather/backgrounds/`](src/systems/weather/backgrounds/) draw continuous `requestAnimationFrame` loops on a `<canvas>`: radial gradients, arc-based particle fields, alpha pulsation, and layered lightning flashes.
- **XGBoost ML inference (Python)** — A 100-tree, 6-class XGBoost model runs server-side in FastAPI. Feature engineering derives 15 features from 5 raw inputs via `engineer_features()` in [`backend/services/prediction_utils.py`](backend/services/prediction_utils.py).
- **LLM summarization with provider fallback** — [`backend/services/llm_summarizer.py`](backend/services/llm_summarizer.py) tries Gemini first, then falls back to Groq. Uses `asyncio.gather(return_exceptions=True)` for timeout isolation.
- **CometCard 3D tilt** — [`src/components/portals/WeatherPortal.tsx`](src/components/portals/WeatherPortal.tsx) uses `useMotionValue` + `useSpring` for mouse-tracking rotateX/rotateY with a glare overlay using `mix-blend-overlay`.
- **Parallax zoom via scroll listener** — [`src/app/result/page.tsx`](src/app/result/page.tsx) scales the sticky hero from 1→0.88 and fades opacity to 0 as the user scrolls.
- **Auto-disconnecting IntersectionObserver** — Sequential reveal of content cards via `useScrollReveal` hook that calls `obs.unobserve(el)` after firing once.
- **IoT API key authentication** — [`backend/services/iot_gateway.py`](backend/services/iot_gateway.py) verifies `X-Api-Key` header against `IOT_API_KEY` env var for all IoT endpoints.
- **Wokwi ESP32 integration** — [`backend/wokwi/sketch.ino`](backend/wokwi/sketch.ino) sends DHT22 + BMP180 + potentiometer data to the backend every 10 seconds via HTTP POST.

## Libraries & Fonts

- **[Framer Motion](https://motion.dev)** — Spring-based entry animations: fade-up with blur, scale-in, and staggered delays.
- **[Lenis](https://github.com/studio-freight/lenis)** — Smooth scrolling with custom cubic easing (configured in [`LenisProvider.tsx`](src/components/layout/LenisProvider.tsx)).
- **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Authentication via `@supabase/ssr`. Email/password signup and Google OAuth.
- **[Lucide React](https://lucide.dev)** — Icons for orbital variable nodes.
- **[Playfair Display](https://fonts.google.com/specimen/Playfair+Display)** — Serif headings and district names.
- **[Space Mono](https://fonts.google.com/specimen/Space+Mono)** — Monospace for labels and metadata.
- **[Montserrat](https://fonts.google.com/specimen/Montserrat)** — Sans-serif body text.

## Project Structure

```
karnataka-weather/
├── .env.example                    # Frontend env template
├── .gitignore
├── next.config.mjs                 # Security headers, image remote patterns
├── package.json
├── tsconfig.json
├── public/                         # Static assets (SVG icons)
├── backend/
│   ├── main.py                     # FastAPI app entry point (CORS, rate limiting, security)
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # API keys (not committed)
│   ├── karnataka_weather_500.csv   # Training dataset
│   ├── wokwi/
│   │   ├── sketch.ino              # ESP32 Wokwi simulator sketch
│   │   └── wokwi.toml              # Wokwi project config
│   └── services/
│       ├── prediction_utils.py     # Feature engineering + model constants
│       ├── iot_gateway.py          # IoT endpoints (API key auth)
│       ├── iot_manager.py          # IoT session state management
│       ├── weather_intelligence.py # Open-Meteo + Overpass + Wikimedia + LLM
│       ├── llm_summarizer.py       # Gemini / Groq provider integration
│       ├── static_places.py        # 30-district place data
│       ├── response_merger.py      # Response merging utility
│       └── sources/
│           ├── overpass.py         # OpenStreetMap Overpass API
│           ├── wikimedia.py        # Wikimedia Commons API
│           ├── open_meteo.py       # Open-Meteo forecast API
│           ├── rss_news.py         # RSS news feed
│           └── wikipedia.py        # Wikipedia API
├── src/
│   ├── app/
│   │   ├── globals.css             # Design tokens, keyframes, input range styles
│   │   ├── layout.tsx              # Root layout, font imports, LenisProvider
│   │   ├── page.tsx                # Login/signup with 6-split weather backgrounds
│   │   ├── map/page.tsx            # SVG district selector (30 districts)
│   │   ├── predict/page.tsx        # Orbital sliders + prediction mode selector
│   │   ├── result/page.tsx         # Full cinematic result page
│   │   ├── portal/page.tsx         # Mode selection portal (Manual, IoT, Intelligence)
│   │   ├── iot/page.tsx            # IoT live dashboard with sensor controls
│   │   ├── intelligence/
│   │   │   ├── page.tsx            # Intelligence analysis page
│   │   │   ├── portal/page.tsx     # Intelligence beyond-the-fold (District, Place cards)
│   │   │   └── select/page.tsx     # Intelligence selection page
│   │   ├── history/page.tsx        # Prediction history
│   │   └── auth/callback/route.ts  # Supabase OAuth exchange endpoint
│   ├── components/
│   │   ├── layout/LenisProvider.tsx
│   │   ├── portals/
│   │   │   ├── WeatherPortal.tsx   # CometCard with 3D tilt + PortalGlow
│   │   │   └── PortalGlow.tsx      # Cursor-following color glow
│   │   └── ui/
│   │       ├── loading-screen.tsx  # 3D CSS loading screen
│   │       ├── loader-iot.tsx      # IoT-specific loading animation
│   │       ├── loader-wi.tsx       # Intelligence-specific loading animation
│   │       ├── animated-list.tsx   # Animated list component
│   │       ├── button.tsx          # Shadcn button primitive
│   │       └── combobox.tsx        # Combobox component
│   ├── lib/
│   │   ├── auth.ts                 # Supabase AuthManager
│   │   ├── utils.ts                # cn() classname helper
│   │   ├── weatherContent.ts       # Copy for all 6 weather conditions
│   │   ├── districtContent.ts      # Travel guides for all 30 districts
│   │   ├── places.ts               # Place data for all 30 districts
│   │   ├── karnatakaDistricts.ts   # District coordinates + SVG paths
│   │   ├── history.ts              # Prediction history utility
│   │   └── weatherIntelligence.ts  # Intelligence frontend utility
│   └── systems/
│       ├── weather/
│       │   ├── WeatherBackground.tsx   # Dynamic import router for 6 canvases
│       │   └── backgrounds/            # Canvas 2D per-condition renderers
│       └── sliders/
│           └── OrbitalPredict.tsx      # Orbital node + expand card UI
```

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase project (for auth)
- Gemini API key and/or Groq API key (for LLM summaries)

### Frontend

```bash
npm install
npm run dev        # http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # fill in API keys
python main.py          # http://localhost:8000
```

### Wokwi ESP32

1. Go to [wokwi.com](https://wokwi.com)
2. Create a new ESP32 project
3. Paste the contents of `backend/wokwi/sketch.ino` into the code editor
4. Add dependencies: `Adafruit BMP085`, `Adafruit SSD1306`, `Adafruit GFX`, `DHT sensor`
5. Wire components: DHT22 (GPIO4), BMP180 (I2C), Potentiometer (GPIO34), OLED (I2C)
6. Click Start — data is sent to your backend every 10 seconds

### Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_API_URL` | Python backend URL |
| `NEXT_PUBLIC_IOT_API_KEY` | API key for IoT endpoints |
| `GEMINI_API_KEY` | Google Gemini API key for LLM summaries |
| `GROQ_API_KEY` | Groq API key (fallback for LLM) |
| `IOT_API_KEY` | Backend IoT endpoint authentication |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) |

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Dataset

The XGBoost model is trained on Karnataka weather station data with 6 classes: **Sunny**, **Cloudy**, **PartlyCloudy**, **Rainy**, **Stormy**, **Windy**. Training data includes historical readings of humidity, pressure, wind speed, and temperature, augmented with 15 engineered features (temperature range, storm index, fog index, etc.).
