# Karnataka Weather Prediction — Full Project Context

> **Purpose of this document:** This file is a self-contained, AI/LLM-friendly reference that describes the entire Karnataka Weather application — its architecture, tech stack, folder structure, every source file's purpose and contents, color palette, user workflow, API contracts, data schemas, and known issues. Any AI agent reading this file alone should be able to understand, modify, debug, or extend the project without additional user input.

---

## 1. Project Overview

**Karnataka Weather** is a cinematic, premium weather prediction web application for the 30 districts of Karnataka, India. It combines:

- A **Next.js 15 (App Router)** frontend with glassmorphic UI, Framer Motion animations, and a React Three Fiber atmospheric background.
- A **FastAPI + XGBoost** Python backend that trains a machine-learning weather classifier on startup and serves predictions via a REST API.

**Core user flow:** Login → Select district on SVG map → Adjust weather sliders → Get ML-powered prediction → View result.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | Next.js (App Router) | 15.x (`^9.3.3` in package.json, actual installed is 15+) |
| UI library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| 3D engine | Three.js + React Three Fiber + Drei | three ^0.184.0, r3f ^9.6.1, drei ^10.7.7 |
| Animation | Framer Motion | (peer dep) |
| CSS | Vanilla CSS + Tailwind (postcss plugin configured but minimal use) | Tailwind ^4 |
| Backend framework | FastAPI | latest |
| ML model | XGBoost | latest |
| Data processing | pandas, numpy, scikit-learn, imbalanced-learn (SMOTE) | latest |
| Backend server | Uvicorn | latest |
| Package manager | npm | — |
| OS target | Windows | — |

---

## 3. Folder Structure

```
latest karnataka-weather/
├── updated.md                          # Older update log
└── karnataka-weather/                  # ← MAIN PROJECT ROOT (run all commands here)
    ├── .gitignore
    ├── .vscode/
    │   └── settings.json               # Python interpreter → backend/venv
    ├── package.json                    # npm deps & scripts
    ├── package-lock.json
    ├── tsconfig.json                   # TS config (ES2017, bundler resolution)
    ├── next.config.ts                  # Next.js config (empty/default)
    ├── postcss.config.mjs              # PostCSS with @tailwindcss/postcss
    ├── eslint.config.mjs               # ESLint with next core-web-vitals + TS
    ├── next-env.d.ts
    ├── node_modules/                   # (gitignored)
    ├── .next/                          # (gitignored, build output)
    ├── public/                         # Static assets
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── backend/                        # Python ML backend
    │   ├── main.py                     # FastAPI server + XGBoost training
    │   ├── check_data.py               # Quick CSV inspection utility
    │   ├── karnataka_weather_500.csv   # Training dataset (~1.8 MB, ~500 rows)
    │   └── venv/                       # Python virtual environment
    └── src/
        ├── app/                        # Next.js App Router pages
        │   ├── globals.css             # Global design system (all styles)
        │   ├── layout.tsx              # Root layout (<html>, metadata)
        │   ├── favicon.ico
        │   ├── page.tsx                # "/" — Login/Signup page
        │   ├── map/
        │   │   └── page.tsx            # "/map" — SVG district selector
        │   ├── predict/
        │   │   └── page.tsx            # "/predict?city=X" — Slider input page
        │   └── result/
        │       └── page.tsx            # "/result?city=X&condition=Y&..." — Result display
        ├── lib/                        # Shared data & utilities
        │   ├── auth.ts                 # localStorage auth manager
        │   ├── cities.ts               # 21 city coordinates + regions
        │   ├── karnatakaBorder.ts      # Simplified border polygon (for 3D)
        │   └── karnatakaDistricts.ts   # Full GeoJSON-like polygon data for 30 districts
        └── systems/                    # Modular visual systems
            ├── atmosphere/
            │   ├── AtmosphereEngine.tsx # R3F Canvas wrapper (particles + fog)
            │   ├── ParticleField.tsx    # Floating particles (Points geometry)
            │   └── FogLayer.tsx         # Drifting translucent fog planes
            ├── sliders/
            │   └── EnvironmentalSlider.tsx # Reusable styled range slider
            └── terrain/
                ├── KarnatakaTerrain.tsx # 3D extruded map shape (not used in current flow)
                └── DistrictNodes.tsx    # 3D interactive city dots (not used in current flow)
```

