# Karnataka Weather — Architectural Report (Part 1 of 3)

---

## 1. Project Overview

### What This Project Is
Karnataka Weather is a full-stack, cinematic weather prediction web application. It is themed around the geography and culture of the Indian state of Karnataka. Users authenticate, select a district from an interactive SVG map, input atmospheric conditions through a premium orbital UI, and receive an AI-powered weather condition prediction rendered with a matching animated background, editorial content cards, travel recommendations, and contextual tips.

### Main Objective
To provide a visually premium, AI-backed weather condition prediction tool specific to Karnataka, India — combining machine learning inference with cinematic presentation, district-aware editorial content, and OAuth-integrated user accounts.

### Current Capabilities
- Email/password + Google OAuth authentication via Supabase
- Interactive SVG map of Karnataka's 30 districts with hover/select interactions
- Orbital node UI for adjusting 5 weather input variables with range sliders
- XGBoost ML model inference running **client-side in TypeScript** (7.1 MB JSON model)
- Fallback to a Python FastAPI backend (`localhost:8000`) for ML inference
- Animated canvas-based weather backgrounds for 6 conditions: Sunny, Cloudy, Rainy, Stormy, Foggy, Windy
- Scrollable result page with parallax effects, editorial content, travel ideas, and pro tips
- Per-district editorial content for ~30 Karnataka districts
- User profile management: display name editing, avatar upload (base64 thumbnail stored in Supabase metadata)
- Quick Preview presets for instant condition navigation
- Smooth scroll via Lenis, page transitions via Framer Motion

### User Problems It Solves
- Provides a visually engaging way to explore weather condition predictions for Karnataka districts
- Delivers destination-specific travel and lifestyle recommendations keyed to predicted conditions
- Offers both quick preset exploration and precise manual atmospheric parameter tuning

### Overall Architecture
A **Next.js 15 App Router** monorepo with:
- Frontend: React 19 + TypeScript + TailwindCSS v4 + Framer Motion + Three.js (R3F)
- In-browser ML: XGBoost model tree-walked in TypeScript
- Auth: Supabase (browser client + server SSR client for OAuth callback)
- Optional backend: Python FastAPI + XGBoost (trains on startup from CSV, serves `/predict`)
- Smooth scroll: Lenis
- Icons: Lucide React

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | ^15.0.0 | App Router framework, SSR/CSR hybrid |
| React | 19.2.4 | UI rendering |
| TypeScript | ^5 | Type safety |
| TailwindCSS | ^4 | Utility CSS (via `@tailwind` import) |
| Framer Motion | ^12.40.0 | Page transitions, AnimatePresence, motion.div |
| Lenis | ^1.3.23 | Smooth scroll engine (replaces native scroll) |
| Three.js | ^0.184.0 | 3D Karnataka terrain and particle field |
| @react-three/fiber | ^9.6.1 | React renderer for Three.js |
| @react-three/drei | ^10.7.7 | Three.js helpers |
| Lucide React | ^1.17.0 | Icon set (Droplets, Gauge, Wind, Thermometer, Sun) |
| class-variance-authority | ^0.7.1 | Component variant system |
| clsx | ^2.1.1 | Class name merging |
| @radix-ui/react-slot | ^1.2.4 | Polymorphic component slot |

### Google Fonts (loaded via CSS `@import`)
- **Montserrat** (300, 400, 500, 700) — body text, descriptions
- **Space Mono** (400, 700) — labels, metadata, monospace UI
- **Playfair Display** (300, 400) — hero headings, district names

### Backend (Python FastAPI)
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | latest | REST API framework |
| Uvicorn | latest | ASGI server |
| XGBoost | latest | ML classifier |
| scikit-learn | latest | LabelEncoder, StratifiedKFold, classification_report |
| pandas | latest | CSV loading, feature engineering |
| numpy | latest | Array operations |
| imbalanced-learn | latest | SMOTE oversampling |
| pydantic | (via FastAPI) | Request body validation |

### Auth
- Supabase Auth (email/password + Google OAuth)
- `@supabase/supabase-js ^2.106.2` — browser client
- `@supabase/ssr ^0.10.3` — SSR server client for OAuth callback cookie handling

### Machine Learning
- **Algorithm**: XGBoost multi-class classifier (`multi:softprob`)
- **Model format**: JSON tree dump (exported via `export_model.py`, loaded in `src/lib/xgboost.ts`)
- **Classes**: 6 — `Cloudy`, `Foggy`, `Rainy`, `Stormy`, `Sunny`, `Windy`
- **Features (engineered)**: 15 total from 5 raw inputs
- **Inference**: Client-side TypeScript tree traversal + softmax + rule overrides
- **Training**: Python (SMOTE-balanced, 500 estimators, max_depth=8)
- **Dataset**: `karnataka_weather_500.csv` (~500+ rows, 5 raw columns)

### Database / Auth Provider
- **Supabase** (hosted PostgreSQL + Auth)
- No custom tables — only Supabase Auth user store is used
- User metadata (`name`, `avatar_url`) stored in `auth.users.user_metadata` (JSON field)
- Avatar stored as base64 JPEG thumbnail (<150px) in metadata + `localStorage` cache

---

## 3. Complete Folder Structure

```
karnataka-weather/                  ← Project root
├── .env.example                    ← Environment variable template
├── .env.local                      ← Active env vars (gitignored)
├── .gitignore
├── eslint.config.mjs               ← ESLint config (Next.js ruleset)
├── next.config.mjs                 ← Empty Next.js config (no customizations)
├── next-env.d.ts                   ← Next.js TypeScript declarations
├── package.json                    ← Dependencies, scripts
├── postcss.config.mjs              ← PostCSS (TailwindCSS v4 plugin)
├── tsconfig.json                   ← TypeScript config (strict, paths alias @/→src/)
├── PRESENTATION_SCRIPT.md          ← Demo script (non-code)
├── PROJECT_CONTEXT.md              ← Previous LLM context doc
├── TECHNICAL_REPORT.md             ← Previous technical report
├── README.md                       ← Project readme
│
├── backend/                        ← Python FastAPI ML backend
│   ├── main.py                     ← FastAPI app, training loop, /predict endpoint
│   ├── export_model.py             ← Exports trained model to xgboost_model.json
│   ├── check_data.py               ← Debug: inspect CSV
│   ├── debug_trees.py              ← Debug: tree inspection (v1)
│   ├── debug_trees2.py             ← Debug: tree inspection (v2)
│   ├── debug_trees3.py             ← Debug: tree inspection (v3)
│   ├── requirements.txt            ← Python dependencies
│   ├── karnataka_weather_500.csv   ← Training dataset (1.8 MB)
│   ├── xgboost_model.json          ← Full model export (114 MB) - NOT used by frontend
│   ├── xgboost_full.json           ← Alternative full model (5.8 MB)
│   ├── xgboost_model_compact.json  ← Compact model (6.8 MB)
│   └── venv/                       ← Python virtual environment
│
├── public/                         ← Static assets served at root
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
└── src/
    ├── app/                        ← Next.js App Router pages
    │   ├── layout.tsx              ← Root layout (Lenis + global CSS)
    │   ├── globals.css             ← Global styles, CSS variables, keyframes
    │   ├── favicon.ico
    │   ├── page.tsx                ← Route "/" — Login/Signup page
    │   ├── map/
    │   │   └── page.tsx            ← Route "/map" — District selector map
    │   ├── predict/
    │   │   └── page.tsx            ← Route "/predict?city=..." — Weather input
    │   ├── result/
    │   │   └── page.tsx            ← Route "/result?..." — Prediction results
    │   ├── api/
    │   │   ├── predict/
    │   │   │   └── route.ts        ← POST /api/predict — Next.js API (in-browser XGBoost)
    │   │   └── image/
    │   │       └── route.ts        ← GET /api/image?url= — Wikipedia image proxy
    │   └── auth/
    │       └── callback/
    │           └── route.ts        ← GET /auth/callback — Supabase OAuth code exchange
    │
    ├── components/
    │   ├── layout/
    │   │   └── LenisProvider.tsx   ← Smooth scroll provider (wraps all pages)
    │   └── ui/
    │       ├── badge.tsx           ← Badge component (CVA variants)
    │       ├── button.tsx          ← Button component (CVA + Radix Slot)
    │       ├── card.tsx            ← Card/CardHeader/CardContent/etc.
    │       ├── glass-button.tsx    ← Glassmorphic button variant
    │       └── loading-screen.tsx  ← 3D cube loading animation
    │
    ├── lib/
    │   ├── auth.ts                 ← AuthManager: login, signup, Google OAuth, profile
    │   ├── cities.ts               ← 21 Karnataka cities with lat/lng/region + toScene()
    │   ├── districtContent.ts      ← Editorial content for ~30 districts (86 KB)
    │   ├── karnatakaBorder.ts      ← Karnataka border coordinates for 3D terrain
    │   ├── karnatakaDistricts.ts   ← GEO_DATA: SVG polygon data for 30 districts (82 KB)
    │   ├── utils.ts                ← cn() class merger utility
    │   ├── weatherContent.ts       ← Editorial content for 6 weather conditions (23 KB)
    │   ├── xgboost.ts              ← In-browser XGBoost inference engine
    │   ├── xgboost_model.json      ← Bundled model (7.1 MB) — imported by xgboost.ts
    │   └── supabase/               ← Empty directory (supabase client in auth.ts)
    │
    └── systems/
        ├── atmosphere/
        │   ├── AtmosphereEngine.tsx ← Three.js Canvas: ParticleField + FogLayer
        │   ├── FogLayer.tsx         ← Two drifting fog planes (Three.js meshes)
        │   └── ParticleField.tsx    ← 120 upward-drifting 3D points
        ├── terrain/
        │   ├── KarnatakaTerrain.tsx ← Extruded Karnataka shape in Three.js
        │   └── DistrictNodes.tsx    ← Clickable/hoverable city dots in Three.js
        ├── weather/
        │   ├── WeatherBackground.tsx ← Condition switch → dynamic import background
        │   └── backgrounds/
        │       ├── SunnyBackground.tsx   ← Canvas: radial gradient + rotating rays + particles
        │       ├── CloudyBackground.tsx  ← Canvas: grey gradients + cloud puffs
        │       ├── RainyBackground.tsx   ← Canvas: dark bg + falling drops + ripples
        │       ├── StormyBackground.tsx  ← Canvas: dark bg + lightning + heavy rain
        │       ├── FoggyBackground.tsx   ← Canvas: white gradient + drifting fog patches
        │       └── WindyBackground.tsx   ← Canvas: streaking particles + wind lines
        └── sliders/
            ├── OrbitalPredict.tsx       ← Main orbital UI: 5 nodes on rotating ring
            └── EnvironmentalSlider.tsx  ← Simple labeled range slider (not used in prod)
```

