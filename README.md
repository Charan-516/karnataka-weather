# Karnataka Weather

A cinematic ML-powered weather prediction platform for the 30 districts of Karnataka, India. Users select a district on an interactive SVG map, adjust five atmospheric variables (humidity, pressure, wind speed, min/max temperature), and receive a weather classification backed by a 100-tree XGBoost model that runs entirely in the browser's API route — no Python backend required. The result is displayed on a full-screen page with a Canvas 2D weather animation, parallax-scrolled content, travel recommendations, and condition-specific styling.

## Techniques

- **SVG map with mouse-following tooltip** — The district selector at [`src/app/map/page.tsx`](src/app/map/page.tsx) renders 30 GeoJSON-derived polygons as SVG `<path>` elements. Hover tracking via `onMouseMove` positions a fixed div at `e.clientX/clientY`, while `onMouseLeave` hides it. Click state toggles fill opacity and enables the "Continue" pill button.
- **Orbital UI with click-to-expand cards** — The predict page at [`src/systems/sliders/OrbitalPredict.tsx`](src/systems/sliders/OrbitalPredict.tsx) arranges five parameter nodes in a circle using `Math.cos`/`Math.sin`. Clicking a node triggers `requestAnimationFrame`-based rotation that snaps the target to the 12-o'clock position via `shortestAngleDelta`, then reveals an expanded card with a range slider. Auto-rotation resumes when the card is dismissed.
- **Canvas 2D weather backgrounds** — Six condition-specific components at [`src/systems/weather/backgrounds/`](src/systems/weather/backgrounds/) draw directly to a `<canvas>` via `requestAnimationFrame`. Techniques include radial gradients for atmospheric glow, arc-based particle fields (200 raindrops, 120 wind streaks), per-frame `Date.now()`-derived alpha pulsation, and [`ctx.save()`/`ctx.restore()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save) for layered lightning flashes in `StormyBackground.tsx`.
- **Serverless XGBoost inference in TypeScript** — A 6.8 MB JSON model dump (100 trees, 6 classes, max depth 8) is loaded at module scope in [`src/lib/xgboost.ts`](src/lib/xgboost.ts). Each tree is a JSON node graph walked recursively by `predictTree()`. The function [`softmax()`](https://en.wikipedia.org/wiki/Softmax_function) normalises class scores. Rule-based overrides then correct meteorological blind spots (e.g., `humidity >= 88 && windSpeed >= 5 → Rainy`).
- **Client-side fallback with mirrored rules** — The predict page at [`src/app/predict/page.tsx`](src/app/predict/page.tsx) includes an identical copy of the API's rule chain. If the `fetch` to `/api/predict` fails, the page navigates directly to the result page with the fallback prediction — the user never sees an error state.
- **Parallax zoom via scroll listener** — The result page at [`src/app/result/page.tsx`](src/app/result/page.tsx) attaches a [`scroll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) event listener (with `{ passive: true }`) that scales the sticky hero section from `1` to `0.88` and fades its opacity to `0` as the user scrolls past one viewport height.
- **Auto-disconnecting IntersectionObserver** — The `useScrollReveal` hook in `src/app/result/page.tsx:27` creates an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) that fires once per element, then calls `obs.unobserve(el)` to stop watching. This powers the sequential reveal of content cards, travel rows, and tips.
- **Canvas-resized avatar uploads** — [`src/lib/auth.ts:108`](src/lib/auth.ts:108) loads the user's selected photo into a hidden `<img>`, draws it to a `<canvas>` at max 150 px via `CanvasRenderingContext2D.drawImage`, then exports as a JPEG data URL. The thumbnail is stored in Supabase `user_metadata` and cached to `localStorage` as a fallback when the metadata payload is silently dropped.
- **CSS-only orbital breathing** — Three `@keyframes` in `globals.css:48-58` — `centerPulse`, `centerPing`, and `nodePulse` — create a pulsing core and orbiting glow effect using only CSS. The central orb uses two concentric `<div>` elements with staggered `animation-delay`.
- **Dynamic import with `ssr: false`** — The weather backgrounds at [`src/app/result/page.tsx:11`](src/app/result/page.tsx:11) and the `OrbitalPredict` component are loaded with [`next/dynamic`](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading) and `{ ssr: false }` to prevent server-side errors when accessing browser-only APIs like `CanvasRenderingContext2D`.
- **Meteorological feature engineering** — The `engineerFeatures()` function in [`src/lib/xgboost.ts:40`](src/lib/xgboost.ts:40) derives 15 features from 5 raw inputs: `tempRange`, `tempMean`, `humidityWind`, `pressureAnomaly`, `stormIndex`, `heatDryIndex`, `fogIndex`, `humidityHigh`, `humidityLow`, and `windPower`. These are the same features the Python model was trained on.