---

## 4. User Workflow (Page-by-Page)

### Page 1: Login (`/` → `src/app/page.tsx`)
- **AtmosphereEngine** renders behind the card (particles + fog in WebGL).
- Glassmorphic card with Login/Signup toggle.
- Auth via `localStorage` (`AuthManager` in `src/lib/auth.ts`).
- On success: animated exit → redirect to `/map`.
- If already logged in: auto-redirect to `/map`.

### Page 2: District Map (`/map` → `src/app/map/page.tsx`)
- Full-viewport warm radial gradient background.
- SVG map rendering all 30 districts from `karnatakaDistricts.ts`.
- Hover: tooltip follows cursor showing district name + "Click to select".
- Click: selects district (highlighted fill + border).
- Bottom bar shows selected district name + "Continue →" pill button.
- On continue: navigates to `/predict?city={districtName}`.
- Auth guard: redirects to `/` if not logged in.

### Page 3: Predict (`/predict?city=X` → `src/app/predict/page.tsx`)
- Wrapped in `<Suspense>` for `useSearchParams()`.
- Reads `city` from URL query params.
- 5 environmental sliders: Humidity, Pressure, Wind Speed, Min Temp, Max Temp.
- Background gradient tints dynamically based on slider values.
- Floating decorative orbs with drift animation.
- On submit: `POST http://localhost:8000/predict` with JSON body.
- **Fallback logic**: if backend is unreachable, client-side rule-based prediction runs.
- Navigates to `/result?city=X&condition=Y&confidence=Z&...`.
- "← Change district" link goes back to `/map`.

### Page 4: Result (`/result?...` → `src/app/result/page.tsx`)
- Reads all params from URL: city, condition, confidence.
- Displays: city name (eyebrow), condition (giant serif text), confidence %.
- Two buttons: "← Adjust" (back to predict) and "New City" (back to map).

---

## 5. Design System & Color Palette

### CSS Custom Properties (defined in `globals.css :root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#f5f0e8` | Page background, canvas clear color |
| `--color-surface` | `#eee6d6` | Card surfaces |
| `--color-primary` | `#e8b89a` | Primary peach accent |
| `--color-secondary` | `#c49a7a` | Secondary warm tone |
| `--color-accent` | `#8b4513` | Buttons, CTA (SaddleBrown) |
| `--color-accent-light` | `#c4622d` | Lighter accent variant |
| `--color-text-primary` | `#1a1208` | Headings, body text |
| `--color-text-secondary` | `#3d2b1a` | Secondary text |
| `--color-text-muted` | `#7a6a5a` | Labels, hints, metadata |
| `--color-particle` | `#f0c8a0` | 3D particle color |
| `--color-fog` | `#e8d5b8` | 3D fog layer color |

### Inline Colors Used Across Pages

| Color | Hex | Where Used |
|-------|-----|-----------|
| Background gradient start | `#fde8d8` | Map, predict, result pages |
| Background gradient mid | `#f5cdb0`, `#f0b890` | Radial gradients |
| Background gradient end | `#d4845a` | Gradient terminus |
| Card glass bg | `rgba(255, 245, 238, 0.55)` | Map card, predict card |
| Card border | `rgba(232, 173, 140, 0.3)` | Glass card borders |
| Tooltip bg | `rgba(255, 245, 235, 0.92)` | Hover tooltips |
| Eyebrow text / muted | `#b87a52` | Labels, metadata text |
| Heading dark | `#3d1f0a` | District names, titles |
| Selected fill | `rgba(212, 132, 90, 0.55)` | Selected district on map |
| Hover fill | `rgba(212, 132, 90, 0.35)` | Hovered district on map |
| Default fill | `rgba(232, 173, 140, 0.18)` | Default district fill |
| Proceed button | `#d4845a` | Continue pill button |
| High-humidity tint | `#dde8f0`→`#8aaabb` | Cool blue gradient (predict) |
| Low-temp tint | `#e8eef5`→`#a0b8cc` | Cold blue gradient (predict) |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| **Playfair Display** (serif) | 300, 400 | Headings, large display text, district names |
| **Space Mono** (monospace) | 400, 700 | Labels, eyebrows, metadata, buttons |
| **Montserrat** (sans-serif) | 300, 400, 500, 700 | Body text, inputs, detail paragraphs |