---

## 4. Component Architecture

### Root Layout — `src/app/layout.tsx`
- **Purpose**: Root shell for all pages
- **Children**: Wraps entire app in `<LenisProvider>`
- **Metadata**: Sets page title "Karnataka Weather" and description
- **Imports**: `globals.css`, `LenisProvider`
- **No state, no hooks**

### LenisProvider — `src/components/layout/LenisProvider.tsx`
- **Purpose**: Provides smooth scroll globally via Lenis library
- **State**: `lenisRef` (ref to Lenis instance)
- **Hooks**: `useEffect` (creates Lenis, starts rAF loop, adds ResizeObserver, cleans up)
- **Config**: duration 1.4s, exponential easing `1.001 - 2^(-10t)`
- **Children**: Renders `<>{children}</>`
- **Parent**: `RootLayout`

### LoginPage — `src/app/page.tsx`
- **Purpose**: Authentication gate — login or sign-up form over animated weather background
- **State**: `mode` ('login'|'signup'), `name`, `email`, `password`, `error`, `isExiting`
- **Hooks**: `useRouter`, `useState`, `useEffect`
- **Auth check**: `useEffect` calls `AuthManager.current()` — redirects to `/map` if already logged in
- **Submit**: Calls `AuthManager.login()` or `AuthManager.signup()` → on success, sets `isExiting=true` → navigates to `/map` after 900ms
- **Background**: 6 `WeatherBackground` components (dynamically imported, SSR disabled) split into equal vertical sixths via `clipPath`. Vertical dividers and condition labels overlay them.
- **Card**: Framer Motion `motion.div` with `float-element` CSS animation. AnimatePresence handles exit blur animation.
- **Interactions**: Mode toggle (login↔signup), Google OAuth button, error display
- **Reusable?**: No — single-purpose page

### MapPage — `src/app/map/page.tsx`
- **Purpose**: District selector — SVG map of Karnataka
- **State**: `tooltip` (visible, name, x, y), `selected` (district name), `hoveredDistrict`
- **Hooks**: `useRouter`, `useState`, `useEffect`
- **Auth check**: Redirects to `/` if not logged in
- **Map rendering**: Iterates `GEO_DATA` array. Each district is an SVG `<g>` with path elements. Fill/stroke changes based on `selected` or `hoveredDistrict`.
- **Coordinate projection**: `lngToX()` and `latToY()` — linear projection within 500×560 SVG viewBox with 20px padding. Map is scaled to 0.67 via CSS transform.
- **Interaction**: onMouseMove → show tooltip + set hovered; onMouseLeave → hide tooltip; onClick → set selected district
- **Navigation**: "Continue →" button appears when district selected → pushes `/predict?city=<district>`
- **Logout**: Fixed bottom-right button calls `AuthManager.logout()` → redirects to `/`
- **Tooltip**: Fixed positioned div with glassmorphic styling, shows district name
- **Reusable?**: No — single-purpose page

### PredictPage — `src/app/predict/page.tsx`
- **Purpose**: Weather parameter input UI
- **Wrapped in**: `<Suspense>` (needed for `useSearchParams`)
- **State**: `humidity` (60), `pressure` (1010), `windSpeed` (20), `minTemp` (18), `maxTemp` (30), `loading` (false)
- **URL param**: `city` from `useSearchParams`
- **Auth check**: Redirects to `/` if not logged in
- **Background tint**: `getBgColor()` returns radial gradient based on slider values (blue if humid, orange if hot, cold blue if low minTemp, warm peach by default)
- **Submit flow**: `handleSubmit()` → sets loading → `fetch(${API_URL}/predict, POST)` with JSON payload → on success pushes `/result?...` with all params → on failure uses client-side rule-based fallback → still pushes to result
- **Quick Preview presets**: 6 buttons that immediately push to `/result` with hardcoded condition/confidence
- **OrbitalPredict**: Receives `variables` array, `onVariableChange` callback, `onSubmit`, `onBack`, `loading`
- **LoadingScreen**: Overlaid in AnimatePresence when `loading=true`
- **Floating orbs**: Two blurred radial gradient divs with `orbDrift` CSS animation
- **Reusable?**: No — single-purpose page

### ResultPage — `src/app/result/page.tsx`
- **Purpose**: Prediction result display — cinematic scrollable page
- **Wrapped in**: `<Suspense>`
- **URL params**: `city`, `condition`, `confidence`, `humidity`, `pressure`, `windSpeed`, `minTemp`, `maxTemp`
- **State**: `profileOpen`, `user` (name, email, avatarUrl), `editName`, `saving`
- **Auth check**: Redirects to `/` if not logged in
- **Content resolution**: Looks up `WEATHER_CONTENT[condition]` for weather editorial. Also looks up `DISTRICT_CONTENT[districtKey]` for district-specific content. District aliases normalize variant spellings (Bengaluru→BengaluruUrban, Mysore→Mysuru, etc.)
- **Color system**: `isDark` (true for Rainy/Stormy/Cloudy). `accentColor` = per-condition color. Used for all text and UI tinting.
- **Hero section**: Sticky parallax — `ParallaxSection` component shrinks/fades on scroll using IntersectionObserver + scroll listener. `WeatherStickman` SVG drawn per condition.
- **Scroll reveal**: `RevealSection` uses IntersectionObserver to fade+slide up content as it enters viewport.
- **Cards grid**: Pinterest-style alternating row/row-reverse layout. Each card has image + text. Images use lazy loading + fallback URL on error.
- **Profile modal**: Framer Motion modal. Avatar upload → base64 thumbnail via Canvas → stored in Supabase user metadata + localStorage.
- **Navigation**: "Adjust" → `/predict?city=...`, "New City" → `/map`
- **Sub-components**: `RevealSection`, `ParallaxSection`, `WeatherStickman` (all defined inline in the file)
- **Reusable?**: No — single-purpose page, but `RevealSection` and `ParallaxSection` are reusable patterns

### OrbitalPredict — `src/systems/sliders/OrbitalPredict.tsx`
- **Purpose**: The core weather input widget. 5 variable nodes orbit a center ring. Click a node to expand it at center with a slider card.
- **Props**: `variables[]` (VariableConfig), `onVariableChange(key, value)`, `onSubmit()`, `onBack()`, `loading`
- **State**: `expandedId` (which node is expanded), `rotationAngle` (0-360°, auto-increments), `autoRotate` (boolean), `pulseNodes` (Record of related node keys), `cardVisible` (opacity gate)
- **Refs**: `containerRef`, `targetRef` (animation target angle), `rafRef` (rAF id)
- **Auto-rotation**: `setInterval` increments angle by 0.3° every 50ms when `autoRotate=true`
- **Click behavior**: Stops auto-rotation → calculates target angle to bring node to 12 o'clock position (270°) → runs `animateToTarget()` rAF loop using shortest-path delta → when close enough, sets `cardVisible=true`
- **Position calculation**: `calculatePosition(index, total)` — places node on circle at radius 170px, computes x/y/zIndex/opacity from sine/cosine of current angle
- **Energy ring**: SVG circle with `strokeDashoffset` showing current value as percentage of range
- **Expanded card**: Absolutely centered, shows label, meteorological description, and range slider
- **Icons**: Lucide (Droplets, Gauge, Wind, Thermometer, Sun) matched by label
- **Global CSS keyframes used**: `centerPulse`, `centerPing`, `nodePulse` (defined in `globals.css`)
- **Reusable?**: Yes — accepts generic `variables[]` config, fully data-driven

