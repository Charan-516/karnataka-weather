# Karnataka Weather — Complete Presentation Script

## AI-Powered Weather Prediction for 30 Districts of Karnataka

---

## SLIDE 1: Title Slide

**Title:** Karnataka Weather — AI-Powered Prediction Platform

**Speaker Notes:**
"Good morning/afternoon everyone. I'm presenting Karnataka Weather — a full-stack ML platform that predicts weather conditions for 30 districts of Karnataka using XGBoost with a Python FastAPI backend deployed on Render. The system supports three prediction modes: Manual input via orbital sliders, live IoT sensor data from an ESP32 simulator, and AI-powered Intelligence analysis using Open-Meteo, OpenStreetMap, and LLM summarization. A cinematic frontend on Vercel calls a Python ML backend on Render, with a 3D loading screen that masks the 30-60 second Render cold start. The intelligence endpoint uses a TTL caching layer that delivers 60x speedup on cache hits, with priority pre-warming of all 31 districts on server startup."

**Key Talking Points:**
- Geographic scope: 30 Karnataka districts
- Three prediction modes: Manual, IoT, Intelligence
- Core technology: XGBoost + FastAPI + Next.js
- Two-tier deployment: Vercel (frontend) + Render (backend)
- Loading screen handles cold start UX

---

## SLIDE 2: Problem Statement

**Title:** Problem Statement

**Speaker Notes:**
"Traditional weather forecasting requires supercomputing infrastructure, vast sensor networks, and expert meteorologists. For regional and local forecasting — especially in developing regions — these resources are often unavailable. Farmers, travellers, and event planners in Karnataka need accessible, real-time weather predictions without expensive equipment. The challenge: deliver accurate predictions using minimal inputs — just five atmospheric parameters — while maintaining production-grade reliability at zero infrastructure cost."

**Key Talking Points:**
- Gap between NWP complexity and end-user accessibility
- Regional forecasting gap in India
- Need for minimal-input, high-accuracy prediction
- Zero-cost deployment constraint

---

## SLIDE 3: Existing Systems

**Title:** Existing Weather Prediction Systems

**Speaker Notes:**
"Currently, weather prediction falls into three categories. Numerical Weather Prediction models like ECMWF and GFS — supercomputer-based simulations requiring terabytes of data. Statistical models like ARIMA that work for time-series but struggle with categorical conditions. Commercial APIs like OpenWeatherMap that provide predictions at recurring cost with limited transparency. None are designed for Karnataka's specific climate patterns — from coastal Mangalore to arid Ballari to the Western Ghats."

**Key Talking Points:**
- NWP: high accuracy, high cost
- Statistical: time-series only
- Commercial APIs: monthly subscriptions, black-box
- Karnataka-specific gap: no localized model

---

## SLIDE 4: Proposed System — Overview

**Title:** Proposed System — Overview

**Speaker Notes:**
"Our proposed system is a full-stack web application supporting three prediction modes. The user selects a district on an interactive SVG map, then chooses a mode from the Portal page — three CometCard tiles with 3D mouse-tracking tilt animation and cursor-following glow effects.

**Manual Mode:** Users adjust five parameters through an orbital UI — five nodes circling a central pulsing orb, each clickable to reveal an expanded card with a range slider. On submit, the frontend sends a POST request to a Python FastAPI backend on Render.

**IoT Mode:** Live sensor data from a Wokwi ESP32 simulator — DHT22 for temperature and humidity, BMP180 for pressure, and a potentiometer for wind speed. Data is sent to the backend every 10 seconds via HTTP POST with API key authentication.

**Intelligence Mode:** AI-powered analysis that queries Open-Meteo forecast APIs, OpenStreetMap for local infrastructure, Wikimedia Commons for landmarks, and an LLM (Gemini or Groq) for natural language summaries.

The backend applies 15 engineered features, runs them through 100 XGBoost trees per class, applies 7 meteorological rule overrides, and returns the predicted condition with a confidence score."