Loaded via Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Space+Mono:wght@400;700&family=Playfair+Display:wght@300;400&display=swap')`

### Design Radii & Shadows

| Token | Value |
|-------|-------|
| `--radius-card` | `19.2px` (login card), `28px` (map/predict cards inline) |
| `--radius-btn` | `8px` |
| `--radius-tag` | `99px` (pill buttons) |
| `--shadow-card` | `0 8px 48px rgba(139,69,19,0.12), inset 0 1px 0 rgba(255,255,255,0.6)` |
| `--shadow-btn` | `0 4px 24px rgba(139,69,19,0.25)` |

### Animation System

| Animation | Duration | Easing | Purpose |
|-----------|----------|--------|---------|
| `cinematicFloat` | 8s infinite | ease-in-out | Gentle floating for cards |
| `breathe` | 3s infinite | ease-in-out | Pulsing opacity for hints |
| `tooltipFadeIn` | 0.3s | cubic-bezier(0.16,1,0.3,1) | Tooltip entrance |
| `pulse` | 2s infinite | ease-in-out | Selected district dot pulse |
| `orbDrift` | 14s/18s alternate | ease-in-out | Floating orbs on predict page |
| `rise-in` | 0.9s | cubic-bezier(0.16,1,0.3,1) | Scroll-reveal entrance |
| Framer Motion page transitions | 0.9s | `[0.16, 1, 0.3, 1]` | Card enter/exit with blur |

---

## 6. API Contract

### Endpoint: `POST http://localhost:8000/predict`

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

**Response:**
```json
{
  "condition": "Sunny",
  "confidence": 0.87
}
```

**Possible `condition` values:** `"Sunny"`, `"Cloudy"`, `"Rainy"`, `"Stormy"`, `"Foggy"`, `"Windy"` (6 classes)

**Slider ranges (frontend):**

| Parameter | Min | Max | Step | Default | Unit |
|-----------|-----|-----|------|---------|------|
| Humidity | 20 | 100 | 1 | 60 | % |
| Pressure | 980 | 1025 | 0.5 | 1010 | hPa |
| Wind Speed | 0 | 50 | 0.5 | 12 | km/h |
| Min Temp | 5 | 25 | 0.5 | 18 | °C |
| Max Temp | 20 | 45 | 0.5 | 30 | °C |

---

## 7. Backend ML Pipeline (`backend/main.py`)

### Startup Flow
1. Reads `karnataka_weather_500.csv` (columns: `MinTemp`, `MaxTemp`, `Humidity`, `Pressure`, `WindSpeed`, `Condition`).
2. Engineers 10 derived features: `TempRange`, `TempMean`, `HumidityWind`, `PressureAnomaly`, `StormIndex`, `HeatDryIndex`, `FogIndex`, `HumidityHigh`, `HumidityLow`, `WindPower`.
3. Applies SMOTE to balance the 6 classes (original data is ~57.6% Sunny).
4. Trains XGBoost classifier (500 estimators, max_depth=8, lr=0.05).
5. Prints classification report + 5-fold CV accuracy + top feature importances.

### Prediction Flow
1. Receives 5 raw features via POST.
2. Engineers same 10 derived features.
3. XGBoost predicts class probabilities → picks highest.
4. `apply_rule_overrides()` applies meteorological heuristics for edge cases.
5. Returns final condition + confidence.