### WeatherBackground — `src/systems/weather/WeatherBackground.tsx`
- **Purpose**: Condition-router — maps string condition to the correct canvas background component
- **Props**: `condition: string`
- **All 6 sub-components**: dynamically imported with `{ ssr: false }` to avoid SSR canvas issues
- **Reusable?**: Yes — accepts any of the 6 condition strings

### Background Components (6 files in `src/systems/weather/backgrounds/`)
All follow the same pattern:
- **Mount**: `useRef<HTMLCanvasElement>`, `useEffect` creates canvas 2D context
- **Resize**: Window resize listener sets `canvas.width/height = window.innerWidth/Height`
- **Draw loop**: `requestAnimationFrame(draw)` — each frame clears and redraws
- **Cleanup**: `cancelAnimationFrame(animId)` + `removeEventListener` on unmount
- **Render**: `<canvas style={{ position: 'fixed', inset: 0, zIndex: 0 }} />`

| Component | Visual Elements |
|---|---|
| SunnyBackground | Radial yellow/orange gradient, 16 rotating rays, 60 upward particles |
| CloudyBackground | Grey gradient, animated cloud puffs |
| RainyBackground | Dark teal gradient, 200 falling drops, expanding ripples |
| StormyBackground | Dark bg, heavy rain, lightning flash effect |
| FoggyBackground | White/cream gradient, drifting fog ellipses |
| WindyBackground | Peach gradient, streaking horizontal particles, wind lines |

### AtmosphereEngine — `src/systems/atmosphere/AtmosphereEngine.tsx`
- **Purpose**: Three.js R3F Canvas wrapping ParticleField + FogLayer (legacy/unused in current routes)
- **Props**: `particleSpeed?`, `particleColor?`
- **Canvas settings**: camera z=10, fov=60, antialias=false, dpr=[1,1.5]
- **Scene**: ambient warm light, exponential fog, particle field, fog layer planes

### ParticleField — `src/systems/atmosphere/ParticleField.tsx`
- **Purpose**: 3D points rising upward in Three.js scene
- **Props**: `count` (120), `speedMultiplier` (1), `color`
- **Per frame**: increments Y position, wraps at ±22 units
- **Material**: `PointsMaterial`, additive blending, 0.35 opacity, size 0.06

### FogLayer — `src/systems/atmosphere/FogLayer.tsx`
- **Purpose**: Two large translucent planes drifting in sinusoidal paths
- **Per frame**: Updates x/y position using `sin(t)` and `cos(t)` at different speeds
- **Materials**: Warm beige (`#e8d5b8`, `#dfc8a8`), transparent, double-sided

