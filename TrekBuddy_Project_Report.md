## TrekBuddy Website — Architecture & Project Analysis Report

**Workspace**: `D:/TrekBuddywebsite`  
**Framework**: Next.js **16.1.x** (App Router) + React **19** + TypeScript  

### 1. System overview
**TrekBuddy** is a Puducherry-focused travel web app with two primary experiences:

- **User dashboard**: categories/places discovery, trip planning, chat assistant, transit info, events, emergency info, profile/settings.
- **Admin console**: CRUD for places/categories/events/transit, plus an image-search + upload pipeline for place media.

The app is designed as a modern **client-heavy Next.js App Router** application with Firebase as the backend (Auth, Firestore, Storage) and Groq powering AI chat responses.

### 2. Tech stack (confirmed from repo)

#### Runtime & framework
- **Next.js**: `next@^16.1.6` (App Router under `src/app/`)
- **React**: `react@19.2.3`, `react-dom@19.2.3`
- **TypeScript**: `typescript@^5`, strict mode enabled (`tsconfig.json`)

#### UI / design system
- **Tailwind CSS v4**: `tailwindcss@^4` with PostCSS plugin `@tailwindcss/postcss` (`postcss.config.mjs`)
- **Radix UI primitives**: multiple `@radix-ui/react-*`
- **shadcn-style setup**: `components.json` indicates `components/ui`, `@/lib/utils`, RSC enabled
- **Icons**: `lucide-react`
- **Toasts**: `sonner`
- **Theme**: `next-themes` (ThemeProvider used in root layout)

#### Animations
- **framer-motion**: used broadly on landing/dashboard pages for transitions and micro-interactions
- **tw-animate-css**: utility animation helpers

#### Backend / data / infra
- **Firebase**: `firebase@^12.7.0`
  - Auth, Firestore, Storage (initialized in `src/lib/firebase.ts`)
- **SEO**: `next-sitemap` (postbuild runs sitemap generation)
- **Images**: Next Image config permits `images.unsplash.com` (`next.config.ts`)

#### AI
- **Groq SDK**: `groq-sdk@^0.37.0`
  - Route-handler streaming at `src/app/api/chat/route.ts`
  - Optional reusable wrapper in `src/lib/groq.ts`

#### Testing & tooling
- **ESLint**: flat config extends `next/core-web-vitals` + `next/typescript` (`eslint.config.mjs`)
- **Jest**: `jest@^30`

#### Mobile packaging
- **Capacitor**: `@capacitor/*@^8.1.0`
  - `capacitor.config.ts` uses `webDir: 'out'` (intended for web export/output used by native shell)

### 3. Folder / module structure (what each directory does)

```text
D:/TrekBuddywebsite
├─ src/
│  ├─ app/            Next.js App Router routes + layouts + API route handlers
│  ├─ components/     UI + feature components (layout, admin, planner, ui primitives)
│  ├─ context/        React context providers (AuthProvider)
│  ├─ hooks/          Custom hooks (admin auth, etc.)
│  ├─ lib/            Shared integrations/utilities (Firebase init, Groq, prompts, admin helpers)
│  ├─ services/       Domain services (transit fetching, currency data, datasets used by AI chat, etc.)
│  ├─ types/          Shared TypeScript models (admin/domain types)
│  ├─ utils/          Seeders & utilities (e.g., transit seed dataset + writer)
│  ├─ data/           Static JSON/data (content referenced by UI)
│  └─ constants/      Shared constants
├─ public/            Static assets + generated sitemap/robots
├─ scripts/           One-off scripts (seeding/import helpers)
├─ tests/             Jest tests
└─ TrekBuddy_Project_Report.md  (this document)
```

**Important correction**: there is **no** `src/middleware.ts` in this repo. The admin edge-guard logic lives in `src/proxy.ts` (details below). For it to actually execute as Next middleware, it typically must be named/exported appropriately (see Recommendations).

### 4. Routing & application structure (App Router)

#### 4.1 Root shell
- **Root layout**: `src/app/layout.tsx`
  - Site metadata + JSON-LD schema
  - Wraps app with `ThemeProvider` + `AuthProvider`
  - Global layout includes `Navbar`, `Toaster`, and dynamic widgets (AI floating widget, mobile banner)
- **Home page**: `src/app/page.tsx`
  - Client component using `framer-motion`
  - Best-effort Firestore counts via `getCountFromServer` for collections `places` and `users`