### Rule Overrides (in priority order)
| Rule | Condition Output | Confidence Floor |
|------|-----------------|------------------|
| humidity ≥ 88 AND wind ≥ 50 | Stormy | 0.85 |
| humidity ≥ 85 AND wind ≥ 30 | Rainy | 0.82 |
| humidity ≥ 92 AND wind ≥ 15 | Rainy | 0.80 |
| humidity ≥ 70 AND 18 ≤ wind < 50 | Cloudy | 0.78 |
| humidity ≥ 75 AND wind < 18 | Cloudy | 0.72 |
| minTemp ≤ 16 AND maxTemp ≤ 25 AND humidity ≥ 35 AND wind ≤ 20 | Foggy | 0.75 |
| maxTemp ≥ 33 AND humidity ≤ 55 | Windy | 0.76 |

### Model Performance
- Overall accuracy: ~83%
- Weighted precision: ~92%
- Weighted recall: ~83%
- Weighted F1: ~87%

---

## 8. Authentication System (`src/lib/auth.ts`)

- **Storage:** `localStorage` (client-side only, no server auth).
- **Keys:** `kw_users` (array of all users), `kw_current_user` (logged-in user or null).
- **User interface:** `{ id: number, name: string, email: string, password: string }`
- **Methods:** `signup(name, email, password)`, `login(email, password)`, `logout()`, `current()`.
- **Guard pattern:** Each protected page checks `AuthManager.current()` in a `useEffect` and redirects to `/` if null.

---

## 9. Geodata System (`src/lib/karnatakaDistricts.ts`)

### Interface
```typescript
interface DistrictData {
  district: string       // District name
  polys: number[][][][]  // GeoJSON-style MultiPolygon coordinates [lng, lat]
  cx: number             // Centroid longitude
  cy: number             // Centroid latitude
}
```

### Districts (30 total)
Chikmagalur, Dakshina Kannada, Davanagere, Gadag, Gulbarga, Mandya, Shimoga, Tumkur, Udupi, Uttara Kannada, Bijapur, Mysore, Bagalkot, Bidar, Chamrajnagar, Hassan, Haveri, Kodagu, Koppal, Bangalore Rural, Bangalore, Belgaum, Bellary, Chikkaballapura, Chitradurga, Dharwad, Kolar, Raichur, Ramanagara, Yadgir.

### SVG Projection (in `map/page.tsx`)
```
LNG_MIN = 74.051, LNG_MAX = 78.588
LAT_MIN = 11.582, LAT_MAX = 18.477
ViewBox = "0 0 500 560", Padding = 20
lngToX(lng) = PADDING + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (VW - PADDING*2)
latToY(lat) = PADDING + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (VH - PADDING*2)
```

---

## 10. 3D Atmosphere System (used on Login page)

### AtmosphereEngine (`systems/atmosphere/AtmosphereEngine.tsx`)
- R3F `<Canvas>` with fixed positioning, z-index 0 (behind UI).
- Camera at `[0, 0, 10]`, FOV 60.
- Background clear color: `#f5f0e8`.
- Fog: `#f5f0e8`, near=20, far=60.
- Ambient light: intensity 0.8, color `#f0d0a0`.
- Renders `<ParticleField>` (120 particles) + `<FogLayer>`.

### ParticleField (`systems/atmosphere/ParticleField.tsx`)
- `THREE.Points` with `BufferGeometry`.
- Particles spread in 40×40 area, z from -5 to -15.
- Drift upward at 0.003 * speedMultiplier per frame, wrap at y=±22.
- Material: `AdditiveBlending`, size 0.06, opacity 0.35.

### FogLayer (`systems/atmosphere/FogLayer.tsx`)
- Two translucent `PlaneGeometry` meshes.
- Slow sinusoidal drift on x/y axes.
- Colors: `#e8d5b8` (opacity 0.15) and `#dfc8a8` (opacity 0.10).

---

## 11. 3D Terrain System (legacy, not in active user flow)