**Key Talking Points:**
- Three modes: Manual, IoT, Intelligence
- SVG district map with hover tooltips
- Orbital UI: 5 parameter nodes orbiting a central pulse
- Wokwi ESP32 with DHT22 + BMP180 + Potentiometer
- Intelligence: Open-Meteo + Overpass + Wikimedia + LLM
- 15 engineered features → 600 trees → rule overrides
- Python FastAPI on Render — cold start handled by loading screen
- CometCard 3D tilt with mouse-tracking animation

---

## SLIDE 5: Project Objectives

**Title:** Project Objectives

- Build an ML model achieving 85%+ accuracy from five atmospheric parameters
- Engineer 15 domain-specific meteorological features
- Deploy a Python FastAPI ML backend on Render free tier
- Design a cinematic UI with orbital parameter input and Canvas 2D weather backgrounds
- Implement a 3D loading screen to handle cold-start latency
- Deploy on zero-cost infrastructure (Vercel + Render + Supabase free)
- Serve all 30 Karnataka districts with unique travel content
- Support three prediction modes: Manual, IoT sensor data, and AI Intelligence
- Integrate Wokwi ESP32 simulator with real sensor hardware
- Provide API key authentication for IoT endpoints

---

## SLIDE 6: Dataset

**Title:** Dataset Overview

**Speaker Notes:**
"Our dataset contains 500 rows of meteorological data covering six weather conditions across Karnataka. Each row has five raw features: MinTemp (5-25°C), MaxTemp (20-45°C), Humidity (20-100%), Pressure (980-1025 hPa), and WindSpeed (0-80 km/h). The data was synthetically generated using parametric distributions calibrated against India Meteorological Department historical climate norms for Karnataka. SMOTE oversampling balanced the classes."

**Key Talking Points:**
- 500 samples, 5 raw features, 6 classes
- Feature ranges reflect real Karnataka climate
- Synthetic generation from IMD norms
- Balanced class distribution via SMOTE

---

## SLIDE 7: Feature Engineering

**Title:** Feature Engineering — 15 Features from 5 Inputs

**Speaker Notes:**
"From 5 raw inputs we derive 10 additional features. TempRange (diurnal variation). TempMean (overall warmth). HumidityWind (humidity × wind ÷ 100 — distinguishes Rainy from Stormy). PressureAnomaly (1013.25 - pressure — deviation from standard atmosphere). StormIndex (combines humidity, wind, and pressure into a single storm severity score). HeatDryIndex (captures hot-and-dry conditions). FogIndex (cold + humidity + calm wind). HumidityHigh and HumidityLow (quadratic humidity effects). WindPower (non-linear wind effects)."

**Key Talking Points:**
- 5 raw → 15 total features
- StormIndex ranks #1 in feature importance
- Engineered features dominate the top 3 importance slots

---

## SLIDE 8: Model Architecture

**Title:** XGBoost Model Architecture

**Speaker Notes:**
"100 boosting rounds with 6 trees per round — 600 trees total. Each tree has maximum depth of 8. Objective is multi:softprob, outputting probability distributions over all 6 classes. Learning rate 0.05. Subsample 0.85, column subsample 0.85. Regularization prevents overfitting on our 500-sample dataset."

**Key Talking Points:**
- 100 rounds × 6 trees = 600 trees
- Max depth: 8
- Learning rate: 0.05
- Gradient boosting: sequential residual fitting

---

## SLIDE 9: Model Performance

**Title:** Evaluation Metrics

| Metric | Value |
|--------|-------|
| Accuracy | 85.0% |
| CV accuracy | 84.3% ± 2.1% |
| Best class | Foggy (F1: 0.96) |
| Worst class | Windy (F1: 0.76) |
| 500-tree accuracy | 96.6% (but 114MB — too large) |

**Primary confusion:** Windy↔Sunny (12%), Stormy↔Rainy (8%). Rule overrides correct 60% of these.

