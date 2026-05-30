# Karnataka Weather Prediction — Full Project Context

> **Purpose:** Self-contained reference describing the entire Karnataka Weather application — architecture, tech stack, folder structure, every source file's purpose, color palette, user workflow, API contracts, data schemas, and known issues.

---

## 1. Project Overview

**Karnataka Weather** is a cinematic weather prediction platform for the 30 districts of Karnataka, India. It combines:

- A **Next.js 15 (App Router)** frontend with glassmorphic UI, Framer Motion animations, custom Canvas 2D weather backgrounds (Sunny, Cloudy, Rainy, Stormy, Foggy, Windy).
- An **XGBoost ML model ported to TypeScript** — inference runs entirely inside Next.js API routes via a recursive tree walker on a 6.8MB JSON model, eliminating any Python backend.
- **Supabase** for authentication (email/password + Google OAuth).

**Core user flow:** Login → Select district on SVG map → Adjust 5 orbital weather sliders → Get ML-powered prediction → View cinematic result page with parallax zoom, condition-stickman, travel cards, and scroll-reveal content.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 15.5.18 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| ML model | XGBoost (JSON dump, TS inference) | 100 trees × 6 classes |
| Animation | Framer Motion | ^12.40.0 |
| Scroll | Lenis | ^1.3.23 |
| Icons | Lucide React | ^1.17.0 |
| Auth | Supabase (`@supabase/ssr`) | ^0.10.3 |
| CSS | Tailwind v4 + inline styles | ^4 |
| 3D | Three.js + R3F + Drei (3D atmosphere page, not in main flow) | three ^0.184 |

---

## 3. Folder Structure