### KarnatakaTerrain (`systems/terrain/KarnatakaTerrain.tsx`)
- Extruded `THREE.Shape` from `karnatakaBorder.ts` coordinates.
- Depth 0.2, bevel enabled, sandy colors (`#c4956a`, `#deb887`, `#e8b89a`).
- Gentle floating animation.

### DistrictNodes (`systems/terrain/DistrictNodes.tsx`)
- Renders 21 city markers from `cities.ts` as interactive dots.
- Core dot + glow ring with pulsing animation.
- Hover/click handlers with cursor change.
- Uses `toScene()` projection: `x = (lng - 76.3) * 1.8`, `y = (lat - 14.9) * 1.8`.

---

## 12. How to Run

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ with pip

### Frontend (Next.js)
```powershell
cd karnataka-weather
npm install          # first time only
npm run dev          # starts on http://localhost:3000
```

### Backend (FastAPI + XGBoost)
```powershell
cd karnataka-weather/backend
.\venv\Scripts\activate
pip install fastapi uvicorn pandas numpy xgboost scikit-learn imbalanced-learn   # first time
python main.py       # trains model on startup, serves on http://localhost:8000
```

> **Note:** The frontend works without the backend — it falls back to client-side rule-based predictions if the API is unreachable.

---

## 13. Key npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server with HMR |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `eslint` | Run ESLint |

---

## 14. Configuration Files Summary

### `tsconfig.json`
- Target: ES2017, Module: esnext, JSX: react-jsx
- Path alias: `@/*` → `./src/*`
- Strict mode enabled

### `postcss.config.mjs`
- Plugin: `@tailwindcss/postcss` (Tailwind v4)

### `.vscode/settings.json`
- Python interpreter locked to `backend/venv/Scripts/python.exe`

### `next.config.ts`
- Empty/default configuration

---

## 15. Dataset Schema (`karnataka_weather_500.csv`)

| Column | Type | Range | Description |
|--------|------|-------|-------------|
| MinTemp | float | ~5–25 | Minimum temperature (°C) |
| MaxTemp | float | ~20–45 | Maximum temperature (°C) |
| Humidity | float | ~20–100 | Relative humidity (%) |
| Pressure | float | ~980–1025 | Atmospheric pressure (hPa) |
| WindSpeed | float | ~0–75 | Wind speed (km/h) |
| Condition | string | 6 classes | Target label |

**Class distribution (original, imbalanced):** ~57.6% Sunny, rest split among Cloudy, Rainy, Stormy, Foggy, Windy.

---

## 16. Client-Side Fallback Prediction Logic

When the backend is unreachable, `predict/page.tsx` uses this cascade:

```
if humidity ≥ 88 AND windSpeed ≥ 50 → Stormy (85%)
else if humidity ≥ 85 AND windSpeed ≥ 30 → Rainy (82%)
else if humidity ≥ 92 → Rainy (80%)
else if humidity ≥ 70 → Cloudy (78%)
else if minTemp ≤ 16 AND maxTemp ≤ 25 AND humidity ≥ 35 → Foggy (75%)
else if maxTemp ≥ 33 AND humidity ≤ 55 → Windy (76%)
else → Sunny (70%)
```

---

## 17. Component Dependency Graph

```
page.tsx (/)
├── AtmosphereEngine (3D background)
│   ├── ParticleField
│   └── FogLayer
└── AuthManager (lib/auth.ts)

map/page.tsx (/map)
├── AuthManager
└── GEO_DATA (lib/karnatakaDistricts.ts)

predict/page.tsx (/predict)
├── AuthManager
├── EnvironmentalSlider (systems/sliders/)
└── fetch → localhost:8000/predict

result/page.tsx (/result)
└── (reads URL search params only)
```

---

## 18. Known Issues & Notes