---

## SLIDE 10: Rule Overrides

**Title:** Meteorological Rule Overrides

**Speaker Notes:**
"The ML model alone has blind spots — particularly in extreme or edge cases. We added 7 rule-based overrides that run after the ML output. For example: humidity ≥ 88% and wind speed ≥ 40 km/h overrides to Stormy. Humidity ≥ 88% and wind speed ≥ 5 km/h overrides to Rainy. These rules are human-readable, inspectable, and correct the ML model's most common failure modes."

**Override Rules (priority order):**
1. humidity ≥ 88 && wind ≥ 40 → Stormy (≥0.88)
2. humidity ≥ 88 && wind ≥ 5 → Rainy (≥0.82)
3. humidity ≥ 85 && wind ≥ 15 → Rainy (≥0.84)
4. humidity ≥ 92 && wind ≥ 3 → Rainy (≥0.80)
5. humidity ≥ 40 && wind ≤ 15 && minTemp ≤ 18 && maxTemp ≤ 26 → Foggy (≥0.78)
6. humidity ≥ 70 → Cloudy (≥0.80)
7. wind ≥ 30 → Windy (≥0.82)
8. maxTemp ≥ 26 && humidity ≤ 55 → Sunny (≥0.85)
9. Fallthrough: ML model output

---

## SLIDE 11: Python Backend on Render

**Title:** Python FastAPI ML Backend

**Speaker Notes:**
"Rather than porting XGBoost to TypeScript, we deploy a Python FastAPI backend on Render's free tier. The backend at `backend/main.py` loads the trained XGBoost model, engineers 15 features from 5 raw inputs, runs 600 trees, applies softmax normalization, and executes rule overrides — all in under 50ms on Render's 512 MB RAM. The free tier spins down after 15 minutes of idle; cold start takes 30-60 seconds. A background thread trains the model on startup so the server responds immediately while the model trains in parallel. A loading screen on the frontend masks this latency with a 3D animated cube sequence."

**Key Points:**
- FastAPI + XGBoost Python on Render free tier (512 MB RAM, 0.1 CPU)
- Background thread training prevents cold-start port scan timeout
- 15 features → 600 trees → softmax → overrides
- <50ms inference after warm-up
- Frontend loading screen masks cold start
- CORS + rate limiting via slowapi
- **TTL caching layer** — per-source caches (weather 2min, places 6hr, wiki 24hr, wikimedia 6hr, news 30min, LLM 2min) + district-level 2-min cache
- **Priority cache pre-warming** — background thread pre-caches all 31 districts on startup; if user hits a district being pre-warmed, system waits for it
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

---

## SLIDE 12: Technology Stack

**Title:** Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript 5 |
| UI | Framer Motion 12, Lenis 1.3, Lucide Icons |
| Backend | Python 3.11, FastAPI, XGBoost 2.0 |
| ML | XGBoost with SMOTE oversampling |
| Auth | Supabase (email + Google OAuth) |
| IoT | Wokwi ESP32 (DHT22 + BMP180 + Potentiometer + OLED) |
| Intelligence | Open-Meteo + Overpass + Wikimedia + Gemini/Groq LLM |
| Styling | Tailwind CSS v4 + inline styles |
| Animation | Canvas 2D (6 backgrounds), CSS 3D (loading screen), CometCard 3D tilt |
| Deployment | Vercel (frontend), Render (backend), GitHub |
| Security | CORS, rate limiting (slowapi), API key auth, security headers |

**Fonts:** Playfair Display (headings), Space Mono (labels), Montserrat (body), Courier New (loading cubes)

---

## SLIDE 13: User Flow

**Title:** User Journey