## Libraries & Fonts

- **[Framer Motion](https://motion.dev)** — Spring-based entry animations: fade-up with blur, scale-in, and staggered delays on all pages.
- **[Lenis](https://github.com/studio-freight/lenis)** — Smooth scrolling with custom cubic easing. Configured at [`src/components/layout/LenisProvider.tsx`](src/components/layout/LenisProvider.tsx) with `duration: 1.2` and `easing: (t) => 1 - Math.pow(1 - t, 3)`.
- **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Authentication via `@supabase/ssr`. Supports email/password signup and Google OAuth with a callback route at [`src/app/auth/callback/route.ts`](src/app/auth/callback/route.ts).
- **[Lucide React](https://lucide.dev)** — Icon set for the orbital variable nodes: Droplets (humidity), Gauge (pressure), Wind (wind speed), Thermometer (min temp), Sun (max temp).
- **[Playfair Display](https://fonts.google.com/specimen/Playfair+Display)** — Serif headings, district names, and large condition text on the result page.
- **[Space Mono](https://fonts.google.com/specimen/Space+Mono)** — Monospace for labels, metadata, button text, and small UI elements.
- **[Montserrat](https://fonts.google.com/specimen/Montserrat)** — Sans-serif body text throughout.

## Project Structure

```
karnataka-weather/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── public/                          # Static assets (SVG icons)
├── backend/                         # Python training scripts and CSV dataset
├── src/
│   ├── app/
│   │   ├── globals.css              # Design tokens, keyframes, input range styles
│   │   ├── layout.tsx               # Root layout, font imports, LenisProvider
│   │   ├── page.tsx                 # Login/signup with 6-split weather backgrounds
│   │   ├── map/page.tsx             # SVG district selector (30 districts)
│   │   ├── predict/page.tsx         # Orbital variable sliders + 6 preset buttons
│   │   ├── result/page.tsx          # Full cinematic result page
│   │   ├── api/predict/route.ts     # POST /api/predict — XGBoost inference
│   │   └── auth/callback/route.ts   # Supabase OAuth exchange endpoint
│   ├── components/
│   │   ├── layout/LenisProvider.tsx  # Smooth-scroll provider component
│   │   └── ui/                      # Shadcn primitives (installed, unused)
│   ├── lib/
│   │   ├── auth.ts                  # Supabase AuthManager
│   │   ├── xgboost.ts              # TypeScript XGBoost inference engine
│   │   ├── xgboost_model.json      # 6.8 MB model (100 trees, 6 classes)
│   │   ├── utils.ts                 # cn() classname helper
│   │   ├── weatherContent.ts        # Copy for all 6 weather conditions
│   │   ├── districtContent.ts       # Copy for 28 district travel guides
│   │   ├── cities.ts                # Legacy city coordinates (21 entries)
│   │   ├── karnatakaDistricts.ts    # 30-district GeoJSON polygon data
│   │   └── karnatakaBorder.ts       # Simplified Karnataka outline
│   └── systems/
│       ├── weather/
│       │   ├── WeatherBackground.tsx      # Dynamic import router for 6 canvases
│       │   └── backgrounds/              # Canvas 2D per-condition renderers
│       ├── sliders/OrbitalPredict.tsx     # Orbital node + expand card UI
│       └── (legacy)
│           ├── atmosphere/               # Three.js atmosphere components
│           └── terrain/                  # Three.js terrain components
```

The **`src/systems/weather/backgrounds/`** directory contains six `'use client'` components — one per weather condition — each of which renders a continuous `requestAnimationFrame` loop on a fixed `<canvas>`. The **`backend/`** directory holds the original Python training pipeline (FastAPI, XGBoost, SMOTE) and the export script that produced `xgboost_model.json`. The **`src/lib/`** directory contains all data files: district polygons, weather copy, travel guides, and the TypeScript ML engine with its model JSON. The **`src/systems/atmosphere/`** and **`src/systems/terrain/`** directories contain legacy Three.js components that are no longer imported by any active page.

## Run

```powershell
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

No Python backend — inference runs inside Next.js.