#### 4.2 Public routes
- `/` → `src/app/page.tsx`
- `/about` → `src/app/about/page.tsx`
- `/download` → `src/app/download/page.tsx` (+ layout with metadata)
- `/login` → `src/app/login/page.tsx`
- `/signup` → `src/app/signup/page.tsx`
- `/forgot-password` → `src/app/forgot-password/page.tsx`

#### 4.3 Dashboard routes (`/dashboard/*`) — user-auth gated (client-side)
- Layout: `src/app/dashboard/layout.tsx` wraps children with `src/components/auth/AuthGuard.tsx`
- Main pages (non-exhaustive, from file scan):
  - `/dashboard` → redirects to categories (`src/app/dashboard/page.tsx`)
  - `/dashboard/categories` and `/dashboard/categories/[id]`
  - `/dashboard/places/[id]`
  - `/dashboard/places/famous`
  - `/dashboard/planner` and `/dashboard/planner/[id]`
  - `/dashboard/chat`
  - `/dashboard/events` and `/dashboard/events/[category]`
  - `/dashboard/transit/*` (bus/train/cabs/rentals/route-planner)
  - `/dashboard/bus-routes` and `/dashboard/bus-routes/[id]`
  - `/dashboard/profile`, `/dashboard/settings`, `/dashboard/emergency`, `/dashboard/trips`
  - `/dashboard/currency`

**Access control**: dashboard protection is implemented as a **client-side guard** (`AuthGuard` checks Firebase auth state and redirects to `/login?redirect=...`).

#### 4.4 Admin routes (`/admin/*`) — role gated + cookie marker
- Layout: `src/app/admin/layout.tsx` (renders sidebar shell; wraps in `AuthProvider`)
- Login: `src/app/admin/login/page.tsx`
  - Firebase email/password login
  - Reads Firestore `users/{uid}.role` and permits only `admin|superadmin`
  - Sets a cookie marker `admin_session=1` for 7 days
- Role enforcement hook: `src/hooks/useAdminAuth.ts` (client-side role check + redirect)

**Edge/cookie guard**: `src/proxy.ts` checks `admin_session` cookie for `/admin/:path*`.
This is intended to guard admin routes *before* page JS loads, but whether it’s active depends on Next middleware wiring (see Recommendations).

#### 4.5 API routes (`src/app/api/**/route.ts`)
- **`POST /api/chat`**: `src/app/api/chat/route.ts`
  - In-memory IP rate limiting (10 req/min)
  - “Quick replies” keyword shortcuts
  - Groq streaming response (plain text stream)
- **`GET /api/admin/images/search`**: `src/app/api/admin/images/search/route.ts`
  - Aggregates images from:
    - Wikimedia (primary, no key)
    - Google Places (optional via `GOOGLE_PLACES_API_KEY`)
    - Pexels (optional via `PEXELS_API_KEY`)
  - In-memory server cache (2h TTL, capped size)
- **`GET /api/admin/images/proxy`**: `src/app/api/admin/images/proxy/route.ts`
  - Domain allowlist proxy to fetch image bytes server-side (avoids CORS for uploads)
- **`GET /api/seed-transit`**: `src/app/api/seed-transit/route.ts`
  - Triggers `seedTransitData()` (purges old rentals then seeds all transit items)

### 5. Core modules & logic (what lives where)

#### 5.1 Authentication & user profile
- **Firebase init**: `src/lib/firebase.ts`
  - Reads `NEXT_PUBLIC_FIREBASE_*` env vars
  - Initializes `auth`, `db`, `storage`
  - Client-only analytics loaded dynamically when supported
- **Auth context**: `src/context/AuthContext.tsx`
  - Tracks `user`, `userProfile`, `loading`
  - Subscribes to Firestore `users/{uid}` via `onSnapshot`
  - `logout()` also clears `admin_session` cookie marker
- **Dashboard guard**: `src/components/auth/AuthGuard.tsx`
  - Redirects unauthenticated users to login with redirect parameter

#### 5.2 Admin content CRUD (Firestore)
- **Admin Firestore API**: `src/lib/admin/firestore.ts`
  - Collections used:
    - `adminPlaces`
    - `adminCategories`
    - `events`
    - `transit`
  - Provides `getDashboardStats()` for admin dashboard counters (counts + recent places)
- **Admin types**: `src/types/admin.ts` (interfaces + image search response types)