### KarnatakaTerrain — `src/systems/terrain/KarnatakaTerrain.tsx`
- **Purpose**: Extruded Karnataka border shape in Three.js (legacy 3D map, not used in current routes)
- **Data**: `KARNATAKA_BORDER` from `lib/karnatakaBorder.ts` — 63 coordinate pairs
- **Geometry**: `ExtrudeGeometry` (depth 0.2, bevel 0.04) + `ShapeGeometry` (top face)
- **Animation**: `useFrame` — gentle vertical bob (sin wave) + slight X rotation
- **Materials**: 3 layers — main body (#c4956a), top face (#deb887), border glow (#e8b89a)

### DistrictNodes — `src/systems/terrain/DistrictNodes.tsx`
- **Purpose**: Clickable city dots in Three.js scene (legacy, not used in current routes)
- **Data**: Reads `CITIES` array from `lib/cities.ts`, converts lat/lng to scene coords via `toScene()`
- **Sub-component** `CityNode`: core dot + glow ring, pulse animation on hover, 1.8x scale on hover
- **Events**: onPointerOver/Out, onClick → callbacks to parent

### EnvironmentalSlider — `src/systems/sliders/EnvironmentalSlider.tsx`
- **Purpose**: Simple horizontal range slider with label and value display
- **Props**: `label`, `min`, `max`, `step`, `unit`, `value`, `onChange`
- **Note**: This component is **defined but not used** in the current production UI — `OrbitalPredict` has its own inline slider implementation

### LoadingScreen — `src/components/ui/loading-screen.tsx`
- **Purpose**: Full-screen loading animation shown during prediction API call
- **Structure**: Large 3D spinning cube (CSS 3D transforms) + 7 letter cubes spelling "LOADING" + subtitle text
- **Cube**: 6 faces positioned via `rotateY/X(n) translateZ(48px)`, spun with `cubeSpin` keyframe
- **Letters**: Each is a mini 3D cube with front face showing letter. `zapFade` animates Z-depth wave with staggered `animationDelay` = `i * 0.38s`. `glowFade` syncs glow pulse to same delay.
- **Colors**: Cyan/teal theme (`#06b6d4`, `#22d3ee`) — intentionally different from rest of app
- **All styles**: Scoped `<style>` tag inside component (no global leak)

### UI Primitive Components
| Component | File | Variants | Notes |
|---|---|---|---|
| Button | `button.tsx` | default, destructive, outline, secondary, ghost, link | CVA + Radix Slot `asChild` |
| Badge | `badge.tsx` | default, secondary, destructive, outline | CVA |
| Card | `card.tsx` | — | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| GlassButton | `glass-button.tsx` | size: default/sm/lg/xl/icon | Custom glassmorphic wrapper div + shadow div |

**Note**: These UI primitives are **created but rarely used** in the app. Most pages use inline-styled JSX.

---

## 5. Routing

| Route | File | Purpose | Protected | Navigation In |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Login/Signup | No (redirects to /map if logged in) | Initial entry, logout redirects |
| `/map` | `app/map/page.tsx` | District selector | Yes (redirects to / if not logged in) | After login, "New City" from result |
| `/predict` | `app/predict/page.tsx` | Weather parameter input | Yes | From /map with `?city=<district>` |
| `/result` | `app/result/page.tsx` | Prediction result | Yes | From /predict with all params in URL |
| `/auth/callback` | `app/auth/callback/route.ts` | Supabase OAuth code exchange | No | Google OAuth redirect |
| `POST /api/predict` | `app/api/predict/route.ts` | In-process XGBoost inference | No auth | Called by predict page fetch |
| `GET /api/image` | `app/api/image/route.ts` | Wikipedia image proxy | No auth | Could be called for images |

### URL Parameter Schema
**`/predict?city=<string>`**
- `city`: District name from map selection

**`/result?city=<string>&condition=<string>&confidence=<float>&humidity=<float>&pressure=<float>&windSpeed=<float>&minTemp=<float>&maxTemp=<float>`**
- All values passed as URL search params (no server state, no DB)
# Karnataka Weather — Architectural Report (Part 2 of 3)

---

## 6. Authentication

### Login Flow
```
User visits "/" 
  → useEffect: AuthManager.current() 
  → if user exists: router.replace('/map')  (already logged in)
  → else: show login form

User submits email+password:
  → AuthManager.login(email, password)
  → supabase.auth.signInWithPassword()
  → success: setIsExiting=true → router.push('/map') after 900ms
  → failure: setError(error.message)

User clicks "Sign up" toggle:
  → mode = 'signup'
  → "Name" field animates in (AnimatePresence height: 0 → auto)
  → AuthManager.signup(name, email, password)
  → supabase.auth.signUp({ email, password, options: { data: { name } } })
```

### Google OAuth Flow
```
User clicks "Sign in with Google":
  → AuthManager.signInWithGoogle()
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: origin + '/auth/callback' })
  → Browser redirects to Google
  → Google redirects to /auth/callback?code=<code>
  → route.ts: supabase.auth.exchangeCodeForSession(code)
  → success: NextResponse.redirect(origin + '/map')
  → failure: NextResponse.redirect(origin + '?error=auth_failed')
```

### Logout
```
AuthManager.logout() → supabase.auth.signOut() → router.push('/')
```
Called from: map page button, result page profile modal.

### Protected Routes
All protected routes (`/map`, `/predict`, `/result`) call `AuthManager.current()` in `useEffect`. If null returned, `router.replace('/')`. This is **client-side only** — no middleware, no server-side auth checks.

### Auth Provider
- **Supabase Auth** with browser client created lazily via `getClient()` singleton
- Client URL: `NEXT_PUBLIC_SUPABASE_URL`
- Client key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- SSR client (`createServerClient`) used only in `/auth/callback/route.ts` for cookie-based session

### User Session
- Managed entirely by Supabase (JWT stored in cookies/localStorage by Supabase SDK)
- `AuthManager.current()` calls `supabase.auth.getUser()` on every page load — no local session cache

### Profile Management
- `updateProfile(name)`: `supabase.auth.updateUser({ data: { name } })`
- `uploadAvatar(file)`: Client-side Canvas resize to 150px → base64 JPEG → `supabase.auth.updateUser({ data: { avatar_url: thumbnail } })` + `localStorage.setItem('avatar_' + userId, thumbnail)`
- Avatar fallback: If `avatar_url` missing from Supabase metadata, checks `localStorage`

---

## 7. UI / UX Analysis

### Design Language
The app uses a **warm, editorial, cinematic** aesthetic — drawing from high-end travel magazines and atmospheric environmental design. It is NOT a standard dashboard-style weather app. The design prioritizes emotional impact over information density.

### Color Palette
Defined as CSS custom properties in `:root` (`globals.css`):

| Variable | Value | Usage |
|---|---|---|
| `--color-bg` | `#f5f0e8` | Page backgrounds |
| `--color-surface` | `#eee6d6` | Card surfaces |
| `--color-primary` | `#e8b89a` | Primary accent |
| `--color-secondary` | `#c49a7a` | Secondary accent |
| `--color-accent` | `#8b4513` | Saddlebrown — buttons, active states |
| `--color-accent-light` | `#c4622d` | Lighter accent |
| `--color-text-primary` | `#1a1208` | Dark brown text |
| `--color-text-secondary` | `#3d2b1a` | Slightly lighter text |
| `--color-text-muted` | `#3a2a1a` | Muted text |
| `--color-particle` | `#f0c8a0` | Three.js particle color |
| `--color-fog` | `#e8d5b8` | Three.js fog color |

**Glassmorphic cards**: `background: rgba(250,242,232,0.85); backdrop-filter: blur(40px); border: 1px solid rgba(232,173,140,0.3)`

**Per-condition text colors** (result page):
| Condition | Color |
|---|---|
| Sunny | `#3b2d8a` (deep purple) |
| Cloudy | `#b8860b` (dark goldenrod) |
| Rainy | `#f5c8a0` (peach) |
| Stormy | `#b8d44a` (yellow-green) |
| Foggy | `#8b5a3a` (brown) |
| Windy | `#9a5a7a` (mauve) |

### Typography
Three font families used consistently:

| Font | Weights | Usage |
|---|---|---|
| Playfair Display (serif) | 300, 400 | Hero headings, district names, card titles, condition name |
| Space Mono (monospace) | 400, 700 | Labels, metadata, buttons, subtitles, letterSpacing 0.1–0.3em |
| Montserrat (sans-serif) | 300, 400, 500, 700 | Body copy, descriptions, paragraph text |

**Font sizes**: Range from 8px (range labels) to `clamp(72px, 14vw, 160px)` (result hero condition name).

### Spacing
No design token system for spacing. All spacing is inline via `margin`, `padding`, `gap` in px. Common values: 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 60px, 80px.

### Cards
All cards use the same glassmorphic pattern:
- Background: `rgba(250,242,232,0.82–0.95)`
- Backdrop blur: 20–40px
- Border: 1px solid `rgba(232,173,140,0.2–0.5)`
- Border radius: 16–28px
- Box shadow: `0 24px 80px rgba(180,80,20,0.15–0.18)`

### Buttons
Two styles in active use:
1. **Pill/filled**: `background: #d4845a; color: #fff; border-radius: 99px; padding: 10px 24px` — "Continue →" on map
2. **Rectangular**: `background: #8b4513; color: #fff8f0; border-radius: 8px; padding: 14px 32px` — "Predict Weather", "Enter"
3. **Ghost/outline**: `background: transparent; border: 1px solid ...` — "New City", "Adjust"
4. **Google button**: Specific styling per Google brand guidelines

Hover effects: `transform: translateY(-1px)` on login button, background color shifts via `onMouseEnter`/`onMouseLeave` inline handlers.

### Forms
- Login fields: Styled via `.login-field` CSS class
- Labels: Space Mono, 9px, uppercase, 0.15em letter-spacing, 0.6 opacity
- Inputs: 12px Montserrat, 1px border, background `rgba(250,242,232,0.6)`, focus border darkens
- Range sliders: Custom thumb via `input[type="range"]::-webkit-slider-thumb` — 18px saddlebrown circle with white border

### Icons
- **Lucide React**: Used only in `OrbitalPredict` for node icons (Droplets, Gauge, Wind, Thermometer, Sun). Size 18–22px.
- **SVG inline**: Google icon in login page (4-path multicolor SVG), user icon in result page profile button, back/forward arrows as Unicode characters ("←", "→", "↓")
- **WeatherStickman**: Custom inline SVG stick figures (6 poses, one per condition) rendered in result hero

### Animations & Micro-interactions

**Framer Motion**:
- Page entry: `initial={{ opacity:0, y:24, filter:'blur(8px)' }} animate={{ opacity:1, y:0, filter:'blur(0px)' }}` on all main cards
- Exit: `exit={{ opacity:0, scale:0.96, filter:'blur(12px)' }}` on login card
- Element stagger: `delay` prop on `transition` for sequential reveal
- AnimatePresence: Used for login card exit, loading overlay, signup name field height animation

**CSS Keyframes** (in `globals.css`):
- `centerPulse`: opacity + scale pulse for orbital center
- `centerPing`: Scale 2 + fade out for ping rings
- `nodePulse`: Opacity 0.6↔1 for related nodes
- `float`: -4px vertical translation, 6s infinite — login card floating
- `@keyframes` for range thumb via direct CSS

**CSS Keyframes** (inline `<style>` tags per page):
- `orbDrift`: translate 30px/20px + scale 1.06 — floating orbs on predict page
- `pulse`: scale + opacity for selected district dot on map
- `breathe`: scale on result page scroll hint
- `cubeSpin`, `breathe`, `pulseFast`, `shadowBreathe`, `zapFade`, `glowFade` — all in LoadingScreen

### Glassmorphism
Used extensively:
- Login card: `backdrop-filter: blur(40px) saturate(1.2)`
- Map card: `backdrop-filter: blur(40px)`
- Predict card: `backdrop-filter: blur(40px)`
- Orbital expanded card: `backdrop-filter: blur(40px)`
- Tooltips: `backdrop-filter: blur(20px)`
- Result cards: `backdrop-filter: blur(20px)`

### Loading Screen
Shows when `loading=true` during API call on predict page. Full-screen `#f0ffff` background with two blurred blue orbs. The `LoadingScreen` component renders:
1. A large 3D spinning cube (96px, CSS 3D transforms, 8s spin)
2. Seven mini-cubes spelling "LOADING" with staggered Z-wave animation (0.38s per letter)
3. A subtitle: "Preparing your experience, please wait…"
All in cyan/teal color scheme.

### Transitions
- Page navigation: No route-level transition. Per-page content animates in via Framer Motion.
- District selection: 0.18s CSS transition on SVG fill/stroke
- Orbital node click: rAF animation over ~1 second (eased 8% per frame)
- Slider value changes: `width` transition 0.15s ease on fill bar
- Background tint on predict page: `transition: background 1s ease` on wrapper div

### Hover Effects
- Map districts: Fill changes from 18% to 35% opacity; stroke thickens from 0.6 to 1.0
- Logout/profile buttons: Background brightens via `onMouseEnter` inline handler
- Preset buttons: Background + border color shift
- Image cards (result): `transform: scale(1.05)` with 0.6s ease transition
- Orbital nodes: Expand from 46px→56px, background goes dark brown, icon turns white

### Responsive Behaviour
- Login card: `width: min(400px, 90vw)` — responsive
- Predict card: `width: min(700px, 94vw)` — responsive
- Map card: Fixed 860px inside a 0.67 scale wrapper — **not fully responsive** on small screens
- Result hero: `fontSize: clamp(72px, 14vw, 160px)` — fluid type
- Result content: `maxWidth: 960px, margin: 0 auto` — centered column
- Tips grid: `gridTemplateColumns: repeat(auto-fill, minmax(260px, 1fr))` — responsive
- No explicit mobile breakpoints are defined anywhere

### Accessibility
- No ARIA labels on interactive elements (map districts, orbital nodes)
- No keyboard navigation for orbital UI
- No focus styles beyond browser defaults
- Semantic HTML: `<h1>` used on login ("Karnataka"), result (condition name). `<form>` on login.
- Color contrast: Some label text at low opacity (0.4–0.6) may fail WCAG AA
- Images: `alt` attributes present on result page images
- No skip links, no landmark regions
- `suppressHydrationWarning` on `<html>` element

### Map Interaction
- Crosshair cursor over SVG
- Districts highlight on hover (fill brightens)
- Tooltip appears near cursor with district name + "Click to select"
- Click selects district (fill darkens, persists)
- Selected district name appears in bottom panel with animated dot indicator
- "Continue →" button appears — pill-shaped, animated entry

### Prediction Interaction (Orbital UI)
1. Nodes orbit automatically in clockwise direction
2. Click a node → auto-rotate stops, node animates to 12 o'clock via shortest path
3. Related nodes pulse; selected node expands and turns dark
4. Card appears at center with description + slider
5. Slider adjusts value; ring arc fills proportionally
6. Click background → collapse card, resume rotation
7. "Predict Weather" button → triggers API call, loading overlay appears

---

## 8. User Journey

```
Visit "/"
  ↓ (if logged in → skip to /map)
Login / Sign Up
  ↓ Email+password or Google OAuth
  ↓ 900ms exit animation
"/map" — Karnataka District Map
  ↓ Hover districts to see names
  ↓ Click district to select
  ↓ Click "Continue →"
"/predict?city=<district>"
  ↓ See district name as heading
  ↓ Orbital nodes auto-rotate
  ↓ Click node → see description + adjust slider
  ↓ Close card → rotate resumes
  ↓ OR click Quick Preview preset → immediately jump to result
  ↓ Click "Predict Weather"
  ↓ Loading screen (3D cube animation)
  ↓ API call (backend or client-side fallback)
"/result?city=...&condition=...&confidence=...&..."
  ↓ Animated entry: condition name blurs in (large Playfair Display)
  ↓ Weather-appropriate animated canvas background
  ↓ Confidence percentage displayed
  ↓ "Scroll to explore ↓" breathing indicator
  ↓ Scroll → parallax scale+fade of hero section
  ↓ "Weather Gallery" — 3 image+text cards (alternating layout, scroll reveal)
  ↓ "Travel Ideas" — 3 destination cards (image + description + best time + tip)
  ↓ "Pro Tips" — grid of 5 numbered tips
  ↓ Footer with "← Adjust Values" and "New City" buttons
  ↓ Profile button (top-right) → open profile modal
  ↓ Edit name, upload avatar, logout
```

---

## 9. Prediction Workflow

### Full Backend Path (when Python server running)
```
User clicks "Predict Weather"
  ↓
handleSubmit() — setLoading(true)
  ↓
fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: JSON.stringify({ minTemp, maxTemp, humidity, pressure, windSpeed })
})
  ↓
Python FastAPI receives WeatherInput
  ↓
engineer_features() — produces 15-feature array:
  [minT, maxT, hum, pres, wind, tempRange, tempMean, humidityWind,
   pressureAnomaly, stormIndex, heatDryIndex, fogIndex,
   humidityHigh, humidityLow, windPower]
  ↓
XGBClassifier.predict() → class index
XGBClassifier.predict_proba() → 6 class probabilities
  ↓
apply_rule_overrides(data, ml_label, ml_confidence)
  → Priority: Stormy > Rainy > Foggy > Cloudy > Windy > Sunny > ML fallback
  ↓
return { condition: final_label, confidence: final_confidence }
  ↓
Frontend: router.push('/result?city=...&condition=...&confidence=...&...')
```

### Fallback Path (client-side, backend unreachable)
```
fetch() throws / response not ok
  ↓
catch block: applies identical rule logic in TypeScript:
  if (humidity >= 88 && windSpeed >= 40) → Stormy (0.88)
  if (humidity >= 88 && windSpeed >= 5) → Rainy (0.82)
  if (humidity >= 85 && windSpeed >= 15) → Rainy (0.84)
  if (humidity >= 92 && windSpeed >= 3) → Rainy (0.80)
  if (humidity >= 40 && windSpeed <= 15 && minTemp <= 18 && maxTemp <= 26) → Foggy (0.78)
  if (humidity >= 70) → Cloudy (0.80)
  if (windSpeed >= 30) → Windy (0.82)
  if (maxTemp >= 26 && humidity <= 55) → Sunny (0.85)
  else → Sunny (0.70)
  ↓
router.push('/result?...') with fallback values
```

### Next.js API Path (POST /api/predict)
The frontend predict page calls `${API_URL}/predict` which points to `localhost:8000` (Python). However, there is also a Next.js API route at `/api/predict` which does:
```
POST /api/predict
  ↓
Validates all 5 fields are numbers
  ↓
Calls predict() from src/lib/xgboost.ts
  → engineerFeatures() → 15-feature array
  → Tree traversal over all model.trees (500 trees × 6 classes = 3000 trees)
  → scores[cls] += leafValue for each tree
  → softmax(scores) → probabilities
  → applyRuleOverrides() → final label + confidence
  ↓
Returns { condition, confidence }
```
**Note**: The predict page currently calls `localhost:8000` (Python), not `/api/predict`. The Next.js API route exists as an alternative but is not the primary call target.

---

## 10. Backend Architecture

### `backend/main.py` Structure
```
Imports: fastapi, pydantic, pandas, numpy, xgboost, sklearn, imblearn, uvicorn

Global state:
  model = None  (populated by training thread)
  label_encoder = LabelEncoder()

Lifespan context manager:
  → starts train_model() in daemon thread on startup

FastAPI app with CORS (allow_origins=["*"], allow all methods/headers)

train_model():
  1. pd.read_csv("karnataka_weather_500.csv")
  2. engineer_features(df) → 15 feature columns
  3. LabelEncoder.fit_transform(df["Condition"])
  4. SMOTE(random_state=42, k_neighbors=5).fit_resample(X, y)
  5. XGBClassifier(n_estimators=500, max_depth=8, lr=0.05, ...)
  6. clf.fit(X_resampled, y_resampled)
  7. model = clf (set global only after training complete)
  8. Evaluate on original data: classification_report + 5-fold CV
  9. Print top 8 feature importances

apply_rule_overrides(data, ml_label, ml_confidence):
  → Exact same logic as TypeScript version (kept in sync)

@app.post("/predict")
  → Validates model loaded (503 if not)
  → Builds raw DataFrame from request
  → engineer_features() → same 15-feature array
  → model.predict() + model.predict_proba()
  → apply_rule_overrides()
  → Logs full probability breakdown
  → Returns { condition, confidence }
```

### Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/predict` | None | Weather prediction |

### Training Details
- **Dataset**: `karnataka_weather_500.csv` — must be in current working directory
- **SMOTE**: k_neighbors=5, random_state=42 — balances class distribution before training
- **XGBoost params**: 500 estimators, max_depth=8, lr=0.05, subsample=0.85, colsample_bytree=0.85, min_child_weight=3, gamma=0.1, reg_alpha=0.1, reg_lambda=1.0
- **Objective**: `multi:softprob` (6 classes)
- **Runs in background thread** so server accepts requests immediately (returns 503 while training)

### Debug Scripts
- `check_data.py`: Inspects CSV shape and column info
- `debug_trees.py`, `debug_trees2.py`, `debug_trees3.py`: Various tree dump inspection utilities used during development
- `export_model.py`: Trains the model, dumps it as JSON tree format for the TypeScript port

### Model Files in Backend
| File | Size | Description |
|---|---|---|
| `xgboost_model.json` | 114 MB | Full model dump (all tree details) — NOT copied to frontend |
| `xgboost_model_compact.json` | 6.8 MB | Compact model |
| `xgboost_full.json` | 5.8 MB | Another export variant |

The **7.1 MB** `xgboost_model.json` in `src/lib/` is the one actually used by the frontend TypeScript inference.

---

## 11. Machine Learning Pipeline

### Dataset (`karnataka_weather_500.csv`)
- ~500+ rows of synthetic/generated weather data for Karnataka
- Columns: `MinTemp`, `MaxTemp`, `Humidity`, `Pressure`, `WindSpeed`, `Condition`
- Target classes: `Cloudy`, `Foggy`, `Rainy`, `Stormy`, `Sunny`, `Windy` (6 classes)

### Feature Engineering (identical in Python and TypeScript)
From 5 raw inputs, 10 derived features are created:

| Feature | Formula | Meteorological Meaning |
|---|---|---|
| TempRange | MaxTemp - MinTemp | Daily temperature swing |
| TempMean | (MaxTemp + MinTemp) / 2 | Average daily temperature |
| HumidityWind | Humidity × WindSpeed / 100 | Combined moisture-wind energy |
| PressureAnomaly | 1013.25 - Pressure | Departure from standard pressure |
| StormIndex | (hum/100) × (wind/75) × (clip(PA,0)/25 + 0.3) | Storm likelihood composite |
| HeatDryIndex | (MaxTemp/45) × (1 - hum/100) | Hot-dry conditions indicator |
| FogIndex | clip(1-(minT-10)/18,0,1) × (hum/100) × clip(1-wind/75,0,1) | Fog formation likelihood |
| HumidityHigh | (clip(hum-70,0)/30)² | Quadratic push above 70% humidity |
| HumidityLow | (clip(50-hum,0)/50)² | Quadratic push below 50% humidity |
| WindPower | (wind/75)^1.5 | Non-linear wind energy |

Total: **15 features** fed to the model.

### Training
1. SMOTE oversampling balances class representation
2. XGBoost trained with `multi:softprob` — outputs probability per class
3. 500 estimators × 6 classes = 3000 decision trees total

### Inference (TypeScript)
```typescript
engineerFeatures(input) → float[15]
for i in range(model.trees.length):
    cls = i % numClass
    scores[cls] += predictTree(model.trees[i], features)
probs = softmax(scores)
mlLabel = model.classes[argmax(probs)]
mlConfidence = max(probs)
[finalLabel, finalConfidence] = applyRuleOverrides(input, mlLabel, mlConfidence)
```

### Tree Traversal (TypeScript)
```typescript
function predictTree(node, features):
    if 'leaf' in node: return node.leaf
    featIdx = parseInt(node.split.slice(1))  // e.g., "f3" → 3
    val = features[featIdx]
    childId = val <= node.split_condition ? node.yes : node.no
    child = node.children.find(c => c.nodeid === childId)
    return predictTree(child, features)
```

### Rule Overrides (applied post-ML, both Python and TypeScript)
Priority order (first match wins):
1. `hum >= 88 AND wind >= 40` → **Stormy** (min confidence 0.88)
2. `hum >= 88 AND wind >= 5` → **Rainy** (0.82)
3. `hum >= 85 AND wind >= 15` → **Rainy** (0.84)
4. `hum >= 92 AND wind >= 3` → **Rainy** (0.80)
5. `hum >= 40 AND wind <= 15 AND minT <= 18 AND maxT <= 26` → **Foggy** (0.78)
6. `hum >= 70` → **Cloudy** (0.80)
7. `wind >= 30` → **Windy** (0.82)
8. `maxT >= 26 AND hum <= 55` → **Sunny** (0.85)
9. fallback → ML label + ML confidence

### Confidence
The confidence is `max(softmax(scores))` from the model, then boosted to the rule minimum if a rule fires. Displayed as `Math.round(confidence * 100)%` in the result page.

---

## 12. API Documentation

### Next.js API Route: POST `/api/predict`

**Method**: POST  
**Route**: `/api/predict`  
**Auth**: None  
**Content-Type**: `application/json`

**Input**:
```json
{
  "minTemp": 18.0,
  "maxTemp": 30.0,
  "humidity": 60.0,
  "pressure": 1010.0,
  "windSpeed": 20.0
}
```

**Validation**: All 5 fields must be present and `typeof === 'number'`. Returns 400 if invalid.

**Output** (200):
```json
{
  "condition": "Sunny",
  "confidence": 0.85
}
```

**Error** (400):
```json
{ "error": "Invalid input. All fields must be numbers." }
```

**Error** (500):
```json
{ "error": "Internal server error" }
```

**Example request**:
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"minTemp":18,"maxTemp":30,"humidity":60,"pressure":1010,"windSpeed":20}'
```

**Example response**:
```json
{ "condition": "Cloudy", "confidence": 0.80 }
```

---

### Next.js API Route: GET `/api/image`

**Method**: GET  
**Route**: `/api/image?url=<encoded_url>`  
**Auth**: None  
**Purpose**: Reverse proxy for Wikipedia images to bypass CORS restrictions

**Input**: Query param `url` — must be a full URL whose hostname ends with `upload.wikimedia.org`

**Validation**: URL must be valid and hostname must be whitelisted. Returns 400/403 if invalid.

**Output** (200): Raw image bytes with original `Content-Type` and `Cache-Control: public, max-age=86400`

**Errors**:
- 400: Missing/invalid URL
- 403: Host not in allowlist
- Upstream status: Forwarded from Wikipedia

---

### Next.js Route: GET `/auth/callback`

**Method**: GET  
**Route**: `/auth/callback?code=<code>&next=<path>`  
**Purpose**: Supabase OAuth PKCE code exchange

**Behavior**:
- Exchanges `code` param for session cookies via `supabase.auth.exchangeCodeForSession(code)`
- Redirects to `origin + next` (default: `/map`) on success
- Redirects to `origin + '?error=auth_failed'` on failure

---

### Python Backend: POST `http://localhost:8000/predict`