```
karnataka-weather/
├── .env.local                      # Supabase URL + ANON key
├── .gitignore
├── package.json
├── tsconfig.json                   # ES2017, bundler, @/* → ./src/*
├── next.config.mjs                 # Empty/default
├── postcss.config.mjs              # @tailwindcss/postcss
├── eslint.config.mjs               # next core-web-vitals + TS
├── public/                         # SVG icons (file, globe, next, vercel, window)
├── backend/                        # Python ML training (NOT in production)
│   ├── main.py                     # FastAPI: trains XGBoost + SMOTE on CSV
│   ├── export_model.py             # Dumps trained model → JSON for TS port
│   ├── requirements.txt
│   └── karnataka_weather_500.csv   # 500-record training dataset
└── src/
    ├── app/
    │   ├── globals.css             # ~40 lines essential CSS + keyframes + range thumb
    │   ├── layout.tsx              # Root <html>, LenisProvider, Google Fonts
    │   ├── page.tsx                # "/" — Login/Signup with 6-split weather backgrounds
    │   ├── map/page.tsx            # "/map" — SVG district selector (30 districts)
    │   ├── predict/page.tsx        # "/predict?city=X" — Orbital variable sliders + presets
    │   ├── result/page.tsx         # "/result?city=X&condition=Y&..." — Full result page
    │   ├── api/predict/route.ts    # POST /api/predict — XGBoost inference endpoint
    │   └── auth/callback/route.ts  # GET /auth/callback — Supabase OAuth exchange
    ├── lib/
    │   ├── auth.ts                 # Supabase AuthManager (signup, login, Google OAuth, profile update)
    │   ├── xgboost.ts              # TS XGBoost inference: 15 features, 600 trees, softmax, rule overrides
    │   ├── xgboost_model.json      # 6.8MB model dump (100 trees × 6 classes)
    │   ├── utils.ts                # cn() helper (clsx)
    │   ├── weatherContent.ts       # 6-condition content (title, subtitle, cards, travel, tips)
    │   ├── districtContent.ts      # 28-district travel content (heritage, nature, tips)
    │   ├── cities.ts               # 21 city coordinates + regions (for legacy 3D)
    │   ├── karnatakaDistricts.ts   # 30-district GeoJSON-style polygon data
    │   └── karnatakaBorder.ts      # Simplified border polygon (for legacy 3D)
    ├── components/
    │   ├── layout/LenisProvider.tsx # Lenis smooth scroll + ResizeObserver
    │   └── ui/                     # Shadcn UI (button, card, badge — available but unused in inline-styled pages)
    └── systems/
        ├── weather/
        │   ├── WeatherBackground.tsx     # Dynamic import switcher for 6 Canvas2D backgrounds
        │   └── backgrounds/
        │       ├── SunnyBackground.tsx   # Sun rays + 60 floating particles
        │       ├── CloudyBackground.tsx  # 3-layer drifting ellipses
        │       ├── RainyBackground.tsx   # 200 raindrops + ground ripples
        │       ├── StormyBackground.tsx  # 200 vortex particles + lightning bolts
        │       ├── FoggyBackground.tsx   # 12 fog patches + 80 mist particles
        │       └── WindyBackground.tsx   # 120 wind streaks + 20 tumbling leaves
        ├── sliders/
        │   └── OrbitalPredict.tsx  # 5 orbiting variable nodes with click-to-expand card + range
        ├── atmosphere/              # Legacy 3D (not in current user flow)
        │   ├── AtmosphereEngine.tsx
        │   ├── ParticleField.tsx
        │   └── FogLayer.tsx
        └── terrain/                 # Legacy 3D (not in current user flow)
            ├── KarnatakaTerrain.tsx
            └── DistrictNodes.tsx
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
- SVG map rendering all 30 districts from `karnatakaDistricts.ts`.
- Hover: tooltip follows cursor showing district name + "Click to select".
- Click: selects district (highlighted fill + border).
- Bottom bar shows selected district name + "Continue →" pill button.
- On continue: navigates to `/predict?city={districtName}`.
- Auth guard: redirects to `/` if not logged in.

### Page 3: Predict (`/predict?city=X` → `src/app/predict/page.tsx`)
- Wrapped in `<Suspense>` for `useSearchParams()`.
- Reads `city` from URL query params.
- **OrbitalPredict**: 5 variable nodes (Humidity, Pressure, Wind Speed, Min/Max Temp) orbit around a pulsing center.
  - Click any node → orbit rotates to bring it to 12-o'clock → expanded card with description + range slider.
  - Slider changes update the energy ring (SVG dashoffset).
  - Auto-rotate resumes when card closes.
- Background gradient tints dynamically based on slider values.
- **Quick Preview**: 6 preset buttons (Sunny/Cloudy/Rainy/Stormy/Foggy/Windy) that navigate directly to `/result` with hardcoded values.
- On submit: `POST /api/predict` with JSON body → navigates to `/result` with all params.
- **Fallback logic**: If API fails, client-side rules mirror the backend exactly.

### Page 4: Result (`/result?...` → `src/app/result/page.tsx`)
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

### Typography
| Font | Usage |
|------|-------|
| Playfair Display (serif) | Headings, district names, big condition text |
| Space Mono (monospace) | Labels, eyebrows, metadata, buttons |
| Montserrat (sans-serif) | Body text (fallback from Tailwind) |

---

## 6. API Contract

### Endpoint: `POST /api/predict`

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

**Possible `condition` values:** `"Sunny"`, `"Cloudy"`, `"Rainy"`, `"Stormy"`, `"Foggy"`, `"Windy"`

### Slider Ranges (frontend)
| Parameter | Min | Max | Step | Default | Unit |
|-----------|-----|-----|------|---------|------|
| Humidity | 20 | 100 | 1 | 60 | % |
| Pressure | 980 | 1025 | 0.5 | 1010 | hPa |
| Wind Speed | 0 | 80 | 1 | 20 | km/h |
| Min Temp | 5 | 25 | 0.5 | 18 | °C |
| Max Temp | 20 | 45 | 0.5 | 30 | °C |

---

## 7. ML Inference Engine (`src/lib/xgboost.ts`)

### Architecture
1. Imports 6.8MB `xgboost_model.json` (100 trees × 6 classes, max_depth=8).
2. `engineerFeatures()` converts 5 raw inputs → 15 features (5 raw + 10 derived).
3. `predictTree()` recursively walks each tree's JSON nodes, returns leaf value.
4. `softmax()` normalizes class scores to probabilities.
5. `applyRuleOverrides()` applies meteorological heuristics on top of ML output.

### Rule Overrides (priority order, in `src/lib/xgboost.ts:86-108`)
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
- Sub-50ms inference on Vercel Edge/Serverless.
- All 6 presets tested and verified correct.

---

## 8. Authentication (`src/lib/auth.ts`)

- **Supabase** browser client via `@supabase/ssr`.
- Lazy initialization (`getClient()` caches singleton).
- Methods: `signup()`, `login()`, `signInWithGoogle()`, `logout()`, `current()`, `updateProfile()`, `uploadAvatar()`.
- Avatar upload: resizes to 150px JPEG thumbnail, stores in Supabase `user_metadata` + localStorage fallback.
- OAuth callback: `auth/callback/route.ts` exchanges code for session, redirects to `/map`.
- Guard: each protected page calls `AuthManager.current()` in `useEffect`.

---

## 9. Known Issues & Technical Debt

1. **`useRef` unused in `map/page.tsx`** — Imported but never referenced (build warning).
2. **`useCallback` unused in `result/page.tsx`** — Imported, was used previously but now removed (build warning).
3. **`<img>` instead of `<Image />`** — All external Unsplash/Pexels images use native `<img>` (Next.js build warning). Fine for now since images are decorative backgrounds, not performance-critical.
4. **Unused shadcn components** — `button.tsx`, `card.tsx`, `badge.tsx` exist but no page imports them (all UI uses inline styles).
5. **Legacy 3D files** — `AtmosphereEngine.tsx`, `ParticleField.tsx`, `FogLayer.tsx`, `KarnatakaTerrain.tsx`, `DistrictNodes.tsx` are not imported by any active page. Kept for potential future use.
6. **6.8MB JSON model** — Loaded at module import time. Currently only the API route imports it (server-side), so client bundle is unaffected. If client-side inference is needed, models should be lazy-loaded.
7. **Profile photo limit** — Supabase `user_metadata` has size limits. The 150px JPEG thumbnail (~5-15KB) stays within limits, but very large metadata updates may be silently dropped. localStorage provides fallback persistence.
8. **No loading states for external images** — Unsplash/Pexels URLs could fail; no `onError` fallback is provided.

---

## 10. Run Commands

```powershell
npm install              # First time
npm run dev              # http://localhost:3000
npm run build            # Production build
npm run lint             # ESLint
```

No Python backend required — inference runs inside Next.js.

---

*Document generated: 2026-05-31. Keep updated when making changes.*