1. **Login** (`/`) — 6-split weather backgrounds, glassmorphic card with email/password or Google OAuth
2. **Map** (`/map`) — SVG map with 30 district polygons, hover tooltips, click to select
3. **Portal** (`/portal`) — Three CometCard tiles (Manual, IoT, Intelligence) with 3D tilt animation
4. **Manual** (`/predict?city=X`) — Orbital UI with 5 variable nodes → Loading screen → Result
5. **IoT** (`/iot?city=X`) — Live sensor dashboard with pause/resume/reset controls
6. **Intelligence** (`/intelligence`) — District/Place analysis with 7-day forecast, landmarks, LLM summary
7. **Result** (`/result?...`) — Full-screen Canvas 2D weather background, parallax zoom, content cards, travel, tips

---

## SLIDE 14: Orbital Predict UI

**Title:** Orbital Parameter Input

**Speaker Notes:**
"The predict page is the centerpiece of the UI. Five parameter nodes orbit a pulsing central orb. Click any node — the orbit rotates to bring it to the 12-o'clock position, and an expanded card slides in with a description and range slider. Adjusting the slider updates the energy ring (SVG dashoffset). Auto-rotation resumes when the card is dismissed. The background gradient dynamically tints based on slider values — warm orange for high temperature, cool blue for high humidity."

**Technical details:**
- `shortestAngleDelta()` for efficient orbital rotation
- `requestAnimationFrame` for smooth animation
- SVG energy rings: `strokeDasharray` / `strokeDashoffset`
- CSS `@keyframes` for `centerPulse`, `centerPing`, `nodePulse`

---

## SLIDE 15: Loading Screen

**Title:** 3D Loading Screen — Cold Start UX

**Speaker Notes:**
"Render's free tier spins down after 15 minutes of inactivity. The first prediction after idle triggers a cold start that can take 30-60 seconds. To keep users engaged, we built a 3D animated loading screen with a spinning cube in cyan, purple, and indigo, and seven letter cubes spelling L-O-A-D-I-N-G that glow and fade in a Z-axis wave. The entire animation is CSS 3D transforms and keyframes — no JavaScript animation libraries — keeping the bundle light. `animation-fill-mode: backwards` prevents initial flash on mount."

**Technical details:**
- `transform-style: preserve-3d` with perspective
- `keyframes zapFade` controls Z-axis translation + opacity
- `keyframes glowFade` syncs cyan box-shadow glow with the fade
- `animation-fill-mode: backwards` prevents initial render flash
- Single `<style>` tag keeps CSS colocated
- 7 letter cubes with staggered `animation-delay` for wave effect

---

## SLIDE 16: Result Page

**Title:** Cinematic Result Page

**Speaker Notes:**
"The result page shows the prediction in full-screen. A Canvas 2D weather background renders behind all content. A sticky hero section uses a `scroll` event listener with `{ passive: true }` to create a parallax zoom effect — scaling from 1 to 0.88 and fading out. A condition-specific SVG stickman sits in the corner. Content cards, travel destinations, and tips scroll in sequentially using `IntersectionObserver` with auto-disconnect after first fire. A profile button in the top-right opens a centered modal with avatar upload (canvas-resized to 150px JPEG), editable name, and logout."

---

## SLIDE 17: Authentication

**Title:** Supabase Auth

- Email/password signup and login
- Google OAuth with callback at `/auth/callback`
- Lazy-initialized `AuthManager` wrapper in `src/lib/auth.ts`
- Canvas-resized avatar uploads (150px max) cached to localStorage as fallback
- Auth guard: each protected page redirects to `/` if not logged in

---

## SLIDE 18: IoT Integration

**Title:** IoT Sensor Integration — Wokwi ESP32

**Speaker Notes:**
"Our IoT mode connects to a Wokwi ESP32 simulator — a free online tool that simulates ESP32 hardware with real sensor components. The simulator uses four components: a DHT22 sensor on GPIO4 for temperature and humidity, a BMP180 barometric sensor on I2C for pressure, a potentiometer on GPIO34 mapped to 0-50 km/h wind speed, and an OLED SSD1306 display showing live readings. Every 10 seconds, the ESP32 sends an HTTP POST request to our backend's `/iot/sensor-data` endpoint with API key authentication. The backend processes the sensor data, applies the XGBoost model, and returns a prediction. The IoT page on the frontend displays live readings with pause/resume/reset controls."

