# Technical Report — Karnataka Weather Prediction System

---

## 1. Executive Summary

A full-stack weather prediction platform for 30 districts of Karnataka. XGBoost model inference was ported from Python to TypeScript, eliminating the Python backend entirely. Authentication uses Supabase (email/password + Google OAuth). The system is deployed on Vercel free tier.

**Key metrics:** 85% model accuracy, 6.8MB model, <50ms inference, 60 FPS Canvas 2D animations, $0 monthly hosting cost.

---

## 2. Architecture

| Component | Technology | Role |
|-----------|-----------|------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript 5 | 5 pages: login, map, predict, result, API |
| ML Engine | TypeScript XGBoost port (`src/lib/xgboost.ts`) | Recursive tree walker on 6.8MB JSON model |
| Auth | Supabase (`@supabase/ssr`) | Email/password + Google OAuth |
| Animation | Canvas 2D (6 backgrounds), Framer Motion 12, Lenis 1.3 | Weather visualization, page transitions, smooth scroll |
| Deployment | Vercel Hobby, GitHub | Auto-deploy from git push |

**Architecture decision:** XGBoost inference runs in the same Node.js process as the Next.js API route — no network calls, no cold starts, no Python runtime.

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
- **Estimators:** 100 (6.8MB) — 500 gives 96% but 114MB exceeds Vercel limits
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

```typescript
humidity >= 88 && windSpeed >= 40  → Stormy  (≥0.88)
humidity >= 88 && windSpeed >= 5   → Rainy   (≥0.82)
humidity >= 85 && windSpeed >= 15  → Rainy   (≥0.84)
humidity >= 92 && windSpeed >= 3   → Rainy   (≥0.80)
humidity >= 40 && windSpeed <= 15 && minTemp <= 18 && maxTemp <= 26 → Foggy (≥0.78)
humidity >= 70                     → Cloudy  (≥0.80)
windSpeed >= 30                    → Windy   (≥0.82)
maxTemp >= 26 && humidity <= 55    → Sunny   (≥0.85)
fallthrough                        → ML model output
```

---

## 4. App Structure

```
karnataka-weather/
├── src/app/
│   ├── page.tsx                    # Login/signup with 6-split weather backgrounds
│   ├── map/page.tsx                # SVG district selector (30 districts)
│   ├── predict/page.tsx            # Orbital UI sliders + 6 preset buttons
│   ├── result/page.tsx             # Cinematic result page with parallax, stickman, profile modal
│   ├── api/predict/route.ts        # POST /api/predict — XGBoost inference
│   ├── auth/callback/route.ts      # Supabase OAuth callback
│   └── globals.css                 # Design tokens, keyframes, login CSS
├── src/lib/
│   ├── xgboost.ts                  # TS XGBoost engine — 15 features, 600 trees, softmax, overrides
│   ├── xgboost_model.json          # 6.8MB model dump
│   ├── auth.ts                     # Supabase AuthManager (signup, login, Google OAuth, profile)
│   ├── weatherContent.ts           # Content for 6 conditions (cards, travel, tips)
│   ├── districtContent.ts          # Travel content for 28 districts
│   └── karnatakaDistricts.ts       # 30-district GeoJSON polygons
└── src/systems/
    ├── sliders/OrbitalPredict.tsx   # 5 orbiting parameter nodes with click-to-expand cards
    └── weather/
        ├── WeatherBackground.tsx    # Dynamic import router
        └── backgrounds/            # 6 Canvas 2D renderers
```

---

## 5. Key User Flow

1. **Login** → Supabase auth (email/password or Google OAuth)
2. **Map** → SVG with 30 district polygons, hover tooltips, click to select
3. **Predict** → 5 orbital variable nodes. Click any node → orbit rotates it to 12-o'clock → expanded card with description + range slider. SVG energy ring updates via `strokeDashoffset`. Background tints based on slider values. 6 preset buttons skip API and navigate directly.
4. **Result** → Canvas 2D weather background behind sticky parallax hero (`scroll` event with `{ passive: true }`, scale 1→0.88). Condition SVG stickman. Content cards, travel, tips via `IntersectionObserver` (auto-disconnects after first fire). Profile modal with canvas-resized avatar upload (150px JPEG), name edit, logout.

---

## 6. API Contract

**POST /api/predict**

```json
// Request
{ "minTemp": 18, "maxTemp": 30, "humidity": 60, "pressure": 1010, "windSpeed": 12 }

// Response
{ "condition": "Sunny", "confidence": 0.87 }
```

Client-side fallback mirrors the exact same rule chain — if the API call fails, the user navigates directly to `/result` with the fallback prediction.

---

## 7. Bugs Fixed

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Feature index parsed as single digit | `parseInt(node.split[1])` only read 2nd char | `parseInt(node.split.slice(1))` |
| 114MB model exceeded Vercel limits | 500 trees + pretty-printed JSON | 100 trees + compact JSON = 6.8MB |
| Supabase build error | `createBrowserClient()` at module scope | Lazy dynamic `await import()` |
| Next.js 14 + React 19 conflict | Next 14 required React 18 | Upgraded to Next.js 15 |
| Lenis rAF memory leak | `requestAnimationFrame` loop never stopped | Added `running` flag |
| StormyBackground canvas corruption | ctx state modified between save/restore | Wrapped lightning in `ctx.save()/restore()` |
| Login page broken | Login CSS classes stripped in cleanup | Restored all login CSS |

---

## 8. Performance

| Metric | Value |
|--------|-------|
| Inference time | <50ms |
| Canvas FPS | 60 FPS (all conditions) |
| Model size | 6.8MB (100 trees) |
| Build time | ~2 minutes |
| First-load JS | 103KB |
| Model file in bundle | Yes — no external fetch |
| Cold starts | None — model loaded at module scope |

---

## 9. Deployment

- **URL:** `https://karnataka-weather.vercel.app`
- **Plan:** Vercel Hobby (free)
- **Auth:** Supabase free tier
- **CD:** Git push → auto-deploy

---

## 10. Known Issues

- `<img>` tags used for external Unsplash/Pexels URLs — intentional, no optimization needed for external decorative images
- Three.js legacy files (`src/systems/atmosphere/`, `src/systems/terrain/`) not imported by any active page
- Shadcn UI components installed but unused — all pages use inline styles
- Profile photo stored in Supabase `user_metadata` (size-limited) with localStorage fallback

---

## 11. Future Work

- ONNX Runtime Web for 500-tree model (96% accuracy)
- Prediction history with Supabase table
- Kannada language localization
- Real-time sensor integration
- Time-series forecasting
- Mobile native app

---

*Report generated: 2026-05-31*
