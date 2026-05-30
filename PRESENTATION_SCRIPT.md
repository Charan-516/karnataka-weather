# Karnataka Weather — Complete Presentation Script

## AI-Powered Weather Prediction for 30 Districts of Karnataka

---

## SLIDE 1: Title Slide

**Title:** Karnataka Weather — AI-Powered Prediction Platform

**Speaker Notes:**
"Good morning/afternoon everyone. I'm presenting Karnataka Weather — a full-stack ML platform that predicts weather conditions for 30 districts of Karnataka using XGBoost deployed entirely inside a Next.js application. The system takes five atmospheric inputs — temperature range, humidity, pressure, and wind speed — and predicts one of six conditions: Sunny, Cloudy, Rainy, Stormy, Foggy, or Windy. We eliminated the traditional Python backend by porting the XGBoost inference engine to TypeScript, allowing a single serverless deployment on Vercel."

**Key Talking Points:**
- Geographic scope: 30 Karnataka districts
- Core technology: XGBoost + Next.js + TypeScript
- Zero Python in production
- Deployed on Vercel free tier

**Suggested Visuals:** Centered logo, subtitle, weather collage background

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

## SLIDE 4: Proposed System

**Title:** Proposed System — Overview

**Speaker Notes:**
"Our proposed system is a full-stack web application. The user selects a district on an interactive SVG map, then adjusts five parameters through an orbital UI — five nodes circling a central pulsing orb, each clickable to reveal an expanded card with a range slider. The system applies 15 engineered features, runs them through 100 XGBoost trees per class (600 total), applies 7 meteorological rule overrides, and returns the predicted condition with a confidence score. The entire inference engine runs in TypeScript inside a Next.js API route — no separate backend."

**Key Talking Points:**
- SVG district map with hover tooltips
- Orbital UI: 5 parameter nodes orbiting a central pulse
- 15 engineered features from 5 raw inputs
- 100 trees per class, 600 total
- 7 rule overrides correct ML blind spots
- Pure TypeScript inference — no Python in production

**Diagrams to Include:** Input → Feature Engineering → XGBoost Trees → Rule Overrides → Output flow

---

## SLIDE 5: Project Objectives

**Title:** Project Objectives

- Build an ML model achieving 85%+ accuracy from five atmospheric parameters
- Engineer 10 domain-specific meteorological features
- Implement inference in pure TypeScript — no Python runtime
- Design a cinematic UI with orbital parameter input and Canvas 2D weather backgrounds
- Deploy on zero-cost infrastructure (Vercel + Supabase free)
- Serve all 30 Karnataka districts with unique travel content

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

## SLIDE 11: TypeScript Inference Engine

**Title:** Porting XGBoost to TypeScript

**Speaker Notes:**
"The model is exported from Python using `get_dump(dump_format='json')` — a 6.8 MB JSON file containing 100 tree structures. Our TypeScript engine at `src/lib/xgboost.ts` loads this JSON, walks each tree recursively via `predictTree()`, aggregates class scores, applies `softmax()` normalization, and runs rule overrides. All in under 50 milliseconds."

**Key Points:**
- 6.8MB JSON model file
- Recursive tree walker (max depth 8)
- 15 features → 600 trees → softmax → overrides
- <50ms inference in Next.js API route

---

## SLIDE 12: Technology Stack

**Title:** Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript 5 |
| UI | Framer Motion 12, Lenis 1.3, Lucide Icons |
| ML | XGBoost → TypeScript port |
| Auth | Supabase (email + Google OAuth) |
| Styling | Tailwind CSS v4 + inline styles |
| Animation | Canvas 2D (6 weather backgrounds) |
| Deployment | Vercel (Hobby), GitHub |

**Fonts:** Playfair Display (headings), Space Mono (labels), Montserrat (body)

---

## SLIDE 13: User Flow

**Title:** User Journey

1. **Login** (`/`) — 6-split weather backgrounds, glassmorphic card with email/password or Google OAuth
2. **Map** (`/map`) — SVG map with 30 district polygons, hover tooltips, click to select
3. **Predict** (`/predict?city=X`) — Orbital UI with 5 variable nodes, click-to-expand cards with sliders, 6 preset buttons
4. **Result** (`/result?city=X&condition=Y&...`) — Full-screen Canvas 2D weather background, parallax zoom hero, condition stickman, content cards, travel destinations, tips, profile modal

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

## SLIDE 15: Canvas 2D Weather Backgrounds

**Title:** Real-time Weather Visualization

**Speaker Notes:**
"Six Canvas 2D backgrounds — one per condition — each rendering at 60 FPS via `requestAnimationFrame`. Sunny: radial gradient with 60 floating particles. Cloudy: 3-layer drifting ellipses. Rainy: 200 raindrops with ground ripples. Stormy: 200 vortex particles with lightning flashes using `ctx.save()`/`ctx.restore()`. Foggy: 12 fog patches with radial gradients. Windy: 120 wind streaks with tumbling leaves."

**Key techniques:**
- `CanvasRenderingContext2D` for all rendering
- `ctx.createRadialGradient()` for atmospheric glow
- `Date.now()`-based alpha pulsation
- Components loaded via `next/dynamic` with `{ ssr: false }`

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

## SLIDE 18: Deployment & Build

**Title:** Deployment

- **Host:** Vercel Hobby (free tier)
- **CD:** Git push → auto-deploy
- **Build:** `npm run build` → 6.8MB model bundled with serverless function
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Status:** Live at `https://karnataka-weather.vercel.app`

---

## SLIDE 19: Performance

**Title:** Performance Metrics

| Metric | Value |
|--------|-------|
| Inference time | <50ms |
| Canvas FPS | 60 FPS (all 6 conditions) |
| Model size | 6.8MB |
| First-load JS | 103KB shared |
| Build time | ~2 min |

---

## SLIDE 20: Key Challenges & Fixes

**Title:** Challenges Overcome

| Problem | Fix |
|---------|-----|
| Feature index parsed as single digit | `parseInt(slice(1))` → `parseInt(slice(1))` |
| 114MB model too large | Reduced to 100 trees + compact JSON = 6.8MB |
| ML default prediction 93% Foggy for clear warm conditions | 7 rule overrides added |
| Lenis rAF memory leak | Added `running` flag to stop loop on unmount |
| StormyBackground canvas corruption | Wrapped lightning in `ctx.save()/restore()` |
| Login page broken after CSS cleanup | Restored all login-related CSS classes |

---

## SLIDE 21: Future Work

**Title:** Future Enhancements

- ONNX Runtime Web for 500-tree model (96% accuracy)
- Prediction history with Supabase database
- Kannada language localization
- Real-time sensor integration via weather stations
- Time-series forecasting (multi-day predictions)
- Mobile native app (React Native)

---

## SLIDE 22: Conclusion

**Title:** Conclusion

"Karnataka Weather demonstrates that ML-powered weather prediction can be deployed without expensive infrastructure. By porting XGBoost to TypeScript, we eliminated the Python backend entirely — the entire application runs on a single Vercel serverless function. The orbital UI provides an intuitive, interactive way to explore atmospheric parameters, and the Canvas 2D backgrounds create an immersive experience. The code is open-source and available at `github.com/Charan-516/karnataka-weather`."

---

*Presentation last updated: 2026-05-31*