**Method**: POST  
**Route**: `/predict`  
**Auth**: None  
**Content-Type**: `application/json`

**Input**:
```json
{
  "minTemp": 18.0,
  "maxTemp": 30.0,
  "humidity": 60.0,
  "pressure": 1010.0,
  "windSpeed": 20.0
}
```

**Output** (200):
```json
{ "condition": "Rainy", "confidence": 0.84 }
```

**Error** (503): Model still loading (training not complete)
```json
{ "error": "Model still loading" }
```

**CORS**: Allows all origins (`*`), all methods, all headers.

---

## 13. Database

### Provider: Supabase (PostgreSQL)
- **Custom tables**: None. No application-level tables are defined.
- **Auth table**: Supabase managed `auth.users` — stores user records
- **User metadata**: Stored in `auth.users.user_metadata` (JSONB) — fields: `name` (string), `avatar_url` (base64 string)
- **Indexes**: Managed by Supabase on `auth.users.id`, `auth.users.email`
- **Policies**: Default Supabase RLS policies on auth tables
- **Storage buckets**: None configured — avatars stored as base64 in user metadata (not in Storage)
- **Session storage**: Supabase handles JWT storage in browser (cookies + localStorage)

---

## 14. Environment Variables

| Variable | Example Value | Purpose | Used In |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dtuoemqcnwnwkojyifsq.supabase.co` | Supabase project URL | `src/lib/auth.ts` (getClient), `/auth/callback/route.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (JWT) | Supabase anonymous public key | `src/lib/auth.ts` (getClient), `/auth/callback/route.ts` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Python backend base URL | `src/app/predict/page.tsx` |