**Key Points:**
- Wokwi ESP32 simulator (online, no hardware required)
- DHT22 (GPIO4) + BMP180 (I2C) + Potentiometer (GPIO34) + OLED (I2C)
- WiFi built into ESP32 (Wokwi-GUEST network, simulated)
- HTTP POST every 10 seconds with X-Api-Key header
- Backend API key authentication via `_verify_api_key()`
- Live dashboard with sensor controls
- ±3°C temperature bounds from estimate

---

## SLIDE 19: Intelligence Mode

**Title:** AI-Powered Intelligence Analysis

**Speaker Notes:**
"The Intelligence mode goes beyond simple prediction. It queries multiple data sources to provide comprehensive weather analysis for any district or place in Karnataka. Open-Meteo provides 7-day forecast data. OpenStreetMap's Overpass API finds local infrastructure — hospitals, markets, transport. Wikimedia Commons retrieves landmark images. An LLM (Google Gemini with Groq fallback) generates a natural language summary of the weather conditions, local impacts, and travel recommendations. All responses are merged into a single intelligence object with forecast data, landmarks, places, and narrative text."

**Key Points:**
- Open-Meteo: 7-day forecast (temperature, humidity, wind, precipitation)
- Overpass API: local infrastructure (hospitals, markets, transport) — with static fallback for flaky API
- Wikimedia Commons: landmark images
- Gemini/Groq LLM: natural language weather summary (2-min cached)
- Provider fallback: Gemini first, Groq if Gemini fails
- asyncio.gather(return_exceptions=True) for timeout isolation
- **District-level caching:** Full response cached per district (2-min TTL), giving 60x speedup (2.39s → 0.04s)
- **Priority pre-warming:** Background thread pre-caches all 31 districts on server start
- Rate limited: 10 requests/minute

---

## SLIDE 20: CometCard 3D Tilt

**Title:** CometCard 3D Tilt Animation

**Speaker Notes:**
"The Portal page features three CometCard tiles — one for each prediction mode. Each card uses mouse-tracking 3D tilt animation powered by Framer Motion. When the user moves their mouse over a card, `useMotionValue` captures the cursor position relative to the card's center, and `useSpring` applies smooth spring-based rotation on both X and Y axes. A glare overlay with `mix-blend-overlay` creates a realistic light reflection effect. The cards also feature PortalGlow — a cursor-following color glow that responds to the card's accent color. All existing effects are preserved: text reveal on hover, icon lift, float CSS animation, and amber overlay."

**Key Points:**
- `useMotionValue` for mouse position tracking
- `useSpring` for smooth spring-based rotation
- rotateX/rotateY based on cursor offset from card center
- Glare overlay with `mix-blend-overlay`
- PortalGlow: cursor-following color glow
- Text reveal, icon lift, float CSS on hover
- Three cards: Manual (orange), IoT (green), Intelligence (blue)

---

## SLIDE 21: Deployment

**Title:** Deployment — Two-Tier Architecture