#### 5.3 Image search + selection + upload pipeline (admin)
This system is intentionally split so the **search** logic can be shared across environments.

- **Universal search module**: `src/lib/admin/imageSearchShared.ts`
  - Next.js mode: delegates to `/api/admin/images/search` (keeps API keys server-side)
  - React Native mode: calls Wikimedia directly and optionally Pexels directly
  - Caching:
    - in-memory cache (30 min)
    - optional AsyncStorage cache adapter (RN)
- **Wikimedia client**: `src/lib/admin/wikimediaApi.ts`
  - Throttled MediaWiki search + metadata extraction
- **Client upload utilities**: `src/lib/admin/imageUtils.ts`
  - `searchPlaceImages()` uses shared search in **server-proxy mode**
  - `uploadFromUrl()` uses `/api/admin/images/proxy` to fetch bytes, compresses via canvas, uploads to Firebase Storage
  - `uploadFromFile()` compresses and uploads directly
- **Admin UI components**:
  - `src/components/admin/SmartImagePicker.tsx` (search + select + upload orchestration)
  - `src/components/admin/ImageSearchGrid.tsx` (selection UX)
  - `src/components/admin/PlaceForm.tsx` (place create/edit form)

#### 5.4 Transit module (seed + fetch + UI consumption)
- **Seed dataset + writer**: `src/utils/seedTransitData.ts`
  - Large in-repo dataset `SEED_DATA`
  - `seedTransitData()` deletes existing documents for category `rentals` then batch-writes all seed items by stable ids
- **Fetch service**: `src/services/transitService.ts`
  - `getTransitItems(category)` queries Firestore `transit` by `category` and caches results in memory
  - Re-exports `seedTransitData`
- **Dashboard transit layout**: `src/app/dashboard/transit/layout.tsx`
  - Calls `seedTransitData()` on mount (client-side)

#### 5.5 AI module (chat + prompt configuration)
- **Chat API**: `src/app/api/chat/route.ts`
  - Constructs a system instruction and injects partial place context (`PLACES_DATA` slice)
  - Streams Groq chat completions
- **Groq wrapper**: `src/lib/groq.ts`
  - Provides `GroqService` with `generateResponse`, `generateJSON`, and `generateResponseStream`
- **Prompt preset**: `src/lib/prompts.ts`
  - Defines `MASTER_SYSTEM_PROMPT` (persona + formatting rules)
  - Note: this prompt includes emoji guidance; actual usage depends on where it’s passed into calls

#### 5.6 Currency module
- **Static model/data**: `src/services/currencyService.ts`
  - `SUPPORTED_CURRENCIES`, `EXCHANGE_LOCATIONS`
- **Dashboard UI**: `src/app/dashboard/currency/page.tsx` (present in repo; earlier scan suggests it may need a compile check)

### 6. Workflows (data flow + control flow)

#### 6.1 Auth → dashboard access

```mermaid
flowchart TD
  Visitor[Visitor] --> LoginPage[/login]
  LoginPage --> FirebaseAuth[FirebaseAuth]
  FirebaseAuth --> AuthProvider[AuthProvider]
  AuthProvider --> AuthGuard[AuthGuard]
  AuthGuard -->|user_present| Dashboard[/dashboard/*]
  AuthGuard -->|user_missing| LoginRedirect[/login?redirect=...]
```

#### 6.2 Admin: add/edit place with image search + upload

```mermaid
flowchart TD
  AdminUser[AdminUser] --> AdminLogin[/admin/login]
  AdminLogin --> FirebaseAuth[FirebaseAuth]
  AdminLogin --> FirestoreRole[Firestore_users_uid_role]
  FirestoreRole -->|admin_ok| Cookie[SetCookie_admin_session]
  Cookie --> AdminPlaces[/admin/places]

  AdminPlaces --> PlaceForm[PlaceForm]
  PlaceForm --> SmartPicker[SmartImagePicker]
  SmartPicker --> SearchAPI[/api/admin/images/search]
  SearchAPI --> Wikimedia[WikimediaAPI]
  SearchAPI --> GooglePlaces[GooglePlaces_optional]
  SearchAPI --> Pexels[Pexels_optional]

  SmartPicker --> Proxy[/api/admin/images/proxy]
  Proxy --> ExternalImg[ExternalImageURL]
  SmartPicker --> Storage[FirebaseStorage_placeImages]
  PlaceForm --> FirestoreWrite[Firestore_adminPlaces]
```