1. **`framer-motion` not in package.json** — It's used in multiple pages (`motion.div`, `AnimatePresence`) but not listed as a dependency. It may be installed as a transient dep or needs `npm install framer-motion`.
2. **3D terrain/nodes are legacy** — `KarnatakaTerrain.tsx` and `DistrictNodes.tsx` are not imported by any active page. The current map uses pure SVG rendering.
3. **Auth is client-only** — No server-side session validation. Passwords stored in plain text in localStorage.
4. **CORS is wide open** — Backend allows all origins (`*`).
5. **Backend deprecation warning** — `@app.on_event("startup")` is deprecated in newer FastAPI; should migrate to lifespan context manager.
6. **Result page lacks auth guard** — Unlike other pages, `result/page.tsx` doesn't check `AuthManager.current()`.
7. **Predict page "← Adjust" goes to `/predict` without query params** — Loses the city context when navigating back from results.

---

## 19. Engineered Feature Formulas (Backend)

| Feature | Formula |
|---------|---------|
| TempRange | MaxTemp − MinTemp |
| TempMean | (MaxTemp + MinTemp) / 2 |
| HumidityWind | Humidity × WindSpeed / 100 |
| PressureAnomaly | 1013.25 − Pressure |
| StormIndex | (Humidity/100) × (WindSpeed/75) × (clip(PressureAnomaly,0,∞)/25 + 0.3) |
| HeatDryIndex | (MaxTemp/45) × (1 − Humidity/100) |
| FogIndex | clip(1−(MinTemp−10)/18, 0,1) × (Humidity/100) × clip(1−WindSpeed/75, 0,1) |
| HumidityHigh | (clip(Humidity−70, 0,∞) / 30)² |
| HumidityLow | (clip(50−Humidity, 0,∞) / 50)² |
| WindPower | (WindSpeed / 75)^1.5 |

---

## 20. XGBoost Hyperparameters

```python
n_estimators=500, max_depth=8, learning_rate=0.05,
subsample=0.85, colsample_bytree=0.85, min_child_weight=3,
gamma=0.1, reg_alpha=0.1, reg_lambda=1.0,
objective="multi:softprob", eval_metric="mlogloss"
```

---

## 21. File Contents Quick Reference

### Frontend Source Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/app/layout.tsx` | 19 | Root layout, metadata title="Karnataka Weather" |
| `src/app/page.tsx` | 163 | Login/signup with AtmosphereEngine background |
| `src/app/globals.css` | 512 | Complete design system (all component styles) |
| `src/app/map/page.tsx` | 304 | SVG interactive district map |
| `src/app/predict/page.tsx` | 313 | Weather parameter sliders + API call |
| `src/app/result/page.tsx` | 113 | Prediction result display |
| `src/lib/auth.ts` | 61 | localStorage auth (signup/login/logout/current) |
| `src/lib/cities.ts` | 37 | 21 city coordinates with regions |
| `src/lib/karnatakaBorder.ts` | 22 | Simplified border for 3D extrusion |
| `src/lib/karnatakaDistricts.ts` | 39 | Full polygon data for 30 districts (~82 KB) |
| `src/systems/atmosphere/AtmosphereEngine.tsx` | 37 | R3F Canvas with particles + fog |
| `src/systems/atmosphere/ParticleField.tsx` | 60 | Floating particle system |
| `src/systems/atmosphere/FogLayer.tsx` | 56 | Drifting translucent planes |
| `src/systems/sliders/EnvironmentalSlider.tsx` | 55 | Reusable styled range input |
| `src/systems/terrain/KarnatakaTerrain.tsx` | 76 | 3D extruded terrain (legacy) |
| `src/systems/terrain/DistrictNodes.tsx` | 125 | 3D city markers (legacy) |

### Backend Files

| File | Lines | Purpose |
|------|-------|---------|
| `backend/main.py` | 262 | FastAPI server, feature engineering, XGBoost, prediction |
| `backend/check_data.py` | 12 | Utility to inspect CSV statistics |
| `backend/karnataka_weather_500.csv` | ~500 | Training data (6 columns) |

---

*Document generated: 2026-05-29. This file should be kept updated when making changes to the project.*