- **Frontend:** Vercel Hobby (free tier) — `karnataka-weather.vercel.app`
- **Backend:** Render Web Service (free tier) — `karnataka-weather-uxdg.onrender.com`
- **CD:** Git push → Vercel auto-deploys frontend; Render auto-deploys from GitHub
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IOT_API_KEY`
- **Cold start:** Render spins down after 15 min idle; 30-60s cold start; loading screen masks delay
- **API fallback:** Frontend has client-side rule overrides if backend returns error/503
- **IoT:** Wokwi ESP32 connects to Render backend via public URL
- **Security:** CORS_ORIGINS, IOT_API_KEY, rate limiting, security headers

---

## SLIDE 22: Performance

**Title:** Performance Metrics

| Metric | Value |
|--------|-------|
| Inference time (Render) | <50ms (after warm) |
| Canvas FPS | 60 FPS (all 6 conditions) |
| Cold start | 30-60s (masked by loading screen) |
| Intelligence endpoint (uncached) | 2.39s (6-source fetch + LLM) |
| Intelligence endpoint (cached) | 0.04s (district-level cache hit) |
| Cache speedup | 60x |
| First-load JS | 103KB shared |
| Build time | ~2 min |
| IoT data interval | 10 seconds |
| Intelligence sources | 4 (Open-Meteo, Overpass, Wikimedia, LLM) |

---

## SLIDE 23: Key Challenges & Fixes

**Title:** Challenges Overcome

| Problem | Fix |
|---------|-----|
| Render free tier port scan timeout | Background thread training; model assigned only after `clf.fit()` |
| Model `NotFittedError` race condition | Model variable set only after `clf.fit()` completes |
| 114MB model too large | Reduced to 100 trees + compact JSON |
| ML default prediction 93% Foggy | 7 rule overrides added |
| Lenis rAF memory leak | Added `running` flag to stop loop on unmount |
| StormyBackground canvas corruption | Wrapped lightning in `ctx.save()/restore()` |
| Loading screen blue box glitch | Changed `background` shorthand to `background-color` longhand |
| IoT 401 Unauthorized | Added X-Api-Key header to frontend fetch calls |
| Missing CORS for IoT | Added CORS_ORIGINS env var + slowapi rate limiting |
| 13 inconsistent district names | Standardized to official Karnataka names (Belagavi, Mysuru, etc.) |
| Dead client-side XGBoost (6.8MB) | Deleted xgboost.ts + xgboost_model.json |
| 13 dead files bloating bundle | Removed legacy Three.js, unused components, debug scripts |
| Missing security headers | Added X-Content-Type-Options, X-Frame-Options, etc. in next.config.mjs |
| Intelligence too slow for 100 users | TTL caching layer: 60x speedup (2.39s → 0.04s) with district-level 2-min cache |
| Overpass API flaky on shared IPs | Static place fallback with 10-20 hardcoded places per district |
| Portal pages laggy | Conditional LenisProvider skips smooth scroll on non-scrollable pages |
| WeatherPortal bundle slow load | Dynamic import via next/dynamic — HTML first, JS after |
| Auth layout shift | AuthPreloader component preloads Supabase client on mount |

---

## SLIDE 24: Future Work

**Title:** Future Enhancements

- ONNX Runtime Web for on-device inference (skip backend entirely)
- Prediction history with Supabase database
- Kannada language localization
- ~~Real-time sensor integration via weather stations~~ — **DONE** (Wokwi ESP32)
- Time-series forecasting (multi-day predictions)
- Mobile native app (React Native)
- Physical ESP32 hardware deployment (replace Wokwi simulator)
- Multiple IoT sensor nodes per district

---

## SLIDE 25: Conclusion

**Title:** Conclusion

"Karnataka Weather demonstrates that ML-powered weather prediction can be deployed without expensive infrastructure. A Python FastAPI backend on Render's free tier handles XGBoost inference, while a cinematic Next.js frontend on Vercel provides an immersive user experience. The system supports three prediction modes — Manual, IoT, and Intelligence — making it accessible to users with varying technical capabilities. The Wokwi ESP32 integration proves that real sensor hardware can feed live data into the ML pipeline. The intelligence endpoint uses a TTL caching layer with priority pre-warming to deliver 60x speedup on cache hits, enabling the system to handle 100 concurrent users within external API rate limits. The 3D loading screen elegantly handles the cold-start latency of free hosting. The CometCard 3D tilt animation provides an engaging mode selection experience. The code is open-source at `github.com/Charan-516/karnataka-weather`."

---

*Presentation last updated: 2026-07-22*