All three are `NEXT_PUBLIC_` — exposed to the browser bundle. No server-only environment variables exist.

The anon key is safe to expose publicly (Supabase design — it only allows operations permitted by Row Level Security policies).
# Karnataka Weather — Architectural Report (Part 3 of 3)

---

## 15. Data Libraries

### `src/lib/auth.ts` — AuthManager
Singleton class providing all authentication operations.

```typescript
class AuthManager {
  static getClient(): SupabaseClient  // Lazy singleton supabase client
  static signup(name, email, password): Promise<void>
  static login(email, password): Promise<void>
  static signInWithGoogle(): Promise<void>
  static logout(): Promise<void>
  static current(): Promise<User | null>  // calls supabase.auth.getUser()
  static getProfile(): Promise<{ name, email, avatarUrl }>
  static updateProfile(name): Promise<void>
  static uploadAvatar(file): Promise<string>  // resizes to 150px, stores base64
}
```

Avatar upload detail:
1. Create `<canvas>` element
2. `ctx.drawImage(img, 0, 0, 150, 150)` 
3. `canvas.toDataURL('image/jpeg', 0.8)` → base64 string
4. `supabase.auth.updateUser({ data: { avatar_url: thumbnail } })`
5. `localStorage.setItem('avatar_' + user.id, thumbnail)` (cache)

---

### `src/lib/xgboost.ts` — In-browser ML Engine
Full client-side XGBoost inference.

```typescript
// Imports JSON model (7.1 MB) — bundled into Next.js chunk
import modelData from './xgboost_model.json'

interface ModelData {
  trees: XGBNode[]
  classes: string[]         // ['Cloudy','Foggy','Rainy','Stormy','Sunny','Windy']
  feature_names: string[]   // 15 feature names
  n_estimators: number      // 500
  num_class: number         // 6
  learning_rate: number     // 0.05
}

interface XGBNode {
  nodeid: number
  depth: number
  split?: string           // e.g. "f7" (feature index 7)
  split_condition?: number
  yes?: number             // child nodeid for true branch
  no?: number              // child nodeid for false branch
  children?: XGBNode[]
  leaf?: number            // leaf value (only on leaf nodes)
}

function engineerFeatures(input): number[15]
  → Same formula as Python engineer_features()

function predictTree(node, features): number
  → Recursively traverse tree
  → At split: compare features[featureIndex] to split_condition
  → Return leaf value at terminal node

function predict(input): { condition, confidence, probabilities }
  → scores[6] = 0
  → for each tree i: scores[i % 6] += predictTree(tree[i], features)
  → probs = softmax(scores)
  → mlLabel = classes[argmax(probs)]
  → applyRuleOverrides() → finalLabel, finalConfidence

function applyRuleOverrides(input, mlLabel, mlConfidence): [string, number]
  → Same cascaded rules as Python version
```