#### 6.3 Chat: dashboard → `/api/chat` (streaming)

```mermaid
flowchart TD
  User[DashboardUser] --> ChatUI[/dashboard/chat]
  ChatUI --> ChatAPI[/api/chat]
  ChatAPI --> RateLimit[InMemoryRateLimit]
  ChatAPI --> Groq[GroqChatCompletions_stream]
  Groq --> Stream[PlainTextStream]
  Stream --> ChatUI
```

#### 6.4 Transit: seed → read → pages
- Seed can be triggered by:
  - `/api/seed-transit` (server route), or
  - `/dashboard/transit/*` layout mount (client calls `seedTransitData()`)
- Read path:
  - UI pages call `getTransitItems(category)` → Firestore query `transit` where `category == ...`

### 7. Data model (inferred Firestore collections)
Collections directly referenced by code:

- **`users`**: user profiles + roles (`role` used for admin gating)
- **`places`**: counted on home page (public stats); likely end-user place content
- **`adminPlaces`**: admin-managed places (CRUD)
- **`adminCategories`**: admin-managed categories (CRUD)
- **`events`**: admin-managed events (CRUD)
- **`transit`**: transit items (seeded + read by UI)

### 8. UI design & animation conventions (observed patterns)
- **Motion-first UI**: framer-motion is used for:
  - section reveals (`whileInView`)
  - hover/tap transitions
  - page-level “cinematic” composition (home hero + CTA blocks)
- **Theming**: Tailwind class toggles via `next-themes` `ThemeProvider` with `attribute="class"`
- **Performance posture**:
  - dynamic imports for below-the-fold sections on the home page
  - image search caching both client-side and server-side

### 9. Risks, gaps, and recommendations

#### 9.1 Admin edge protection wiring
- **What exists**: `src/proxy.ts` exports a matcher and a function named `proxy`.
- **Risk**: Next.js edge middleware typically expects a root `middleware.ts` exporting `middleware()` (or default) to run automatically.
- **Recommendation**: if you intend edge protection to run, rename/wire this as Next middleware (and keep the client-side `useAdminAuth` as defense-in-depth).

#### 9.2 Client-side transit seeding on every transit page mount
- **What exists**: `src/app/dashboard/transit/layout.tsx` calls `seedTransitData()` in `useEffect`.
- **Risk**: can cause unexpected writes, slower UX, and permission/rules issues for normal users.
- **Recommendation**: restrict seeding to admin-only tooling and keep transit reads purely read-only for users.

#### 9.3 In-memory caches are non-durable
- **What exists**: image search route cache and transit service cache are in-memory.
- **Risk**: resets on cold start/redeploy and doesn’t share across instances.
- **Recommendation**: acceptable for MVP; for scale, consider shared cache (Redis) or Firestore-backed caching.

#### 9.4 Prompt consistency
- **Observation**: `/api/chat` uses its own `SYSTEM_INSTRUCTION` while `src/lib/prompts.ts` defines a different `MASTER_SYSTEM_PROMPT`.
- **Recommendation**: unify prompt injection so the same persona/rules are applied across chat entrypoints.

#### 9.5 Currency page integrity
- **Observation**: `src/app/dashboard/currency/page.tsx` exists; prior scan suggested malformed content.
- **Recommendation**: run a build/typecheck and fix compilation if needed (especially before Capacitor packaging).

### 10. Quick “where to look” index (entrypoints)
- **App shell**: `src/app/layout.tsx`, `src/components/layout/Navbar.tsx`
- **Auth**: `src/lib/firebase.ts`, `src/context/AuthContext.tsx`, `src/components/auth/AuthGuard.tsx`
- **Admin guard**: `src/app/admin/login/page.tsx`, `src/hooks/useAdminAuth.ts`, `src/proxy.ts`
- **Admin CRUD**: `src/lib/admin/firestore.ts`
- **Image pipeline**: `src/app/api/admin/images/*`, `src/lib/admin/imageSearchShared.ts`, `src/lib/admin/imageUtils.ts`
- **Chat**: `src/app/dashboard/chat/page.tsx`, `src/app/api/chat/route.ts`, `src/lib/groq.ts`
- **Transit**: `src/utils/seedTransitData.ts`, `src/services/transitService.ts`, `src/app/dashboard/transit/layout.tsx`