**Performance consideration**: 3000 tree traversals per prediction call. No Web Worker used — runs on main thread. No benchmarks available but likely < 500ms on modern hardware given the shallow tree depth.

---

### `src/lib/karnatakaDistricts.ts`

Contains `GEO_DATA: DistrictData[]` — an array of all Karnataka districts with SVG polygon data.

```typescript
interface DistrictData {
  id: string           // e.g. "Mysuru", "BengaluruUrban"
  name: string         // Display name: "Mysuru", "Bengaluru Urban"
  capital?: string     // District capital city
  lat: number          // Centroid latitude
  lng: number          // Centroid longitude  
  paths: string[]      // Array of SVG path `d` attribute strings
  labelOffset?: { x: number, y: number }  // SVG label positioning adjustment
}
```

Data coverage: 30 districts. Districts with multiple polygons (e.g., coastal Uttara Kannada, island-like boundaries) have multiple entries in `paths[]`.

SVG coordinate space: 500×560 units. Districts use `lngToX`/`latToY` projection from map page.

---

### `src/lib/cities.ts`

```typescript
interface City {
  name: string    // "Bengaluru", "Mysuru", etc.
  lat: number     // Latitude
  lng: number     // Longitude
  region: string  // "South", "Malnad", "Central", "Hyderabad-KA", "North", "Coastal"
}

const CITIES: City[]  // 21 cities

function toScene(lat, lng): { x: number, y: number }
  → x = (lng - 76.3) * 1.8
  → y = (lat - 14.9) * 1.8
  // Projects real-world coordinates to Three.js scene space
```

**Regions**:
- South: Bengaluru, Mysuru, Tumakuru, Hassan, Mandya
- Malnad: Chikkamagaluru, Shivamogga, Kodagu
- Central: Davanagere, Chitradurga
- Hyderabad-KA: Ballari, Kalaburagi, Bidar, Raichur
- North: Hubli, Dharwad, Belagavi, Gadag, Vijayapura
- Coastal: Mangaluru, Udupi

---

### `src/lib/karnatakaBorder.ts`

62 `[lng, lat]` coordinate pairs tracing Karnataka's border.
Projected to Three.js scene: `x = (lng - 76.3) * 1.8, y = (lat - 14.9) * 1.8`.
Center of projection: approximately [76.3°E, 14.9°N] — center of Karnataka.

---

### `src/lib/weatherContent.ts`

`WEATHER_CONTENT: Record<string, WeatherContent>` — 6 entries (one per condition).

```typescript
interface WeatherContent {
  title: string           // "Sunny", "Cloudy", etc.
  subtitle: string        // Editorial tagline
  heroImage: string       // Unsplash URL (unused in current result layout)
  description: string     // 1-2 sentence description
  cards: {                // 3 cards
    image: string         // Unsplash URL
    title: string
    text: string          // 2-3 sentences
    alt: string
    fallbackImage?: string
  }[]
  travel: {               // 3 travel destinations
    destination: string
    image: string         // Unsplash URL
    description: string
    bestTime: string
    tip: string
    fallbackImage?: string
  }[]
  tips: string[]          // 5 pro tips
}
```

All images sourced from Unsplash (free CDN). `fallbackImage` used if primary image errors (via `onError` handler).

---

### `src/lib/districtContent.ts`

`DISTRICT_CONTENT: Record<string, DistrictContent>` — ~30 entries (one per district).

```typescript
interface DistrictContent {
  cards: { image, title, text, alt, fallbackImage? }[]
  travel: { destination, image, description, bestTime, tip, fallbackImage? }[]
  tips: string[]
}
```

**Image sources**: Three helper functions:
- `IMG(id)`: Unsplash — `https://images.unsplash.com/${id}?fm=jpg&q=60&w=1200...`
- `PEX(id)`: Pexels — `https://images.pexels.com/photos/${id}/...`
- `WIKI(path)`: Wikimedia Commons — `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`

Wikipedia images go through `/api/image` proxy to bypass CORS. Unsplash and Pexels images are loaded directly.

**Districts covered** (30): Bagalkote, Ballari, Belagavi, BengaluruRural, BengaluruUrban, Bidar, Chamarajanagara, Chikkaballapura, Chikkamagaluru, Chitradurga, DakshinaKannada, Davanagere, Dharwad, Gadag, Hassan, Haveri, Kalaburagi, Kodagu, Kolar, Koppal, Mandya, Mysuru, Raichur, Ramanagara, Shivamogga, Tumakuru, Udupi, UttaraKannada, Vijayanagara, Vijayapura, Yadgir.

**District key normalization** (result page):
```typescript
const aliases = {
  'Bengaluru': 'BengaluruUrban',
  'Bangalore': 'BengaluruUrban',
  'Mysore': 'Mysuru',
  'Gulbarga': 'Kalaburagi',
  'Belgaum': 'Belagavi',
  'Shimoga': 'Shivamogga',
  'Tumkur': 'Tumakuru',
  'Mangalore': 'DakshinaKannada',
  'Mangaluru': 'DakshinaKannada',
  'Hubli': 'Dharwad',
  'Bijapur': 'Vijayapura',
  'Hospet': 'Vijayanagara',
  'Hampi': 'Vijayanagara',
  'Coorg': 'Kodagu',
}
```

---

### `src/lib/utils.ts`

```typescript
import { clsx } from 'clsx'
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
```

Simple class merger. Used in shadcn-style UI components (Button, Badge, Card, GlassButton).

---

## 16. CSS Architecture

### `src/app/globals.css`

**Structure**:
1. Google Fonts `@import`
2. Tailwind `@tailwind base; @tailwind components; @tailwind utilities`
3. `:root` CSS custom properties (color tokens)
4. `*` reset (`box-sizing: border-box; margin: 0; padding: 0`)
5. `html, body` — `height: 100%; overflow-x: hidden; background: var(--color-bg); color: var(--color-text-primary); font-family: Montserrat`
6. `input[type="range"]` global styles — removes default appearance, sets height 6px, transparent background
7. `input[type="range"]::-webkit-slider-thumb` — 18px × 18px circle, saddlebrown background, white border
8. CSS keyframes: `centerPulse`, `centerPing`, `nodePulse`, `float` (alias: `float-element`)
9. `.login-field input` — form field styles
10. `.glass-button-*` class styles for GlassButton component

**Key global effects**:
- All `img` elements have `object-fit: cover` if using `.card-image` class
- Smooth scroll behavior is handled by Lenis (not `scroll-behavior: smooth` CSS)
- No CSS reset library — manual `*` reset

### Inline `<style>` Scoping Pattern
Several pages use `<style>{`...`}</style>` JSX to inject page-scoped CSS. These are **not truly scoped** (no CSS modules or Shadow DOM) — they inject into the global stylesheet. Components that do this:
- `LoadingScreen.tsx`: All cube + letter animation keyframes
- `PredictPage` (`predict/page.tsx`): `.env-slider` and orbital-related styles, `orbDrift` keyframe
- `MapPage` (`map/page.tsx`): Map-specific styles, `pulse` keyframe for selected dot

**Risk**: Naming collisions are possible if the same class names appear in multiple components simultaneously. Currently safe because pages don't co-render.

### CSS Modules
**Not used**. The project uses TailwindCSS utilities (rare, mostly for utility classes) and inline styles (dominant pattern) + global CSS classes.

### Tailwind Usage
Tailwind is used minimally:
- `GlassButton`: `relative isolate all-unset cursor-pointer rounded-full transition-all text-base font-medium px-6 py-3.5`
- `Badge`: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2`
- `Button`: Standard shadcn button classes
- **Most pages**: Zero Tailwind usage — all inline styles

---

## 17. Build & Runtime

### Next.js Configuration (`next.config.mjs`)
Empty default configuration — no custom webpack, no image domains (images loaded directly from Unsplash/Pexels, not via Next.js Image component), no env overrides, no headers config.

### TypeScript (`tsconfig.json`)
- Target: ES2017
- Lib: `["dom", "dom.iterable", "esnext"]`
- Module: ESNext, bundler resolution
- Strict mode: true
- JSX: preserve
- Path alias: `@/*` → `./src/*`
- Not emitting JS (Next.js handles compilation)

### PostCSS (`postcss.config.mjs`)
- Plugin: `@tailwindcss/postcss` — TailwindCSS v4 PostCSS plugin

### Scripts (`package.json`)
```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

`--turbopack`: Uses Rust-based Turbopack bundler for dev (experimental, faster HMR).

### How to Run
**Frontend**:
```powershell
cd "c:\Users\chara\Downloads\latest karnataka-weather\karnataka-weather"
npm install
npm run dev
# Runs at http://localhost:3000
```

**Backend**:
```powershell
cd backend
# Activate venv:
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
# ~30-60 seconds for model training on startup
```

**Export model for TypeScript**:
```powershell
cd backend
.\venv\Scripts\activate
python export_model.py
# Outputs xgboost_model.json (114 MB full) to backend/
# Copy relevant model to src/lib/xgboost_model.json
```

### Bundle Concerns
- **`xgboost_model.json` (7.1 MB)** is imported statically and bundled into the JavaScript chunk. This is the largest single asset.
- **`karnatakaDistricts.ts` (82 KB)** and **`districtContent.ts` (86 KB)** are also bundled statically.
- Three.js adds ~500KB gzipped to the bundle.
- No code splitting configured beyond Next.js App Router defaults (each route is a separate chunk).
- Dynamic imports with `ssr: false` for all 6 background components — they are lazy-loaded per condition.

---

## 18. Known Patterns & Conventions

### Data Flow Pattern
All data flows **down via props** or **up via callbacks**. No global state library (no Redux, no Zustand, no Context). The only "global" state is:
- Supabase session (managed by Supabase SDK in browser)
- URL params (the result page state is entirely in the URL)
- `localStorage` (avatar cache only)

### URL-as-State Pattern
The predict → result transition passes **all necessary data as URL search params**. The result page reads only from the URL and renders accordingly. This means:
- Deep linking works (bookmark a result URL and it re-renders correctly)
- Refresh works (no lost state)
- No server-side session or localStorage needed for result data

### Fetch-then-Navigate Pattern
```
handleSubmit():
  loading = true
  result = await fetch('/predict', {...})
  router.push('/result?' + params)
```
No result state is stored — the navigation itself carries data.

### Quick Preview Pattern
The 6 preset buttons skip the API call entirely, directly constructing result URL with hardcoded `condition=Sunny/Rainy/...&confidence=0.9&...`. This allows fast exploration without API latency.

### Fallback Cascade Pattern
Three levels of prediction:
1. **Python backend** (best, full ML model with SMOTE training)
2. **Next.js /api/predict** (client-side XGBoost tree traversal, no SMOTE)
3. **Inline rule-based** (deterministic, catches clear meteorological patterns)

### Inline Style Dominance
Most complex UI is built with `style={{}}` inline objects. This was a deliberate choice to enable precise, per-element control without class naming overhead, and to easily derive styles from state variables (e.g., `isDark`, `accentColor`, slider `pct`).

### Image Fallback Pattern
```tsx
<img
  src={item.image}
  onError={(e) => { e.currentTarget.src = item.fallbackImage || defaultImg }}
  alt={item.alt}
/>
```
Primary images: Unsplash/Pexels/Wikipedia. Fallback: alternative Unsplash URL.

### SVG District Paths
Each district in `karnatakaDistricts.ts` stores actual SVG path `d` strings. These were pre-computed from GeoJSON Karnataka district data and stored as static data to avoid runtime GeoJSON parsing.

---

## 19. Known Technical Considerations

### Model Bundle Size
The 7.1 MB `xgboost_model.json` bundled into `src/lib/` will be included in the JavaScript bundle. This will:
- Increase initial page load time significantly on slow connections
- Be cached by the browser after first load
- **Mitigation options** (not yet implemented): lazy load the model JSON only when `/predict` is visited, or move inference entirely to the Python backend

### No Middleware Authentication
Route protection is purely client-side (`useEffect` → `AuthManager.current()` → redirect). Server-side middleware authentication (via Next.js `middleware.ts`) is not implemented. A user with a crafted URL could briefly see a protected page before the redirect fires.

### CORS on Python Backend
`allow_origins=["*"]` — completely open CORS. Acceptable for local development but must be restricted for production (to the Next.js app domain).

### Model Training Race Condition
The Python backend sets `model = clf` only after training completes (~30-60s). Requests during training return 503. The frontend has no retry mechanism — a 503 immediately falls back to client-side rules.

### Image Proxy Whitelist
`/api/image` only allows `upload.wikimedia.org`. Images from Pexels and Unsplash are loaded directly in `<img>` tags, which may have CORS implications in certain browser security contexts but works in practice since these CDNs return permissive CORS headers.

### District Key Normalization
The `DISTRICT_CONTENT` keys use specific casing (e.g., `BengaluruUrban`, `DakshinaKannada`). The result page has an alias map. If a new district is added to the map that doesn't match a content key or alias, it will silently fall back to generic weather content without district enrichment.

### EnvironmentalSlider Not Wired
`EnvironmentalSlider.tsx` exists but is not used in any page. `OrbitalPredict` has its own inline slider. The `EnvironmentalSlider` was likely an earlier iteration.

### Three.js Systems Not Used in Current Routes
`AtmosphereEngine`, `KarnatakaTerrain`, and `DistrictNodes` are fully built but not imported by any current page. They may be remnants of a 3D map concept that was replaced by the SVG map. They add to the bundle if Next.js tree-shaking doesn't eliminate them.

---

## 20. Deployment Notes

### Current Setup
Local development only. No production deployment configured.

### Frontend Deployment (if needed)
- **Vercel** (recommended for Next.js): `vercel --prod`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` must be set in Vercel project settings
- `NEXT_PUBLIC_API_URL` must point to a live Python backend URL (not `localhost:8000`)

### Backend Deployment (if needed)
- Requires Python 3.10+
- `karnataka_weather_500.csv` must be present in working directory on startup
- `pip install -r requirements.txt`
- `python main.py` or `uvicorn main:app --host 0.0.0.0 --port 8000`
- For production: set CORS `allow_origins` to frontend domain only
- Training takes ~30-60s on startup — plan for warm-up time

### Supabase Setup
- Create Supabase project
- Enable Email/Password and Google OAuth providers in Authentication settings
- Set Google OAuth redirect URL: `<frontend_domain>/auth/callback`
- No SQL migrations needed (no custom tables)

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
NEXT_PUBLIC_API_URL=https://<backend_domain>
```

---

## 21. Quick Reference for Future Development

### Adding a New Weather Condition
1. Add a new background in `src/systems/weather/backgrounds/<Condition>Background.tsx`
2. Add case to `src/systems/weather/WeatherBackground.tsx` switch statement
3. Add entry to `src/lib/weatherContent.ts` `WEATHER_CONTENT` object
4. Add color mapping in result page `conditionStyle` object
5. Add stickman pose to `WeatherStickman` in result page
6. Add rule override in `src/lib/xgboost.ts` `applyRuleOverrides()`
7. Mirror rule in `backend/main.py` `apply_rule_overrides()`
8. Retrain ML model if desired (add samples to CSV, re-run export_model.py, replace JSON)

### Adding a New District
1. Add SVG path data to `src/lib/karnatakaDistricts.ts` `GEO_DATA` array
2. Add content entry to `src/lib/districtContent.ts` `DISTRICT_CONTENT`
3. If district name differs from content key, add alias to result page `aliases` object
4. Optionally add to `src/lib/cities.ts` for Three.js scene city nodes

### Changing the ML Model
1. Modify `backend/main.py` feature engineering or hyperparameters
2. Run `python export_model.py` in backend directory
3. Copy output to `src/lib/xgboost_model.json`
4. Ensure `engineerFeatures()` in `src/lib/xgboost.ts` matches Python `engineer_features()`
5. Ensure `applyRuleOverrides()` in TypeScript matches Python version

### Running a Quick Prediction Test
```bash
# Python backend (fast)
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"minTemp":15,"maxTemp":22,"humidity":85,"pressure":1008,"windSpeed":12}'

# Next.js API (when dev server running)
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"minTemp":15,"maxTemp":22,"humidity":85,"pressure":1008,"windSpeed":12}'
```

### Input Range Reference
| Variable | Min | Max | Unit | Default |
|---|---|---|---|---|
| Min Temperature | 10 | 28 | °C | 18 |
| Max Temperature | 18 | 45 | °C | 30 |
| Humidity | 10 | 100 | % | 60 |
| Pressure | 990 | 1030 | hPa | 1010 |
| Wind Speed | 0 | 75 | km/h | 20 |

### Condition Trigger Guide (Rule Overrides)
| Condition | Humidity | Wind | Min Temp | Max Temp |
|---|---|---|---|---|
| Stormy | ≥88% | ≥40 km/h | any | any |
| Rainy | ≥88% | ≥5 km/h | any | any |
| Rainy | ≥85% | ≥15 km/h | any | any |
| Foggy | ≥40% | ≤15 km/h | ≤18°C | ≤26°C |
| Cloudy | ≥70% | any | any | any |
| Windy | any | ≥30 km/h | any | any |
| Sunny | ≤55% | any | any | ≥26°C |

---

*Report generated: 2026-07-19. Covers codebase as of latest commit in `c:\Users\chara\Downloads\latest karnataka-weather\karnataka-weather`. All source files verified by direct inspection.*
