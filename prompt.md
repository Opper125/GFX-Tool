အောက်ပါ ပြောထားတဲ့ Website ကို မင်းရဲ့ arena ရဲ့ database နဲ့ပဲချိတ်ဆက်ပီး မင်းရဲ့ arena မှာပဲ 100% dashbaord 3ခုလုံးအပါဝင်တခါထဲ တည်ဆောက်ပေးပါ။ prompt ထဲမှာ ပြောထားတဲ့ စနစ်အားလုံးအကုန်ပါဝင်ရမယ်။ api အားလုံးကိုသေချာချိတ်ဆက်ပေးပါ admin dashbaord ကို သက်မှတ်ထားတဲ့ ipaddress ဘက်မှာပဲ ဝင်ရောက်သုံးပြုခွင့်ပေးထားပါ admin ipaddress ဖုန်းကတော့် 116.206.193.37 ဖြစ်တယ် ADMIN_LOGIN_PASSWORD ကို @OPPER@ ထားပေးပါ ADMIN_APPROVE_PASSWORD ကို @155872@ ထားပေးပါ G2BULK_API_KEY တွေ imgbb api key တွေ ကြန်တဲ့ api base url တွေ key တွေအကုန် admin dashbaord ထဲကနေ Add Save လုပ်ပီးသုံးပြုပါမယ်။ သတိ ဖိုင်ထဲမှာ api အချက်အလက် password လုံးဝမသိမ်းပါနဲ့ database မှာလည်း မသိမ်းပါနဲ့ Env ထဲမှာ တိုက်ရိုက်သိမ်းဆည်းပေးပါ အရေးကြီးပါတယ်။ Domain ကို တခုထဲပဲ သုံးပါမယ်။ သင့်ရဲ့ arena မှာတခါထဲ အပီးစီး ဖန်တီးသွားပါ Dashbaord 3ခုလုံးကို အမှားယွင်းမရှိအောင်
အောက်ပါ Prompt မှာ ဖန်တီးရမှာတွေအပြည့်အဝ ရှင်းပြထားပါတယ်။

# CR7 Game Shop — Master Build Blueprint (Users + Admin + Reseller Domains)

> **Meta-instruction to the implementing AI / developer team**
>
> This document is the **complete, non-negotiable Master Blueprint** for building the entire website from scratch — the three domains (Users Domain, Admin Domain, Reseller Domain), every one of their pages, every sub-page, every modal, every popup, and every state.
>
> - **Absolutely nothing may be omitted.** Every feature, every page, every sub-page, every modal, every popup, and every one of the five canonical states (Loading / Empty / Success / Error / Interactive) is fully specified here.
> - **Every page has a per-page contract.** Layout, component positions, SVG icon positions, animations, interaction flow, data flow, API calls, SQL queries, RLS policies, triggers, and Realtime channels are all written out verbatim. Do not paraphrase them or guess the missing pieces — there are no missing pieces.
> - **The database schema is complete.** Tables, foreign keys, RLS policies, Realtime publications, functions, triggers, and indexes are all provided in full in Part 21. Every feature in the site must consume this exact schema — do not invent new tables, do not rename columns, do not drop constraints.
> - **No placeholders are accepted.** `// TODO`, `// implement later`, `// hook up API here`, "stub for now", or any equivalent are forbidden. Every function must be implemented end-to-end. Every button must be wired. Every state must render.
> - **No shortcuts on security.** Password checks, admin approvals, RLS, IP allow-lists, and the balance-protection trigger are load-bearing — they are not optional. If you find yourself skipping one to make a feature "work", stop and re-read Part 1 (Non-negotiable Rules) and Part 20 (Security System).

---

## Table of Contents

| Part | Title |
|---:|---|
| **0** | Tech Stack Overview |
| **1** | Non-negotiable Rules (Foundational Constraints) |
| **2** | Environment Variables (Vercel Env) |
| **3** | File & Folder Structure (Modular, Line-Limited) |
| **4** | Domain Routing (Edge Middleware) |
| **5** | Admin IP Access Control |
| **6** | Admin Login System |
| **7** | Users Dashboard: Real-Device Geolocation Permission Gate |
| **8** | Users Dashboard: Complete Page-by-Page Specification |
| **9** | Admin Dashboard: Complete Page-by-Page Specification |
| **10** | Reseller Dashboard: Complete Page-by-Page Specification |
| **11** | Admin: Locations Map System |
| **12** | Admin: Security Logs Page |
| **13** | Admin: VPS Self-Hosted Management System |
| **14** | Reseller Dashboard: Role-Based Login System |
| **15** | Source-Code Protection System |
| **16** | UI/UX Design System (App-Grade, Not Web-Grade) |
| **17** | Toast / Message System |
| **18** | G Store System (Complete) |
| **19** | App vs Web Platform Detection |
| **20** | Security System (Anti-Hack Measures) |
| **21** | Database Schema (Complete SQL with Purpose, Relationships, Indexes) |
| **22** | Build Order & Delivery Manifesto |

---

## Part 0 — Tech Stack Overview

| Layer | Technology | Why this choice |
|---|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript (ES6 Modules) | Zero framework overhead, direct control of the DOM, fastest first-paint on low-end Android devices, easiest to obfuscate for source-code protection (Part 15). No React / Vue / Svelte / Next.js. |
| Database | Supabase (PostgreSQL 15+ with Realtime, Storage, and Row-Level Security) | Single source of truth; every rule enforced at the DB layer via RLS + triggers, so a leaked anon key cannot escalate privileges. |
| Hosting | Vercel (Serverless Functions + Edge Middleware) | Middleware handles per-hostname routing (Part 4). API routes live in `api/*.js` as Node serverless functions. |
| Image storage | ImgBB API | Cheap, direct-upload from server (never client), and served through our masking proxy so raw URLs never leak to the browser (Part 15.2). |
| Game topups & gift cards | G2Bulk API (v1 for game topups, v2 for SMM / redeem codes) | Two distinct endpoints — v1 is player-ID based, v2 is code-based. See Part 18. |
| Video data | YouTube Data API v3 | Channel-video listing and metadata on the News page. |
| Maps | Leaflet.js + OpenStreetMap tiles + CartoDB Dark tile layer | Free, no API key, works globally, matches the dark glassmorphism theme. |
| VPS management | Self-hosted in-dashboard VPS system (KVM + libvirt + web SSH via xterm.js) | Admin can spin up / stop / restart / attach terminal to KVM instances from the dashboard. |
| WebSocket | Vercel Edge Runtime WebSocket | Powers the in-browser SSH terminal for the VPS panel. |
| Reverse geocoding | Nominatim (OpenStreetMap), rate-limited to 1 req/s | Converts lat/lon to a human-readable address for the Locations Map. |
| Terminal emulator | xterm.js loaded from CDN | Renders the WebSSH terminal in the VPS panel. |
| Encryption | Node.js `crypto` module (AES-256-GCM) | Encrypts stored SSH credentials at rest using `AES_ENCRYPTION_KEY`. |

**Explicitly forbidden** in this build:
- No CSS frameworks (no Tailwind, Bootstrap, Bulma, etc.). Only the design system defined in Part 16.
- No JavaScript UI frameworks (no React, Vue, Svelte, Next.js, Nuxt, SvelteKit).
- No jQuery. Vanilla DOM APIs only.
- No CDN-hosted CSS. The only CDN scripts allowed are `xterm.js`, `xterm-addon-fit`, and `leaflet` (Part 11 / Part 13).
- No `<style>` or `<script>` tags with inline code in HTML. See Rule 1 in Part 1.

---
## Part 1 — Non-negotiable Rules (Foundational Constraints)

These twelve rules are the ground floor. Every other part of this document assumes they are already in effect. If a rule conflicts with a shortcut you are tempted to take, the rule wins.

### Rule 1 — Strict file separation

- **No inline `<style>`** and **no inline `<script>` with code inside** are allowed in any HTML file.
- HTML, CSS, and JavaScript must live in separate files.
- The **only** tags an HTML file may use to load code are:
  - `<link rel="stylesheet" href="/css/…">`
  - `<script type="module" src="/js/…"></script>`
- No `onclick=`, `onload=`, `onchange=`, or any other inline event handler attributes in HTML. Wire everything through `addEventListener` in the corresponding JS module.
- No `style="…"` attributes on production markup. Layout must come from CSS classes. (A single exception: dynamically computed positioning values written from JS, e.g. a tooltip's `left` / `top`, are allowed.)

### Rule 2 — Secrets

- **No API key, secret, service-role key, database password, or admin password is ever hard-coded** anywhere in the repository.
- Every secret is read exclusively from Vercel Environment Variables via `process.env.<NAME>` and only inside server-side files under `api/*.js`.
- **Client-side JavaScript (`js/**/*.js`) must never receive a secret**, not as a build-time replacement, not as a bootstrap constant, not embedded in the HTML shell.
- The client receives only:
  - Response data (already filtered by RLS on the server)
  - Non-sensitive metadata (display strings, IDs, timestamps)
- If a page needs to show, for example, an ImgBB-hosted image, it must go through our masking proxy (Part 15.2) — the ImgBB URL itself never appears in the DOM.

### Rule 3 — Absolutely no emoji

- The entire website — every page, every toast, every button label, every empty state, every error message, every notification — must use **inline SVG** or **references into the `/assets/icons.svg` sprite**.
- Emoji characters (🎮 ✅ ⚠️ 🔒 etc.) are **forbidden** in:
  - HTML content
  - CSS `content:` properties
  - Toast messages, alert strings, error strings
  - Button labels, tooltips, aria-labels
- Icons must be SVG, and they must inherit color from CSS `color` / `currentColor` so the design system controls their appearance.

### Rule 4 — No frames on icons and images

- Do not wrap SVG icons or product images in a decorative frame — no `border`, no `box-shadow` that creates a card-around-the-icon effect, no colored `background-color` box.
- Transparent PNG / SVG must be rendered as-is against the page background.
- **Only exception**: the **user-avatar circle** (initials placeholder). That single case is drawn as a gradient-filled circle (using the design system's accent gradient), not as a framed image.

### Rule 5 — Admin Action Password on every mutation

- Every mutation in the Admin Dashboard — **Create / Update / Delete / Approve / Reject / Assign / Ban / Send / Toggle / Restart / Terminate / Reset** — must open a **confirmation modal** that requires the operator to enter `ADMIN_APPROVE_PASSWORD`.
- The check is performed **server-side** inside `api/admin-action.js`. Never trust the client to have validated the password. The client may pre-check for UX (disabling the confirm button until the field is non-empty), but the server is the sole authority.
- The server-side comparison must use `crypto.timingSafeEqual` to prevent timing attacks (see Part 6, Step 2).
- If the password is missing or wrong, respond with **HTTP 403** and log the attempt into `security_logs` with `event_type='ADMIN_ACTION_PW_FAIL'`.
- No feature — not even something "trivial" like toggling a banner active-flag — is exempt.

### Rule 6 — Balance protection (the money rule)

- `users.game_balance` is the user's money. It must be treated as such.
- Direct `UPDATE users SET game_balance = …` is **blocked at the database level** by the trigger `prevent_direct_balance_edit` (Part 21). Any attempt errors out.
- **The only** way to change a balance is through the `update_user_balance(user_id uuid, delta numeric, reason text, ref_id uuid)` RPC function, which:
  1. Validates the operation
  2. Applies the delta transactionally
  3. Inserts a matching row into `balance_ledger` for full auditability
- The client's `amount` field on any request is **never trusted**. The server always re-reads the authoritative value from the database before charging.
- `game_balance` is display-only in every client response. There is no client-side "adjust balance" surface, ever.

### Rule 7 — No user activity logs

- Do not build a general user-activity log system (page views, clicks, session recordings, funnel analytics). This is deliberate — the project explicitly opts out of behavioural tracking on end users.
- The following log systems are the **only** allowed exceptions and are covered in later parts:
  - `security_logs` — failed logins, IP blocks, admin-action password failures (Part 12)
  - `vps_metrics_log` — CPU / RAM / disk / bandwidth per VPS instance (Part 13)
  - `user_location_tracking` — real-device geolocation for the Admin Map (Part 7, Part 11)

### Rule 8 — File & line limits (mandatory modularity)

- **Maximum 10 files per folder.** If a folder needs an 11th file, create a sub-folder and split.
- **JavaScript**: no single `.js` file may exceed **5,000 lines**.
- **CSS**: no single `.css` file may exceed **3,000 lines**.
- These limits are hard. If you approach them, split the module into logical sub-modules and re-export from an index file.
- All JS must use ES6 modules (`import` / `export`) and be loaded via `<script type="module" src="…">`.
- No `require()`, no CommonJS in client code, no bundler required — the browser loads the modules natively.

### Rule 9 — Source-code protection on the Users Dashboard

The full detail is in Part 15, but the surface area you must enforce is:
- F12 / DevTools blocking
- Right-click disabled
- Long-press on images disabled (mobile)
- Text selection disabled on non-input elements
- `console.log`, `console.info`, `console.warn`, `console.debug` overridden to no-op in production
- Image URLs masked through a Base64-token proxy so raw ImgBB URLs never appear in the DOM

Admin and Reseller dashboards do **not** apply the F12 blocker (operators need it), but they still enforce IP checks and admin passwords.

### Rule 10 — Fixed navigation bars

- The **Topbar (60 px)** and **Bottom Nav (64 px)** are `position: fixed` at `z-index: 1000`.
- They **never move** on scroll. No "hide on scroll down, show on scroll up" behaviour. No transform animations. They are pinned.
- The content area between them uses `padding-top: 60px` + `padding-bottom: 64px` so real content is not covered.
- **z-index hierarchy** (memorize this — every design decision refers to it):

| Layer | z-index |
|---|---|
| Topbar | 1000 |
| Bottom Nav | 1000 |
| Dropdown menus (e.g. avatar dropdown) | 1500 |
| Modal dialogs | 2000 |
| Full-screen overlays (e.g. global search) | 3000 |
| Toast notifications | 5000 |
| Maintenance / Location-lock gate | 99999 |

### Rule 11 — Every state must be designed

For every page and every reusable component, all **five canonical states** must be built. No shortcuts, no "we'll skeleton later".

1. **Loading state** — a **skeleton screen** matching the final layout (grey placeholder blocks). No generic spinners; every skeleton reproduces the actual card / row / grid outline.
2. **Empty state** — an SVG illustration + a short message explaining what's missing + a clear CTA button that leads the user out of the empty state.
3. **Success state** — how the component looks with real data (the "normal" render).
4. **Error state** — an error SVG + a plain-language message + a **Retry** button that re-fires the exact request that failed.
5. **Interactive state** — hover, active, focus, and disabled variants for every button / link / control.

### Rule 12 — Two-step confirmation on destructive actions

Delete, Reject, Ban, Terminate, Reset, Force-Logout — every destructive action uses a **two-step modal**:

1. **Step 1 — Confirm intent** *and* enter `ADMIN_APPROVE_PASSWORD`.
   - Title: "Confirm destructive action"
   - Body: "You are about to <action> <target>. This cannot be undone."
   - Password field required.
   - Button: `Cancel` (secondary) + `Confirm` (danger red, disabled until password is non-empty).
2. **Step 2 — Loading → Success toast.**
   - The confirm button shows the loading state (spinner replaces label, button disabled).
   - On success, the modal closes and a **success toast** appears (Part 17).
   - On failure, the modal stays open, shows the error under the password field, and re-enables the button.

There is no "single-click delete" anywhere in Admin, ever.

---
## Part 2 — Environment Variables (Vercel Env)

All secrets live in Vercel Environment Variables. They are read only from `api/*.js` at runtime via `process.env.<NAME>`. **Never** inline them into client JS, never commit them to git, and never expose them in error messages.

```env
# ==================== Supabase ====================
SUPABASE_URL=                       # Project URL, e.g. https://xxxx.supabase.co
SUPABASE_ANON_KEY=                  # Anon (public) key — used by the server to build the RLS-scoped client
SUPABASE_SERVICE_ROLE_KEY=          # Service-role key — bypasses RLS; use ONLY in trusted server flows

# ==================== ImgBB ======================
IMGBB_API_KEY=                      # Server-side upload proxy uses this; client never sees it

# ==================== G2Bulk =====================
G2BULK_API_KEY=                     # Single key covers both v1 and v2
G2BULK_BASE_URL=https://api.g2bulk.com/v1     # Game topups (player-ID based)
G2BULK_SMM_URL=https://api.g2bulk.com/api/v2  # Gift cards / redeem codes

# ==================== Domains ====================
USER_DOMAIN=cr7game.shop
ADMIN_DOMAIN=cr7adminpanel.vercel.app
RESELLER_DOMAIN=reselleradmin.vercel.app

# ==================== Admin Auth =================
ADMIN_LOGIN_PASSWORD=               # Required to log in to the Admin dashboard
ADMIN_APPROVE_PASSWORD=             # Required per mutation (Rule 5)
ADMIN_IPADDRESS=                    # Comma-separated allow-list of admin IPs (Part 5)

# ==================== YouTube ====================
YOUTUBE_API_KEY=                    # Data API v3 key for the News page
CHANNEL_ID=                         # YouTube channel to pull videos from
USER_ID=                            # Legacy display field (public)

# ==================== VPS Self-Hosted =============
VPS_NODE_SECRET=                    # Shared secret used by the VPS agent on each host
VPS_AGENT_PORT=7777                 # TCP port the agent listens on
VPS_DEFAULT_OS=ubuntu-22.04         # Default guest OS image
VPS_STORAGE_PATH=/var/lib/cr7game/vps
VPS_NETWORK_BRIDGE=br0
VPS_MAX_INSTANCES=10                # Guardrail against runaway instance creation

# ==================== Encryption =================
AES_ENCRYPTION_KEY=                 # 32-byte hex key. Encrypts stored SSH creds with AES-256-GCM
JWT_SECRET=                         # HS256 secret for signing session tokens

# ==================== Nominatim ==================
NOMINATIM_USER_AGENT=CR7Game/1.0 (contact@cr7game.shop)   # Required by OSM policy
```

**How to verify env is loaded correctly** (add a `/api/health` endpoint that returns `{ ok: true, envKeys: Object.keys(process.env).filter(k => k in EXPECTED_KEYS).length }` — never return the values themselves).

**If a key is missing at cold start**, the API endpoint that depends on it must fail closed (respond with HTTP 500 + `{ error: 'server_misconfigured' }`) and log to `security_logs` with `event_type='ENV_MISSING'`. Do not silently fall back to a default.

---

## Part 3 — File & Folder Structure (Modular, Line-Limited)

The tree below is authoritative. Do not add files outside it. If a new file is needed, it must be a sub-module inside an existing folder and it must respect Rule 8 (≤10 files per folder; JS ≤5,000 lines; CSS ≤3,000 lines).

```
root/
├── index.html                     (~600 lines)  — Users Dashboard shell (loads users CSS + JS bundle)
├── admin.html                     (~700 lines)  — Admin Dashboard shell (loads admin CSS + JS bundle)
├── reseller.html                  (~600 lines)  — Reseller Dashboard shell (loads reseller CSS + JS bundle)
├── 404.html                       (~120 lines)  — Rendered for wrong-domain + wrong-route + IP-blocked
├── package.json                                — Declares Node deps for api/*.js
├── vercel.json                                 — Configures middleware + serverless functions
├── middleware.js                  (~300 lines)  — Edge middleware for per-hostname routing (Part 4)
├── robots.txt
├── sitemap.xml
│
├── assets/
│   ├── icons.svg                                — SVG sprite with every icon used across the site
│   ├── bg-circuit.svg                           — Circuit-board background pattern (dark)
│   ├── bg-hex.svg                               — Hex-grid background pattern
│   ├── bg-stars.svg                             — Star-field background pattern
│   ├── bg-form-pattern.svg                      — Auth-form background pattern
│   └── logo.svg                                 — Brand logo, uses currentColor for tinting
│
├── css/
│   ├── index/                     (Users Dashboard styles, max 10 files, each ≤3,000 lines)
│   │   ├── 01-base.css            — CSS reset, custom-property tokens, typography scale
│   │   ├── 02-layout.css          — Fixed topbar, bottom nav, content area, safe-area insets
│   │   ├── 03-components.css      — Clipped buttons, cards (glassmorphism), inputs, modals, toasts
│   │   ├── 04-home.css            — Home page: menu grid, banner carousel, category chips
│   │   ├── 05-gstore.css          — G Store: tabs, product grid, balance card, search bar
│   │   ├── 06-orders-cart.css     — Cart, checkout, order-history cards, order-detail timeline
│   │   ├── 07-profile-auth.css    — Login, signup, profile, KYC form, avatar dropdown
│   │   ├── 08-news-reviews.css    — News feed, review cards, YouTube embed player
│   │   ├── 09-animations.css      — @keyframes, transitions, entrance/exit choreography
│   │   └── 10-responsive.css      — Mobile / tablet / desktop breakpoints, orientation handling
│   │
│   ├── admin/                     (Admin Dashboard styles)
│   │   ├── 01-base.css
│   │   ├── 02-layout.css          — Left sidebar + topbar, collapsible sidebar
│   │   ├── 03-components.css      — Data tables, filter bars, stat cards, admin buttons
│   │   ├── 04-users-orders.css    — User-detail page, per-user IP history, orders table
│   │   ├── 05-content-mgmt.css    — Menu / category / product / banner editors
│   │   ├── 06-g2bulk.css          — G2Bulk sync UI, import status, product mapping
│   │   ├── 07-reseller-kyc.css    — Reseller approval, KYC viewer, applications queue
│   │   ├── 08-locations-map.css   — Map, marker popups, right-side user-detail panel
│   │   ├── 09-vps-panel.css       — Terminal container, instance cards, live-metrics gauges
│   │   └── 10-animations.css
│   │
│   └── reseller/                  (Reseller Dashboard styles)
│       ├── 01-base.css
│       ├── 02-layout.css
│       ├── 03-components.css
│       ├── 04-pages.css           — Content mgmt (own scope), orders (own scope), payments
│       ├── 05-premium-analytics.css
│       └── 06-animations.css
│
├── js/
│   ├── index/                     (Users Dashboard scripts)
│   │   ├── 01-core.js             — App init, hash-router, toast, modal, platform detection, service-worker registration
│   │   ├── 02-location-gate.js    — Native geolocation gate (blocks all other modules until granted)
│   │   ├── 03-auth.js             — Login, signup, session, password reset, slider CAPTCHA
│   │   ├── 04-intro-topbar.js     — Intro animation, topbar behaviour, bottom-nav behaviour, avatar dropdown
│   │   ├── 05-home-feed.js        — Menu list, category list, product list rendering + Realtime subscriptions
│   │   ├── 06-search-cart.js      — Global search overlay, cart add/remove, cart persistence
│   │   ├── 07-checkout.js         — Checkout flow, payment-screenshot upload, promo-code apply
│   │   ├── 08-gstore.js           — G Store: topup (v1 API), gift cards (v2 API), player-ID validation
│   │   ├── 09-orders-profile.js   — Order history, order detail, profile page, KYC apply, "My VPS" reseller-scoped view
│   │   └── 10-news-reseller-link.js — News feed (YouTube), reviews, reseller exchange-token flow
│   │
│   ├── admin/                     (Admin Dashboard scripts)
│   │   ├── 01-core.js             — Router, sidebar nav, toast, modal, admin-action confirm helper
│   │   ├── 02-auth-ip.js          — IP gate, login, slider CAPTCHA, session persistence
│   │   ├── 03-settings.js         — Global settings, payment methods, env info (redacted)
│   │   ├── 04-users.js            — User list, per-user detail page, IP history, balance-ledger tab
│   │   ├── 05-orders-promo-payments.js — Orders (all), promo codes, deposits, withdrawals
│   │   ├── 06-content-mgmt.js     — Menus, categories, products, banners, news CMS
│   │   ├── 07-g2bulk.js           — G2Bulk sync, product import wizard, live balance
│   │   ├── 08-reseller.js         — Reseller applications, KYC approve/reject, premium plans, active resellers
│   │   ├── 09-locations-map.js    — Realtime map, 30-second auto-refresh, marker click → detail panel
│   │   └── 10-vps-panel.js        — VPS overview, create-instance wizard, terminal (WebSocket), assign to reseller
│   │
│   └── reseller/                  (Reseller Dashboard scripts)
│       ├── 01-core.js             — Router, side nav, toast, modal
│       ├── 02-auth-settings.js    — Login (role=reseller), session, incoming exchange-token handler
│       ├── 03-content-mgmt.js     — Own menus / products / banners (limited by plan)
│       ├── 04-orders-payments.js  — Own customers' orders, payment confirmation
│       ├── 05-premium.js          — Premium-plan upgrade, plan limits display
│       └── 06-analytics.js        — Sales, customer insights, charts (Chart.js loaded lazily)
│
└── api/                           (Vercel Serverless Functions — Node runtime)
    ├── auth.js                    — Login (admin / user / reseller), signup, session, IP filter, exchange-token endpoint
    ├── supabase.js                — Shared Supabase client factory + RPC helpers + RLS-aware wrappers
    ├── imgbb.js                   — Upload proxy (server → ImgBB) + image-URL masking proxy (Base64 token → real URL)
    ├── g2bulk-v1.js               — Topup API (games with player_id)
    ├── g2bulk-v2.js               — SMM API (gift cards, redeem codes)
    ├── youtube.js                 — Channel-videos fetch + in-memory cache (5-minute TTL)
    ├── admin-action.js            — Central handler for every admin mutation (validates ADMIN_APPROVE_PASSWORD)
    ├── balance.js                 — Deposit, withdrawal, RPC-based balance ops (calls update_user_balance)
    ├── location.js                — Geolocation save + Nominatim reverse geocode (1 req/s throttle + cache)
    └── vps.js                     — VPS agent proxy: create / start / stop / restart / terminate / attach terminal (WebSocket)
```

**Naming discipline:**
- CSS files are numbered `01-…`, `02-…` so their include order in the HTML shell is stable and visible.
- JS files follow the same numbering — the shell `<script type="module">` tags load them in that order, and later modules may import from earlier ones.
- Any new module you add must fit the numbering and update the shell.

**Import graph (Users Dashboard example):**
```
01-core.js               (no imports — top of graph)
02-location-gate.js      imports { toast, showOverlay } from 01-core.js
03-auth.js               imports { toast, api, modal } from 01-core.js
04-intro-topbar.js       imports { router, currentUser } from 01-core.js + 03-auth.js
05-home-feed.js          imports { api, currentUser } from 01-core.js
06-search-cart.js        imports { api, toast } from 01-core.js
07-checkout.js           imports { api, currentUser, toast } + 06-search-cart.js (cart state)
08-gstore.js             imports { api, currentUser, toast, modal }
09-orders-profile.js     imports { api, currentUser, toast, modal }
10-news-reseller-link.js imports { api, currentUser }
```

Cyclic imports are forbidden. If you find one, split the shared code into a new sub-module.

---
## Part 4 — Domain Routing (Edge Middleware)

All three domains (`USER_DOMAIN`, `ADMIN_DOMAIN`, `RESELLER_DOMAIN`) point to the same Vercel deployment. The single job of `middleware.js` is to decide, based on the request's `Host` header, which HTML shell to serve and whether the request should even be allowed to reach any HTML at all.

### 4.1 Routing decision flow

```
                    Incoming request
                          │
                          ▼
              Extract hostname (Host header)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
 hostname ==        hostname ==        hostname ==
 USER_DOMAIN        ADMIN_DOMAIN       RESELLER_DOMAIN
        │                 │                 │
        │                 ▼                 │
        │       IP filter (Part 5)          │
        │                 │                 │
        │       ┌─────────┴─────────┐       │
        │       │                   │       │
        │       ▼                   ▼       │
        │   Pass                  Block     │
        │       │                   │       │
        ▼       ▼                   ▼       ▼
   Serve   Serve             Return         Serve
   index   admin             404.html       reseller
   .html   .html             + log          .html
```

### 4.2 Rules per domain

**IF `hostname === USER_DOMAIN` (e.g. `cr7game.shop`):**
- `/` → serve `index.html`
- Any path starting with `/admin` or `/reseller` → serve `404.html` (do not leak the existence of other domains)
- Static assets (`/css/*`, `/js/*`, `/assets/*`) → pass-through
- API routes (`/api/*`) → pass-through, but each API endpoint still validates its own auth
- Any other unknown route → serve `404.html`

**IF `hostname === ADMIN_DOMAIN`:**
- **First**, run the Admin IP filter (Part 5).
- If IP passes: `/` → serve `admin.html`.
- If IP does not pass: return `404.html` — **do not** hint that the admin panel exists.
- Any path starting with `/index.html` or `/reseller` → serve `404.html`.
- `/api/*` → pass-through, but every admin API endpoint re-runs the IP check per-request (defense in depth).

**IF `hostname === RESELLER_DOMAIN`:**
- `/` → serve `reseller.html`.
- Any path starting with `/admin` or `/index.html` → serve `404.html`.
- `/api/*` → pass-through; reseller endpoints validate the reseller session server-side.

**ELSE (unknown hostname):**
- Serve `404.html`. Do not respond with a message that reveals the deployment structure.

### 4.3 Implementation notes for `middleware.js`

- Runs on the Vercel Edge Runtime (not Node). Use `Response` and the `Request` object directly.
- Read hostname from `req.headers.get('host')` and strip any port suffix.
- All three domain names come from `process.env.USER_DOMAIN`, `process.env.ADMIN_DOMAIN`, `process.env.RESELLER_DOMAIN`. Do not hard-code hostnames.
- The IP allow-list is compared case-insensitively and IPv6-aware; use `req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()` — Vercel places the client IP first.
- The middleware itself must never log the request body. It logs only `{ hostname, path, ip, decision }` into `security_logs` when it blocks.

---

## Part 5 — Admin IP Access Control

Admin access is gated by a static IP allow-list stored in the environment variable `ADMIN_IPADDRESS` (comma-separated). Every request that ends up at the Admin domain is checked *before* any HTML or API logic runs.

### 5.1 Decision matrix

```
Admin domain request arrives
    │
    ▼
api/auth.js reads client IP:
    ip = (x-forwarded-for || x-real-ip).split(',')[0].trim()
    │
    ▼
Compare with ADMIN_IPADDRESS
    │
    ├──  ADMIN_IPADDRESS is empty / undefined
    │       │
    │       ▼
    │   Render "IP Setup Required" screen
    │     • Detected client IP is shown prominently in a monospace pill
    │     • [Copy IP] button copies the IP to clipboard and toasts "IP copied"
    │     • Step-by-step Vercel env instructions:
    │         1. Open your Vercel project dashboard
    │         2. Settings → Environment Variables → New
    │         3. Key: ADMIN_IPADDRESS  Value: <the copied IP>
    │         4. Redeploy
    │     • NO login form is shown — the panel is uninitialised
    │
    ├──  Env set AND client IP is in the allow-list
    │       │
    │       ▼
    │   Proceed to the Admin Login screen (Part 6)
    │
    └──  Env set AND client IP is NOT in the allow-list
            │
            ▼
        Serve 404.html (no hint whatsoever)
        INSERT INTO security_logs
          (ip_address, user_agent, attempted_domain, event_type, result, timestamp)
        VALUES
          ($1,          $2,          'admin',           'ADMIN_IP_BLOCKED', 'blocked', NOW())
```

### 5.2 What operators can do with the log

The Admin Security Logs page (Part 12) lists every blocked attempt with:
- Timestamp (localised to the operator's TZ)
- IP + country flag (looked up via a free GeoIP service, cached 24 h)
- Event-type badge (`ADMIN_IP_BLOCKED`, `ADMIN_LOGIN_FAIL`, `ADMIN_ACTION_PW_FAIL`, `USER_LOGIN_FAIL`, `ENV_MISSING`)
- User-Agent parsed into `{ browser, os, device_type }`
- Optional `details` JSONB (path attempted, referer if any)

### 5.3 Bypass hardening

- The IP check runs in **middleware** *and* is repeated inside every `/api/admin-*` handler. A leaked route cannot be used to bypass middleware.
- IPv4-mapped IPv6 addresses (`::ffff:1.2.3.4`) are normalised to IPv4 before comparison.
- CIDR ranges are supported in the env variable (`ADMIN_IPADDRESS=1.2.3.4,10.0.0.0/24`).

---

## Part 6 — Admin Login System

Once the IP check passes, the operator lands on the Admin Login screen. Login is a strict four-step flow.

### 6.1 Step 1 — Slider-Puzzle CAPTCHA

- A `<canvas>` renders a random background image with a puzzle-piece cut-out at a random X position (Y is fixed to keep it simple).
- The user drags a floating piece horizontally until it snaps into the cut-out.
- **Tolerance**: ±5 px between piece's `left` and target `left`.
- **Failure**: 3 wrong attempts → regenerate a new puzzle *and* start a 10-second cooldown during which the confirm button shows a live countdown ("Try again in 10s… 9s…").
- Shared component: `js/captcha-slider.js` (loaded by both user signup and admin login).

**States** (all five are required):
- Loading: skeleton grey block of canvas size.
- Empty: never occurs (puzzle is always seeded).
- Success: piece snaps with a soft "click" sound (respect `prefers-reduced-motion`), overlay fades, password field focuses.
- Error: piece bounces back, "Not quite — try again" appears above the canvas in `--color-danger`.
- Interactive: hovering the piece cursor becomes `grab`; while dragging it becomes `grabbing`.

### 6.2 Step 2 — Password entry

- `<input type="password">` with an SVG eye toggle (`aria-label="Show password"` / `"Hide password"`).
- On submit: `POST /api/auth { action: 'admin_login', password }`.
- **Server-side check**:
  ```js
  const input = Buffer.from(password || '', 'utf8');
  const expected = Buffer.from(process.env.ADMIN_LOGIN_PASSWORD || '', 'utf8');
  if (input.length !== expected.length) return fail(); // constant-time-safe short-circuit
  const ok = crypto.timingSafeEqual(input, expected);
  ```
- **On failure**: return HTTP 401 + `{ error: 'invalid_password' }`, insert `security_logs` row with `event_type='ADMIN_LOGIN_FAIL'`, and enforce an exponential-backoff cooldown per IP (1 s → 2 s → 4 s → 8 s → cap at 60 s).

### 6.3 Step 3 — Session creation

- Insert into `admin_sessions`:
  ```sql
  INSERT INTO admin_sessions (token, ip_address, user_agent, expires_at)
  VALUES (gen_random_uuid(), $1, $2, NOW() + INTERVAL '30 days')
  RETURNING token;
  ```
- Set an HTTP-only cookie:
  ```
  Set-Cookie: admin_session=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000
  ```
- The client never sees the token in JS — the browser handles it automatically.

### 6.4 Step 4 — Logout

- `DELETE /api/auth` → delete the row from `admin_sessions` where `token = <cookie>` + return `Set-Cookie: admin_session=; Max-Age=0`.
- Redirect to `/` (which re-runs the IP + login check).

### 6.5 Session validation on every admin API call

Every `/api/admin-*` handler starts with:
```js
const token = readCookie(req, 'admin_session');
if (!token) return unauthorized();
const session = await supabase
  .from('admin_sessions')
  .select('*')
  .eq('token', token)
  .gt('expires_at', new Date().toISOString())
  .maybeSingle();
if (!session.data) return unauthorized();
// also re-run the IP check
if (!isIpAllowed(clientIp)) return forbidden();
```

If either check fails, the response is HTTP 401 or 403 with `{ error: 'session_invalid' }` — the client-side router treats that as "redirect to login".

---

## Part 7 — Users Dashboard: Real-Device Geolocation Permission Gate

### 7.1 Core concept — native browser permission, not a fake UI

**The website UI does not "ask" the user for permission.** The native browser (OS-level) geolocation dialog is the *only* mechanism. We do not draw a "please allow location" screen with our own "Allow" button; that would let a user click "Allow" in our fake UI without actually granting OS permission, defeating the whole point.

Our JavaScript triggers `navigator.geolocation.getCurrentPosition()` on page load, and the *browser* pops its own native modal. Our HTML shell shows only a full-screen "locked" overlay that:
- Explains what state the permission is in (device off / denied / prompting / timeout)
- Tells the user exactly how to change that state on their OS / browser
- Retries when the user says they've made the change

```
Page load
   │
   ▼
02-location-gate.js runs IMMEDIATELY
(all other modules await the 'location-ready' event)
   │
   ▼
navigator.geolocation.getCurrentPosition(...)
   │
   ▼
Browser consults OS-level device-location state
   │
   ├── Device location services OFF
   │     → Browser fires POSITION_UNAVAILABLE
   │     → Show Screen 1 (device-off instructions, per OS)
   │
   ├── Device ON + browser permission not yet granted
   │     → Browser shows its native permission dialog
   │     ├── User taps Allow  → onSuccess(position) → dispatch 'location-ready'
   │     └── User taps Deny   → Show Screen 2 (permission denied)
   │
   └── Device ON + browser permission already granted
         → Direct onSuccess → dashboard proceeds
```

### 7.2 Permission detection matrix (full code)

```javascript
// js/index/02-location-gate.js
import { showOverlay, hideOverlay, throttle } from './01-core.js';

async function checkLocationPermission() {
    if (!navigator.permissions || !navigator.geolocation) {
        // Very old browser — no Permissions API + no geolocation
        showBrowserUnsupportedScreen();
        return;
    }
    const permResult = await navigator.permissions.query({ name: 'geolocation' });

    switch (permResult.state) {
        case 'granted': startLocationTracking(); break;
        case 'prompt':  requestGeolocation();    break;
        case 'denied':  showPermissionDeniedScreen(); break;
    }

    // React to permission changes without a page reload
    permResult.onchange = () => checkLocationPermission();
}

function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function onLocationError(err) {
    switch (err.code) {
        case err.PERMISSION_DENIED:    showPermissionDeniedScreen(); break;
        case err.POSITION_UNAVAILABLE: showDeviceLocationOffScreen(); break;
        case err.TIMEOUT:              showTimeoutScreen(); break;
        default:                       showGenericErrorScreen(err);
    }
}

function onLocationSuccess(position) {
    document.getElementById('location-lock-overlay')?.remove();
    window.dispatchEvent(new CustomEvent('location-ready', { detail: position }));
    sendLocationToServer(position);   // non-blocking background POST
    startWatchPosition();             // 30-second throttled continuous update
}
```

Every other module (`03-auth.js`, `04-intro-topbar.js`, `05-home-feed.js`, …) begins with:
```js
await new Promise(r => window.addEventListener('location-ready', r, { once: true }));
```
so nothing else runs until permission is granted.

### 7.3 Lock-screen UI — three variants (all use the SVG icon sprite)

**Screen 1 — Device location OFF**
```
┌───────────────────────────────────────────┐
│                                           │
│     [SVG: phone + location-slash]         │  120 px, animated pulse (2 s loop)
│                                           │
│     "Location Services are OFF"           │  22 px, bold, white
│                                           │
│     "Please enable Location Services      │  14 px, --text-secondary
│      on your device to continue."         │
│                                           │
│  ▸ iOS (auto-shown when UA is iOS):       │
│      Settings → Privacy & Security →      │
│      Location Services → ON               │
│                                           │
│  ▸ Android (auto-shown when UA is Android):│
│      Settings → Location → ON             │
│                                           │
│  ┌──────────────────────────────────┐     │
│  │  I've enabled it — try again     │     │  Clipped primary button
│  └──────────────────────────────────┘     │
│                                           │
└───────────────────────────────────────────┘
```

**Screen 2 — Browser permission denied**
- SVG: location pin + lock icon, tinted `--color-danger`.
- Title: "Location permission required".
- Body: browser-specific instructions with a small SVG diagram of the URL-bar padlock/permissions icon (Chrome / Safari / Firefox variants selected by UA sniff).
- Button: "I've allowed it — continue" → retries `checkLocationPermission()`.

**Screen 3 — GPS timeout**
- SVG: satellite (slow rotate animation, 4 s linear infinite).
- Title: "Locating…"
- Progress bar: 10-second countdown that fills left→right.
- Button (appears after countdown): "Try again".

**Screen 4 — Browser unsupported** (rare, for very old browsers)
- SVG: browser icon with a warning triangle.
- Title: "Your browser doesn't support location".
- Body: "Please open this site in the latest Chrome, Safari, Firefox, or Edge."
- No retry button (the situation is not recoverable in-page).

Every screen uses the same design tokens as the rest of the app (Part 16), sits at `z-index: 99999`, and covers the whole viewport with `position: fixed; inset: 0`.

### 7.4 Server save flow

```
onLocationSuccess
   │
   ▼
POST /api/location
   │
   ▼
api/location.js:
  1. ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip']
  2. { browser, os, device_type } = parseUserAgent(req.headers['user-agent'])
  3. platform = /CR7GameApp\//.test(req.headers['user-agent']) ? 'app' : 'web'
  4. reverse-geocode via Nominatim (rate-limited to 1 req/s + in-memory 24 h cache):
        GET https://nominatim.openstreetmap.org/reverse
            ?lat={lat}&lon={lon}&format=json&zoom=14&addressdetails=1
        Header: User-Agent: ${process.env.NOMINATIM_USER_AGENT}
  5. Supabase UPSERT into user_location_tracking:
        ON CONFLICT (user_id) DO UPDATE SET
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          accuracy = EXCLUDED.accuracy,
          address = EXCLUDED.address,
          ip_address = EXCLUDED.ip_address,
          user_agent = EXCLUDED.user_agent,
          browser = EXCLUDED.browser,
          os = EXCLUDED.os,
          device_type = EXCLUDED.device_type,
          platform = EXCLUDED.platform,
          updated_at = NOW()
  6. Response: { success: true, address }
```

If reverse geocoding fails (Nominatim 5xx or timeout), the row is still upserted with `address = NULL` and the client receives `{ success: true, address: null }` — the map will fall back to displaying "Unknown location" for that user.

### 7.5 Continuous watch position (movement tracking)

```javascript
function startWatchPosition() {
    navigator.geolocation.watchPosition(
        throttledUpdate,
        handleWatchError,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
}

const throttledUpdate = throttle((position) => {
    fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy:  position.coords.accuracy,
            user_id:   currentUser?.id,
            action:    'update'
        })
    });
}, 30_000); // 30 s — matches the Admin Map auto-refresh cadence (Part 11)
```

`handleWatchError` re-uses `onLocationError`. If the OS reports repeated `POSITION_UNAVAILABLE` after initial success (user turned location OFF mid-session), we re-show Screen 1 as an overlay — the dashboard keeps its last-known state visible behind it.

---
## Part 8 — Users Dashboard: Complete Page-by-Page Specification

This part is the exhaustive per-page contract for the Users Dashboard. Every page below must exist, and every state described below must be built. The design tokens are defined in Part 16 — do not invent new colours, radii, or shadows here.

### 8.1 Global layout (applies to every page)

```
┌───────────────────────────────────────────────────────────────┐
│  TOPBAR — 60 px, position: fixed, top: 0, z-index: 1000       │
│  [Logo]      [Search]     [Notif bell]      [Avatar / Login]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  CONTENT AREA                                                 │
│  padding-top: 60px    padding-bottom: 64px                    │
│  (Only this region scrolls — the bars are pinned.)            │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│  BOTTOM NAV — 64 px, position: fixed, bottom: 0, z: 1000      │
│  [ Home ] [ G Store ] [ Cart ] [ Orders ] [ Profile ]         │
└───────────────────────────────────────────────────────────────┘
```

**Topbar detail**

- **Left**: brand logo (SVG, 30 px tall, uses `currentColor`) followed by the wordmark (SVG text, hidden on screens narrower than 360 px).
- **Center**: search icon (magnifying-glass SVG). Click opens the full-screen Global Search overlay (§ 8.12) at `z-index: 3000`.
- **Right**:
  - Notification bell (SVG). If `notifications_unread_count > 0`, an 8 px red dot appears at top-right of the icon. Click routes to `#/notifications`.
  - Avatar circle (48 × 48, gradient-filled with the user's first initial in white). If the user is a guest, this is replaced with a `Login` button (clipped, `--gradient-accent`).
- **Avatar dropdown** — appears on click at `z-index: 1500`, aligned to the right edge of the avatar, with a 12 px offset from the topbar bottom:
  - My Profile → `#/profile`
  - My Orders → `#/orders`
  - Balance History → `#/profile/balance`
  - **Reseller Dashboard** → external link to `RESELLER_DOMAIN`, only visible when `users.role === 'reseller'`. Uses the exchange-token flow (Part 14.5).
  - Logout → clears the session cookie and hard-reloads to `/`.

Every dropdown item is a full-width row with an SVG icon on the left, label in the centre, and a right-chevron on the right. Hover raises the row's background to `--surface-2`.

**Bottom nav detail** (5 tabs, SVG icons only — no emoji)

| Tab | SVG icon | Route | Notes |
|---|---|---|---|
| Home | house | `#/home` | Default landing after login. |
| G Store | gamepad | `#/gstore` | Includes deposit CTA. |
| Cart | shopping-bag | `#/cart` | Icon carries a circular badge with `cart_items_count`; badge hidden when count is 0. |
| Orders | clipboard-list | `#/orders` | Realtime-subscribed. |
| Profile | user-circle | `#/profile` | Falls back to Login page if guest. |

Active tab: icon fills with `--color-accent-cyan`, label text turns `--color-accent-cyan`, and a 2 px underline slides in from the previous active tab's position (150 ms `cubic-bezier(0.4, 0, 0.2, 1)`).

**Universal loading pattern**

Every page renders its skeleton immediately (before the first API call resolves). The skeleton must reproduce the final layout precisely so there is no layout shift when data arrives.

**Universal empty pattern**

Every list has an empty state. Empty states are: SVG illustration (200 px), title (18 px semi-bold), body (14 px `--text-secondary`), and a single CTA button. The illustration must inherit theme colour.

---

### 8.2 Page: Home (`#/home`)

**Layout, top to bottom**

```
┌───────────────────────────────────────────────────────┐
│  BANNER CAROUSEL — 180 px tall, auto-slide every 5 s │
│    Full-width image with dark gradient overlay        │
│    Bottom-left: title (20 px bold) + CTA button       │
│    Bottom-centre: pagination dots (● ○ ○ ○)           │
├───────────────────────────────────────────────────────┤
│  MENU GRID — admin-defined menus                      │
│    Section title + [See all →] link on the right       │
│    4 columns on mobile, 6 on tablet, 8 on desktop      │
│    Each cell: SVG icon (52 px) + menu name (12 px)     │
├───────────────────────────────────────────────────────┤
│  FEATURED PRODUCTS                                    │
│    3 columns on mobile, 4 on tablet, 6 on desktop      │
│    Uses the standard product-card component            │
├───────────────────────────────────────────────────────┤
│  LATEST NEWS — horizontal scroll                      │
│    3 visible on mobile, swipe for more                 │
├───────────────────────────────────────────────────────┤
│  YOUTUBE CHANNEL VIDEOS                               │
│    From YouTube Data API v3 (cached 5 min on server)   │
│    2 columns, each cell: thumbnail + title + views     │
├───────────────────────────────────────────────────────┤
│  CUSTOMER REVIEWS                                     │
│    Carousel of published reviews (5-star rating)       │
└───────────────────────────────────────────────────────┘
```

**Banner carousel**

- Source: `SELECT * FROM banners WHERE is_active = TRUE AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW()) ORDER BY sort_order`.
- Auto-slide every 5 s; pause on hover / touch-hold.
- Swipe left / right (touch) or drag (mouse) to advance manually.
- Pagination dots reflect the current slide index; clicking a dot jumps to that slide.
- CTA button target: `banners.cta_url` (an internal hash-route or an external URL — internal is preferred).
- Image URLs are always **masked** through `/api/imgbb?token=…` (Part 15.2).

**Menu grid**

- Source: `SELECT id, name, icon_svg, sort_order FROM menus WHERE is_active = TRUE AND visible_to_user = TRUE ORDER BY sort_order`.
- **Click behaviour**: full-page navigation to `#/menu/{menu_id}` (Menu Detail, § 8.3). Not a modal, not an overlay — a real route change.
- **Empty state**: SVG (folder-open with a question mark) + "No menus available yet" + CTA "Refresh".

**Featured products**

- Source: `SELECT * FROM products WHERE is_featured = TRUE AND is_active = TRUE ORDER BY featured_order LIMIT 6`.
- Uses the same product-card component as the Category Detail page (see § 8.4 for the four card styles).
- **Add to Cart button** on each card triggers the fly-to-cart animation (see § 8.5 Add-to-cart behaviour).

**Latest news**

- Source: `SELECT * FROM news WHERE is_published = TRUE ORDER BY published_at DESC LIMIT 10`.
- Horizontal scroll container, snap-scroll to card edges.
- Each card: thumbnail (16:9), title (2 lines max, ellipsis), published date.

**YouTube videos**

- Server route: `GET /api/youtube?channelId=<env.CHANNEL_ID>&limit=6`.
- Response: `[{ videoId, title, thumbnail, viewCount, publishedAt }]`.
- Server caches for 5 minutes in memory. If the YouTube API returns an error, the section renders its error state: "Videos unavailable — try again in a moment" + Retry.

**Customer reviews carousel**

- Source: `SELECT * FROM product_reviews WHERE rating >= 4 AND is_visible = TRUE ORDER BY created_at DESC LIMIT 10`.
- Each slide: user avatar + username + 5-star row (SVG stars filled per rating) + review text (3 lines max) + product name.

**All five states, applied to Home**

1. **Loading**: banner (grey 180 px block), menu grid (24 grey squares), 6 product-card skeletons, 4 news skeletons.
2. **Empty**: only occurs if the DB is empty. Full-page empty state: "Nothing here yet — check back soon".
3. **Success**: as described above.
4. **Error**: banner, menu grid, product list, news, YouTube each own their own retry. A whole-page API failure shows a full-page retry.
5. **Interactive**: banner drag, menu-cell hover (lift 2 px + `--shadow-md`), product-card hover (see § 8.4).

**Menu click flow — CRITICAL**

```
User taps a menu tile (e.g. "Mobile Games")
    ↓
Route changes to  #/menu/{menu_id}
    ↓
A NEW PAGE is rendered — not a modal, not an overlay.
    ↓
Menu Detail page (§ 8.3) shows the categories that belong to that menu.
```

---

### 8.3 Page: Menu Detail (`#/menu/{menu_id}`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   Menu Name                     [Search]      │
│  Optional: menu description (14 px, --text-secondary)   │
│  Menu cover banner (full-width, 200 px tall)            │
├─────────────────────────────────────────────────────────┤
│  CATEGORIES UNDER THIS MENU                             │
│  Grid: 2 columns on mobile, 3 on tablet, 4 on desktop   │
│                                                         │
│  ┌───────────────────┐   ┌───────────────────┐          │
│  │  [category image] │   │  [category image] │          │
│  │  4:3 aspect ratio │   │                   │          │
│  │  ┌─ overlay ────┐ │   │                   │          │
│  │  │ Name         │ │   │  Name             │          │
│  │  │ 24 products  │ │   │  15 products      │          │
│  │  └──────────────┘ │   │                   │          │
│  └───────────────────┘   └───────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

**Data flow**

```
GET /api/supabase
  ?table=menu_categories
  &menu_id={id}

Response: [{ id, name, image_url, product_count, sort_order, is_active }]
Order:    sort_order ASC, then created_at DESC
```

`product_count` is a derived column materialised by the trigger `refresh_category_product_count` on `products` insert/update/delete (Part 21). This avoids a live `COUNT(*)` on every page load.

**Interaction**

- Click a category card → full-page navigation to `#/category/{category_id}`.
- Back button uses history.back() if the history stack has an in-app entry, otherwise falls back to `#/home`.
- Search icon opens the Global Search overlay scoped to the current menu (see § 8.12).

**All five states**

1. Loading: 6 category-card skeletons in the grid.
2. Empty: SVG (empty box) + "No categories in this menu yet" + "Explore Home".
3. Success: as above.
4. Error: full-page retry.
5. Interactive: card hover raises `--shadow-lg` and slightly scales (`transform: scale(1.02)`, 200 ms).

---

### 8.4 Page: Category Detail (`#/category/{category_id}`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   Category Name                 [Filter]      │
│  Breadcrumb: Home  ›  Menu Name  ›  Category Name       │
├─────────────────────────────────────────────────────────┤
│  STICKY FILTER BAR (appears after 80 px scroll)         │
│  [ Sort: Latest ▼ ]  [ Price range ]  [ ☑ In stock ]     │
├─────────────────────────────────────────────────────────┤
│  PRODUCTS GRID — layout is DYNAMIC per product          │
│  (Admin chooses `display_style` per product)            │
│                                                         │
│  Style A — GRID_CARD (default)                          │
│  Three cards per row on mobile.                         │
│                                                         │
│  Style B — LIST_HORIZONTAL                              │
│  Single column, thumb 80 × 80 on the left, name/price   │
│  in the middle, [Buy+] on the right.                    │
│                                                         │
│  Style C — FEATURED_LARGE                               │
│  Full-width image (220 px), title + description + CTA   │
│  overlaid on a gradient at the bottom.                  │
│                                                         │
│  Style D — COMPACT_MASONRY                              │
│  Two-column Pinterest-style masonry, variable heights.  │
├─────────────────────────────────────────────────────────┤
│  Pagination OR infinite scroll (admin toggle per menu)  │
│  Loading skeleton at bottom while fetching next page.   │
└─────────────────────────────────────────────────────────┘
```

**Sort options** (dropdown): Latest, Price low → high, Price high → low, Best-selling, Rating.

**Product-card states** (mandatory)

- **Loading**: shimmer grey card.
- **In stock**: normal card, [Buy+] enabled.
- **Out of stock**: greyscale image + red ribbon "Out of stock" top-right; [Buy+] disabled.
- **On sale**: gold discount badge top-left ("−25%"), price + strikethrough original price.
- **New**: cyan ribbon top-left ("New").
- **Hover**: card lifts 4 px, `--shadow-lg` intensifies, [Buy+] fills with `--gradient-accent`.

**Data flow**

```
GET /api/supabase
  ?table=products
  &category_id={id}
  &sort=<sort_key>
  &min_price=<n>&max_price=<n>
  &in_stock=<0|1>
  &page=<n>&page_size=24
```

Server-side, the query is issued through the RLS-scoped Supabase client — the anon key can only see rows where `is_active = TRUE`.

**Product click flow**

```
Tap a product card
    ↓
Route changes to  #/product/{product_id}
    ↓
Full-page Product Detail view (§ 8.5)
```

**Five states**

1. Loading: 6–8 product-card skeletons matching the current `display_style`.
2. Empty: SVG (empty shelf) + "No products found — try a different filter" + [Reset filters].
3. Success: as above.
4. Error: full-page retry + a "Report problem" small link that logs to `security_logs`.
5. Interactive: sort dropdown, price-range slider, in-stock checkbox all update the URL query and re-fetch (debounced 300 ms).

---

### 8.5 Page: Product Detail (`#/product/{product_id}`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]        [Share]        [Heart / Favorite]      │
├─────────────────────────────────────────────────────────┤
│  IMAGE GALLERY                                          │
│  Main image (300 px tall), swipeable if multiple.       │
│  Pagination dots below.                                 │
│  Thumbnail row: [1] [2] [3] [4] under the main image.   │
├─────────────────────────────────────────────────────────┤
│  PRODUCT INFO                                           │
│  Name (22 px, bold)                                     │
│  ★★★★★  4.8  (128 reviews)                              │
│  Category: Menu ›  Category                             │
│  Price: 12,500 MMK  (large, --color-accent-gold)        │
│  Original price: 15,000 MMK  (strikethrough, if on sale)│
│  Stock:  42 available  (green)  /  Out of stock (red)   │
├─────────────────────────────────────────────────────────┤
│  DESCRIPTION                                            │
│  Sanitised HTML from admin CMS.                         │
│  [Read more ▼]  if the copy is longer than 6 lines.      │
├─────────────────────────────────────────────────────────┤
│  VARIANTS / OPTIONS  (only if `products.variants` set)  │
│  Size:  [ S ] [ M ] [ L ] [ XL ]                        │
│  Colour: [○ Red] [○ Blue] [○ Green]                     │
├─────────────────────────────────────────────────────────┤
│  QUANTITY                                               │
│  [ − ]    [ 1 ]    [ + ]                                │
├─────────────────────────────────────────────────────────┤
│  DELIVERY INFO                                          │
│  Delivery: 1–3 days (city-based).                       │
│  Return policy: 7 days.                                 │
├─────────────────────────────────────────────────────────┤
│  RELATED PRODUCTS  (horizontal scroll)                  │
├─────────────────────────────────────────────────────────┤
│  REVIEWS                                                │
│  Filter chips: [All] [5★] [4★] [3★] [2★] [1★]           │
│  Review cards: user avatar, rating, text, optional photo│
├─────────────────────────────────────────────────────────┤
│  FIXED BOTTOM ACTION BAR (sits above bottom nav)        │
│  [ Add to cart ]              [ Buy now → ]             │
└─────────────────────────────────────────────────────────┘
```

**Add-to-cart behaviour**

- Click → animate a clone of the main image flying from the gallery into the bottom-nav Cart icon. Animation: 500 ms `cubic-bezier(0.4, 0, 0.2, 1)`, scale from 1 → 0.2, opacity from 1 → 0.4 during the flight.
- On animation end: increment the badge with a small bounce (`scale(1) → scale(1.25) → scale(1)` in 240 ms) and fire toast "Added to cart".
- Server call: `POST /api/supabase { table: 'cart_items', op: 'upsert', data: { user_id, product_id, quantity, selected_variants } }`. Merge policy: if the same `(user_id, product_id, selected_variants)` combination already exists, its quantity is incremented; otherwise a new row is inserted.
- Guest users: cart is stored in `localStorage` under the key `cart_guest_v1`. On login, `mergeGuestCartIntoUserCart()` is called (a server-side merge RPC).

**Buy-now behaviour**

- Skips the cart entirely and navigates to `#/checkout?instant=1&product_id=…&qty=…&variants=…`.
- The Checkout page recognises `instant=1` and hides the "back to cart" affordance.

**Reviews section**

- Source: `SELECT * FROM product_reviews WHERE product_id = $1 AND is_visible = TRUE ORDER BY created_at DESC LIMIT 20`.
- Rating filter chips are pill buttons; the selected chip is filled with `--gradient-accent`.
- Each review card: avatar, username, rating stars, date, review text, up to 3 photo thumbnails (click to expand into lightbox at `z-index: 3000`).

**Share button**

- Uses `navigator.share({ title, text, url })` on supported browsers; falls back to a modal with a copy-URL field + social buttons (only "Copy link" is guaranteed to work; social links open in a new tab).

**Favorite (heart) button**

- Toggles a row in `favorites` (`user_id`, `product_id`, `created_at`). Optimistic UI: heart fills immediately; on server error, it reverts and shows a toast "Couldn't save favorite — try again".

**All five states** are required — Loading (skeleton with gallery + description blocks), Empty (rare: only if the product row is deleted between the list and the detail page → show "Product not found" + back button), Success, Error, Interactive.

---

### 8.6 Page: G Store (`#/gstore`)

The G Store is the paid-goods layer: game top-ups (v1 API) and gift cards (v2 API). It is a self-contained mini-app that shares the topbar + bottom nav.

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  VIRTUAL BALANCE CARD (sticky-top under topbar)         │
│  ┌────────────────────────────────────────────────┐    │
│  │  [wallet SVG]   Virtual Balance                │    │
│  │  15,500 MMK   (32 px bold, --color-accent-gold)│    │
│  │  [ + Deposit ]                     [History → ]│    │
│  └────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  TAB BAR                                                │
│  [ Game Topup ]      [ Gift Cards ]  ← underline active │
├─────────────────────────────────────────────────────────┤
│  === TAB A: Game Topup (requires Player ID) ===        │
│                                                         │
│  Category filter chips (horizontal scroll)              │
│  [ All ] [ Mobile Legends ] [ Free Fire ] [ PUBG ] …    │
│                                                         │
│  Games grid — 3 columns on mobile:                     │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│    │ [icon]   │ │ [icon]   │ │ [icon]   │              │
│    │ Game name│ │ Game name│ │ Game name│              │
│    │  TOPUP   │ │  TOPUP   │ │  TOPUP   │              │
│    └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
│  === TAB B: Gift Cards (no Player ID) ===              │
│  Same grid, categories: Google Play / Steam / App Store │
│  / Netflix, etc. Redeem codes are delivered on order.  │
└─────────────────────────────────────────────────────────┘
```

**Deposit flow**

```
Click [+ Deposit]
    ↓
Deposit modal opens at z-index: 2000
    ┌────────────────────────────────┐
    │  Deposit funds            [×]  │
    │                                │
    │  Choose method:                │
    │  ○ KBZ Pay                     │
    │  ○ Wave Pay                    │
    │  ○ AYA Pay                     │
    │  ○ CB Pay                      │
    │                                │
    │  Amount:  [__________] MMK     │
    │                                │
    │  Instructions:                 │
    │  Send to 09-xxx-xxxxxx         │
    │  Reference: <auto-generated>   │
    │                                │
    │  Screenshot upload:            │
    │  ┌───────────────────────┐     │
    │  │  Drop file or click   │     │
    │  │  Max 5 MB — JPG/PNG   │     │
    │  └───────────────────────┘     │
    │                                │
    │  [ Submit for review ]         │
    └────────────────────────────────┘
    ↓
1. Upload screenshot: POST /api/imgbb (server proxies to ImgBB)
   → returns masked URL
2. POST /api/balance
   { action: 'deposit_request',
     amount, method, screenshot_url, reference }
3. Server INSERTs into deposit_requests with status='pending'
4. Toast: "Deposit submitted — admin will review it shortly"
```

The deposit row is realtime-subscribed; when admin approves it, the user's balance card updates in place and a toast appears: "Deposit approved — +10,000 MMK added".

**Game topup flow (per-game page)**

```
Tap a game tile
    ↓
Route:  #/gstore/game/{game_code}
    ↓
Server call:  GET /api/g2bulk-v1?op=fields&game=<game_code>
              (server proxies to G2Bulk to get the required input fields)
    ↓
Dynamic form is rendered:

    ┌─────────────────────────────────────┐
    │  Mobile Legends: Diamond Topup       │
    │                                      │
    │  Player ID:  [___________]           │
    │  Zone ID:    [___________]           │
    │  [ Verify player info ]              │  ← Calls G2Bulk /verify
    │                                      │
    │  Verified: "Player123 (level 55)"     │
    │                                      │
    │  Select package:                     │
    │  ○ 100 diamonds — 3,500 MMK          │
    │  ● 500 diamonds — 15,000 MMK         │
    │  ○ 1,000 diamonds — 28,000 MMK       │
    │                                      │
    │  [ Continue to payment → ]           │
    └─────────────────────────────────────┘
    ↓
Transaction PIN modal appears
    "Enter your 4-digit transaction PIN"
    [ _ ][ _ ][ _ ][ _ ]
    5 wrong attempts → 60-second lockout (toast + disabled input)
    ↓
POST /api/g2bulk-v1
    { action:'place_order', game_code, player_id, zone_id,
      package_id, pin }
    ↓
Server-side:
  1. Verify PIN with bcrypt.compare against users.transaction_pin_hash.
  2. Read the AUTHORITATIVE balance from the DB (never trust the client value).
  3. Deduct via RPC:
       update_user_balance(user_id, -amount, 'gstore_topup', order_id)
  4. Call G2Bulk with the server's API key.
  5. INSERT INTO g2bulk_orders (status='processing', g2bulk_order_id).
  6. On G2Bulk error → refund via RPC:
       update_user_balance(user_id, +amount, 'refund', order_id)
     and mark the row status='failed'.
    ↓
Success screen:
    ┌────────────────────────────────────┐
    │  [ SVG checkmark, animated ]        │
    │  Topup successful                   │
    │                                     │
    │  Our reference:  #ORD-000123        │
    │  G2Bulk ID:      G2B-98765  [Copy]  │
    │                                     │
    │  Delivery status: Processing…       │
    │  (auto-refresh every 5 s)           │
    │                                     │
    │  [ View orders ]  [ Buy more ]      │
    └────────────────────────────────────┘
```

Delivery status polls `GET /api/g2bulk-v1?op=status&order_id=…` every 5 s until the row transitions to `delivered` or `failed`; then it stops polling and updates the DB row status.

**Gift-card flow**

- Same shape but no Player ID / Zone ID inputs.
- On success, the server returns a redemption code that is stored in `g2bulk_orders.redemption_code` (encrypted with `AES_ENCRYPTION_KEY`) and displayed to the user with a masked view + [Reveal] button + [Copy] button.
- Reveal expires 60 s after first reveal; after that the user must return to the Order Detail page (which re-decrypts server-side under RLS).

**Five states for G Store**

1. Loading: balance card skeleton, game-grid skeletons.
2. Empty: unlikely (admin should always have at least one game/gift-card synced); if it happens, "No products available".
3. Success: as above.
4. Error: if G2Bulk is unreachable, show a bar at the top of the G Store: "G Store temporarily unavailable — you can still browse other pages" and disable the tab.
5. Interactive: category chips scroll horizontally with momentum, active chip highlighted; game tile hover raises `--shadow-md`.

---

### 8.7 Page: Cart (`#/cart`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   Cart ({count} items)          [ Clear all ] │
├─────────────────────────────────────────────────────────┤
│  CART ITEMS                                             │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │ [thumb 80×80]  Product name          [Delete ×]│      │
│  │                Variant: Size L                 │      │
│  │                Unit price: 12,500 MMK          │      │
│  │                [ − ]   2   [ + ]               │      │
│  │                Subtotal: 25,000 MMK            │      │
│  └───────────────────────────────────────────────┘      │
│  ┌───────────────────────────────────────────────┐      │
│  │ …                                              │      │
│  └───────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  PROMO CODE                                             │
│  ┌───────────────────────────────┐  ┌──────────┐        │
│  │ Enter promo code              │  │ Apply    │        │
│  └───────────────────────────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────┤
│  SUMMARY  (sticky bottom, above bottom nav)             │
│  Subtotal:      45,000 MMK                              │
│  Discount:      −5,000 MMK                              │
│  Delivery:      +1,500 MMK                              │
│  ─────────────────────                                  │
│  Total:         41,500 MMK                              │
│                                                         │
│  [ Proceed to checkout → ]     ← clipped, full-width    │
└─────────────────────────────────────────────────────────┘
```

**Behaviour**

- **Quantity change**: optimistic UI update (the subtotal and grand total update instantly), then a debounced (500 ms) `POST /api/supabase { table:'cart_items', op:'update', … }`. If the server rejects (e.g. stock insufficient), the UI rolls back and a toast explains why.
- **Delete item**: swipe-left gesture on mobile (60 px threshold reveals a red delete button) OR click the × icon. Both routes trigger a *soft delete* — the row disappears from the list and a toast appears at the bottom with "Item removed — Undo" (5 s window). Undo re-inserts the row; otherwise the deletion is committed.
- **Clear all**: two-step confirmation modal ("Remove all items from cart?" + Cancel / Confirm). Not password-protected (this is a user action, not an admin action), but the modal still uses the two-step pattern.
- **Promo code**: submits to `/api/supabase { op:'validate_promo', code }`. Server checks `promo_codes` for validity, applicable-to-user rules, expiry, and single-use flag. On success, the summary updates and the code chip shows a green ✓; on failure, an error toast + red inline message.
- **Empty state**: SVG (empty basket), "Your cart is empty", [Shop now →] CTA to `#/home`.

**Realtime**

- If admin changes a product's price or marks it out of stock while it sits in the user's cart, the cart re-fetches on next open and shows an inline notice on the affected row: "Price changed — new: 13,000 MMK".

---

### 8.8 Page: Checkout (`#/checkout`)

**Layout — four steps on a single scrollable page**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   Checkout                                    │
├─────────────────────────────────────────────────────────┤
│  Step 1 — Delivery info                                 │
│  Name:      [___________________]                       │
│  Phone:     [___________________]                       │
│  Address:   [___________________]                       │
│  City:      [ Yangon ▼ ] (from admin cities list)       │
│  Township:  [ Hlaing ▼ ]                                │
│  Delivery note: [ textarea ]                            │
├─────────────────────────────────────────────────────────┤
│  Step 2 — Payment method                                │
│  ○ Virtual Balance  (15,500 MMK available)              │
│  ○ KBZ Pay                                              │
│  ○ Wave Pay                                             │
│  ○ Cash on Delivery (COD)                               │
├─────────────────────────────────────────────────────────┤
│  Step 3 — Payment  (only if method != Balance/COD)      │
│  Send 41,500 MMK to 09-xxx-xxxxxx                       │
│  Reference: ORD-{timestamp}                             │
│                                                         │
│  Upload screenshot: [ file input with preview ]         │
├─────────────────────────────────────────────────────────┤
│  Step 4 — Order summary                                 │
│  Mini product list.                                     │
│  Grand total: 41,500 MMK                                │
├─────────────────────────────────────────────────────────┤
│  [ Place order ]  ← clipped, animated, full-width       │
└─────────────────────────────────────────────────────────┘
```

**Place-order server flow**

- If method = **Virtual Balance**:
  1. Server verifies `users.game_balance >= grand_total` using the fresh DB read.
  2. Deducts via `update_user_balance(user_id, -grand_total, 'checkout_order', order_id)`.
  3. Inserts the order with `status='paid_awaiting_admin'`.
  4. Admin still approves the fulfilment (physical goods) — the money side is settled.
- If method = **COD**:
  - Order inserted with `status='pending_cod'`. No balance move. Admin later marks it delivered → `status='completed'`.
- If method = **KBZ / Wave / AYA / CB**:
  - Order inserted with `status='pending_payment_review'` and `payment_screenshot_url`.
  - Admin reviews and either approves (→ `paid_awaiting_admin`) or rejects with a reason.

**On success**, the user is routed to `#/orders/{new_order_id}` (Order Detail).

**Five states**:
1. Loading: skeleton form (grey rectangles for each field group).
2. Empty: not applicable (cart cannot be empty here — if it is, redirect to `#/cart`).
3. Success: as above.
4. Error: server rejection is shown inline under the offending step (e.g. "Insufficient balance").
5. Interactive: form validation is inline and per-field on blur.

---

### 8.9 Page: Orders List (`#/orders`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   My orders                                   │
├─────────────────────────────────────────────────────────┤
│  TABS: [ All ] [ Pending ] [ Processing ] [ Completed ] │
│        [ Cancelled ]                                    │
├─────────────────────────────────────────────────────────┤
│  ORDER CARDS                                            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [order icon]   Order #ORD-000123                │    │
│  │                Placed: Jan 15, 2024             │    │
│  │  Products:     ML Diamond 500 + 1 more          │    │
│  │  Total:        15,000 MMK                       │    │
│  │  Status:       [ PENDING ]  (orange badge)      │    │
│  │  [ View details → ]                             │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Status badge colours**:
- Pending → orange (`--color-warn`)
- Processing → cyan (`--color-accent-cyan`)
- Completed → green (`--color-success`)
- Cancelled → grey (`--color-muted`)
- Refunded → purple (`--color-refund`)

**Realtime**

- Subscribes to Supabase Realtime channel `user-orders-{user_id}` — status updates arrive live and the badge/text animates a brief flash.

**Five states**: Loading (5 card skeletons), Empty ("No orders yet — start shopping"), Success, Error, Interactive (tab underline slide, card hover).

---

### 8.10 Page: Order Detail (`#/orders/{order_id}`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]   Order #ORD-000123                           │
├─────────────────────────────────────────────────────────┤
│  STATUS TIMELINE (vertical)                             │
│  ● Order placed         Jan 15, 14:30                   │
│  ● Payment confirmed    Jan 15, 14:45                   │
│  ○ Processing           (pending)                       │
│  ○ Delivered            (pending)                       │
├─────────────────────────────────────────────────────────┤
│  PRODUCTS                                               │
│  [thumb] Name × 2      ...  25,000 MMK                  │
│  [thumb] Name × 1      ...  15,000 MMK                  │
├─────────────────────────────────────────────────────────┤
│  DELIVERY                                               │
│  Name / phone / address                                 │
├─────────────────────────────────────────────────────────┤
│  PAYMENT                                                │
│  Method: KBZ Pay                                        │
│  Screenshot: [thumbnail — click to expand full-screen]  │
│  Reference: ORD-000123                                  │
├─────────────────────────────────────────────────────────┤
│  TOTAL BREAKDOWN                                        │
│  Subtotal / Discount / Delivery / Grand total           │
├─────────────────────────────────────────────────────────┤
│  ACTIONS                                                │
│  If status = 'pending':      [ Cancel order ]           │
│  If status = 'completed':    [ Reorder ] [ Write review]│
│  Always:                     [ Contact support ]        │
└─────────────────────────────────────────────────────────┘
```

Cancel order is only allowed within 5 minutes of placing it (server enforces via a check on `created_at`). Reorder duplicates the line items into the current cart. Write review opens a modal for star + text + up to 3 photos.

---

### 8.11 Page: Profile (`#/profile`)

**Layout**

```
┌─────────────────────────────────────────────────────────┐
│  PROFILE HEADER (200 px, gradient background)           │
│    [ avatar circle 80 px, gradient fill w/ initial ]    │
│    Username                                             │
│    user@gmail.com                                       │
│    [ Edit profile ]  (small button)                     │
├─────────────────────────────────────────────────────────┤
│  BALANCE CARD                                           │
│  Virtual Balance:  15,500 MMK                           │
│  [ + Deposit ]    [ History ]                           │
├─────────────────────────────────────────────────────────┤
│  MENU LIST                                              │
│  [SVG] My orders               →                        │
│  [SVG] My VPS                  →    ← only if VPS assigned │
│  [SVG] Reseller Dashboard      →    ← only if role='reseller' │
│  [SVG] KYC application         →    ← only if role='user'  │
│  [SVG] Transaction PIN         →                        │
│  [SVG] Change password         →                        │
│  [SVG] Notifications           →                        │
│  [SVG] Language                →                        │
│  [SVG] Help & support          →                        │
│  [SVG] Terms & privacy         →                        │
│  ─────────────                                          │
│  [SVG red] Logout                                       │
└─────────────────────────────────────────────────────────┘
```

**Sub-pages**

- `#/profile/vps` — lists all VPS instances assigned to the current user (each card: IP, username, password with show/hide toggle, one-click SSH command copy, expiry countdown).
- `#/profile/kyc` — application form (full name, NRIC, business name, business type, ID photos: front / back / selfie). Uploads go through the ImgBB proxy. Insert row into `reseller_kyc (status='pending')`. Toast: "KYC submitted — review takes 1–7 days".
- `#/profile/pin` — set / change transaction PIN. Requires the current password to change PIN.
- `#/profile/password` — change password with old password verification.
- `#/profile/notifications` — per-channel toggles (email, in-app, push).
- `#/profile/balance` — full ledger (see § 8.11.1).

**§ 8.11.1 Balance history sub-page**

- Table: date | type (deposit / withdrawal / topup / refund) | amount | reference (link to the source order or deposit request) | running balance.
- Filters: type, date range, min/max amount.
- Downloadable as CSV (client-side generation from the rendered list).

---

### 8.12 Modal: Global Search (full-screen overlay)

**Trigger**: topbar search icon or `Ctrl/⌘ + K`.

**Layout** (`z-index: 3000`)

```
┌─────────────────────────────────────────────────────────┐
│  [ Search box, auto-focused ]                [ × close ]│
├─────────────────────────────────────────────────────────┤
│  Popular searches: [ ML ] [ Free Fire ] [ PUBG ] [ Netflix ]│
├─────────────────────────────────────────────────────────┤
│  Debounced 300 ms after each keystroke, then:           │
│                                                         │
│  PRODUCTS (max 5)                                       │
│  [thumb] ML Diamond 500 — 15,000 MMK   →                │
│                                                         │
│  CATEGORIES (max 3)                                     │
│  [icon]  Mobile Legends                →                │
│                                                         │
│  NEWS (max 2)                                           │
│  [thumb] Title …                       →                │
│                                                         │
│  [ See all results → ]                                  │
└─────────────────────────────────────────────────────────┘
```

**Server call**: `GET /api/supabase?op=global_search&q=<query>&scope=<menu_id?>` — server runs a UNION query across `products`, `categories`, and `news`, each with `ILIKE` + `similarity()` scoring (using `pg_trgm`).

**States**:
1. Loading: 3-line skeleton in each section while the request is in flight.
2. Empty: SVG (magnifying glass over an empty page) + "No results for '<query>'" + suggested searches.
3. Success: results as above.
4. Error: retry button.
5. Interactive: arrow keys navigate results; Enter opens the highlighted result; Esc closes the overlay.

---
## Part 9 — Admin Dashboard: Complete Page-by-Page Specification

The Admin Dashboard is a single-page app served at `admin.html` from `ADMIN_DOMAIN`. Access is gated by the IP allow-list (Part 5) *and* the admin login (Part 6). Every mutation requires `ADMIN_APPROVE_PASSWORD` (Rule 5, Part 1).

### 9.1 Global layout

```
┌────────────┬────────────────────────────────────────────┐
│  SIDEBAR   │  TOPBAR (60 px)                            │
│  240 px    │  [Breadcrumb]                [Notif][Admin ▼]│
│  fixed     ├────────────────────────────────────────────┤
│  left      │                                            │
│            │  CONTENT AREA (padding: 20 px)             │
│  [Logo]    │  Scrolls independently.                    │
│            │                                            │
│  [Nav]     │                                            │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```

**Sidebar navigation tree** — every item has an SVG icon, and the whole item is a full-row click target:

```
[Dashboard]
[Users]
[Orders]
[Products]
    ├── Menus
    ├── Categories
    ├── Products
    └── Banners
[G Store]
    ├── G2Bulk Sync
    ├── G2Bulk Balance
    └── G Store Orders
[Payments]
    ├── Deposit Requests
    ├── Withdrawal Requests
    ├── Payment Methods
    └── Transactions
[Promo Codes]
[News]
[Reviews]
[Resellers]
    ├── Applications (KYC)
    ├── Active Resellers
    └── Premium Plans
[Locations Map]
[VPS Panel]
    ├── Overview
    ├── Instances
    ├── Create New
    ├── Physical Server
    └── Setup Wizard
[Security Logs]
[Settings]
    ├── General
    ├── Payment Methods
    ├── Notifications
    └── Env Info
```

- Sidebar can be **collapsed** to a 64 px rail (icons only) via a toggle at the bottom. Collapse state persists in `localStorage.admin_sidebar_collapsed`.
- Active section is highlighted with a 4 px left border in `--color-accent-cyan` and a subtle `--surface-2` background.
- Sub-menu groups expand inline (no fly-outs).

**Topbar detail**

- **Breadcrumb**: reflects the current route, e.g. `Users › #U-1024 › IP History`. Clickable segments navigate back.
- **Notification bell**: pending items requiring attention (deposit requests, KYC applications, failed orders). Red badge shows the total count. Click routes to `#/notifications`.
- **Admin dropdown** (top-right): shows the logged-in admin's name + role. Items: Change password, Session info, Logout.

**Admin-action confirmation modal (used everywhere)**

Every mutating action opens the same modal component:

```
┌────────────────────────────────────┐
│  Confirm <ACTION>            [ × ] │
│                                    │
│  You are about to <verb>           │
│    <target>.                       │
│                                    │
│  This will:                        │
│   • <side-effect 1>                │
│   • <side-effect 2>                │
│                                    │
│  Admin approval password:          │
│  [ • • • • • • • • • • • • ]       │
│                                    │
│  [ Cancel ]              [ Confirm ]│
└────────────────────────────────────┘
```

The confirm button is disabled until the password field is non-empty. On submit, `POST /api/admin-action` is called with `{ action, target_id, payload, password }`. Server responds with 200 on success, 401 on wrong password (with a red inline error under the field), 403 for policy failures, and 500 for infrastructure errors.

---

### 9.2 Page: Dashboard Overview

```
┌─────────────────────────────────────────────────────────┐
│  STATS CARDS (4 per row on desktop, 2 on mobile)        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Total  │ │ Total  │ │ Pending│ │ Revenue│            │
│  │ Users  │ │ Orders │ │ Orders │ │ Today  │            │
│  │ 1,204  │ │ 3,456  │ │  23    │ │ 450 K  │            │
│  │ +12% ↑ │ │ +8% ↑  │ │ [red]  │ │ +15% ↑ │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
├─────────────────────────────────────────────────────────┤
│  CHARTS (2 per row)                                     │
│  ┌────────────────────────┐ ┌────────────────────────┐  │
│  │  Revenue line chart    │ │  Orders bar chart      │  │
│  │  last 30 days (SVG)    │ │  last 7 days (SVG)     │  │
│  └────────────────────────┘ └────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  RECENT ORDERS (table, 10 most recent)                  │
│  Order ID | User | Total | Status | Actions             │
├─────────────────────────────────────────────────────────┤
│  RECENT SIGNUPS  +  G STORE LIVE ORDERS (side-by-side)  │
└─────────────────────────────────────────────────────────┘
```

- **Stats numbers** come from a materialised view `admin_daily_stats` refreshed every 60 s by a cron job. This avoids counting on every dashboard load.
- **Charts** are hand-rolled SVG (no chart lib) — this preserves the design system's stroke widths and glow effects.
- **Recent orders** subscribe to the Supabase Realtime channel `admin-orders` so new orders appear at the top with a fade-in.

---

### 9.3 Page: Users list + per-user detail

**Users list**

```
┌─────────────────────────────────────────────────────────┐
│  USERS MANAGEMENT           [ + Send mass notification ]│
├─────────────────────────────────────────────────────────┤
│  FILTER BAR                                             │
│  [ Search: username / email / phone ] [ Role ▼ ]        │
│  [ Status ▼ ] [ Platform ▼ ] [ Date from ] [ Date to ]  │
│  [ Apply ]  [ Reset ]                                   │
├─────────────────────────────────────────────────────────┤
│  DATA TABLE                                             │
│  # | Username | Email | Role | Balance | Platform |     │
│    | Joined | Last seen | Status | Actions             │
├─────────────────────────────────────────────────────────┤
│  Pagination: [< Prev] [1] [2] [3] … [Next >]            │
└─────────────────────────────────────────────────────────┘
```

Row actions (kebab menu on each row): View → per-user detail page; Send notification; Ban; Change role; Reset password. All destructive actions open the admin-action confirmation modal.

**Per-user detail (`#/users/{user_id}`)**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back to users]                        [Actions ▼]   │
├─────────────────────────────────────────────────────────┤
│  USER HEADER                                            │
│  [avatar 100 px]   @username                            │
│                    user@gmail.com                       │
│                    Role: [USER]   Status: [Active]      │
│                    Joined: Jan 15, 2024                 │
├─────────────────────────────────────────────────────────┤
│  TABS: [Overview] [Orders] [G Store] [Balance] [IP hist]│
│         [VPS]                                           │
├─────────────────────────────────────────────────────────┤
│  === Overview ===                                       │
│                                                         │
│  BALANCE                                                │
│  Current: 15,500 MMK                                    │
│  [ + Add balance ]   [ − Deduct balance ]               │
│    → both open modals (amount + reason + password)      │
│                                                         │
│  CONTACT                                                │
│  Phone: 09-xxx-xxxxxx                                   │
│  Registration IP: 203.114.x.x   [Copy]                  │
│  Last login: 5 min ago                                  │
│  Platform: [Web]  Android / Chrome 120                  │
│                                                         │
│  CURRENT LOCATION                                       │
│  [ mini Leaflet map, 250 px tall ]                      │
│  Address: Hlaing, Yangon, Myanmar                       │
│                                                         │
│  QUICK STATS                                            │
│  Total orders: 24   Total spent: 245,000 MMK            │
│  G Store orders: 12   KYC: Approved                     │
│                                                         │
│  DANGER ZONE                                            │
│  [ Ban user ]  [ Reset password ]  [ Delete account ]   │
│    All open the two-step destructive confirmation modal │
│                                                         │
│  === Orders ===         Full order table for this user  │
│  === G Store ===        All G2Bulk orders + delivery    │
│  === Balance ===        Full ledger (Type, Amount,      │
│                         Balance after, Description,     │
│                         Date). Down-loadable as CSV.    │
│  === IP History ===     Every login IP with timestamp,  │
│                         geolocation, and device.        │
│  === VPS ===            All VPS instances assigned      │
└─────────────────────────────────────────────────────────┘
```

Every mutation (Add balance, Deduct balance, Ban, Reset, Delete) invokes `update_user_balance` (Part 21) for money moves, or `admin_action` for role/state changes, always with `ADMIN_APPROVE_PASSWORD`.

---

### 9.4 Page: Orders Management

```
┌─────────────────────────────────────────────────────────┐
│  ORDERS                                     [Export CSV]│
├─────────────────────────────────────────────────────────┤
│  TABS: [All] [Pending] [Processing] [Completed] [Cancel]│
├─────────────────────────────────────────────────────────┤
│  FILTER: [Search] [User] [Date range] [Amount range]    │
├─────────────────────────────────────────────────────────┤
│  DATA TABLE                                             │
│  # | Order ID | User | Products | Total | Payment |     │
│    | Status | Created | Actions                        │
├─────────────────────────────────────────────────────────┤
│  Row click → Order detail modal:                        │
│    Full order info + products + payment screenshot      │
│    [ Approve ]  [ Reject with reason ]  [ Refund ]      │
│    All → admin-password modal                           │
└─────────────────────────────────────────────────────────┘
```

**Approve flow**

```
Click [Approve]
    ↓
Modal: "Approve order #ORD-000123?"
       Admin password: [ ______________ ]
       [Confirm]
    ↓
POST /api/admin-action { action:'approve_order', order_id, password }
    ↓
Server:
  1. Verify password (crypto.timingSafeEqual)
  2. UPDATE orders SET
       status = 'approved',
       approved_at = NOW(),
       approved_by = <admin_id>
     WHERE id = $order_id AND status IN ('pending','pending_payment_review')
  3. INSERT INTO balance_ledger via RPC (if paid by balance, no move needed)
  4. Send realtime notification to the user
    ↓
Toast: "Order approved"
Table row status animates from orange → green.
```

**Reject flow**

Same pattern but with a mandatory reason textarea (min 10 characters). If the order was paid by balance, the server calls `update_user_balance(user_id, +amount, 'refund_reject', order_id)` in the same transaction.

**Refund flow**

Applies to already-approved orders. Two-step destructive modal (Rule 12) + password. Server refunds the balance and marks the order `status='refunded'`. G Store orders that already delivered a code cannot be refunded automatically; admin sees a warning ("This order was fulfilled — refund will not reverse the delivery").

---

### 9.5 Page: Menus Management

```
┌─────────────────────────────────────────────────────────┐
│  MENUS                                 [ + Create menu ]│
├─────────────────────────────────────────────────────────┤
│  MENU CARDS GRID (3 per row on desktop)                 │
│  ┌───────────────────┐                                  │
│  │ [ menu image ]    │                                  │
│  │ Menu name         │                                  │
│  │ 15 categories     │                                  │
│  │ Sort order: 1     │                                  │
│  │ [Edit][Delete][↑↓]│                                  │
│  └───────────────────┘                                  │
├─────────────────────────────────────────────────────────┤
│  Drag-drop reorder (updates sort_order in the DB)       │
└─────────────────────────────────────────────────────────┘
```

**Create / edit menu modal**

```
┌────────────────────────────────────┐
│  New menu                    [ × ] │
│                                    │
│  Name (MM):   [ ______________ ]   │
│  Name (EN):   [ ______________ ]   │
│  Icon SVG:    [ upload / select ]  │
│  Cover image: [ ImgBB upload ]     │
│  Description: [ textarea ]         │
│  Sort order:  [ 1 ]                │
│  Status:      [ Active ▼ ]         │
│  Visible to:  [ ☑ Users ]          │
│               [ ☑ Resellers ]      │
│                                    │
│  Admin password: [ __________ ]    │
│  [ Save menu ]                     │
└────────────────────────────────────┘
```

Delete opens the two-step destructive modal. If the menu has categories under it, the confirmation lists them explicitly ("This will orphan 15 categories — reassign them first?") and the confirm button remains disabled until the operator ticks a "I understand" checkbox.

---

### 9.6 Page: Categories Management

- Filter chip at the top: filter by menu.
- Grid cards + table toggle.
- Create / edit modal: Name (MM / EN), Parent menu (dropdown), Image (ImgBB upload), Description, Sort order, Status, Parent category (optional — for sub-categories via `parent_id`).
- Sub-categories are supported: a category may have `parent_id` pointing at another category (max depth 2).

---

### 9.7 Page: Products Management

```
┌─────────────────────────────────────────────────────────┐
│  PRODUCTS                                [ + Add product]│
├─────────────────────────────────────────────────────────┤
│  FILTER: [Search] [Menu ▼] [Category ▼] [Stock ▼]       │
├─────────────────────────────────────────────────────────┤
│  Table / grid toggle                                    │
│  # | Image | Name | Category | Price | Stock | Style |  │
│    | Status | Actions                                   │
└─────────────────────────────────────────────────────────┘
```

**Product editor (large tabbed modal)**

```
┌───────────────────────────────────────────────┐
│  Product editor                       [ × ]   │
├───────────────────────────────────────────────┤
│  Tabs: [Basic] [Images] [Variants] [SEO]      │
├───────────────────────────────────────────────┤
│  === Basic ===                                │
│  Name (MM):          [ _______________ ]      │
│  Name (EN):          [ _______________ ]      │
│  Menu:               [ dropdown ]             │
│  Category:           [ dropdown ]             │
│  Price:              [ _______________ ] MMK  │
│  Original price:     [ _______________ ] MMK  │
│  Stock:              [ _______________ ]      │
│  Description:        [ rich-text editor ]     │
│  Display style:      [ GRID_CARD ▼ ]          │
│                      Options:                 │
│                        GRID_CARD              │
│                        LIST_HORIZONTAL        │
│                        FEATURED_LARGE         │
│                        COMPACT_MASONRY        │
│  Ribbon:             [ None ▼ ] New / Sale …  │
│                                               │
│  === Images ===                               │
│  Main image: [ upload via ImgBB ]             │
│  Gallery:    [ upload multiple ]              │
│  Drag-reorder within the gallery.             │
│                                               │
│  === Variants ===                             │
│  Add variant type: [ Size ] [ Color ] …       │
│  Each variant has its own stock and price     │
│  overrides (stored as JSONB in                │
│  products.variants).                          │
│                                               │
│  === SEO ===                                  │
│  Meta title / description / slug              │
├───────────────────────────────────────────────┤
│  Admin password: [ __________ ] [ Save product]│
└───────────────────────────────────────────────┘
```

Rich-text editor uses `contenteditable` with a limited toolbar (bold, italic, headings, lists, link). Content is server-sanitised with DOMPurify inside `admin-action.js` before storage.

---

### 9.8 Page: Banners

- Banner cards showing preview image + title + active date range + status.
- Editor fields: image (ImgBB), title, subtitle, CTA text, CTA link, position (Home / Category), active-from / active-to dates.
- Drag-drop reorder updates `sort_order`.

---

### 9.9 Page: G2Bulk Sync

```
┌─────────────────────────────────────────────────────────┐
│  G2BULK SYNC                                            │
├─────────────────────────────────────────────────────────┤
│  BALANCE CARD                                           │
│  G2Bulk account balance: $XX.XX                         │
│  Last synced: 2 min ago                                 │
│  [ Refresh balance ]                                    │
├─────────────────────────────────────────────────────────┤
│  SYNC ACTIONS                                           │
│  [ Sync all games from G2Bulk v1 ]                      │
│  [ Sync gift-card products from G2Bulk v2 ]             │
│  [ Sync product fields (player-ID requirements) ]       │
├─────────────────────────────────────────────────────────┤
│  IMPORTED PRODUCTS TABLE                                │
│  G2Bulk code | Name | Type | Category assigned | Status │
│  Filter by: unassigned / assigned                       │
│  Row action: [ Assign to category ] [ Set price markup ]│
└─────────────────────────────────────────────────────────┘
```

The sync buttons are long-running (they may loop across dozens of pages of G2Bulk data). They open a progress modal that shows: "Fetching page 3 of ~40… 128 products imported so far". If the operator closes the modal, the sync continues server-side and pushes progress via Supabase Realtime on channel `admin-g2bulk-sync`.

---

### 9.10 Page: G Store Orders (Admin View)

Table columns: Order ID | User | Game | Package | Amount | G2Bulk ID | Status | Actions

Status colours:
- Pending → yellow
- Processing → blue
- Success → green
- Failed → red

Failed orders show `[Retry]` and `[Manual refund]` actions. Retry re-submits to G2Bulk with the same payload. Manual refund refunds via `update_user_balance` and marks the row `status='refunded_manual'`.

---

### 9.11 Page: Deposit Requests

- Tabs: Pending / Approved / Rejected.
- Row: User | Amount | Method | Reference | Screenshot thumbnail | Timestamp | Actions.
- **Approve** → admin-password modal → RPC `update_user_balance(user_id, +amount, 'deposit', deposit_id)` + set `deposit_requests.status='approved'`.
- **Reject** → reason input + admin-password → set `deposit_requests.status='rejected'` + send user a notification.

---

### 9.12 Page: Withdrawal Requests

Same pattern as deposit but the RPC call is `update_user_balance(user_id, -amount, 'withdrawal', wid_id)`. The RPC refuses if balance is insufficient; the admin sees the error inline.

---

### 9.13 Page: Payment Methods

- List of payment methods (KBZ Pay, Wave Pay, AYA Pay, CB Pay, …).
- Row: [icon] Name | Phone number | QR-code image | Status | [Edit] [Delete].
- `[+ Add method]` opens a modal with icon upload, name, phone number, QR-code image upload, active toggle.

---

### 9.14 Page: Promo Codes

Table: Code | Discount type (% / fixed) | Value | Max uses | Uses so far | Expiry | Status.

`[+ Create promo]` modal: code (auto-generated but editable), discount type, value, max uses (total), max uses per user, min order amount, applicable products / categories / menus, valid from, valid to, active.

---

### 9.15 Page: News CMS

- List view + editor.
- Editor: title, cover image (ImgBB), rich-text body, category, publish date, status (draft / published).
- Draft rows never appear in the users' Home News section.

---

### 9.16 Page: Reviews Moderation

Review cards with user avatar, product, rating, text, photos. Actions: Approve → sets `is_visible=TRUE`; Reject → keeps the row but `is_visible=FALSE` (soft-hide, for audit); Reply → admin can attach a public reply that shows under the review.

---

### 9.17 Page: Reseller Applications (KYC Review)

Tabs: Pending / Approved / Rejected.

```
┌───────────────────────────────────────┐
│  @username (user@gmail.com)           │
│  Business: XYZ Store                  │
│  Type: Reseller                       │
│  Applied: 2 days ago                  │
│  Documents:                           │
│  [ ID front ] [ ID back ] [ Selfie ]  │
│    ↑ click to view full size (modal)  │
│  [ Approve as reseller ]  [ Reject ]  │
└───────────────────────────────────────┘
```

**Approve flow**

- Admin-password modal.
- Server transaction:
  - `UPDATE users SET role='reseller', reseller_approved_at=NOW() WHERE id=$user_id`
  - `UPDATE reseller_kyc SET status='approved', approved_by=$admin_id WHERE user_id=$user_id`
- Send in-app + email notification to the user.

**Reject flow**

- Admin-password + mandatory reason.
- `UPDATE reseller_kyc SET status='rejected', reason=$reason, rejected_by=$admin_id`.
- User's next login shows the reason in Profile → KYC.

---

### 9.18 Page: Active Resellers

Table: reseller name | total sales | customers | plan | expiry | actions.

Actions: View their reseller dashboard (opens `RESELLER_DOMAIN` with an admin-impersonation exchange token), Change plan, Suspend (revokes `users.role='reseller'` and force-logs-out reseller sessions).

---

### 9.19 Page: Premium Plans

Plan cards: Free, Bronze, Silver, Gold, Platinum. Each card shows price, duration (30 days / 90 days / 365 days), feature limits (max menus, max categories, max products, max banners, storage quota), and an [Edit plan] button.

`[+ Create new plan]` opens the editor.

---

### 9.20 Page: Settings

Sub-pages:

- **General** — site name, logo upload, contact info, maintenance-mode toggle (when on, every non-admin route serves a maintenance screen).
- **Payment methods** — links back to §9.13.
- **Notifications** — email/SMS templates for order confirmations, deposits approvals, KYC decisions, etc.
- **Env info** — displays masked env values (e.g. `SUPABASE_URL: https://xxxx.supa****.co`, `IMGBB_API_KEY: abc*******xyz`). Read-only. Used to verify env correctness without exposing secrets.

---

## Part 10 — Reseller Dashboard: Complete Page-by-Page Specification

The Reseller Dashboard is a scoped-down version of Admin. It runs at `RESELLER_DOMAIN` and every mutation is scoped to `reseller_id = <current session user_id>` at the RLS layer (Part 21).

### 10.1 Global layout

Sidebar + topbar layout mirrors Admin (Part 9.1) with a reduced navigation tree:

```
[Dashboard]              Overview
[My Menus]
[My Categories]
[My Products]
[My Banners]
[Orders]                 (only orders that reference reseller's products)
[Customers]              (only customers who bought from this reseller)
[Payments received]
[Analytics]
[Premium Plan]
[Settings]
```

Reseller mutations are protected by the **reseller's own transaction PIN**, not by `ADMIN_APPROVE_PASSWORD`. The PIN is stored as `users.transaction_pin_hash` (bcrypt) and verified server-side in `api/admin-action.js` when the request's session cookie is a reseller session.

### 10.2 Page: Reseller Overview

- **Stats cards**: My sales today, My customers, Pending orders, Balance earned.
- **Charts**: sales trend, top products, customer growth.
- **Plan status card**: "Current plan: Silver — expires in 25 days" [ Upgrade ].

### 10.3 Page: My Menus / Categories / Products / Banners

Same editor UI as Admin's Content CMS, but every list is filtered by `reseller_id = <session.user_id>`. Also:

- **Plan limits are enforced client-side and server-side.**
  - Free: 1 menu, 5 products, 1 banner.
  - Bronze: 3 menus, 25 products, 3 banners.
  - Silver: 5 menus, 100 products, 5 banners.
  - Gold: 15 menus, 500 products, 15 banners.
  - Platinum: unlimited.
- The list header shows a live usage indicator: "5 / 100 products used".
- When the limit is reached, the `[+ Add …]` button is replaced with `[Upgrade plan]` CTA that routes to §10.6.

### 10.4 Page: Reseller Orders

- Only orders whose line items reference this reseller's products.
- Approve/Reject requires the reseller's **transaction PIN**, not the admin password.
- Rejecting a paid order refunds the customer via `update_user_balance`.

### 10.5 Page: Analytics

Charts (SVG, hand-rolled):
- Daily / weekly / monthly revenue line chart.
- Top-selling products bar chart.
- Customer demographics derived from `user_location_tracking` — city-level heat (aggregated, never per-user, so RLS on the aggregate view still applies).

### 10.6 Page: Premium Plan

- Current plan card + all plans grid (from Admin's §9.19).
- `[Upgrade to Gold]` → payment flow (KBZ / Wave / balance) → creates a row in `plan_upgrade_requests` with `status='pending'`. Admin approves in §9.18.
- On approval, `users.reseller_plan` is updated and `users.reseller_plan_expires_at` is set to `NOW() + INTERVAL '<duration>'`.

---
## Part 11 — Admin: Locations Map System

The Locations Map is a full-page admin view that plots every recent user location on a Leaflet map, updates live via Supabase Realtime, and exposes a right-side slide-in panel for per-user detail.

### 11.1 Page layout (top to bottom)

```
┌─────────────────────────────────────────────────────────┐
│  STATS BAR                                              │
│  [SVG globe]  Online: 47                                │
│  [SVG users] Total: 1,204                               │
│  [SVG pin]   Active now: 23                             │
│  [SVG app]   App users: 234  |  Web: 892                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FILTER BAR                                             │
│  [Search: username / email / IP]                        │
│  [Online | Offline | All ▼]                             │
│  [Date from ▼]  [Date to ▼]                             │
│  [Platform: App | Web | All ▼]                          │
│  [ Apply ]  [ Reset ]  [ Export CSV ]                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  MAP CONTAINER  (65 vh)                                 │
│  Leaflet.js + CartoDB Dark tiles                        │
│  Green pin + pulse ring   → online user                 │
│  Grey pin                 → offline user                │
│  Cluster badge (count)    → 5 or more users nearby      │
│  Controls: zoom, layer toggle, full-screen              │
│  Auto-update indicator: "next update in 30 s"           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  USERS DATA TABLE                                       │
│  Username | Email | IP | Location | Platform |          │
│  Last seen | Status | Actions [View][Map]               │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Map design (app-quality dark glassmorphism)

The map container is styled as a dark glass panel with a scanline animation over the top:

```css
#admin-map-container {
    background: linear-gradient(135deg, #0a0f1e 0%, #1a1f35 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5),
                inset 0 1px 0 rgba(255,255,255,0.1);
    position: relative;
}
#admin-map-container::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #00f5ff, transparent);
    animation: scanLine 3s linear infinite;
    z-index: 1000;
    pointer-events: none;
}
@keyframes scanLine {
    0%   { top: 0;    opacity: 1;   }
    100% { top: 100%; opacity: 0.3; }
}
```

**Custom SVG markers** (both online and offline are `L.divIcon` instances):

```javascript
const onlineMarker = L.divIcon({
    html: `
      <div class="map-marker online">
        <svg width="32" height="40" viewBox="0 0 32 40">
          <defs>
            <radialGradient id="pinGrad">
              <stop offset="0%"   stop-color="#00ff88"/>
              <stop offset="100%" stop-color="#00cc66"/>
            </radialGradient>
          </defs>
          <path d="M16 0 C7.16 0 0 7.16 0 16
                   C0 28 16 40 16 40
                   C16 40 32 28 32 16
                   C32 7.16 24.84 0 16 0Z" fill="url(#pinGrad)"/>
          <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
        </svg>
        <div class="pulse-ring"></div>
      </div>`,
    className: '',
    iconSize:   [32, 40],
    iconAnchor: [16, 40],
    popupAnchor:[0, -40]
});
```

**Pulse animation** on online markers:

```css
.map-marker.online .pulse-ring {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -60%);
    width: 50px; height: 50px;
    border-radius: 50%;
    background: rgba(0, 255, 136, 0.2);
    animation: markerPulse 2s ease-out infinite;
}
@keyframes markerPulse {
    0%   { transform: translate(-50%,-60%) scale(0.5); opacity: 1; }
    100% { transform: translate(-50%,-60%) scale(2);   opacity: 0; }
}
```

**Clustering**: when the zoom level would render 5+ markers within 40 px of each other, the group is collapsed into a badge showing the count. Clicking the badge zooms to the cluster's extent.

### 11.3 Marker click → right-side slide-in panel

```
┌───────────────────────────────────────┐
│  [ × close ]        USER DETAIL       │
├───────────────────────────────────────┤
│  [ avatar 60 px, gradient fill ]      │
│  @username123          [ ONLINE ]     │
│  user@gmail.com                       │
├───────────────────────────────────────┤
│  IP ADDRESS                           │
│  203.114.xx.xx      [ Copy SVG ]      │
├───────────────────────────────────────┤
│  LOCATION                             │
│  Hlaing Township, Yangon, Myanmar     │
│  Lat: 16.8661   Lng: 96.1951          │
│  Accuracy: ±15 m                      │
├───────────────────────────────────────┤
│  DEVICE                               │
│  Chrome 120 / Android 14              │
│  Platform: [ Web ] / [ App ]          │
├───────────────────────────────────────┤
│  LAST SEEN                            │
│  2 minutes ago  (2024-01-15 14:32:01) │
├───────────────────────────────────────┤
│  LOCATION HISTORY                     │
│  [ View movement path ]  → polyline   │
├───────────────────────────────────────┤
│  ACTIONS                              │
│  [ View full profile ]  [ Send notif ]│
└───────────────────────────────────────┘
```

The panel is a `<aside>` positioned `right: 0; top: 60px; bottom: 0; width: 380px`, with a translate-in animation (from `translateX(100%)` to `translateX(0)` in 220 ms).

"View movement path" queries `user_location_tracking_history` (the append-only sibling table, Part 21) for the last 24 h of points, then draws them on the map as a polyline in `--color-accent-cyan` with a 3 px stroke and a moving dashed pattern.

### 11.4 Realtime update (Realtime channel + 30 s fallback)

```javascript
// Primary: Supabase Realtime
supabase.channel('admin-location-realtime')
    .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'user_location_tracking'
    }, (payload) => {
        if (payload.eventType === 'INSERT') addMarkerToMap(payload.new);
        if (payload.eventType === 'UPDATE') {
            updateExistingMarker(payload.new);   // setLatLng — DO NOT re-center the map
            updateTableRow(payload.new);
            updateStatsBar();
        }
    })
    .subscribe();

// Secondary: 30 s interval fallback (in case Realtime disconnects)
setInterval(() => {
    if (realtimeDisconnected) refreshAllMarkers();
}, 30_000);
```

The map view **never** re-centers on its own. Position updates use `marker.setLatLng(newLatLng)` which moves the pin but leaves the viewport untouched. The operator's zoom/pan is sacred.

### 11.5 Users data table (below the map)

Table below the map with columns: Username | Email | IP | Location | Platform badge | Last seen | Status | Actions [View][Map].

The [Map] button pans the map to the user's location and briefly bounces the marker (a small `transform: translateY(-8px)` back to 0, ease-out 400 ms).

---

## Part 12 — Admin: Security Logs Page

### 12.1 Log event catalogue

```javascript
const LOG_EVENTS = {
    ADMIN_IP_BLOCKED:    'admin_ip_blocked',    // IP not in ADMIN_IPADDRESS allow-list
    ADMIN_LOGIN_FAIL:    'admin_login_fail',    // Wrong admin login password
    ADMIN_LOGIN_SUCCESS: 'admin_login_success',
    ADMIN_ACTION_PW_FAIL:'admin_action_pw_fail',// Wrong ADMIN_APPROVE_PASSWORD on a mutation
    RESELLER_AUTH_FAIL:  'reseller_auth_fail',
    CAPTCHA_FAIL:        'captcha_fail',
    RATE_LIMIT_HIT:      'rate_limit_hit',
    INVALID_SESSION:     'invalid_session',
    USER_LOGIN_FAIL:     'user_login_fail',
    USER_LOGIN_LOCKED:   'user_login_locked',
    ENV_MISSING:         'env_missing'          // A required env var was missing at cold start
};
```

Every log row goes into `security_logs` with `(id, event_type, ip_address, user_agent, attempted_domain, result, details JSONB, timestamp)`.

### 12.2 Security Logs page UI

```
┌─────────────────────────────────────────────────────────────┐
│  THREAT SUMMARY CARDS (3 per row)                           │
│  ┌───────────────┐┌───────────────┐┌───────────────┐        │
│  │ Blocked IPs   ││ Failed logins ││ Rate-limit hit│        │
│  │ Today: 12     ││ Today: 5      ││ Today: 3      │        │
│  │ [SVG shield]  ││ [SVG lock]    ││ [SVG warning] │        │
│  └───────────────┘└───────────────┘└───────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  SECURITY LOGS                       [ Export ][ Clear old ]│
│  Filter: [IP search] [Event type ▼] [Date range] [ Apply ]  │
├──────────────┬──────────────┬──────────────────┬────────────┤
│ Timestamp    │ IP address   │ Event type       │ Details    │
├──────────────┼──────────────┼──────────────────┼────────────┤
│ 2024-01-15   │ 185.x.x.x    │ ADMIN_IP_BLOCKED │ Attempted  │
│ 14:32:01     │ [flag: RU]   │ [red badge]      │ admin panel│
│ 2024-01-15   │ 203.x.x.x    │ ADMIN_LOGIN_FAIL │ user:"root"│
│ 14:31:45     │ [flag: MM]   │ [orange badge]   │ attempt #3 │
└──────────────┴──────────────┴──────────────────┴────────────┘
```

- Country flags come from a static `/assets/flags.svg` sprite; the flag is looked up by ISO country code returned by a lightweight local GeoIP database (MaxMind's free GeoLite2).
- Event-type badges are colour-coded: red (block), orange (fail), yellow (rate-limit), grey (info), green (success).
- `[Clear old]` opens a two-step destructive modal ("Delete logs older than 90 days?").

---

## Part 13 — Admin: VPS Self-Hosted Management System

### 13.1 Architecture

```
Admin Dashboard (browser, admin.html)
    │
    │  HTTPS (JSON)
    ▼
api/vps.js         (Vercel serverless / Edge Runtime for WebSocket)
    │
    │  REST (actions) + WebSocket (terminal)
    ▼
VPS Agent          (Node.js + PM2 on the physical host)
    │
    │  libvirt (KVM)  or  LXC
    ▼
Virtual machines / containers
```

- The **admin** never talks to the physical host directly; it always goes through `api/vps.js`, which authenticates with the agent using `VPS_NODE_SECRET`.
- The **agent** listens on `VPS_AGENT_PORT` (default 7777) on the host. It exposes a small REST API (`/instances`, `/create`, `/start`, `/stop`, `/restart`, `/terminate`, `/metrics`) and a WebSocket endpoint for SSH pass-through (`/ssh`).

### 13.2 VPS agent install script

The agent is installed on the physical host with a one-liner the admin copies from the setup wizard (§ 13.3, Tab 7). Broad shape:

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. System dependencies
sudo apt-get update
sudo apt-get install -y qemu-kvm libvirt-daemon-system libvirt-clients \
                        bridge-utils virtinst nodejs npm openssh-server

# 2. Bridge network
sudo brctl addbr br0 || true
sudo ip link set br0 up || true

# 3. Storage
sudo mkdir -p /var/lib/cr7game/vps

# 4. Agent
sudo mkdir -p /opt/cr7-vps-agent
cd /opt/cr7-vps-agent
sudo npm init -y >/dev/null
sudo npm install express ws node-ssh dockerode libvirt

# 5. Environment
sudo tee /opt/cr7-vps-agent/.env >/dev/null <<EOF
VPS_NODE_SECRET=${VPS_NODE_SECRET}
VPS_AGENT_PORT=${VPS_AGENT_PORT:-7777}
VPS_STORAGE_PATH=${VPS_STORAGE_PATH:-/var/lib/cr7game/vps}
VPS_NETWORK_BRIDGE=${VPS_NETWORK_BRIDGE:-br0}
EOF

# 6. PM2 supervisor
sudo npm i -g pm2
sudo pm2 start /opt/cr7-vps-agent/index.js --name cr7-vps-agent
sudo pm2 startup
sudo pm2 save
```

Every request from `api/vps.js` includes `Authorization: Bearer <VPS_NODE_SECRET>`. The agent rejects any other requests with 401.

### 13.3 VPS management tabs

**Tab 1 — Overview dashboard**

- Physical-host metrics: CPU (%), RAM (used / total), Disk (used / total), Network (Rx/Tx MB/s). Each is a donut or radial gauge, all SVG.
- Instance grid: one card per running instance showing name, OS, live CPU %, live RAM %, uptime, and an [Open] button.

**Tab 2 — Create new VPS instance (4-step wizard)**

1. **Basic**: instance name, OS (Ubuntu / Debian / CentOS), vCPU count, RAM (GB), disk (GB), static IP (or auto-assign).
2. **User assignment**: search a user (autocompleted), choose access type (owner / read-only), auth method (password / SSH key upload), expiry date.
3. **Network**: bridge (`br0`), VLAN (optional), bandwidth cap (MB/s), firewall preset (default: allow 22 / 80 / 443).
4. **Review**: full summary. `[Create VPS]` opens the admin-password modal. On confirm, a progress bar streams status from the agent via SSE: `disk provisioning` → `installing OS` → `network` → `booting` → `assigning user` → done. Toast on success.

**Tab 3 — In-dashboard terminal (Web SSH)**

```
┌──────────────────────────────────────────┐
│  Terminal — VPS #001 (Ubuntu 22.04)  [×] │
├──────────────────────────────────────────┤
│  root@vps-001:~# ls -la                  │
│  total 48                                │
│  drwx------ 5 root root  4096 Jan 15 ..  │
│  root@vps-001:~# █                       │
└──────────────────────────────────────────┘
[ SFTP Upload ] [ SFTP Download ] [ Clear ] [ Disconnect ]
```

Implementation: `xterm.js` (loaded from CDN) plus `xterm-addon-fit`. A WebSocket is opened to `/api/vps?op=terminal&instance=<id>`. Inside `api/vps.js` (Edge Runtime), the request is validated (admin session + admin IP), and a `node-ssh` connection is opened to the agent, which then opens an SSH shell into the guest and pipes both directions. Encoding is raw bytes → base64 on the wire to avoid text-mangling for control sequences.

SFTP upload / download use short-lived signed URLs (60 s) issued by the agent.

**Tab 4 — Instance management (per instance)**

- Quick actions: [Start] [Stop] [Restart] [Force Kill] [Delete] — each opens the admin-password modal.
- Access credentials: IP, username, password (with show/hide toggle), SSH port, one-click SSH command copy (`ssh -p <port> <user>@<ip>`), .pem download (if key-based).
- Resource usage: live progress bars for CPU / RAM / Disk / Network, refreshed via a 5 s SSE stream from `api/vps.js`.
- Extra: [Open terminal] [View logs] [Snapshots] [Reinstall OS] — reinstall runs the OS installer script and swaps `/var/lib/cr7game/vps/<id>/disk.qcow2` after the operator confirms.

**Tab 5 — VPS resell to users**

- Assign form: instance, user (search), plan duration (7 / 30 / 90 days), price, auto-renew toggle, send credentials via notification checkbox.
- On assign, the user sees the VPS card under Profile → My VPS with IP, username, password (masked), SSH command copy, and an expiry countdown.

**Tab 6 — Physical server health monitor**

- 5 s auto-poll of the agent's `/metrics` endpoint.
- SVG donut for CPU, RAM, and Disk; rolling 60-point line chart for Network.
- Alerts: if CPU > 90% for 3 consecutive samples, a top-of-page banner appears in `--color-danger`.

**Tab 7 — Setup wizard (first-time)**

Steps: server connection (IP / SSH port / initial root credentials) → install-agent script (copy-paste one-liner) → test connection (calls `/health` on the agent) → system check (kernel version, KVM support via `kvm-ok`, disk space) → save config.

Once completed, this tab is hidden unless the operator revisits from the sidebar.

---

## Part 14 — Reseller Dashboard: Role-Based Login System

### 14.1 Core principle

Reseller login = **user's Gmail + password** for a `users` row where:

- `users.role === 'reseller'`, **and**
- `reseller_kyc.status === 'approved'`.

There is no separate reseller-user table. The Reseller Dashboard reuses the standard `users` table with role-based access enforced at RLS (Part 21).

### 14.2 Login flow

```
User opens RESELLER_DOMAIN
    ↓
reseller.html → 02-auth-settings.js
    ↓
Check active session cookie 'reseller_session'
    ├──  Valid → dashboard
    └──  Absent / invalid → login form
                                ↓
    Email + password + [Login]  ↓
                                ↓
    POST /api/auth
      { action:'reseller_login', email, password }
                                ↓
    Server:
      1. SELECT * FROM users WHERE lower(email) = lower($1)
      2. bcrypt.compare(password, users.password_hash)
      3. Require users.role === 'reseller'   ⭐ CRITICAL
      4. Require reseller_kyc.status === 'approved'
                                ↓
    ┌────────────────── Result handling ────────────────────────┐
    │ role='reseller' + kyc='approved'                          │
    │   → create session in reseller_sessions                   │
    │   → set cookie, return dashboard                          │
    │                                                           │
    │ role='reseller' + kyc='pending'                           │
    │   → 403 "Your KYC is still under review (1–7 days)"       │
    │                                                           │
    │ role='user' (not reseller)                                │
    │   → 403 "This account is not a reseller."                 │
    │   → Include link: "Apply for KYC at USER_DOMAIN/profile/kyc"│
    │                                                           │
    │ Wrong password OR user not found                          │
    │   → 401 "Email or password incorrect"                     │
    │   → Same generic message either way (no user-enum leak)    │
    │   → Failure counter; 5 tries → 60 s lockout               │
    └───────────────────────────────────────────────────────────┘
```

### 14.3 Login UI

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           [ Logo — centred, 80 px ]                     │
│           RESELLER DASHBOARD                            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              RESELLER LOGIN                      │   │
│  │                                                  │   │
│  │  Gmail                                           │   │
│  │  [SVG mail] [ user@gmail.com               ]     │   │
│  │                                                  │   │
│  │  Password                                        │   │
│  │  [SVG lock] [ ••••••••     ] [SVG eye toggle]    │   │
│  │                                                  │   │
│  │  [ Log in to reseller dashboard ]                │   │
│  │                                                  │   │
│  │  Not a reseller?                                 │   │
│  │  [ Apply for KYC → USER_DOMAIN/profile/kyc ]     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

Slider CAPTCHA (from Part 6) is required before the password field submits. Failure counters live in `security_logs` filtered by `event_type='RESELLER_AUTH_FAIL'`.

### 14.4 Session management

- Table: `reseller_sessions (token uuid, user_id uuid, ip_address, user_agent, expires_at)`.
- Cookie: `reseller_session=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`.
- Every page load re-validates the session **and** re-reads `users.role` (in case admin revoked reseller status between requests). If role is no longer `'reseller'`, the session is deleted and the user is redirected to the login page with a toast: "Reseller access has been revoked".

### 14.5 Exchange token (Users → Reseller domain)

To move from the Users Dashboard's "Reseller Dashboard" avatar-dropdown link to the Reseller domain without asking the user to log in again:

```javascript
// User Profile → "Reseller Dashboard" button
async function navigateToResellerDashboard() {
    const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_exchange_token' })
    });
    const { exchange_token } = await res.json();
    window.location.href = `https://${RESELLER_DOMAIN}/?token=${exchange_token}`;
}
```

- The server issues a 60-second single-use token, stored in `exchange_tokens (token, user_id, expires_at, used_at)`.
- On the reseller domain, `02-auth-settings.js` reads `?token=…`, POSTs it to `/api/auth { action:'consume_exchange_token' }`, and receives a full reseller session cookie in return. The token row is marked `used_at=NOW()` and cannot be re-used.
- If the token is expired or already used, the reseller login page is shown normally.

---

## Part 15 — Source-Code Protection System

### 15.1 F12 / DevTools protection

Applied only on the Users Dashboard (Admin and Reseller operators need dev tools). Loaded at the top of `01-core.js` before any other user JS runs. Skipped when `location.hostname === 'localhost'`.

```javascript
// js/index/01-core.js — production only
(function () {
    'use strict';
    if (window.location.hostname === 'localhost') return; // dev bypass

    // ── Method 1: viewport size change ─────────────────────────
    const threshold = 160;
    let devtoolsOpen = false;
    const detectDevTools = () => {
        const w = window.outerWidth  - window.innerWidth  > threshold;
        const h = window.outerHeight - window.innerHeight > threshold;
        if ((w || h) && !devtoolsOpen) { devtoolsOpen = true; handleDevToolsOpen(); }
        else if (!w && !h)             { devtoolsOpen = false; }
    };

    // ── Method 2: debugger trap ────────────────────────────────
    setInterval(() => {
        const start = Date.now();
        debugger;                                     // eslint-disable-line no-debugger
        if (Date.now() - start > 100) handleDevToolsOpen();
    }, 1000);

    window.addEventListener('resize', detectDevTools);
    setInterval(detectDevTools, 1000);

    function handleDevToolsOpen() {
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;
                        height:100vh;background:#000;color:#fff;
                        font-family:sans-serif;flex-direction:column;">
              <p>Access blocked — please close developer tools.</p>
            </div>`;
    }

    // ── Method 3: console override ────────────────────────────
    ['log','warn','error','info','debug','trace'].forEach(m => (console[m] = () => {}));

    // ── Method 4: right-click disable ─────────────────────────
    document.addEventListener('contextmenu', e => e.preventDefault());

    // ── Method 5: keyboard shortcuts ──────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
            (e.ctrlKey && e.key === 'U') ||
            (e.ctrlKey && e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });
})();
```

These techniques do not stop a determined attacker (the source is on the user's machine), but they raise the barrier significantly for casual snoopers.

### 15.2 Image URL protection

Direct ImgBB URLs never appear in the DOM. Every image URL is masked through `/api/imgbb?token=<base64>`:

```javascript
// Client-side: request via masked proxy
function renderProtectedImage(imgUrl, canvasEl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const ctx = canvasEl.getContext('2d');
        ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
    };
    img.src = `/api/imgbb?proxy=${btoa(imgUrl)}`;
}
```

```css
/* CSS — block drag / long-press / selection on displayed images */
.product-image,
.banner-image,
.icon-img {
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
}
```

The `api/imgbb.js` proxy validates the token and streams the image with `Cache-Control: private, max-age=3600`. The upstream ImgBB URL is decoded server-side and never returned to the client.

### 15.3 Text-copy protection

```css
body.users-dashboard {
    user-select: none;
    -webkit-user-select: none;
}
input, textarea {
    user-select: text;
    -webkit-user-select: text;
}
```

Selection is enabled on inputs / textareas so users can still type and paste normally.

### 15.4 JavaScript obfuscation (build-time)

- Build step: `javascript-obfuscator` runs in the Vercel build hook against `js/index/*.js` before deployment (Admin and Reseller are left un-obfuscated so operators / support can debug).
- Enabled features: string-array encoding, control-flow flattening, dead-code injection, variable-name mangling, self-defending (breaks execution if the code is tampered with at runtime).
- Source maps are generated but stored only in the deploy artefact — not published.

---

## Part 16 — UI/UX Design System (App-Grade, Not Web-Grade)

### 16.1 Design philosophy

This is a **web app with a native-app feel**: dark backgrounds, glassmorphism cards, glow effects on primary elements, and animated micro-interactions on every hover / focus / click. It is not a "website" in the marketing-page sense.

### 16.2 Colour system (CSS custom properties)

```css
:root {
    /* Backgrounds — deep space */
    --color-bg-primary:   #050810;
    --color-bg-secondary: #0d1117;
    --color-bg-card:      #0f1520;
    --color-bg-elevated:  #151d2e;

    /* Surfaces (for elevation deltas) */
    --surface-1: rgba(255,255,255,0.04);
    --surface-2: rgba(255,255,255,0.08);
    --surface-3: rgba(255,255,255,0.12);

    /* Accents */
    --color-accent-blue:   #00a8ff;
    --color-accent-cyan:   #00f5ff;
    --color-accent-purple: #a855f7;
    --color-accent-gold:   #fbbf24;
    --color-accent-green:  #00ff88;
    --color-accent-red:    #ff4444;

    /* Semantic */
    --color-success: #00ff88;
    --color-warn:    #fbbf24;
    --color-danger:  #ff4444;
    --color-info:    #00a8ff;

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #00a8ff 0%, #a855f7 100%);
    --gradient-accent:  linear-gradient(135deg, #00f5ff 0%, #00a8ff 100%);
    --gradient-gold:    linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    --gradient-danger:  linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
    --gradient-success: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);

    /* Text */
    --text-primary:   #ffffff;
    --text-secondary: #94a3b8;
    --text-muted:     #475569;

    /* Glow shadows */
    --glow-blue:   0 0 20px rgba(0, 168, 255, 0.3);
    --glow-purple: 0 0 20px rgba(168, 85, 247, 0.3);
    --glow-gold:   0 0 20px rgba(251, 191, 36, 0.3);
    --glow-green:  0 0 20px rgba(0, 255, 136, 0.3);
    --glow-red:    0 0 20px rgba(255,  68,  68, 0.3);

    /* Elevation */
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.2);
    --shadow-md: 0 6px 20px rgba(0,0,0,0.35);
    --shadow-lg: 0 20px 40px rgba(0,0,0,0.4);
}
```

### 16.3 Button design (clipped + animated)

```css
.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 28px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border: none;
    outline: none;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    clip-path: polygon(
        12px 0%,        100% 0%,
        100% calc(100% - 12px),
        calc(100% - 12px) 100%,
        0% 100%,        0% 12px
    );
}

.btn-primary { background: var(--gradient-primary); color: white; }

/* Tech-pattern SVG overlay */
.btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.6;
    pointer-events: none;
}

/* Continuous shine sweep */
.btn-primary::after {
    content: '';
    position: absolute;
    top: -50%; left: -75%;
    width: 50%; height: 200%;
    background: linear-gradient(to right,
        rgba(255,255,255,0)   0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0)   100%);
    transform: skewX(-25deg);
    animation: btnShine 3s ease-in-out infinite;
    pointer-events: none;
}

@keyframes btnShine {
    0%   { left: -75%; }
    50%  { left: 125%; }
    100% { left: 125%; }
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-blue), 0 8px 25px rgba(0,168,255,0.3);
}

.btn-primary:active { transform: translateY(0); }

.btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}
```

**Variants**: `.btn-primary` (gradient blue/purple), `.btn-tech` (cyan), `.btn-danger` (red gradient), `.btn-success` (green gradient), `.btn-ghost` (transparent + border), `.btn-icon-only` (square, 40 × 40).

### 16.4 Card design (glassmorphism)

```css
.card {
    background: rgba(15, 21, 32, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.3s;
}
.card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,168,255,0.5), transparent);
}
.card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: var(--shadow-lg), var(--glow-blue);
}
```

### 16.5 Section backgrounds (SVG patterns)

```css
.section-bg-circuit {
    background-color: var(--color-bg-secondary);
    background-image: url('/assets/bg-circuit.svg');
    background-size: 300px 300px;
    background-repeat: repeat;
}
.section-bg-grid {
    background-color: var(--color-bg-primary);
    background-image:
        linear-gradient(rgba(0,168,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,168,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
}
.section-bg-hex {
    background-color: var(--color-bg-primary);
    background-image: url('/assets/bg-hex.svg');
    background-size: 80px 80px;
}
.section-bg-dots {
    background-color: var(--color-bg-secondary);
    background-image: radial-gradient(rgba(0,168,255,0.15) 1px, transparent 1px);
    background-size: 20px 20px;
}
```

### 16.6 Fixed navigation (never moves)

```css
#topbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 60px;
    z-index: 1000;
    background: rgba(5, 8, 16, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,168,255,0.1);
    /* NO transform, NO scroll-hiding transitions */
}
#bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 64px;
    z-index: 1000;
    background: rgba(5, 8, 16, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0,168,255,0.1);
}
#app-content {
    position: fixed;
    top: 60px; bottom: 64px;
    left: 0; right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}
/* NEVER wire a scroll listener that transforms topbar or bottom-nav. */
```

### 16.7 Loading skeleton screens

```css
.skeleton {
    background: linear-gradient(90deg,
        rgba(255,255,255,0.05) 0%,
        rgba(255,255,255,0.10) 50%,
        rgba(255,255,255,0.05) 100%);
    background-size: 200% 100%;
    animation: skeletonShimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
}
@keyframes skeletonShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
}
```

Every skeleton composition must **match the final layout it stands in for** — same widths, same heights, same grid, same gaps. This eliminates layout shift on load.

### 16.8 Empty states

Every empty list / grid MUST include:
- An illustrative SVG (150 px, low-opacity gradient stroke).
- A title in `--text-primary` (18 px).
- A subtitle in `--text-secondary` (14 px).
- Optional CTA button (clipped, primary style) that takes the user out of the empty state.

---

## Part 17 — Toast / Message System

### 17.1 Toast component

```javascript
// js/index/01-core.js
export function showToast(message, type = 'info', duration = 4000) {
    const types = {
        success: { icon: successSVG, color: '#00ff88', bg: 'rgba(0,255,136,0.10)', border: 'rgba(0,255,136,0.30)' },
        error:   { icon: errorSVG,   color: '#ff4444', bg: 'rgba(255,68,68,0.10)', border: 'rgba(255,68,68,0.30)' },
        warning: { icon: warnSVG,    color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.30)' },
        info:    { icon: infoSVG,    color: '#00a8ff', bg: 'rgba(0,168,255,0.10)', border: 'rgba(0,168,255,0.30)' },
        loading: { icon: spinSVG,    color: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.30)' }
    };
    // Slide in from top-right, stack downward, thin progress bar for the
    // countdown, click to dismiss, auto-remove after `duration`.
    // Position: fixed, top: 80px, right: 20px, z-index: 5000.
    // Max concurrent: 5. Older toasts move down; a new one pushes the stack.
}
```

Every toast has an SVG icon (never an emoji). Toasts are announced via ARIA-live for screen readers (`role="status"` for info/success, `role="alert"` for error).

### 17.2 Complete message library

All user-facing strings are in Burmese and centralised in one file so translation and consistency reviews are easy. **No vague errors** ("An error occurred") — every message states what went wrong and what to do next.

```javascript
const MESSAGES = {
    // ============ Auth ============
    LOGIN_SUCCESS:          (name) => `ကြိုဆိုပါသည်, ${name}!`,
    LOGIN_FAIL:             'Email သို့မဟုတ် Password မှားနေပါသည်',
    LOGIN_LOCKED:           (s) => `ကြိုးစားမှုအကြိမ်ရေ ကျော်သွား၍ ${s} စက္ကန့် ထပ်မကြိုးစားနိုင်ပါ`,
    SIGNUP_SUCCESS:         (name) => `${name} — အကောင့်ဖွင့်ပြီးပါပြီ`,
    SIGNUP_EMAIL_EXISTS:    'ဤ Email ဖြင့် အကောင့်ရှိပြီးဖြစ်သည်',
    SIGNUP_USERNAME_EXISTS: 'ဤ Username မှာ ယူသွားပြီးဖြစ်သည်',
    LOGOUT_SUCCESS:         'ထွက်လိုက်ပြီးဖြစ်ပါသည်',

    // ============ Location ============
    LOCATION_REQUIRED:  'ဝက်ဘ်ဆိုဒ်ကို သုံးရန် Location ခွင့်ပြုချက် လိုအပ်ပါသည်',
    LOCATION_SAVED:     'တည်နေရာ မှတ်တမ်းတင်ပြီးပါပြီ',
    LOCATION_DEVICE_OFF:'ဖုန်း Location Services ဖွင့်ထားပါ',

    // ============ Orders ============
    ORDER_CREATED:   (id) => `အော်ဒါ #${id} တင်ပြီးပါပြီ`,
    ORDER_APPROVED:  (id) => `အော်ဒါ #${id} အတည်ပြုပြီးပါပြီ`,
    ORDER_REJECTED:  (id, reason) => `အော်ဒါ #${id} ငြင်းပယ်ခံရသည် — ${reason}`,
    ORDER_CANCELLED: 'အော်ဒါ ဖျက်ပြီးပါပြီ',

    // ============ Balance ============
    BALANCE_INSUFFICIENT:      (need, have) => `လက်ကျန်မလောက်ပါ (လိုအပ်: ${need} MMK, ရှိ: ${have} MMK)`,
    BALANCE_DEPOSIT_PENDING:   'ငွေဖြည့်မှု Admin စစ်ဆေးဆဲ',
    BALANCE_DEPOSIT_APPROVED:  (amt) => `${amt} MMK Balance ဖြည့်ပြီးပါပြီ`,

    // ============ G Store ============
    GSTORE_ORDER_PROCESSING:   'Game ငွေဖြည့်မှု လုပ်ဆောင်ဆဲ',
    GSTORE_ORDER_SUCCESS:      (orderId) => `ငွေဖြည့်ပြီးပါပြီ (G2Bulk Order: ${orderId})`,
    GSTORE_ORDER_FAILED_REFUND:'ငွေဖြည့်မအောင်မြင်ပါ — Balance ပြန်ဖြည့်ပြီးပါပြီ',
    GSTORE_BALANCE_LOW:        'G2Bulk Account Balance မလောက်ပါ — Admin ကို ဆက်သွယ်ပါ',
    GSTORE_PIN_WRONG:          (r) => `PIN မှားပါသည် — ${r} ကြိမ်ကျန်သည်`,
    GSTORE_PIN_LOCKED:         '5 ကြိမ်မှား၍ 60 စက္ကန့် ရပ်ထားသည်',
    GSTOCK_OUT:                'ဤ Product ယာယီ မရနိုင်ပါ',

    // ============ Admin ============
    ADMIN_PASSWORD_WRONG:  'Admin Approval Password မှားနေပါသည်',
    ADMIN_ACTION_SUCCESS:  (a) => `${a} အောင်မြင်စွာ ဆောင်ရွက်ပြီးပါပြီ`,
    ADMIN_IP_SETUP_NEEDED: 'ADMIN_IPADDRESS ကို Vercel Env တွင် ဦးစွာသတ်မှတ်ပါ',

    // ============ VPS ============
    VPS_CREATING:        'VPS Instance ဖန်တီးနေဆဲ (ခဏစောင့်ပါ)',
    VPS_CREATED:         (n) => `VPS "${n}" ဖန်တီးပြီးပါပြီ`,
    VPS_START_SUCCESS:   'VPS စတင်ပြီးပါပြီ',
    VPS_STOP_SUCCESS:    'VPS ရပ်ပြီးပါပြီ',
    VPS_AGENT_OFFLINE:   'VPS Agent နှင့် ချိတ်ဆက်၍မရပါ — Server ကိုစစ်ဆေးပါ',
    VPS_CONNECT_SUCCESS: 'Physical Server နှင့် ချိတ်ဆက်ပြီးပါပြီ',

    // ============ Reseller ============
    RESELLER_NOT_ROLE:      'ဤ Email အကောင့် Reseller မဟုတ်ပါ',
    RESELLER_KYC_PENDING:   'KYC Application စစ်ဆေးဆဲဖြစ်သည် (1-7 ရက်)',
    RESELLER_LIMIT_REACHED: (t) => `${t} Limit ပြည့်ပါပြီ — Premium Plan ဝယ်ယူပါ`,

    // ============ Upload ============
    UPLOAD_SUCCESS:        'ဖိုင် တင်ပြီးပါပြီ',
    UPLOAD_SIZE_EXCEEDED:  (m) => `ဖိုင်ဆိုဒ် ${m}MB ထက် မကျော်ရပါ`,
    UPLOAD_FORMAT_INVALID: 'ဖိုင်ပုံစံ မမှန်ကန်ပါ',

    // ============ Promo ============
    PROMO_VALID:         (d) => `Promo Code မှ ${d} MMK လျှော့ပေးပါသည်`,
    PROMO_INVALID:       'Promo Code မတည်ရှိပါ သို့မဟုတ် သက်တမ်းကုန်ပြီဖြစ်သည်',
    PROMO_ALREADY_USED:  'ဤ Promo Code ကို သင်အသုံးပြုပြီးဖြစ်သည်',
    PROMO_MAX_REACHED:   'ဤ Promo Code ၏ သုံးစွဲနိုင်မှုကုန်ဆုံးပြီ',

    // ============ KYC ============
    KYC_SUBMITTED: 'KYC Application တင်ပြပြီးပါပြီ — 1-7 ရက်တွင် စစ်ဆေးပေးပါမည်',
    KYC_APPROVED:  'Reseller KYC အတည်ပြုပြီးပါပြီ',
    KYC_REJECTED:  (r) => `KYC ငြင်းပယ်ခံရသည် — ${r}`,
};
```

Every code path that shows an error / warning / success **must** reference a key from this library. String literals are forbidden in the toast callsites.

---

## Part 18 — G Store System (Complete)

### 18.1 Categorisation logic (topup vs gift card)

The single G2Bulk catalogue mixes topup games (which need a player ID) and gift cards (which don't). At sync time we classify each product:

```javascript
async function categorizeGames(games) {
    const topupGames    = [];
    const giftcardGames = [];

    for (const game of games) {
        const fields = await fetchGameFields(game.code);
        const requiresPlayerId = fields.some(f =>
            ['player_id','user_id','uid','account_id','username'].includes(f.name.toLowerCase())
        );
        if (requiresPlayerId) topupGames.push(game);
        else                  giftcardGames.push(game);
    }

    return { topupGames, giftcardGames };
}
```

The result is persisted onto each `products` row as `products.type = 'topup' | 'giftcard'`. The G Store's two tabs (Part 8.6) filter directly on that column.

### 18.2 Order success display (G2Bulk order ID only — never the API key)

```javascript
// api/g2bulk-v1.js
async function placeTopupOrder(gameCode, playerData, packageId, userId) {
    const g2bulkResponse = await fetch(`${G2BULK_BASE_URL}/games/${gameCode}/order`, {
        method:  'POST',
        headers: {
            'Authorization':    `Bearer ${process.env.G2BULK_API_KEY}`,   // SERVER ONLY
            'X-Idempotency-Key': crypto.randomUUID()
        },
        body: JSON.stringify({ playerId: playerData.id, packageId })
    });
    const orderData = await g2bulkResponse.json();

    await supabase.from('g2bulk_orders').insert({
        user_id:          userId,
        g2bulk_order_id:  orderData.order_id,
        status:           'pending'
    });

    // ⭐ Response returns the g2bulk_order_id only — the API key is NEVER exposed.
    return {
        success:         true,
        our_order_ref:   internalOrderId,
        g2bulk_order_id: orderData.order_id,
        status:          'processing'
    };
}
```

The success screen (§ 8.6) shows:
- A checkmark with a `stroke-dashoffset` animation (0.6 s ease-out).
- The internal order reference (`#ORD-000123`) — always shown.
- The G2Bulk order ID (`G2B-98765`) — with a copy button, useful for support.
- Live delivery status, polled every 5 s from `GET /api/g2bulk-v1?op=status&order_id=…`.

---

## Part 19 — App vs Web Platform Detection

Every request from the Users Dashboard includes the platform in its User-Agent parsing so `user_location_tracking.platform` can be filled in.

```javascript
export function detectPlatform() {
    const ua = navigator.userAgent;
    const platform = { isApp: false, appVersion: null, os: null, browser: null, deviceType: null };

    // Custom app UA marker set by the wrapper
    const appMatch = ua.match(/CR7GameApp\/(\d+\.\d+\.\d+)/);
    if (appMatch) { platform.isApp = true; platform.appVersion = appMatch[1]; }

    // WebView heuristic — flags Android WKWebView / iOS SFSafariViewController
    const isWebView = /wv/.test(ua) ||
        (/\bMobile\/[A-Z0-9]+\b/.test(ua) && !window.safari) ||
        window.matchMedia('(display-mode: standalone)').matches;
    if (isWebView && !platform.isApp) platform.isApp = true;

    // OS
    if      (/Android/i.test(ua))               platform.os = 'android';
    else if (/iPhone|iPad|iPod/i.test(ua))      platform.os = 'ios';
    else if (/Windows/i.test(ua))               platform.os = 'windows';
    else if (/Mac/i.test(ua))                   platform.os = 'macos';
    else                                        platform.os = 'other';

    // Device
    platform.deviceType = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';

    // Browser
    if      (/Chrome/i.test(ua) && !/Edge/i.test(ua)) platform.browser = 'chrome';
    else if (/Safari/i.test(ua))                      platform.browser = 'safari';
    else if (/Firefox/i.test(ua))                     platform.browser = 'firefox';
    else                                              platform.browser = 'other';

    return platform;
}
```

The detected platform is sent with every location update (Part 7.4) and stored in `user_location_tracking.platform` for the Admin Map filter (Part 11).

---

## Part 20 — Security System (Anti-Hack Measures)

### 20.1 Balance-hack prevention

The client's `amount` field on any order or balance move is **never trusted**. The server always:

1. Reads the current authoritative price from the DB.
2. Reads the current authoritative user balance from the DB.
3. Applies the move only via the `update_user_balance` RPC (which is the only DML path allowed on `users.game_balance` — the trigger `prevent_direct_balance_edit` (Part 21) rejects direct UPDATEs).

```javascript
// api/balance.js  — server-side computation only
async function processOrder(userId, cartItems) {
    const { data: user } = await supabase
        .from('users')
        .select('game_balance')
        .eq('id', userId)
        .single();

    const serverTotal = await computeTotal(cartItems); // reads DB prices only

    if (user.game_balance < serverTotal) {
        return { error: MESSAGES.BALANCE_INSUFFICIENT(serverTotal, user.game_balance) };
    }

    await supabase.rpc('update_user_balance', {
        p_user_id: userId,
        p_amount:  -serverTotal,
        p_type:    'order_deduct',
        p_ref_id:  <order_id>
    });
}
```

### 20.2 CORS + rate limiting

```javascript
const ALLOWED_ORIGINS = [
    `https://${process.env.USER_DOMAIN}`,
    `https://${process.env.ADMIN_DOMAIN}`,
    `https://${process.env.RESELLER_DOMAIN}`
];

// Server-side rate limiter (per IP + endpoint)
const rateLimitMap = new Map();
function checkRateLimit(ip, endpoint, maxReq = 10, windowMs = 60_000) {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const rec = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > rec.resetAt) { rec.count = 0; rec.resetAt = now + windowMs; }
    rec.count++;
    rateLimitMap.set(key, rec);

    if (rec.count > maxReq) {
        logSecurityEvent('RATE_LIMIT_HIT', ip, endpoint);
        return false;
    }
    return true;
}
```

**Per-endpoint limits:**

| Endpoint | Limit |
|---|---|
| `/api/auth` (login / signup) | 5 req/min per IP |
| `/api/balance` | 30 req/min per user |
| `/api/g2bulk-*` | 10 req/min per user |
| `/api/location` | 60 req/min per IP (allows the 30 s throttled updates) |
| `/api/admin-action` | 20 req/min per admin session |
| `/api/imgbb` (upload) | 6 req/min per user |
| `/api/imgbb` (proxy) | 300 req/min per IP |
| `/api/vps` | 20 req/min per admin session |
| Any other | 60 req/min per IP |

A rate-limit hit returns HTTP 429 with `Retry-After: <seconds>` and logs to `security_logs`. On the client, the toast is `MESSAGES.RATE_LIMIT_HIT` and the offending button disables for the retry-after window.

### 20.3 Other measures

- **HTTPS-only cookies** with `Secure; SameSite=Strict; HttpOnly`.
- **CSP header** on all HTML responses: `default-src 'self'; img-src 'self' data: /api/imgbb; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline';` (the `unsafe-inline` on style is temporary; the goal is to remove it once every dynamic style is moved to CSS custom properties).
- **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- **XSS**: all rich-text user input is DOMPurified server-side before storage; on render, use `textContent` for everything that isn't explicitly sanitised HTML.
- **SQL injection**: parameterised queries only (Supabase JS client + PostgREST). No string concatenation in SQL.
- **Direct object references**: RLS on every table gates by `auth.uid()` or session-mapped `user_id` (Part 21).

---
## Part 21 — Database Schema (Complete SQL) — with Full English Documentation

> **This is the entire production database.** Every feature described in Parts 1–20 consumes this schema directly. Running the SQL in this part inside the Supabase SQL Editor (or with `psql`) **once** will provision the whole database — extensions, custom ENUM types, 40+ tables, foreign keys, 25+ RPC functions, 30+ triggers, 60+ RLS policies, Realtime publications, 10+ helper views, scheduled maintenance jobs, indexes, and initial seed data.

### 21.0 How to read this part

Each SQL section is preceded by a **prose block** in English that explains:

- **Purpose** — what this section exists to model or enforce.
- **Key entities** — the tables it defines and what each one represents.
- **Relationships** — how it links to other tables via foreign keys.
- **Indexes** — which columns are indexed and why (query patterns each index accelerates).
- **RLS considerations** — who can read / write / update rows of these tables at run time.
- **Realtime** — whether this section's tables emit Realtime events and to which channels.

Then the raw SQL follows in a `sql` code block, with English inline comments on every non-obvious line.

### 21.1 Section map

| Section | Contents |
|---:|---|
| 1 | PostgreSQL extensions (uuid-ossp, pgcrypto, citext, pg_trgm, btree_gin) |
| 2 | Custom ENUM types (roles, statuses, transaction kinds, etc.) |
| 3 | Core tables: users, sessions (admin / user / reseller), verification & reset tokens |
| 4 | Reseller KYC (application documents, status, reviewer trail) |
| 5 | Premium plans + reseller plan purchases |
| 6 | Content management: menus, categories, products, banners |
| 7 | Cart + Orders |
| 8 | G Store / G2Bulk orders |
| 9 | Transactions & payments (deposits, withdrawals, payment methods, balance ledger) |
| 10 | Promo codes |
| 11 | News & product reviews |
| 12 | Notifications |
| 13 | Location tracking (real-time + history) |
| 14 | Security logs |
| 15 | VPS management (physical servers, instances, assignments, metrics, actions) |
| 16 | YouTube cache |
| 17 | Settings & configuration |
| 18 | Wishlist / favourites |
| 19 | Functions (RPCs) — the ONLY sanctioned mutation paths for sensitive data |
| 20 | Triggers — automatic invariants (balance protection, counters, timestamps) |
| 21 | Row-Level Security policies — the security boundary between roles |
| 22 | Realtime publications — which tables emit changes to which channel |
| 23 | Helper views — pre-computed rollups for dashboards |
| 24 | Initial seed data — default payment methods, premium plans, settings |
| 25 | Scheduled maintenance (pg_cron compatible) — token cleanup, log rotation |
| 26 | Grant permissions to the anon / authenticated roles |

### 21.2 Global design principles

Before diving into individual sections, the schema follows four global rules that every table respects:

**Rule A — Every table has `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`.**
No auto-increment integers. UUIDs prevent enumeration attacks and are safe to expose in URLs.

**Rule B — Every table has `created_at` and `updated_at TIMESTAMPTZ`.**
`created_at` defaults to `NOW()` at insert time. `updated_at` is maintained by the `set_updated_at()` trigger (Section 20). This gives every row an audit trail with no application code.

**Rule C — Soft-delete via `is_active BOOLEAN` where deletion would break foreign keys.**
Hard `DELETE` is reserved for ephemeral rows (session tokens, cache). Domain rows (users, orders, products, categories) are soft-deleted by flipping `is_active = FALSE`, which preserves referential integrity for historical reporting.

**Rule D — Money is stored as `NUMERIC(18, 2)`, never as float.**
Balances, order totals, and prices all use `NUMERIC`. Floats would introduce rounding errors that compound with each transaction — unacceptable for a payment system.

### 21.3 Access-model recap (before diving into RLS)

Three server sessions exist in this system: **admin**, **user**, **reseller**. RLS distinguishes them by matching the session cookie against one of three session tables (`admin_sessions`, `user_sessions`, `reseller_sessions`).

- **Anon role** (Supabase's public anonymous role) — used by client-side JS. RLS forces this role to read **only** `is_active` rows in a small subset of tables (menus, categories, products, banners, published news, published reviews).
- **Authenticated role** — the client's JWT contains `sub = user_id`. RLS lets it read / write only rows scoped to its own `user_id`.
- **Service-role key** — only the server functions in `api/*.js` use this key, and only when the operation has already been authorised by the corresponding session table. This key bypasses RLS, so its use is strictly guarded.

Every RLS policy in Section 21 is written to be **safe by default** — if a session cannot be established, the row is not visible.

---
### 21.4 Section 1 — PostgreSQL extensions

**Purpose.** Enable the five PostgreSQL extensions the schema relies on.

- **`uuid-ossp`** provides `uuid_generate_v4()`, the primary-key default across every table. Alternative would be `pgcrypto`'s `gen_random_uuid()`, but `uuid-ossp` is used consistently for historical reasons and both are available.
- **`pgcrypto`** provides `crypt()` and `gen_salt()` should we ever want DB-side hashing, plus `gen_random_bytes()` for token generation.
- **`citext`** provides a case-insensitive text type. Used for `users.email` so `Alice@Example.com` and `alice@example.com` are the same row (essential for login and duplicate-signup prevention).
- **`pg_trgm`** provides trigram-based similarity search (`%` operator, `similarity()` function) used by the Global Search endpoint (§ 8.12) to fuzzy-match product / category / news titles.
- **`btree_gin`** allows a single GIN index to cover both `tsvector` and normal btree columns — useful for composite full-text-search indexes on `users` (search by username / email / phone in one index).

**Idempotency.** Every extension is created `IF NOT EXISTS`, so this section is safe to re-run.

```sql
-- ============================================================
-- SECTION 1: EXTENSIONS
-- ============================================================
-- uuid_generate_v4() for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- gen_random_bytes() for token generation (email verify, password reset, exchange tokens)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Case-insensitive text for email columns
CREATE EXTENSION IF NOT EXISTS "citext";
-- Trigram similarity search (used by /api/supabase?op=global_search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- Composite GIN indexes for multi-column full-text search on users, products
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

---

### 21.5 Section 2 — Custom ENUM types

**Purpose.** Constrain columns to a small closed set of legal values, at the database layer, so no application bug can insert an unknown state.

Every ENUM is wrapped in a `DO $$ … EXCEPTION WHEN duplicate_object THEN NULL; END $$` block so the section is idempotent — running the schema twice does not error.

Below is the complete catalogue of ENUMs with a description of the semantics of each value.

#### `user_role`

| Value | Meaning |
|---|---|
| `user` | Regular customer. Can browse, buy, deposit, place G Store orders, and apply for reseller KYC. |
| `reseller` | KYC-approved reseller. Can log into `RESELLER_DOMAIN`; can manage their own menus, categories, products, and banners (subject to plan limits, §10.3); still keeps all `user` capabilities on `USER_DOMAIN`. |
| `admin` | System operator. Only accessible on `ADMIN_DOMAIN` (behind the IP allow-list, Part 5). Not a normal login: admin identity is enforced via `admin_sessions`, not `users.role='admin'`. This enum value exists mainly to future-proof; currently the sole admin identity is `ADMIN_LOGIN_PASSWORD`. |

#### `user_status`

| Value | Meaning |
|---|---|
| `active` | Normal, allowed to log in. |
| `banned` | Permanently disabled by admin. Login is refused with a specific toast. |
| `suspended` | Temporarily disabled. Session termination + login refused; row is preserved. |
| `pending_verification` | Signed up but email not yet verified. Cannot place orders; the topbar shows a "verify your email" banner. |

#### `order_status`

Represents the full lifecycle of an order (both physical and G Store):

| Value | Meaning |
|---|---|
| `pending` | Placed by user; no payment yet (only for COD or balance orders where admin still has to fulfil). |
| `pending_payment_review` | User uploaded a payment screenshot; admin needs to review it before proceeding. |
| `processing` | Payment confirmed; admin / warehouse is preparing the order. |
| `approved` | Admin approved (money settled); shipping / delivery in progress for physical goods. |
| `completed` | Order delivered / redeemed. Terminal state. |
| `rejected` | Admin refused (with reason). Balance refunded if it was pre-paid. |
| `cancelled` | User cancelled within the allowed window (5 minutes from placement). |
| `refunded` | Post-completion refund (rare — e.g. failed G Store delivery). |

#### `payment_method_type`

| Value | Meaning |
|---|---|
| `virtual_balance` | Uses `users.game_balance`. |
| `kbz_pay`, `wave_pay`, `aya_pay`, `cb_pay` | Myanmar mobile wallets. Requires a screenshot upload. |
| `cod` | Cash on Delivery. |
| `bank_transfer` | Wire transfer. Requires a screenshot upload. |
| `other` | Manual reconciliation by admin. |

#### `transaction_type`

This is the ledger's chart of accounts. Every entry in `balance_ledger` (Section 9) has one of these types. The naming pattern is `<source>_<direction>`; where direction is understood from context (e.g. `deposit` is always a credit, `withdrawal` is always a debit).

| Value | Direction | Meaning |
|---|---|---|
| `deposit` | Credit | Admin-approved deposit request. |
| `withdrawal` | Debit | Admin-approved withdrawal request. |
| `order_deduct` | Debit | Purchase paid from virtual balance. |
| `order_refund` | Credit | Order rejected / cancelled / refunded. |
| `gstore_topup` | Debit | G Store purchase deducted balance. |
| `gstore_refund` | Credit | G Store failed → automatic balance refund. |
| `admin_adjustment_credit` | Credit | Manual admin credit (with reason). |
| `admin_adjustment_debit` | Debit | Manual admin debit (with reason). |
| `vps_payment` | Debit | Paid for a VPS assignment. |
| `premium_upgrade` | Debit | Paid for a reseller plan. |
| `promo_bonus` | Credit | Promo code bonus credit. |
| `referral_bonus` | Credit | Referral programme bonus. |

#### `kyc_status`

| Value | Meaning |
|---|---|
| `pending` | Application submitted; not yet reviewed. |
| `under_review` | Admin has opened the application but not yet decided. |
| `approved` | Applicant becomes reseller. |
| `rejected` | Applicant refused (reason recorded). |
| `resubmit_required` | Documents unclear; user must upload new photos. |

#### `vps_status`

| Value | Meaning |
|---|---|
| `creating` | Provisioning in progress. |
| `running` | Guest VM is up. |
| `stopped` | Guest VM is down but the disk exists. |
| `suspended` | Frozen (RAM snapshot on disk). |
| `deleted` | Marked for removal. |
| `error` | Provisioning or run-time error; needs admin attention. |
| `migrating` | Being moved between physical hosts (rare). |
| `snapshotting` | Snapshot in progress. |

#### `product_display_style`

Determines how the client renders each product in the Category Detail page (§ 8.4).

| Value | Layout |
|---|---|
| `GRID_CARD` | Default 3-per-row card grid. |
| `LIST_HORIZONTAL` | Single column, thumb+details in a row. |
| `FEATURED_LARGE` | Full-width hero card with overlay. |
| `COMPACT_MASONRY` | Pinterest-style 2-column masonry. |

#### `deposit_status` / `withdrawal_status`

Two separate ENUMs so the state machines evolve independently. `deposit_status` has `pending → approved | rejected | cancelled`. `withdrawal_status` has an additional `processing` state (money leaving the platform's bank account takes real-world time).

#### `notification_type`

The notification-center groups notifications by type; each `notification_type` maps to an icon and a click-target route in the client.

#### `banner_position`

| Value | Where the banner appears |
|---|---|
| `home_top` | Home page banner carousel. |
| `home_middle` | Between Featured Products and News on Home. |
| `gstore_top` | Above the G Store tabs. |
| `category_top` | On a specific category page (referenced via `banners.category_id`). |
| `popup` | Rendered as a modal that appears once per session. |

#### `g2bulk_order_status`

G Store's order lifecycle differs from `order_status` because G2Bulk is an external API with its own state machine.

| Value | Meaning |
|---|---|
| `pending` | Placed but not yet forwarded to G2Bulk. |
| `processing` | Forwarded; G2Bulk is fulfilling. |
| `success` | G2Bulk reported successful delivery. |
| `failed` | G2Bulk reported failure → balance auto-refunded. |
| `refunded` | Admin-initiated manual refund. |
| `partial` | Only part of the package was delivered (rare, e.g. code exhaustion). |

#### `security_event_type`

Enumerates every event type that can land in `security_logs`. Used by the Security Logs page (Part 12) as a filter dropdown.

#### `vps_action_type`

Every VPS action recorded in `vps_actions` (an audit trail): `create`, `start`, `stop`, `restart`, `force_kill`, `delete`, `snapshot`, `restore_snapshot`, `resize`, `reinstall`, `assign_user`, `revoke_user`.

#### `platform_type`

`web` / `app` / `unknown`, populated from `detectPlatform()` (Part 19).

#### `discount_type`

`percent` or `fixed`, used by `promo_codes.discount_type`.

```sql
-- ============================================================
-- SECTION 2: CUSTOM ENUM TYPES
-- ============================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'reseller', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'banned', 'suspended', 'pending_verification');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending', 'pending_payment_review', 'processing',
        'approved', 'completed', 'rejected', 'cancelled', 'refunded'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM (
        'virtual_balance', 'kbz_pay', 'wave_pay', 'aya_pay', 'cb_pay',
        'cod', 'bank_transfer', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM (
        'deposit', 'withdrawal',
        'order_deduct', 'order_refund',
        'gstore_topup', 'gstore_refund',
        'admin_adjustment_credit', 'admin_adjustment_debit',
        'vps_payment', 'premium_upgrade',
        'promo_bonus', 'referral_bonus'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM (
        'pending', 'under_review', 'approved', 'rejected', 'resubmit_required'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE vps_status AS ENUM (
        'creating', 'running', 'stopped', 'suspended',
        'deleted', 'error', 'migrating', 'snapshotting'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE product_display_style AS ENUM (
        'GRID_CARD', 'LIST_HORIZONTAL', 'FEATURED_LARGE', 'COMPACT_MASONRY'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE deposit_status AS ENUM (
        'pending', 'approved', 'rejected', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE withdrawal_status AS ENUM (
        'pending', 'processing', 'completed', 'rejected', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'order_update', 'balance_update', 'gstore_update',
        'kyc_update', 'vps_update', 'promo', 'system',
        'reseller_update', 'admin_message'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE banner_position AS ENUM (
        'home_top', 'home_middle', 'gstore_top', 'category_top', 'popup'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE g2bulk_order_status AS ENUM (
        'pending', 'processing', 'success', 'failed', 'refunded', 'partial'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE security_event_type AS ENUM (
        'ADMIN_IP_BLOCKED', 'ADMIN_LOGIN_FAIL', 'ADMIN_LOGIN_SUCCESS', 'ADMIN_LOGOUT',
        'RESELLER_AUTH_FAIL', 'RESELLER_AUTH_SUCCESS',
        'USER_LOGIN_FAIL', 'USER_LOGIN_SUCCESS', 'USER_LOGIN_LOCKED', 'USER_SIGNUP',
        'CAPTCHA_FAIL', 'RATE_LIMIT_HIT', 'INVALID_SESSION',
        'BALANCE_HACK_ATTEMPT', 'INVALID_TOKEN', 'SUSPICIOUS_REQUEST'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE vps_action_type AS ENUM (
        'create', 'start', 'stop', 'restart', 'force_kill', 'delete',
        'snapshot', 'restore_snapshot', 'resize', 'reinstall',
        'assign_user', 'revoke_user'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE platform_type AS ENUM ('web', 'app', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percent', 'fixed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
```

---
### 21.6 Section 3 — Core tables (users, sessions, verification tokens)

**Purpose.** The identity backbone of the system: the `users` table plus five sibling tables that manage session tokens and email/password lifecycle.

#### Table `users` — the account record

Every human being who touches the system (customer, reseller applicant, admin operator) has exactly one row here. The row's `role` column decides which domain they can log into.

**Key columns:**

- `id UUID` — primary key. Referenced by every other user-owned table.
- `username VARCHAR(30) UNIQUE` — the public handle. `chk_username_format` constraint enforces `^[a-zA-Z0-9_]{3,30}$` so no whitespace, punctuation, or emoji ever land here.
- `email CITEXT UNIQUE` — case-insensitive so `Foo@Bar.com` and `foo@bar.com` collide (essential for login).
- `phone VARCHAR(20)` — optional; used for the Checkout page and delivery.
- `password_hash TEXT` — bcrypt hash (cost 12). Never stored in plaintext.
- `transaction_pin_hash TEXT` — bcrypt hash of the 4-digit PIN used at G Store checkout. Separate from password so a leaked device session cannot spend the balance without the PIN.
- `role user_role` — see § 21.5.
- `status user_status` — see § 21.5.
- `game_balance BIGINT` — virtual balance in the smallest currency unit (MMK, no decimals). Guarded by `chk_game_balance_non_negative` (`>= 0`) *and* by the `prevent_direct_balance_edit` trigger (§ 21 Section 20) — the trigger fires on any `UPDATE` that changes `game_balance` without setting the session variable that only `update_user_balance()` sets.
- `email_verified` / `phone_verified BOOLEAN` — required before certain actions (e.g. checkout, KYC application).
- `reseller_approved_at TIMESTAMPTZ` — set when admin approves KYC; convenient for filtering active resellers.
- `reseller_plan_id UUID` / `reseller_plan_expires TIMESTAMPTZ` — current premium plan and its expiry. When `NOW() > reseller_plan_expires`, the reseller silently downgrades to the Free plan (limits enforced client-side and server-side in `admin-action.js`).
- `banned_at`, `banned_reason`, `banned_by` — a triplet that snapshots the ban decision. `banned_by` references `users(id)` (an admin operator's own users row, if we ever create real admin accounts; nullable so ADMIN_LOGIN_PASSWORD-only ops still work).
- `suspended_at`, `suspended_reason` — similar triplet for temporary suspension.
- `failed_login_attempts INT` + `lockout_until TIMESTAMPTZ` — password brute-force defence. Incremented on each fail; when it reaches 5, `lockout_until` is set to `NOW() + INTERVAL '60 seconds'`. Reset to 0 on any successful login.
- `failed_pin_attempts INT` + `pin_lockout_until TIMESTAMPTZ` — same pattern for the G Store PIN.
- `last_login_at`, `last_login_ip`, `registration_ip` — audit fields, used by the Admin User-Detail page (§ 9.3).
- `referral_code VARCHAR(20) UNIQUE` — the user's own referral code (autogenerated on signup).
- `referred_by_id UUID` — points at the referring user's `id`. `ON DELETE SET NULL` so deleting a user does not cascade-null-out referrals.
- `notification_token TEXT` — device push token (FCM / APNs) for the mobile-app wrapper.
- `language`, `timezone` — client preference; default `my` / `Asia/Yangon`.
- `created_at`, `updated_at` — the global timestamps (Rule B).

**Indexes and why they exist:**

| Index | Query pattern it accelerates |
|---|---|
| `idx_users_email` | Login: `WHERE email = $1`. |
| `idx_users_username` | Signup uniqueness check and profile lookup by username. |
| `idx_users_role` | Admin filters by role (users / resellers / all). |
| `idx_users_status` | Admin filters by status (active / banned / suspended / pending). |
| `idx_users_created_at DESC` | Admin "recent signups" list. |
| `idx_users_last_login DESC NULLS LAST` | Admin "recently active" list. |
| `idx_users_role_status` | Composite for Admin filters combining role + status. |
| `idx_users_referral_code` (partial) | Referral-code lookup on signup; only indexes non-null codes. |
| `idx_users_referred_by` (partial) | "Who did I refer?" queries. |
| `idx_users_reseller_plan` (partial, `WHERE role='reseller'`) | Reseller plan-expiry cron jobs. |
| `idx_users_search` (GIN over tsvector) | Global Search on username / email / phone / full_name. |

**RLS considerations:**

- `anon` can read **nothing** from `users` — the login flow reads through the service-role key.
- `authenticated` can `SELECT` only its own row (`id = auth.uid()`) and `UPDATE` a whitelist of self-editable columns (`avatar_url`, `bio`, `language`, `timezone`, `phone`, `notification_token`). Everything else — role, status, balance, plan, ban — is read-only from the user's perspective.
- Admin operations bypass RLS via the service-role key.

**Realtime:** the `users` table is **not** in any Realtime publication. Balance updates propagate to the user via the `balance_ledger` channel instead (so we don't leak sibling users' data).

#### Table `admin_sessions`

Stores the token issued by the Admin Login (Part 6.3).

- `token UUID UNIQUE` — the value that lives in the `admin_session` cookie.
- `ip_address INET NOT NULL` — the IP at issue-time. Re-checked on every admin request; if the client IP changes, the session is refused (belt-and-braces against session theft).
- `expires_at` — 30 days from issue.
- `last_active_at` — refreshed on every successful admin API call; used by the `cleanup_expired_sessions` cron (§ 21.28) and by the Session Info dropdown in the Admin topbar.

Indexes: token (for lookup), expires_at (for cron cleanup), ip (for the Security Logs cross-reference).

RLS: not accessed by any user role. Only the server (via service-role key) touches this table.

#### Table `user_sessions`

Same shape as `admin_sessions` but for regular users, plus a foreign key to `users.id` and extra device metadata (`platform`, `browser`, `os`, `device_type`, `app_version`).

- On login, `INSERT` a row.
- On every request, `SELECT` by `token` and check `expires_at > NOW()`.
- On logout, `DELETE` the row.

**Realtime**: not published.

#### Table `reseller_sessions`

Identical shape to `user_sessions` but issued specifically after a successful reseller login (Part 14.2). Kept in a separate table so an admin can revoke every reseller session (mass logout) without touching regular user sessions.

#### Table `exchange_tokens`

Powers the Users → Reseller domain SSO handoff (Part 14.5).

- 60-second TTL.
- `used BOOLEAN` + `used_at TIMESTAMPTZ` + `used_ip INET` — enforces single-use. Once consumed, the row is retained (with `used = TRUE`) for audit purposes; the daily cleanup job deletes rows older than 24 h.

RLS: never accessed by any front-end role.

#### Tables `email_verification_tokens`, `password_reset_tokens`

Same shape as `exchange_tokens` but scoped to their specific flows. Verification tokens have a 24-hour TTL; password-reset tokens have a 1-hour TTL.

```sql
-- ============================================================
-- SECTION 3: CORE TABLES
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: users — the master account record
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id                      UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    username                VARCHAR(30)     UNIQUE NOT NULL,               -- 3–30 chars, alnum/_ only
    email                   CITEXT          UNIQUE NOT NULL,               -- case-insensitive unique
    phone                   VARCHAR(20),
    password_hash           TEXT            NOT NULL,                      -- bcrypt cost 12
    transaction_pin_hash    TEXT,                                          -- bcrypt for 4-digit PIN
    role                    user_role       DEFAULT 'user' NOT NULL,
    status                  user_status     DEFAULT 'active' NOT NULL,
    game_balance            BIGINT          DEFAULT 0 NOT NULL,            -- MMK, no decimals
    full_name               VARCHAR(100),
    avatar_url              TEXT,                                          -- served via /api/imgbb masking proxy
    bio                     TEXT,
    email_verified          BOOLEAN         DEFAULT FALSE NOT NULL,
    phone_verified          BOOLEAN         DEFAULT FALSE NOT NULL,
    -- Reseller-specific
    reseller_approved_at    TIMESTAMPTZ,                                   -- set when admin approves KYC
    reseller_plan_id        UUID,                                          -- FK added later (avoid forward-ref cycle)
    reseller_plan_expires   TIMESTAMPTZ,
    -- Ban / suspension audit
    banned_at               TIMESTAMPTZ,
    banned_reason           TEXT,
    banned_by               UUID,
    suspended_at            TIMESTAMPTZ,
    suspended_reason        TEXT,
    -- Brute-force protection counters
    failed_login_attempts   INT             DEFAULT 0 NOT NULL,
    lockout_until           TIMESTAMPTZ,
    failed_pin_attempts     INT             DEFAULT 0 NOT NULL,
    pin_lockout_until       TIMESTAMPTZ,
    -- Audit
    last_login_at           TIMESTAMPTZ,
    last_login_ip           INET,
    registration_ip         INET,
    -- Referral programme
    referral_code           VARCHAR(20)     UNIQUE,
    referred_by_id          UUID            REFERENCES users(id) ON DELETE SET NULL,
    -- Push notifications (FCM / APNs)
    notification_token      TEXT,
    -- User preferences
    language                VARCHAR(10)     DEFAULT 'my',
    timezone                VARCHAR(50)     DEFAULT 'Asia/Yangon',
    -- Standard timestamps
    created_at              TIMESTAMPTZ     DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ     DEFAULT NOW() NOT NULL,
    -- Integrity constraints
    CONSTRAINT chk_game_balance_non_negative CHECK (game_balance >= 0),
    CONSTRAINT chk_username_format           CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
    CONSTRAINT chk_failed_login_attempts     CHECK (failed_login_attempts >= 0),
    CONSTRAINT chk_failed_pin_attempts       CHECK (failed_pin_attempts >= 0)
);

-- Indexes — see documentation table above
CREATE INDEX IF NOT EXISTS idx_users_email          ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username       ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role           ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status         ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at     ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_login     ON users(last_login_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_users_role_status    ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_users_referral_code  ON users(referral_code)  WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_referred_by    ON users(referred_by_id) WHERE referred_by_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_reseller_plan  ON users(reseller_plan_id, reseller_plan_expires) WHERE role = 'reseller';
-- Full-text search across identifying columns
CREATE INDEX IF NOT EXISTS idx_users_search         ON users USING gin(
    to_tsvector('simple',
        COALESCE(username, '')  || ' ' ||
        COALESCE(email, '')     || ' ' ||
        COALESCE(full_name, '') || ' ' ||
        COALESCE(phone, ''))
);

-- ------------------------------------------------------------
-- TABLE: admin_sessions — token issued after admin login
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_sessions (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    token           UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(),  -- cookie value
    ip_address      INET        NOT NULL,                                    -- re-checked on every request
    user_agent      TEXT,
    browser         VARCHAR(50),
    os              VARCHAR(50),
    expires_at      TIMESTAMPTZ NOT NULL,                                    -- 30 days from issue
    last_active_at  TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token   ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_ip      ON admin_sessions(ip_address);

-- ------------------------------------------------------------
-- TABLE: user_sessions — token issued after user login
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           UUID            UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    ip_address      INET,
    user_agent      TEXT,
    platform        platform_type   DEFAULT 'web',                          -- web / app / unknown
    browser         VARCHAR(50),
    os              VARCHAR(50),
    device_type     VARCHAR(20),                                             -- mobile / desktop
    app_version     VARCHAR(20),                                             -- if platform = 'app'
    expires_at      TIMESTAMPTZ     NOT NULL,
    last_active_at  TIMESTAMPTZ     DEFAULT NOW(),
    created_at      TIMESTAMPTZ     DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token   ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user    ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ------------------------------------------------------------
-- TABLE: reseller_sessions — token issued after reseller login
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reseller_sessions (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           UUID            UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    ip_address      INET,
    user_agent      TEXT,
    platform        platform_type   DEFAULT 'web',
    browser         VARCHAR(50),
    os              VARCHAR(50),
    expires_at      TIMESTAMPTZ     NOT NULL,
    last_active_at  TIMESTAMPTZ     DEFAULT NOW(),
    created_at      TIMESTAMPTZ     DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reseller_sessions_token   ON reseller_sessions(token);
CREATE INDEX IF NOT EXISTS idx_reseller_sessions_user    ON reseller_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_sessions_expires ON reseller_sessions(expires_at);

-- ------------------------------------------------------------
-- TABLE: exchange_tokens — 60 s single-use token for User→Reseller SSO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exchange_tokens (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    used        BOOLEAN     DEFAULT FALSE NOT NULL,
    used_at     TIMESTAMPTZ,
    used_ip     INET,
    expires_at  TIMESTAMPTZ NOT NULL,                                       -- issue + 60 seconds
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exchange_tokens_token   ON exchange_tokens(token);
CREATE INDEX IF NOT EXISTS idx_exchange_tokens_user    ON exchange_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_tokens_expires ON exchange_tokens(expires_at);

-- ------------------------------------------------------------
-- TABLE: email_verification_tokens — 24 h TTL
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    used        BOOLEAN     DEFAULT FALSE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verify_token  ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verify_user   ON email_verification_tokens(user_id);

-- ------------------------------------------------------------
-- TABLE: password_reset_tokens — 1 h TTL
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    used        BOOLEAN     DEFAULT FALSE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pw_reset_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_pw_reset_user  ON password_reset_tokens(user_id);
```

---

### 21.7 Section 4 — Reseller KYC

**Purpose.** Records the reseller application, its supporting documents, and the reviewer decision.

#### Table `reseller_kyc`

- `user_id UUID UNIQUE` — one KYC row per user. If a user is rejected, they can be resubmitted by admin (which increments `submission_count`) — the row is updated in place, not duplicated.
- `nric_number VARCHAR(30)` — Myanmar NRIC / national ID. Stored plaintext for admin review; access is gated by RLS to admin only.
- `nric_type VARCHAR(30)` — the ID type (e.g. `citizen`, `guest`, `passport`).
- `business_name`, `business_type`, `business_address`, `business_phone` — the applicant's business info.
- `id_front_url`, `id_back_url`, `selfie_url` — ImgBB URLs (masked in the client via `/api/imgbb`). Held for the compliance lifespan (2 years) and then anonymised by the cleanup job.
- `additional_docs JSONB` — array of `{ type, url }` for whatever else admin asked for.
- `status kyc_status` — see § 21.5.
- `reviewed_by`, `reviewed_at`, `rejection_reason`, `resubmit_note` — reviewer trail.
- `plan_id`, `plan_expires_at` — filled after approval; convenient for a "resellers whose KYC is approved AND plan is not expired" query.
- `admin_notes TEXT` — private notes visible only to admin.
- `submission_count INT DEFAULT 1` — increments when admin marks the row `resubmit_required` and the user submits again.

**Indexes:** by status (Admin filter), by user (join with `users`), by reviewed_at DESC NULLS LAST (Admin "recently reviewed" list), by created_at DESC (Admin "recent applications" list).

**RLS:** the applicant can `SELECT` their own row (`user_id = auth.uid()`). Admin bypasses via service-role key. Nobody else sees anything.

```sql
-- ============================================================
-- SECTION 4: RESELLER KYC
-- ============================================================
CREATE TABLE IF NOT EXISTS reseller_kyc (
    id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name           VARCHAR(100),
    nric_number         VARCHAR(30),
    nric_type           VARCHAR(30),                                       -- citizen / guest / passport
    business_name       VARCHAR(150),
    business_type       VARCHAR(80),
    business_address    TEXT,
    business_phone      VARCHAR(20),
    id_front_url        TEXT,                                              -- ImgBB (masked in client)
    id_back_url         TEXT,
    selfie_url          TEXT,
    additional_docs     JSONB       DEFAULT '[]',                          -- [{ type, url }, ...]
    status              kyc_status  DEFAULT 'pending' NOT NULL,
    reviewed_by         UUID        REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMPTZ,
    rejection_reason    TEXT,                                              -- shown to the applicant
    resubmit_note       TEXT,                                              -- shown to the applicant if resubmit required
    plan_id             UUID,                                              -- set after approval
    plan_expires_at     TIMESTAMPTZ,
    admin_notes         TEXT,                                              -- private, admin-only
    submission_count    INT         DEFAULT 1,
    created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_kyc_status      ON reseller_kyc(status);
CREATE INDEX IF NOT EXISTS idx_kyc_user        ON reseller_kyc(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_reviewed_at ON reseller_kyc(reviewed_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_kyc_created_at  ON reseller_kyc(created_at DESC);
```

---

### 21.8 Section 5 — Premium plans + reseller plan purchases

**Purpose.** Defines the reseller subscription tiers and records every purchase / upgrade.

#### Table `premium_plans`

The catalogue of available plans (Free / Bronze / Silver / Gold / Platinum, seeded in Section 24). Each row is a plan template.

- `slug VARCHAR(50) UNIQUE` — machine identifier (`free`, `bronze`, `silver`, `gold`, `platinum`).
- `price BIGINT` — in MMK.
- `duration_days INT` — how long a purchase is valid.
- `max_menus`, `max_categories`, `max_products`, `max_banners`, `max_storage_mb`, `max_customers` — hard limits. Enforced server-side in `admin-action.js` on every reseller create action.
- `analytics_access`, `priority_support`, `custom_domain`, `api_access BOOLEAN` — feature toggles.
- `features JSONB` — extensible bag for feature flags added later (avoids schema migration when we ship "no ads" or similar).
- `color`, `badge_svg` — cosmetic for the plans grid.
- `is_active`, `sort_order` — soft-delete + display order.

Indexes: composite on `(is_active, sort_order)` for the plans-grid render.

#### Table `reseller_plan_purchases`

Immutable purchase log. Each row records one attempt to buy or upgrade a plan.

- `plan_id UUID REFERENCES premium_plans(id)` — no `ON DELETE`, because we never actually delete plans (we soft-delete via `is_active`).
- `amount_paid BIGINT` — what the user actually paid (may differ from the current plan price if prices changed).
- `payment_method payment_method_type` — see § 21.5.
- `payment_screenshot_url TEXT` — if paid by mobile wallet.
- `payment_reference VARCHAR(100)` — admin-visible reference.
- `starts_at`, `expires_at` — filled after admin approval.
- `approved_by`, `approved_at` — reviewer trail.
- `status VARCHAR(20) DEFAULT 'pending'` — `pending` / `approved` / `rejected` / `cancelled`. (Not an ENUM for historical flexibility.)

Indexes: by user (Reseller's own purchase history), by status (Admin's pending queue).

```sql
-- ============================================================
-- SECTION 5: PREMIUM PLANS
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: premium_plans — the catalogue of plan tiers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS premium_plans (
    id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name                VARCHAR(50) UNIQUE NOT NULL,                       -- Display name
    slug                VARCHAR(50) UNIQUE NOT NULL,                       -- Machine identifier
    price               BIGINT      NOT NULL DEFAULT 0,                    -- MMK
    duration_days       INT         NOT NULL DEFAULT 30,
    -- Hard limits (enforced server-side)
    max_menus           INT         DEFAULT 1,
    max_categories      INT         DEFAULT 5,
    max_products        INT         DEFAULT 20,
    max_banners         INT         DEFAULT 2,
    max_storage_mb      BIGINT      DEFAULT 100,
    max_customers       INT         DEFAULT 100,
    -- Feature toggles
    analytics_access    BOOLEAN     DEFAULT FALSE,
    priority_support    BOOLEAN     DEFAULT FALSE,
    custom_domain       BOOLEAN     DEFAULT FALSE,
    api_access          BOOLEAN     DEFAULT FALSE,
    features            JSONB       DEFAULT '{}',                          -- extensible feature bag
    -- Cosmetics
    color               VARCHAR(20) DEFAULT '#00a8ff',
    badge_svg           TEXT,
    -- Lifecycle
    is_active           BOOLEAN     DEFAULT TRUE,
    sort_order          INT         DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_premium_plans_active ON premium_plans(is_active, sort_order);

-- ------------------------------------------------------------
-- TABLE: reseller_plan_purchases — immutable purchase log
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reseller_plan_purchases (
    id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                 UUID        NOT NULL REFERENCES premium_plans(id),
    amount_paid             BIGINT      NOT NULL,
    payment_method          payment_method_type,
    payment_screenshot_url  TEXT,
    payment_reference       VARCHAR(100),
    starts_at               TIMESTAMPTZ,                                   -- filled on approval
    expires_at              TIMESTAMPTZ,
    approved_by             UUID        REFERENCES users(id) ON DELETE SET NULL,
    approved_at             TIMESTAMPTZ,
    status                  VARCHAR(20) DEFAULT 'pending',                 -- pending/approved/rejected/cancelled
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plan_purchases_user   ON reseller_plan_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_purchases_status ON reseller_plan_purchases(status);
```

---
### 21.9 Section 6 — Content management (menus, categories, products, banners)

**Purpose.** The public catalogue: what shoppers browse on the Users Dashboard and what admins / resellers author on their respective dashboards.

**Ownership model.** Every content row has an optional `reseller_id` foreign key. A row with `reseller_id IS NULL` is a **global** row (owned by admin — visible to all users). A row with a non-null `reseller_id` is a **reseller-scoped** row (only visible to that reseller's own customers, in the reseller subdomain / shop context). RLS enforces this scoping in Section 21 (§ 21.20).

#### Table `menus`

Top-level navigation buckets on Home (§ 8.2). Renders as icon tiles.

- `reseller_id` — see ownership model above.
- `name_mm`, `name_en` — bilingual names. The client renders `name_mm` by default and swaps to `name_en` when `users.language = 'en'`.
- `slug` — used for pretty URLs and analytics. Uniqueness is scoped `(reseller_id, slug)` so two different resellers can each have a `mobile-games` slug.
- `icon_svg TEXT` — the actual SVG source (not a URL). Rendered inline so the client can theme it via `currentColor`.
- `cover_image_url` — cover banner shown on the Menu Detail page (§ 8.3).
- `visible_to_users`, `visible_to_resellers BOOLEAN` — audience toggles. A menu can be hidden from users but visible to reseller dashboards, or vice-versa.
- `is_gstore_linked BOOLEAN` — when TRUE, this menu is a G Store category (topups / gift cards) rather than a physical-goods menu.
- `sort_order INT` — drag-drop position.
- `meta_title`, `meta_description` — SEO.

**Indexes:** `reseller_id`, `sort_order`, `is_active`, plus two partial indexes that greatly speed up the two hot queries:
- `idx_menus_global (is_active, sort_order) WHERE reseller_id IS NULL` — the Users Dashboard home fetch.
- `idx_menus_reseller_active (reseller_id, is_active, sort_order) WHERE reseller_id IS NOT NULL` — the reseller-shop home fetch.

#### Table `categories`

Second-level navigation under a menu.

- `parent_category_id` — optional self-reference for sub-categories. Guarded by `chk_no_self_parent CHECK (id != parent_category_id)`. Max depth is enforced application-side to 2 (a category can have children, but a grandchild cannot have children).
- `product_count INT` — materialised count of active products under this category. Kept up to date by the trigger `refresh_category_product_count` (§ 21 Section 20).
- Full-text search index on `(name_mm || name_en)` via GIN.

#### Table `products`

The core of the catalogue.

- `menu_id`, `category_id` — where the product lives. Both `ON DELETE SET NULL` — deleting a menu doesn't cascade-delete its products, it just orphans them (they become invisible until an admin re-assigns).
- `reseller_id` — ownership.
- `name_mm`, `name_en`, `slug`, `description`, `short_description` — content.
- `price BIGINT`, `original_price BIGINT`, `cost_price BIGINT` — the display price, the pre-discount price (for a strike-through), and the internal cost (admin only, never leaked to client).
- `stock`, `low_stock_threshold`, `track_stock`, `allow_backorder` — inventory. `low_stock_threshold` triggers the "low stock" notification to the reseller / admin.
- `main_image_url`, `gallery_images JSONB` — main image + up to 6 gallery images (JSON array of URLs).
- `display_style product_display_style` — see § 21.5. Controls the card layout on Category Detail.
- `ribbon`, `ribbon_color` — corner ribbon: `new` / `sale` / `hot` / `best` / `limited` / `soon`.
- `is_active`, `is_featured BOOLEAN` — soft-delete + featured on Home.
- `is_gstore_product BOOLEAN` + `g2bulk_code`, `g2bulk_type`, `g2bulk_package_data`, `g2bulk_field_data`, `price_markup_percent` — the G Store integration. `price_markup_percent NUMERIC(5,2)` adds to G2Bulk's price so admin earns margin.
- `view_count`, `sold_count`, `rating_avg NUMERIC(3,2)`, `rating_count` — cached counters maintained by triggers.
- `tags TEXT[]` — array of freeform tags, indexed with a GIN index for `WHERE tags && ARRAY[…]` queries.
- `specifications JSONB` — extensible key-value bag (e.g. `{ "weight": "500g", "colour": "red" }`).

**Constraints:** `chk_price_positive`, `chk_stock_non_negative`, `chk_rating_range` (0–5), `chk_ribbon_values`, `chk_g2bulk_type` (`topup` / `giftcard`).

**Indexes:** category (list page), menu, reseller, `g2bulk_code` (partial, for the sync UI), `(is_active, is_featured)` composite (for Home Featured), price (for sort), `sold_count DESC` (best-sellers), `(rating_avg DESC, rating_count DESC)` (top-rated with tiebreaker), created_at (newest), `(category_id, is_active, sort_order)` composite (Category Detail page), `stock WHERE track_stock=TRUE` (low-stock alerts), tags (GIN), full-text search (GIN over name_mm + name_en + short_description).

#### Table `product_variants`

Variant rows for a single product (Size / Color / etc.).

- `variant_type VARCHAR(50)` — e.g. `size`.
- `variant_value VARCHAR(100)` — e.g. `M`.
- `price_diff BIGINT DEFAULT 0` — delta added to the base product price for this variant.
- `price_override BIGINT` — if not null, replaces the base price entirely (rare).
- `stock INT` — per-variant stock (independent from the parent product's stock).
- `sku` — optional SKU code.

**Indexes:** by product (for the product-detail render), composite `(product_id, is_active, sort_order)`.

#### Table `banners`

Home/G Store/category banners.

- `link_type VARCHAR(20) DEFAULT 'url'` — `url` / `product` / `category` / `menu`. When not `url`, `link_target_id UUID` points at the target row.
- `starts_at`, `ends_at TIMESTAMPTZ` — active window. The Home page filters `WHERE (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW())`.
- `click_count`, `impression_count BIGINT` — analytics counters (post-incremented by a fire-and-forget `POST /api/track` — never load-bearing).

**Indexes:** `(position, is_active, sort_order)` for the render fetch, reseller for the reseller-scoped view, `(is_active, starts_at, ends_at)` for the active-window filter.

```sql
-- ============================================================
-- SECTION 6: CONTENT MANAGEMENT
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: menus — top-level navigation on Users home
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
    id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    reseller_id             UUID        REFERENCES users(id) ON DELETE CASCADE,      -- NULL = global menu
    name_mm                 VARCHAR(100) NOT NULL,
    name_en                 VARCHAR(100),
    slug                    VARCHAR(120),
    description             TEXT,
    icon_svg                TEXT,                                                    -- inline SVG source
    cover_image_url         TEXT,
    sort_order              INT         DEFAULT 0,
    is_active               BOOLEAN     DEFAULT TRUE,
    visible_to_users        BOOLEAN     DEFAULT TRUE,
    visible_to_resellers    BOOLEAN     DEFAULT TRUE,
    is_gstore_linked        BOOLEAN     DEFAULT FALSE,
    meta_title              VARCHAR(200),
    meta_description        TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(reseller_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_menus_reseller        ON menus(reseller_id);
CREATE INDEX IF NOT EXISTS idx_menus_sort            ON menus(sort_order);
CREATE INDEX IF NOT EXISTS idx_menus_active          ON menus(is_active);
CREATE INDEX IF NOT EXISTS idx_menus_global          ON menus(is_active, sort_order) WHERE reseller_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_menus_reseller_active ON menus(reseller_id, is_active, sort_order) WHERE reseller_id IS NOT NULL;

-- ------------------------------------------------------------
-- TABLE: categories — second-level navigation under a menu
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_id                 UUID        REFERENCES menus(id) ON DELETE CASCADE,
    parent_category_id      UUID        REFERENCES categories(id) ON DELETE CASCADE,-- optional self-reference for sub-categories
    reseller_id             UUID        REFERENCES users(id) ON DELETE CASCADE,
    name_mm                 VARCHAR(100) NOT NULL,
    name_en                 VARCHAR(100),
    slug                    VARCHAR(120),
    description             TEXT,
    image_url               TEXT,
    icon_svg                TEXT,
    sort_order              INT         DEFAULT 0,
    is_active               BOOLEAN     DEFAULT TRUE,
    product_count           INT         DEFAULT 0,                                  -- maintained by trigger
    meta_title              VARCHAR(200),
    meta_description        TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_no_self_parent CHECK (id != parent_category_id)
);

CREATE INDEX IF NOT EXISTS idx_categories_menu        ON categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent      ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_reseller    ON categories(reseller_id);
CREATE INDEX IF NOT EXISTS idx_categories_menu_active ON categories(menu_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_search      ON categories USING gin(
    to_tsvector('simple', COALESCE(name_mm,'') || ' ' || COALESCE(name_en,''))
);

-- ------------------------------------------------------------
-- TABLE: products — the core catalogue
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id                    UUID                    DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_id               UUID                    REFERENCES menus(id) ON DELETE SET NULL,
    category_id           UUID                    REFERENCES categories(id) ON DELETE SET NULL,
    reseller_id           UUID                    REFERENCES users(id) ON DELETE CASCADE,
    name_mm               VARCHAR(200)            NOT NULL,
    name_en               VARCHAR(200),
    slug                  VARCHAR(220),
    description           TEXT,
    short_description     VARCHAR(500),
    price                 BIGINT                  NOT NULL,                         -- display price (MMK)
    original_price        BIGINT,                                                    -- for strike-through
    cost_price            BIGINT,                                                    -- admin-only, internal
    stock                 INT                     DEFAULT 0,
    low_stock_threshold   INT                     DEFAULT 5,
    track_stock           BOOLEAN                 DEFAULT TRUE,
    allow_backorder       BOOLEAN                 DEFAULT FALSE,
    main_image_url        TEXT,
    gallery_images        JSONB                   DEFAULT '[]',
    display_style         product_display_style   DEFAULT 'GRID_CARD',
    ribbon                VARCHAR(20),                                              -- new/sale/hot/best/limited/soon
    ribbon_color          VARCHAR(20),
    is_active             BOOLEAN                 DEFAULT TRUE,
    is_featured           BOOLEAN                 DEFAULT FALSE,
    -- G Store integration
    is_gstore_product     BOOLEAN                 DEFAULT FALSE,
    g2bulk_code           VARCHAR(100),
    g2bulk_type           VARCHAR(20),                                              -- 'topup' | 'giftcard'
    g2bulk_package_data   JSONB                   DEFAULT '[]',
    g2bulk_field_data     JSONB                   DEFAULT '[]',
    price_markup_percent  NUMERIC(5,2)            DEFAULT 0,
    -- SEO
    meta_title            VARCHAR(200),
    meta_description      TEXT,
    -- Display & counters
    sort_order            INT                     DEFAULT 0,
    view_count            BIGINT                  DEFAULT 0,
    sold_count            BIGINT                  DEFAULT 0,
    rating_avg            NUMERIC(3,2)            DEFAULT 0,
    rating_count          INT                     DEFAULT 0,
    tags                  TEXT[],
    specifications        JSONB                   DEFAULT '{}',
    created_at            TIMESTAMPTZ             DEFAULT NOW() NOT NULL,
    updated_at            TIMESTAMPTZ             DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_price_positive     CHECK (price >= 0),
    CONSTRAINT chk_stock_non_negative CHECK (stock >= 0),
    CONSTRAINT chk_rating_range       CHECK (rating_avg >= 0 AND rating_avg <= 5),
    CONSTRAINT chk_ribbon_values      CHECK (ribbon IS NULL OR ribbon IN ('new','sale','hot','best','limited','soon')),
    CONSTRAINT chk_g2bulk_type        CHECK (g2bulk_type IS NULL OR g2bulk_type IN ('topup','giftcard'))
);

CREATE INDEX IF NOT EXISTS idx_products_category         ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_menu             ON products(menu_id);
CREATE INDEX IF NOT EXISTS idx_products_reseller         ON products(reseller_id);
CREATE INDEX IF NOT EXISTS idx_products_g2bulk           ON products(g2bulk_code) WHERE g2bulk_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_active_featured  ON products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price            ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_sold_count       ON products(sold_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating           ON products(rating_avg DESC, rating_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_created          ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_active  ON products(category_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_stock            ON products(stock) WHERE track_stock = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_tags             ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_search           ON products USING gin(
    to_tsvector('simple',
        COALESCE(name_mm,'') || ' ' ||
        COALESCE(name_en,'') || ' ' ||
        COALESCE(short_description,''))
);

-- ------------------------------------------------------------
-- TABLE: product_variants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id      UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_type    VARCHAR(50) NOT NULL,                                            -- e.g. 'size', 'color'
    variant_value   VARCHAR(100) NOT NULL,                                           -- e.g. 'M', 'Red'
    price_diff      BIGINT      DEFAULT 0,                                           -- +/- delta on base price
    price_override  BIGINT,                                                          -- if not null, replaces base price
    stock           INT         DEFAULT 0,
    image_url       TEXT,
    sku             VARCHAR(100),
    is_active       BOOLEAN     DEFAULT TRUE,
    sort_order      INT         DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_variant_stock CHECK (stock >= 0)
);

CREATE INDEX IF NOT EXISTS idx_variants_product        ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_product_active ON product_variants(product_id, is_active, sort_order);

-- ------------------------------------------------------------
-- TABLE: banners
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banners (
    id               UUID                DEFAULT gen_random_uuid() PRIMARY KEY,
    reseller_id      UUID                REFERENCES users(id) ON DELETE CASCADE,
    title            VARCHAR(200),
    subtitle         VARCHAR(300),
    image_url        TEXT                NOT NULL,
    mobile_image_url TEXT,                                                            -- optional narrower crop
    cta_text         VARCHAR(80),
    cta_link         TEXT,
    position         banner_position     DEFAULT 'home_top',
    link_type        VARCHAR(20)         DEFAULT 'url',                              -- url/product/category/menu
    link_target_id   UUID,
    starts_at        TIMESTAMPTZ,
    ends_at          TIMESTAMPTZ,
    sort_order       INT                 DEFAULT 0,
    is_active        BOOLEAN             DEFAULT TRUE,
    click_count      BIGINT              DEFAULT 0,
    impression_count BIGINT              DEFAULT 0,
    created_at       TIMESTAMPTZ         DEFAULT NOW(),
    updated_at       TIMESTAMPTZ         DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_position    ON banners(position, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_banners_reseller    ON banners(reseller_id);
CREATE INDEX IF NOT EXISTS idx_banners_active_date ON banners(is_active, starts_at, ends_at);
```

---

### 21.10 Section 7 — Cart & orders

**Purpose.** Records the user's cart, orders, order line items, and every status transition.

#### Table `cart_items`

One row per (user, product, variant) triple. `UNIQUE(user_id, product_id, variant_id)` ensures that adding the same product+variant again just increments the quantity of the existing row (via `ON CONFLICT … DO UPDATE`).

- `quantity` guarded by `chk_cart_quantity CHECK (quantity > 0 AND quantity <= 100)` — protects against a client that tries to submit a million quantity.

#### Table `orders`

The master order record.

- `order_number VARCHAR(30) UNIQUE` — a human-friendly identifier like `ORD-YYMMDD-XXXX`. Generated by trigger `generate_order_number` (§ 21 Section 20).
- `user_id` / `reseller_id` — the customer and (if applicable) the reseller whose shop the order originated in. Both `ON DELETE SET NULL` — deleting either side of the row preserves the historical order.
- `status order_status` — see § 21.5.
- Money columns are all `BIGINT`: `subtotal`, `discount`, `delivery_fee`, `tax`, `total`, `promo_discount`, `refunded_amount`. Guarded by `chk_order_total_positive`, `chk_order_subtotal_positive`, etc.
- Payment fields: `payment_method`, `payment_screenshot_url`, `payment_reference`, `payment_verified_at`.
- Delivery snapshot: `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_city`, `delivery_township`, `delivery_state`, `delivery_note`.
- Status transition audit: `approved_by`/`approved_at`, `rejected_by`/`rejected_reason`/`rejected_at`, `cancelled_by`/`cancelled_reason`/`cancelled_at`, `refunded_at`/`refunded_amount`, `completed_at`, `admin_notes`.
- `promo_code_id` — forward reference to `promo_codes` (added deferred later in Section 10).

**Indexes:** by user, reseller, status, `created_at DESC`, `order_number`, `(user_id, status)` composite (Orders List tabs), `(payment_method, status)` (Admin filter), `(created_at, total)` composite (date-range reports).

#### Table `order_items`

Line items for an order. Each row **snapshots** the product name, image, variant name, price, and G2Bulk code at the time of purchase — so historical orders show what the customer actually paid for even after products are edited or deleted.

- `product_id ON DELETE SET NULL` — deleting a product preserves the order line.
- `price_snapshot` — the unit price at purchase time.
- `quantity` — the quantity ordered.
- `subtotal` = `price_snapshot * quantity` (also stored, so a report doesn't have to recompute).

#### Table `order_status_history`

Append-only log of every status transition on an order. Enables the timeline UI on the Order Detail page (§ 8.10). Populated by the trigger `log_order_status_change` (§ 21 Section 20).

```sql
-- ============================================================
-- SECTION 7: CART & ORDERS
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: cart_items
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id      UUID        REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity        INT         NOT NULL DEFAULT 1,
    added_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id),
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0 AND quantity <= 100)
);

CREATE INDEX IF NOT EXISTS idx_cart_user    ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON cart_items(product_id);

-- ------------------------------------------------------------
-- TABLE: orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id                      UUID                DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number            VARCHAR(30)         UNIQUE NOT NULL,                   -- e.g. ORD-240115-A1B2
    user_id                 UUID                REFERENCES users(id) ON DELETE SET NULL,
    reseller_id             UUID                REFERENCES users(id) ON DELETE SET NULL,
    status                  order_status        DEFAULT 'pending' NOT NULL,
    -- Money
    subtotal                BIGINT              NOT NULL,
    discount                BIGINT              DEFAULT 0,
    delivery_fee            BIGINT              DEFAULT 0,
    tax                     BIGINT              DEFAULT 0,
    total                   BIGINT              NOT NULL,
    -- Payment
    payment_method          payment_method_type,
    payment_screenshot_url  TEXT,
    payment_reference       VARCHAR(100),
    payment_verified_at     TIMESTAMPTZ,
    -- Promo
    promo_code_id           UUID,                                                   -- FK added after promo_codes
    promo_discount          BIGINT              DEFAULT 0,
    -- Delivery snapshot
    delivery_name           VARCHAR(100),
    delivery_phone          VARCHAR(20),
    delivery_address        TEXT,
    delivery_city           VARCHAR(100),
    delivery_township       VARCHAR(100),
    delivery_state          VARCHAR(100),
    delivery_note           TEXT,
    tracking_number         VARCHAR(100),
    estimated_delivery      TIMESTAMPTZ,
    delivered_at            TIMESTAMPTZ,
    -- Status transition audit
    approved_by             UUID                REFERENCES users(id) ON DELETE SET NULL,
    approved_at             TIMESTAMPTZ,
    rejected_reason         TEXT,
    rejected_by             UUID                REFERENCES users(id) ON DELETE SET NULL,
    rejected_at             TIMESTAMPTZ,
    refunded_at             TIMESTAMPTZ,
    refunded_amount         BIGINT,
    cancelled_at            TIMESTAMPTZ,
    cancelled_by            UUID,
    cancelled_reason        TEXT,
    completed_at            TIMESTAMPTZ,
    admin_notes             TEXT,
    ip_address              INET,
    user_agent              TEXT,
    created_at              TIMESTAMPTZ         DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ         DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_order_total_positive     CHECK (total >= 0),
    CONSTRAINT chk_order_subtotal_positive  CHECK (subtotal >= 0),
    CONSTRAINT chk_order_discount_valid     CHECK (discount >= 0),
    CONSTRAINT chk_order_delivery_valid     CHECK (delivery_fee >= 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_user         ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_reseller     ON orders(reseller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created      ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number       ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_status  ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_payment      ON orders(payment_method, status);
CREATE INDEX IF NOT EXISTS idx_orders_date_range   ON orders(created_at, total);

-- ------------------------------------------------------------
-- TABLE: order_items — snapshotted line items
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id                 UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id               UUID        REFERENCES products(id) ON DELETE SET NULL,
    variant_id               UUID        REFERENCES product_variants(id) ON DELETE SET NULL,
    -- Snapshots (preserved even if the product is later edited/deleted)
    product_name_snapshot    VARCHAR(200),
    product_image_snapshot   TEXT,
    variant_name_snapshot    VARCHAR(100),
    price_snapshot           BIGINT      NOT NULL,
    quantity                 INT         NOT NULL,
    subtotal                 BIGINT      NOT NULL,
    g2bulk_code_snapshot     VARCHAR(100),
    created_at               TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_item_subtotal CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ------------------------------------------------------------
-- TABLE: order_status_history — append-only status log
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_status_history (
    id          UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id    UUID            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status  order_status,
    new_status  order_status    NOT NULL,
    changed_by  UUID            REFERENCES users(id) ON DELETE SET NULL,
    note        TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id, created_at DESC);
```

---

### 21.11 Section 8 — G Store / G2Bulk

**Purpose.** The synced G2Bulk product catalogue and the order records that flow to G2Bulk.

#### Table `g2bulk_products_cache`

Mirror of G2Bulk's catalogue, refreshed by the sync UI (§ 9.9). One row per G2Bulk product code.

- `g2bulk_code VARCHAR(100) UNIQUE` — G2Bulk's identifier.
- `g2bulk_type VARCHAR(20)` — `topup` / `giftcard`, decided by `categorizeGames()` (§ 18.1).
- `fields JSONB` — array of required fields (e.g. `[{ name:'player_id', type:'string', required:true }, …]`).
- `packages JSONB` — array of packages / SKUs available for this product.
- `requires_player_id BOOLEAN` — cached decision flag.
- `assigned_category_id`, `assigned_menu_id`, `local_product_id` — links to the corresponding rows in the local schema after admin assigns.
- `price_markup_percent NUMERIC(5,2) DEFAULT 10` — default 10% markup applied when an admin creates a `products` row from this cache entry.
- `last_synced_at`, `sync_error` — freshness + error trail.

#### Table `g2bulk_orders`

Every G2Bulk order (topup or gift card) placed by a user.

- `order_number VARCHAR(30) UNIQUE` — internal order number.
- `g2bulk_order_id VARCHAR(100)` — G2Bulk's identifier for the order (nullable — set once G2Bulk accepts the order).
- `player_data JSONB` — the player-ID / zone-ID / etc. supplied by the user.
- `package_id`, `package_name`, `package_data JSONB` — which package was ordered.
- `amount`, `g2bulk_price`, `our_price`, `markup_amount BIGINT` — the money split. `our_price - g2bulk_price = markup_amount` (admin's margin).
- `status g2bulk_order_status` — see § 21.5.
- `delivery_data JSONB` — the redemption code / receipt / any payload G2Bulk returns.
- `error_message`, `retry_count`, `refunded`, `refunded_at`, `refund_reason` — failure path.
- `webhook_received_at` — set when G2Bulk pings our webhook with the final status.

#### Table `g2bulk_balance_log`

Time series of the G2Bulk account balance (USD). Populated by the "Refresh balance" button on the G2Bulk Sync page (§ 9.9) and also by a scheduled 10-minute cron. Used for the sparkline on the admin dashboard.

```sql
-- ============================================================
-- SECTION 8: G STORE / G2BULK
-- ============================================================
CREATE TABLE IF NOT EXISTS g2bulk_products_cache (
    id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    g2bulk_code          VARCHAR(100) UNIQUE NOT NULL,
    g2bulk_type          VARCHAR(20) NOT NULL,                                     -- 'topup' | 'giftcard'
    name                 VARCHAR(200),
    category_raw         VARCHAR(100),
    description          TEXT,
    image_url            TEXT,
    fields               JSONB       DEFAULT '[]',                                 -- required input fields
    packages             JSONB       DEFAULT '[]',                                 -- SKU packages
    is_active            BOOLEAN     DEFAULT TRUE,
    requires_player_id   BOOLEAN     DEFAULT TRUE,
    assigned_category_id UUID        REFERENCES categories(id) ON DELETE SET NULL,
    assigned_menu_id     UUID        REFERENCES menus(id)      ON DELETE SET NULL,
    price_markup_percent NUMERIC(5,2) DEFAULT 10,
    local_product_id     UUID        REFERENCES products(id)   ON DELETE SET NULL,
    last_synced_at       TIMESTAMPTZ DEFAULT NOW(),
    sync_error           TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_g2bulk_cache_code   ON g2bulk_products_cache(g2bulk_code);
CREATE INDEX IF NOT EXISTS idx_g2bulk_cache_type   ON g2bulk_products_cache(g2bulk_type);
CREATE INDEX IF NOT EXISTS idx_g2bulk_cache_active ON g2bulk_products_cache(is_active);
CREATE INDEX IF NOT EXISTS idx_g2bulk_cache_assign ON g2bulk_products_cache(assigned_category_id) WHERE assigned_category_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS g2bulk_orders (
    id                  UUID                    DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number        VARCHAR(30)             UNIQUE NOT NULL,
    user_id             UUID                    REFERENCES users(id)    ON DELETE SET NULL,
    reseller_id         UUID                    REFERENCES users(id)    ON DELETE SET NULL,
    product_id          UUID                    REFERENCES products(id) ON DELETE SET NULL,
    g2bulk_order_id     VARCHAR(100),
    g2bulk_code         VARCHAR(100)            NOT NULL,
    g2bulk_type         VARCHAR(20)             NOT NULL,
    player_data         JSONB                   DEFAULT '{}',
    package_id          VARCHAR(100),
    package_name        VARCHAR(200),
    package_data        JSONB                   DEFAULT '{}',
    amount              BIGINT                  NOT NULL,
    g2bulk_price        BIGINT,
    our_price           BIGINT,
    markup_amount       BIGINT,
    status              g2bulk_order_status     DEFAULT 'pending' NOT NULL,
    delivery_data       JSONB                   DEFAULT '{}',                     -- redemption code / receipt
    error_message       TEXT,
    retry_count         INT                     DEFAULT 0,
    refunded            BOOLEAN                 DEFAULT FALSE,
    refunded_at         TIMESTAMPTZ,
    refund_reason       TEXT,
    webhook_received_at TIMESTAMPTZ,
    admin_notes         TEXT,
    ip_address          INET,
    created_at          TIMESTAMPTZ             DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ             DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_g2bulk_amount     CHECK (amount >= 0),
    CONSTRAINT chk_g2bulk_type_valid CHECK (g2bulk_type IN ('topup','giftcard'))
);

CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_user    ON g2bulk_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_status  ON g2bulk_orders(status);
CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_g2b_id  ON g2bulk_orders(g2bulk_order_id) WHERE g2bulk_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_code    ON g2bulk_orders(g2bulk_code);
CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_created ON g2bulk_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_g2bulk_orders_number  ON g2bulk_orders(order_number);

CREATE TABLE IF NOT EXISTS g2bulk_balance_log (
    id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    balance_usd  NUMERIC(12,4),
    checked_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_g2bulk_balance_log_time ON g2bulk_balance_log(checked_at DESC);
```

---

### 21.12 Section 9 — Transactions & payments

**Purpose.** The money ledger + deposit / withdrawal requests + payment-method configuration.

#### Table `transactions` (the balance ledger)

Every balance change lands here. The RPC `update_user_balance()` is the **only** sanctioned way to insert a row.

- `type transaction_type` — see § 21.5.
- `amount BIGINT` — always positive; the sign is implicit in `type`.
- `balance_before`, `balance_after BIGINT NOT NULL` — snapshot of the balance around this transaction. `balance_after >= 0` is enforced (`chk_balance_after_non_negative`).
- `reference_id UUID`, `reference_type VARCHAR(50)` — polymorphic pointer to whatever row triggered this transaction (`orders`, `g2bulk_orders`, `deposit_requests`, `withdrawal_requests`, etc.).
- `performed_by UUID` — the actor: NULL for the user themselves, or the admin's user id for adjustments.
- `metadata JSONB` — free-form payload (e.g. G2Bulk order id, refund reason).

**Indexes:** by user, by type, by created_at DESC, composite `(reference_id, reference_type)` for tracing (partial: `WHERE reference_id IS NOT NULL`), composite `(user_id, type, created_at DESC)` for the Balance History page.

#### Table `deposit_requests`

- `auto_reference VARCHAR(30)` — auto-generated like `DEP-YYMMDD-XXXX`. Displayed to the user so they can quote it in the payment note.
- `status deposit_status` — see § 21.5.
- `transaction_id UUID` — set to the created `transactions.id` after approval.

#### Table `withdrawal_requests`

- `account_number`, `account_name`, `account_details JSONB` — where to send the money.
- `transfer_screenshot_url` — admin uploads this when they complete the transfer.
- `status withdrawal_status` includes `processing` (money is on its way).

#### Table `payment_methods_config`

Editable in Admin → Settings → Payment Methods. Each row is one method (KBZ / Wave / AYA / CB / …).

- `is_deposit`, `is_withdrawal BOOLEAN` — a method may support one direction only (e.g. cash on delivery is deposit-only).
- `min_amount`, `max_amount BIGINT` — enforced client-side and server-side.

```sql
-- ============================================================
-- SECTION 9: TRANSACTIONS & PAYMENTS
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: transactions — the money ledger
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id                  UUID                DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID                REFERENCES users(id) ON DELETE SET NULL,
    type                transaction_type    NOT NULL,
    amount              BIGINT              NOT NULL,                              -- always positive
    balance_before      BIGINT              NOT NULL,
    balance_after       BIGINT              NOT NULL,
    reference_id        UUID,
    reference_type      VARCHAR(50),
    description         TEXT,
    performed_by        UUID                REFERENCES users(id) ON DELETE SET NULL,
    ip_address          INET,
    metadata            JSONB               DEFAULT '{}',
    created_at          TIMESTAMPTZ         DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_balance_after_non_negative CHECK (balance_after >= 0)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user      ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type      ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created   ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_ref       ON transactions(reference_id, reference_type) WHERE reference_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type, created_at DESC);

-- ------------------------------------------------------------
-- TABLE: deposit_requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deposit_requests (
    id                      UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 UUID            REFERENCES users(id) ON DELETE SET NULL,
    amount                  BIGINT          NOT NULL,
    payment_method          payment_method_type NOT NULL,
    payment_screenshot_url  TEXT            NOT NULL,
    payment_reference       VARCHAR(100),
    auto_reference          VARCHAR(30),                                           -- system-generated DEP-YYMMDD-XXXX
    status                  deposit_status  DEFAULT 'pending' NOT NULL,
    reviewed_by             UUID            REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at             TIMESTAMPTZ,
    rejection_reason        TEXT,
    transaction_id          UUID            REFERENCES transactions(id) ON DELETE SET NULL,
    admin_notes             TEXT,
    ip_address              INET,
    created_at              TIMESTAMPTZ     DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ     DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_deposit_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_deposit_status      ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_user        ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_created     ON deposit_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposit_user_status ON deposit_requests(user_id, status);

-- ------------------------------------------------------------
-- TABLE: withdrawal_requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id                      UUID                DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 UUID                REFERENCES users(id) ON DELETE SET NULL,
    amount                  BIGINT              NOT NULL,
    payment_method          payment_method_type NOT NULL,
    account_number          VARCHAR(50),
    account_name            VARCHAR(100),
    account_details         JSONB               DEFAULT '{}',
    status                  withdrawal_status   DEFAULT 'pending' NOT NULL,
    reviewed_by             UUID                REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at             TIMESTAMPTZ,
    rejection_reason        TEXT,
    transfer_screenshot_url TEXT,                                                  -- uploaded by admin on completion
    transaction_id          UUID                REFERENCES transactions(id) ON DELETE SET NULL,
    admin_notes             TEXT,
    ip_address              INET,
    created_at              TIMESTAMPTZ         DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ         DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_withdrawal_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_status  ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_user    ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_created ON withdrawal_requests(created_at DESC);

-- ------------------------------------------------------------
-- TABLE: payment_methods_config
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods_config (
    id              UUID                    DEFAULT gen_random_uuid() PRIMARY KEY,
    method_key      payment_method_type     UNIQUE NOT NULL,
    display_name    VARCHAR(100)            NOT NULL,
    account_number  VARCHAR(50),
    account_name    VARCHAR(100),
    qr_code_url     TEXT,
    icon_url        TEXT,
    icon_svg        TEXT,
    instructions    TEXT,
    min_amount      BIGINT                  DEFAULT 1000,
    max_amount      BIGINT                  DEFAULT 5000000,
    is_active       BOOLEAN                 DEFAULT TRUE,
    is_deposit      BOOLEAN                 DEFAULT TRUE,
    is_withdrawal   BOOLEAN                 DEFAULT TRUE,
    sort_order      INT                     DEFAULT 0,
    created_at      TIMESTAMPTZ             DEFAULT NOW(),
    updated_at      TIMESTAMPTZ             DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods_config(is_active, sort_order);
```

---

### 21.13 Section 10 — Promo codes

Two tables: `promo_codes` (the codes themselves) and `promo_code_usage` (who has used which code on which order).

- `applicable_to VARCHAR(20)` — `all` / `category` / `product` / `gstore` / `reseller`. When not `all`, `applicable_ids UUID[]` lists the specific rows the code applies to.
- `per_user_limit INT DEFAULT 1` — how many times a single user may use the code. Enforced by the unique constraint on `promo_code_usage (promo_code_id, user_id, order_id)` in combination with the RPC `apply_promo_code()`.
- `max_uses INT` — global cap across all users.

The `orders.promo_code_id` foreign key is added deferred (after `promo_codes` exists), using `DEFERRABLE INITIALLY DEFERRED` so the whole schema loads without circular-reference errors.

```sql
-- ============================================================
-- SECTION 10: PROMO CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id                  UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    code                VARCHAR(50)     UNIQUE NOT NULL,
    name                VARCHAR(100),
    description         TEXT,
    discount_type       discount_type   NOT NULL,                                  -- percent | fixed
    discount_value      BIGINT          NOT NULL,
    max_discount        BIGINT,                                                    -- cap on percent-based discounts
    min_order_amount    BIGINT          DEFAULT 0,
    max_uses            INT,                                                       -- global cap; NULL = unlimited
    used_count          INT             DEFAULT 0,
    per_user_limit      INT             DEFAULT 1,
    starts_at           TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,
    is_active           BOOLEAN         DEFAULT TRUE,
    applicable_to       VARCHAR(20)     DEFAULT 'all',                             -- all/category/product/gstore/reseller
    applicable_ids      UUID[],                                                    -- restricting IDs when applicable_to != 'all'
    created_by          UUID            REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW(),
    CONSTRAINT chk_promo_discount_positive CHECK (discount_value > 0),
    CONSTRAINT chk_promo_applicable        CHECK (applicable_to IN ('all','category','product','gstore','reseller'))
);

CREATE INDEX IF NOT EXISTS idx_promo_code         ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_active       ON promo_codes(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_promo_active_dates ON promo_codes(is_active, starts_at, expires_at);

-- Deferred FK from orders → promo_codes
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_promo
    FOREIGN KEY (promo_code_id)
    REFERENCES promo_codes(id)
    ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- ------------------------------------------------------------
-- TABLE: promo_code_usage — one row per successful redemption
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_code_usage (
    id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    promo_code_id     UUID        NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
    user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id          UUID        REFERENCES orders(id) ON DELETE SET NULL,
    discount_applied  BIGINT      NOT NULL,
    used_at           TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(promo_code_id, user_id, order_id)                                       -- enforces per-user + per-order uniqueness
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON promo_code_usage(user_id);
```

---

### 21.14 Section 11 — News & reviews

Two independent tables plus a `review_helpful` join table for "was this review helpful?" clicks.

- `news` — CMS articles authored by admin (or reseller in their own scope). `is_pinned` places the row at the top of the news feed regardless of published_at.
- `reviews` — one review per (user, product, order) triple (unique). `is_approved` gates visibility; `is_verified_purchase` is set to TRUE by the trigger `mark_verified_purchase` when the review's `order_id` corresponds to a completed order.
- `review_helpful` — join table; the count is aggregated onto `reviews.helpful_count` by a trigger.

```sql
-- ============================================================
-- SECTION 11: NEWS & REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS news (
    id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    reseller_id         UUID        REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(300) NOT NULL,
    slug                VARCHAR(320),
    cover_image_url     TEXT,
    body                TEXT,                                                       -- sanitised HTML
    excerpt             VARCHAR(500),
    category            VARCHAR(80),
    tags                TEXT[],
    author_id           UUID        REFERENCES users(id) ON DELETE SET NULL,
    author_name         VARCHAR(100),
    is_published        BOOLEAN     DEFAULT FALSE,
    published_at        TIMESTAMPTZ,
    is_pinned           BOOLEAN     DEFAULT FALSE,
    view_count          BIGINT      DEFAULT 0,
    meta_title          VARCHAR(200),
    meta_description    TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_published  ON news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_reseller   ON news(reseller_id);
CREATE INDEX IF NOT EXISTS idx_news_category   ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_pinned     ON news(is_pinned, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_search     ON news USING gin(
    to_tsvector('simple', COALESCE(title,'') || ' ' || COALESCE(excerpt,''))
);

CREATE TABLE IF NOT EXISTS reviews (
    id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id               UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id            UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id              UUID        REFERENCES orders(id) ON DELETE SET NULL,
    order_item_id         UUID        REFERENCES order_items(id) ON DELETE SET NULL,
    rating                INT         NOT NULL,
    review_text           TEXT,
    images                JSONB       DEFAULT '[]',                                -- array of image URLs (up to 3)
    is_approved           BOOLEAN     DEFAULT FALSE,
    is_verified_purchase  BOOLEAN     DEFAULT FALSE,
    admin_reply           TEXT,
    admin_replied_at      TIMESTAMPTZ,
    helpful_count         INT         DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(user_id, product_id, order_id)                                          -- one review per user+product+order
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_user    ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating  ON reviews(rating, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

CREATE TABLE IF NOT EXISTS review_helpful (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id   UUID        NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_review_helpful_review ON review_helpful(review_id);
```

---

### 21.15 Section 12 — Notifications

Single-table design; the client filters by `is_read` and by `type`.

- `link_type VARCHAR(30)` — `order` / `product` / `deposit` / `withdrawal` / `kyc` / `vps` / `promo` / `external`. Along with `link_target_id`, the client knows which route to open when the notification card is tapped.

The unread-count on the topbar bell uses the partial index `idx_notif_unread ON notifications(user_id) WHERE is_read = FALSE` so counting is near-instant even for large accounts.

```sql
-- ============================================================
-- SECTION 12: NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              UUID                DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type   DEFAULT 'system',
    title           VARCHAR(200)        NOT NULL,
    body            TEXT,
    icon_svg        TEXT,
    image_url       TEXT,
    link            TEXT,
    link_type       VARCHAR(30),
    link_target_id  UUID,
    is_read         BOOLEAN             DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    reference_id    UUID,
    reference_type  VARCHAR(50),
    created_at      TIMESTAMPTZ         DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notif_user      ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notif_user_time ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_type      ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notif_unread    ON notifications(user_id) WHERE is_read = FALSE;
```

---

### 21.16 Section 13 — Location tracking

Two tables:
- `user_location_tracking` — one row per user (upsert on every location ping). This is the "current position" table used by the Admin Map (Part 11).
- `user_location_history` — append-only trail. Used by "View movement path" (§ 11.3).

Both tables are covered by Realtime publications so the Admin Map updates live (Part 11.4).

```sql
-- ============================================================
-- SECTION 13: LOCATION TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS user_location_tracking (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude        NUMERIC(10,7)   NOT NULL,                                      -- 7 decimals ≈ 1 cm precision
    longitude       NUMERIC(10,7)   NOT NULL,
    accuracy        NUMERIC(10,2),                                                 -- metres
    altitude        NUMERIC(10,2),
    address         TEXT,
    city            VARCHAR(100),
    township        VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100),
    country_code    VARCHAR(5),
    postal_code     VARCHAR(20),
    ip_address      INET,
    user_agent      TEXT,
    platform        platform_type   DEFAULT 'web',
    app_version     VARCHAR(20),
    browser         VARCHAR(50),
    os              VARCHAR(50),
    device_type     VARCHAR(20),
    is_online       BOOLEAN         DEFAULT TRUE,
    last_seen       TIMESTAMPTZ     DEFAULT NOW(),
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW(),
    UNIQUE(user_id)                                                                -- one row per user (upsert target)
);

CREATE INDEX IF NOT EXISTS idx_location_user        ON user_location_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_location_online      ON user_location_tracking(is_online);
CREATE INDEX IF NOT EXISTS idx_location_last_seen   ON user_location_tracking(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_location_platform    ON user_location_tracking(platform);
CREATE INDEX IF NOT EXISTS idx_location_country     ON user_location_tracking(country_code);
CREATE INDEX IF NOT EXISTS idx_location_coords      ON user_location_tracking(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_location_online_seen ON user_location_tracking(is_online, last_seen DESC);

CREATE TABLE IF NOT EXISTS user_location_history (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude        NUMERIC(10,7)   NOT NULL,
    longitude       NUMERIC(10,7)   NOT NULL,
    accuracy        NUMERIC(10,2),
    address         TEXT,
    ip_address      INET,
    platform        platform_type   DEFAULT 'web',
    recorded_at     TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loc_history_user_time ON user_location_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_loc_history_recent    ON user_location_history(recorded_at DESC);
```

---

### 21.17 Section 14 — Security logs

- `security_logs` — every event listed in § 12.1. `BIGSERIAL` primary key because these tables grow linearly with traffic; UUID would waste space.
- `user_ip_history` — every IP a given user has ever logged in from. Powers the "IP History" tab on the Admin User-Detail page (§ 9.3). `is_suspicious` is flipped by the trigger `flag_suspicious_ip` when the geo-distance between two adjacent logins exceeds a threshold.

```sql
-- ============================================================
-- SECTION 14: SECURITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS security_logs (
    id                  BIGSERIAL               PRIMARY KEY,
    ip_address          INET                    NOT NULL,
    user_agent          TEXT,
    attempted_domain    VARCHAR(100),                                              -- user / admin / reseller
    event_type          security_event_type     NOT NULL,
    user_id             UUID                    REFERENCES users(id) ON DELETE SET NULL,
    username_attempted  VARCHAR(100),
    country_code        VARCHAR(5),
    country_name        VARCHAR(100),
    city                VARCHAR(100),
    metadata            JSONB                   DEFAULT '{}',
    result              VARCHAR(20),                                               -- blocked / allowed / failed
    timestamp           TIMESTAMPTZ             DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_security_logs_ip     ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_type   ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_time   ON security_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_user   ON security_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_security_logs_result ON security_logs(result, timestamp DESC);

CREATE TABLE IF NOT EXISTS user_ip_history (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address      INET            NOT NULL,
    user_agent      TEXT,
    platform        platform_type   DEFAULT 'web',
    browser         VARCHAR(50),
    os              VARCHAR(50),
    device_type     VARCHAR(20),
    location_address TEXT,
    country_code    VARCHAR(5),
    is_suspicious   BOOLEAN         DEFAULT FALSE,                                 -- set by flag_suspicious_ip trigger
    logged_at       TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_history_user   ON user_ip_history(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_ip_history_ip     ON user_ip_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_history_recent ON user_ip_history(logged_at DESC);
```

---

### 21.18 Section 15 — VPS management

Five tables model the entire VPS system:

- `vps_physical_config` — the physical host (there is expected to be exactly one in the MVP, but the schema allows multiple). Stores the agent connection info (encrypted with AES-256-GCM under `AES_ENCRYPTION_KEY`).
- `vps_os_templates` — the catalogue of installable OS images (Ubuntu, Debian, CentOS variants).
- `vps_instances` — one row per VM. `ssh_password_encrypted`, `ssh_key_encrypted`, `vnc_password_encrypted` are AES-encrypted at rest; the RPC `get_vps_credentials()` decrypts only when the caller is a validated admin session.
- `vps_action_logs` — audit trail of every operator action (start/stop/restart/etc.).
- `vps_metrics` / `vps_physical_metrics` — time-series metrics purged by the scheduled cleanup (§ 21.28).

```sql
-- ============================================================
-- SECTION 15: VPS MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS vps_physical_config (
    id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    label                 VARCHAR(100) DEFAULT 'Primary Server',
    host_ip               INET        NOT NULL,
    ssh_port              INT         DEFAULT 22,
    ssh_username          VARCHAR(50),
    ssh_key_encrypted     TEXT,                                                    -- AES-256-GCM ciphertext
    agent_port            INT         DEFAULT 7777,
    agent_secret_hash     TEXT,                                                    -- hash of VPS_NODE_SECRET (for verify only)
    is_connected          BOOLEAN     DEFAULT FALSE,
    last_ping             TIMESTAMPTZ,
    last_ping_latency_ms  INT,
    total_cpu_cores       INT,
    total_ram_gb          INT,
    total_disk_gb         INT,
    used_cpu_cores        INT         DEFAULT 0,
    used_ram_gb           INT         DEFAULT 0,
    used_disk_gb          INT         DEFAULT 0,
    network_bridge        VARCHAR(50) DEFAULT 'br0',
    storage_path          VARCHAR(200) DEFAULT '/var/lib/cr7game/vps',
    os_info               JSONB       DEFAULT '{}',                                -- kernel version, distro, uptime
    setup_completed       BOOLEAN     DEFAULT FALSE,
    max_instances         INT         DEFAULT 10,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vps_os_templates (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    version         VARCHAR(50),
    arch            VARCHAR(20)  DEFAULT 'x86_64',
    image_url       TEXT,
    image_checksum  TEXT,                                                          -- SHA-256 verification
    icon_svg        TEXT,
    min_disk_gb     INT         DEFAULT 10,
    min_ram_gb      INT         DEFAULT 1,
    is_active       BOOLEAN     DEFAULT TRUE,
    sort_order      INT         DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vps_os_active ON vps_os_templates(is_active, sort_order);

CREATE TABLE IF NOT EXISTS vps_instances (
    id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    name                    VARCHAR(100) NOT NULL,                                 -- e.g. vps-001
    label                   VARCHAR(200),                                          -- human label
    status                  vps_status  DEFAULT 'creating' NOT NULL,
    -- OS
    os_template_id          UUID        REFERENCES vps_os_templates(id) ON DELETE SET NULL,
    os_template_slug        VARCHAR(100),
    -- Resources
    cpu_cores               INT         NOT NULL,
    ram_gb                  INT         NOT NULL,
    disk_gb                 INT         NOT NULL,
    -- Network
    ip_address              INET,
    mac_address             VARCHAR(20),
    -- Access
    ssh_username            VARCHAR(50) DEFAULT 'root',
    ssh_password_encrypted  TEXT,                                                  -- AES-256-GCM
    ssh_key_encrypted       TEXT,
    ssh_port                INT         DEFAULT 22,
    vnc_port                INT,
    vnc_password_encrypted  TEXT,
    -- Assignment
    assigned_user_id        UUID        REFERENCES users(id) ON DELETE SET NULL,
    assigned_by             UUID        REFERENCES users(id) ON DELETE SET NULL,
    assigned_at             TIMESTAMPTZ,
    expires_at              TIMESTAMPTZ,
    auto_renew              BOOLEAN     DEFAULT FALSE,
    -- libvirt / physical host
    libvirt_domain_name     VARCHAR(150),                                          -- domain name inside libvirt
    physical_server_id      UUID        REFERENCES vps_physical_config(id) ON DELETE SET NULL,
    bandwidth_limit_mbps    INT,
    network_bridge          VARCHAR(50),
    firewall_rules          JSONB       DEFAULT '[]',
    snapshots               JSONB       DEFAULT '[]',                              -- list of snapshot names + timestamps
    -- Pricing
    price_paid              BIGINT,
    monthly_price           BIGINT,
    notes                   TEXT,
    metadata                JSONB       DEFAULT '{}',
    -- Uptime counters
    last_started_at         TIMESTAMPTZ,
    last_stopped_at         TIMESTAMPTZ,
    uptime_seconds          BIGINT      DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_vps_cpu  CHECK (cpu_cores >= 1 AND cpu_cores <= 128),
    CONSTRAINT chk_vps_ram  CHECK (ram_gb >= 1 AND ram_gb <= 512),
    CONSTRAINT chk_vps_disk CHECK (disk_gb >= 5 AND disk_gb <= 10000)
);

CREATE INDEX IF NOT EXISTS idx_vps_status  ON vps_instances(status);
CREATE INDEX IF NOT EXISTS idx_vps_user    ON vps_instances(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_vps_expires ON vps_instances(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vps_server  ON vps_instances(physical_server_id);
CREATE INDEX IF NOT EXISTS idx_vps_libvirt ON vps_instances(libvirt_domain_name) WHERE libvirt_domain_name IS NOT NULL;

CREATE TABLE IF NOT EXISTS vps_action_logs (
    id              BIGSERIAL           PRIMARY KEY,
    instance_id     UUID                REFERENCES vps_instances(id) ON DELETE CASCADE,
    action          vps_action_type     NOT NULL,
    performed_by    UUID                REFERENCES users(id) ON DELETE SET NULL,
    status          VARCHAR(20)         DEFAULT 'pending',                         -- pending/success/failed
    error_message   TEXT,
    metadata        JSONB               DEFAULT '{}',
    started_at      TIMESTAMPTZ         DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vps_action_logs_instance ON vps_action_logs(instance_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_vps_action_logs_recent   ON vps_action_logs(started_at DESC);

CREATE TABLE IF NOT EXISTS vps_metrics (
    id                  BIGSERIAL       PRIMARY KEY,
    instance_id         UUID            NOT NULL REFERENCES vps_instances(id) ON DELETE CASCADE,
    cpu_percent         NUMERIC(5,2),
    ram_used_mb         BIGINT,
    ram_total_mb        BIGINT,
    disk_used_mb        BIGINT,
    disk_total_mb       BIGINT,
    network_in_kbps     BIGINT,
    network_out_kbps    BIGINT,
    load_avg_1          NUMERIC(8,4),
    load_avg_5          NUMERIC(8,4),
    load_avg_15         NUMERIC(8,4),
    recorded_at         TIMESTAMPTZ     DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vps_metrics_instance ON vps_metrics(instance_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vps_metrics_recent   ON vps_metrics(recorded_at DESC);

CREATE TABLE IF NOT EXISTS vps_physical_metrics (
    id                  BIGSERIAL       PRIMARY KEY,
    server_id           UUID            NOT NULL REFERENCES vps_physical_config(id) ON DELETE CASCADE,
    cpu_percent         NUMERIC(5,2),
    ram_used_gb         NUMERIC(8,2),
    ram_total_gb        NUMERIC(8,2),
    disk_used_gb        NUMERIC(10,2),
    disk_total_gb       NUMERIC(10,2),
    network_in_mbps     NUMERIC(10,4),
    network_out_mbps    NUMERIC(10,4),
    active_vms          INT             DEFAULT 0,
    load_avg_1          NUMERIC(8,4),
    recorded_at         TIMESTAMPTZ     DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_physical_metrics_server ON vps_physical_metrics(server_id, recorded_at DESC);
```

---

### 21.19 Sections 16–18 — YouTube cache, settings, wishlist

**Section 16 — `youtube_videos_cache`.** Server-side cache of YouTube Data API v3 responses. The `youtube.js` API refreshes rows older than 5 minutes; older entries are simply overwritten (`upsert` on `video_id`).

**Section 17 — settings & delivery infrastructure.**
- `settings` — key/value store with `value JSONB`. `is_public` flag lets the anon role read a small whitelist (site name, logo url, maintenance flag).
- `cities` + `townships` — delivery geography with per-row `delivery_fee` and `delivery_days`. Populated in seed data (§ 21.29).
- `ip_geo_cache` — IP → country lookups (24 h TTL).
- `nominatim_cache` — coordinate → address lookups (`lat_lon_key` is a rounded `"lat|lon"` string to enable dedup).

**Section 18 — `wishlist`.** Simple `(user_id, product_id)` join table with unique constraint.

```sql
-- ============================================================
-- SECTION 16: YOUTUBE CACHE
-- ============================================================
CREATE TABLE IF NOT EXISTS youtube_videos_cache (
    id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id            VARCHAR(30) UNIQUE NOT NULL,
    channel_id          VARCHAR(60),
    title               VARCHAR(300),
    description         TEXT,
    thumbnail_url       TEXT,
    thumbnail_hq_url    TEXT,
    published_at        TIMESTAMPTZ,
    view_count          BIGINT,
    like_count          BIGINT,
    comment_count       BIGINT,
    duration            VARCHAR(20),                                               -- ISO 8601 e.g. PT4M13S
    duration_seconds    INT,
    tags                TEXT[],
    category_id         VARCHAR(10),
    is_live             BOOLEAN     DEFAULT FALSE,
    cached_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_yt_channel   ON youtube_videos_cache(channel_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_yt_published ON youtube_videos_cache(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_yt_cached    ON youtube_videos_cache(cached_at DESC);

-- ============================================================
-- SECTION 17: SETTINGS & CONFIGURATION
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    key             VARCHAR(100)    PRIMARY KEY,
    value           JSONB           NOT NULL,
    value_type      VARCHAR(20)     DEFAULT 'string',                              -- string/number/boolean/object/array
    description     TEXT,
    is_public       BOOLEAN         DEFAULT FALSE,                                 -- true = readable by anon role
    updated_by      UUID            REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_public ON settings(is_public) WHERE is_public = TRUE;

CREATE TABLE IF NOT EXISTS cities (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    state           VARCHAR(100),
    name            VARCHAR(100) NOT NULL,
    name_mm         VARCHAR(100),
    delivery_fee    BIGINT      DEFAULT 1500,
    delivery_days   INT         DEFAULT 3,
    is_active       BOOLEAN     DEFAULT TRUE,
    sort_order      INT         DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cities_state  ON cities(state, sort_order);
CREATE INDEX IF NOT EXISTS idx_cities_active ON cities(is_active);

CREATE TABLE IF NOT EXISTS townships (
    id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    city_id         UUID        NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    name_mm         VARCHAR(100),
    delivery_fee    BIGINT,                                                        -- overrides city if not null
    is_active       BOOLEAN     DEFAULT TRUE,
    sort_order      INT         DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_townships_city ON townships(city_id, sort_order);

CREATE TABLE IF NOT EXISTS ip_geo_cache (
    id              BIGSERIAL       PRIMARY KEY,
    ip_address      INET            UNIQUE NOT NULL,
    country_code    VARCHAR(5),
    country_name    VARCHAR(100),
    city            VARCHAR(100),
    region          VARCHAR(100),
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),
    isp             VARCHAR(200),
    cached_at       TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_geo_cache_ip     ON ip_geo_cache(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_geo_cache_cached ON ip_geo_cache(cached_at);

CREATE TABLE IF NOT EXISTS nominatim_cache (
    id              BIGSERIAL       PRIMARY KEY,
    lat_lon_key     VARCHAR(30)     UNIQUE NOT NULL,                               -- rounded "lat|lon" for dedup
    address         TEXT,
    city            VARCHAR(100),
    township        VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100),
    country_code    VARCHAR(5),
    postal_code     VARCHAR(20),
    raw_response    JSONB,
    cached_at       TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nominatim_key    ON nominatim_cache(lat_lon_key);
CREATE INDEX IF NOT EXISTS idx_nominatim_cached ON nominatim_cache(cached_at);

-- ============================================================
-- SECTION 18: WISHLIST / FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user    ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id);
```

---
### 21.20 Section 19 — Functions (RPCs)

**Purpose.** Encapsulate every non-trivial mutation as a `SECURITY DEFINER` function so:
1. The business rule lives in one place (DB layer) instead of scattered across API routes.
2. The application never bypasses balance checks / promo validation / plan limits.
3. Race conditions (concurrent balance edits, promo usage exhaustion) are handled by row-level locks.

Every function below is idempotent (`CREATE OR REPLACE`), so re-running the schema is safe.

#### Function `fn_update_updated_at()` — generic timestamp trigger

Sets `NEW.updated_at = NOW()` on every `BEFORE UPDATE`. Attached to every table with an `updated_at` column (see Section 20).

#### Function `update_user_balance()` — the ONLY sanctioned balance path

- **Contract.** Increments (or decrements, if `p_amount` is negative) `users.game_balance` and inserts a matching row into `transactions`.
- **Race safety.** Takes an exclusive row lock (`SELECT … FOR UPDATE`) on the target user before reading the balance. Two concurrent calls serialise cleanly — the second waits until the first commits.
- **Underflow safety.** Raises `INSUFFICIENT_BALANCE` if the resulting balance would be negative. The caller (API handler) catches this and shows the user `MESSAGES.BALANCE_INSUFFICIENT`.
- **Trigger bypass.** Sets `app.allow_balance_update = 'true'` in the session config *just* for the immediate UPDATE, then resets it. The trigger `prevent_direct_balance_edit` reads this setting to decide whether to allow the change (§ 21.21).
- **Audit trail.** Every call produces a `transactions` row with `balance_before` and `balance_after` snapshots.
- **Return value.** JSONB with `success`, `transaction_id`, `balance_before`, `balance_after`, `amount`.

**Callers:** `api/balance.js` (deposits, withdrawals, admin adjustments), `api/g2bulk-v1.js` (topup + refund), `api/admin-action.js` (reject-refund on orders), `api/checkout.js` (order deduct).

**Never called by:** clients directly. The Supabase anon key does *not* have `EXECUTE` permission on this function (§ 21.28 GRANTS).

#### Function `generate_order_number()` / `generate_g2bulk_order_number()`

Produce `ORD-YYMMDD-XXXX` and `GST-YYMMDD-XXXX` respectively. The counter portion is `COUNT(*) + 1` of same-day orders. On the very rare collision (two inserts in the same millisecond), the row's UNIQUE constraint on `order_number` will fail; the caller retries the insert once.

**Time zone.** Both functions use `Asia/Yangon` so the counter matches the operator's calendar day, not UTC.

#### Function `generate_referral_code(username)`

Produces `<UPPER(first 4 of username)><UPPER(first 4 of md5(random))>` and loops until it does not collide with any existing `users.referral_code`. In practice the loop runs once.

#### Function `cleanup_expired_sessions()`

Deletes expired rows from every session / token table. Called every 5 minutes by the pg_cron job in Section 25.

#### Function `update_user_online_status()`

Flips `user_location_tracking.is_online = FALSE` for any user whose `last_seen` is older than 90 seconds. Runs every 60 seconds via pg_cron. This is what turns the map's pins from green (pulsing) to grey.

#### Function `recalculate_product_rating(product_id)`

Recomputes `products.rating_avg` and `products.rating_count` from `reviews`. Called by the trigger `trg_reviews_rating_change` after any INSERT / UPDATE / DELETE on `reviews`.

#### Functions `increment_product_view(product_id)` / `increment_product_sold(product_id, qty)`

Fire-and-forget counters. `increment_product_view` is called when a Product Detail page loads (fire-and-forget POST); `increment_product_sold` is called by the checkout flow when an order transitions to `paid_awaiting_admin` or `completed`.

#### Function `update_category_product_count(category_id)`

Recomputes `categories.product_count` from `products`. Called by the trigger `trg_product_category_count` on any insert / update / delete of a product. Categories with no active products display as empty on the Menu Detail page (§ 8.3).

#### Function `apply_promo_code(code, user_id, order_total)`

Server-side promo validation + discount computation. Returns JSONB with either `{ valid: true, discount_amount, … }` or `{ valid: false, error: 'PROMO_…' }`. The client shows the appropriate `MESSAGES.PROMO_*` toast for each error code.

**Race safety.** Takes a `FOR SHARE` lock on the promo row. Combined with the unique constraint on `(promo_code_id, user_id, order_id)` in `promo_code_usage`, this prevents a user from redeeming the same code twice by racing two simultaneous checkouts.

#### Function `check_reseller_limits(reseller_id, resource)`

Given `resource` in `('menus', 'categories', 'products', 'banners')`, returns whether the reseller can create one more row of that kind under their current plan. Called by `api/admin-action.js` before every reseller create action.

**Plan expiry handling.** If `users.reseller_plan_expires < NOW()`, the reseller silently downgrades to the Free plan and the check uses Free's limits.

#### Function `get_user_balance_safe(user_id)`

The **only** sanctioned way for a server-side handler to read a user's balance during a checkout / topup flow. Takes a `FOR SHARE` lock, refuses if the user is not `status='active'`.

#### Functions `purge_old_location_history(days)`, `purge_old_vps_metrics(days)`, `purge_old_security_logs(days)`

Housekeeping. Default retention: 30 days for location history, 7 days for VPS metrics, 90 days for security logs. Called by pg_cron in Section 25.

#### Function `auto_cancel_old_orders(hours)`

Marks any order stuck in `pending` / `pending_payment_review` (with a non-balance payment method) for more than `hours` hours as `cancelled`. Default 24 hours. Prevents inventory being reserved forever by an abandoned checkout.

#### Function `get_dashboard_stats()`

Returns a JSONB of the numbers on the Admin Dashboard Overview (§ 9.2): total users, total resellers, total orders, pending orders, today's orders, today's revenue, total revenue, pending deposits, pending KYC, online users, total G Store orders, active VPSes. All computed in a single round-trip.

```sql
-- ============================================================
-- SECTION 19: FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- FUNCTION: fn_update_updated_at
--   Generic BEFORE UPDATE trigger function.
--   Sets updated_at = NOW() on every row update.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: update_user_balance
--   The ONLY sanctioned mutation path for users.game_balance.
--   Uses SELECT FOR UPDATE to serialise concurrent callers.
--   Refuses if the resulting balance would be negative.
--   Records the change in transactions (ledger).
--
--   Called by:
--     api/balance.js (deposit / withdrawal / admin adjustment)
--     api/g2bulk-v1.js (topup / refund)
--     api/admin-action.js (order reject-refund)
--     api/checkout.js (order deduct)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_balance(
    p_user_id           UUID,
    p_amount            BIGINT,                                                 -- signed (+deposit, -deduct)
    p_type              transaction_type,
    p_reference_id      UUID        DEFAULT NULL,                               -- FK-like pointer (order id, deposit id, …)
    p_reference_type    VARCHAR     DEFAULT NULL,                               -- 'orders' / 'g2bulk_orders' / etc.
    p_description       TEXT        DEFAULT NULL,
    p_performed_by      UUID        DEFAULT NULL,                               -- NULL = the user; else admin id
    p_ip_address        INET        DEFAULT NULL,
    p_metadata          JSONB       DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
    v_current_balance   BIGINT;
    v_new_balance       BIGINT;
    v_transaction_id    UUID;
BEGIN
    -- Serialise concurrent balance edits
    SELECT game_balance
    INTO v_current_balance
    FROM users
    WHERE id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: %', p_user_id;
    END IF;

    v_new_balance := v_current_balance + p_amount;

    IF v_new_balance < 0 THEN
        RAISE EXCEPTION 'INSUFFICIENT_BALANCE: current=%, requested=%',
            v_current_balance, p_amount;
    END IF;

    -- Bypass the anti-tamper trigger for this specific UPDATE only
    PERFORM set_config('app.allow_balance_update', 'true', true);

    UPDATE users
    SET game_balance = v_new_balance,
        updated_at   = NOW()
    WHERE id = p_user_id;

    -- Immediately reset the flag so any subsequent UPDATE is again blocked
    PERFORM set_config('app.allow_balance_update', 'false', true);

    -- Record in the ledger
    INSERT INTO transactions (
        user_id, type, amount,
        balance_before, balance_after,
        reference_id, reference_type,
        description, performed_by,
        ip_address, metadata
    )
    VALUES (
        p_user_id, p_type, p_amount,
        v_current_balance, v_new_balance,
        p_reference_id, p_reference_type,
        p_description, p_performed_by,
        p_ip_address, COALESCE(p_metadata, '{}')
    )
    RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'success',        true,
        'transaction_id', v_transaction_id,
        'balance_before', v_current_balance,
        'balance_after',  v_new_balance,
        'amount',         p_amount
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Ensure the bypass flag is reset even on error
        PERFORM set_config('app.allow_balance_update', 'false', true);
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- FUNCTION: generate_order_number
--   Produces 'ORD-YYMMDD-XXXX' scoped to Asia/Yangon calendar day.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_date  TEXT;
    v_count INT;
BEGIN
    v_date := TO_CHAR(NOW() AT TIME ZONE 'Asia/Yangon', 'YYMMDD');
    SELECT COUNT(*) + 1
    INTO v_count
    FROM orders
    WHERE DATE(created_at AT TIME ZONE 'Asia/Yangon') =
          CURRENT_DATE AT TIME ZONE 'Asia/Yangon';
    RETURN 'ORD-' || v_date || '-' || LPAD(v_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: generate_g2bulk_order_number
--   Same pattern with 'GST-' prefix.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_g2bulk_order_number()
RETURNS TEXT AS $$
DECLARE
    v_date  TEXT;
    v_count INT;
BEGIN
    v_date := TO_CHAR(NOW() AT TIME ZONE 'Asia/Yangon', 'YYMMDD');
    SELECT COUNT(*) + 1
    INTO v_count
    FROM g2bulk_orders
    WHERE DATE(created_at AT TIME ZONE 'Asia/Yangon') =
          CURRENT_DATE AT TIME ZONE 'Asia/Yangon';
    RETURN 'GST-' || v_date || '-' || LPAD(v_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: generate_referral_code
--   Produces UPPER(first-4 of username) + UPPER(first-4 of md5(random)).
--   Loops until unique.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_referral_code(p_username VARCHAR)
RETURNS TEXT AS $$
DECLARE
    v_code   TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_code := UPPER(LEFT(p_username, 4)) ||
                  UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = v_code)
        INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: cleanup_expired_sessions
--   Deletes expired rows from every session / token table.
--   Called by pg_cron every 5 minutes.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    DELETE FROM admin_sessions            WHERE expires_at < NOW();
    GET DIAGNOSTICS v_count = ROW_COUNT;

    DELETE FROM user_sessions             WHERE expires_at < NOW();
    DELETE FROM reseller_sessions         WHERE expires_at < NOW();
    DELETE FROM exchange_tokens           WHERE expires_at < NOW() OR used = TRUE;
    DELETE FROM email_verification_tokens WHERE expires_at < NOW() OR used = TRUE;
    DELETE FROM password_reset_tokens     WHERE expires_at < NOW() OR used = TRUE;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: update_user_online_status
--   Flips is_online = FALSE for anyone whose last_seen is > 90 s ago.
--   Runs every 60 s via pg_cron.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_online_status()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE user_location_tracking
    SET is_online = (last_seen > NOW() - INTERVAL '90 seconds')
    WHERE is_online = TRUE
      AND last_seen <= NOW() - INTERVAL '90 seconds';

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: recalculate_product_rating
--   Recomputes products.rating_avg and rating_count from reviews.
--   Called by trg_reviews_rating_change.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION recalculate_product_rating(p_product_id UUID)
RETURNS VOID AS $$
DECLARE
    v_avg   NUMERIC(3,2);
    v_count INT;
BEGIN
    SELECT
        ROUND(AVG(rating)::NUMERIC, 2),
        COUNT(*)
    INTO v_avg, v_count
    FROM reviews
    WHERE product_id = p_product_id
      AND is_approved = TRUE;

    UPDATE products
    SET rating_avg   = COALESCE(v_avg, 0),
        rating_count = COALESCE(v_count, 0),
        updated_at   = NOW()
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: increment_product_view
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET view_count = view_count + 1
    WHERE id = p_product_id AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: increment_product_sold
--   Increment sold_count and decrement stock atomically.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_product_sold(p_product_id UUID, p_quantity INT DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET sold_count = sold_count + p_quantity,
        stock      = GREATEST(0, stock - p_quantity)
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: update_category_product_count
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_category_product_count(p_category_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE categories
    SET product_count = (
        SELECT COUNT(*)
        FROM products
        WHERE category_id = p_category_id
          AND is_active = TRUE
    )
    WHERE id = p_category_id;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: apply_promo_code
--   Server-side promo validation + discount computation.
--   Returns { valid: true, discount_amount, ... } or
--           { valid: false, error: 'PROMO_...' }
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION apply_promo_code(
    p_code          VARCHAR,
    p_user_id       UUID,
    p_order_total   BIGINT
) RETURNS JSONB AS $$
DECLARE
    v_promo         promo_codes%ROWTYPE;
    v_usage_count   INT;
    v_discount      BIGINT;
BEGIN
    SELECT * INTO v_promo
    FROM promo_codes
    WHERE code = UPPER(TRIM(p_code))
      AND is_active = TRUE
    FOR SHARE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'PROMO_NOT_FOUND');
    END IF;

    IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < NOW() THEN
        RETURN jsonb_build_object('valid', false, 'error', 'PROMO_EXPIRED');
    END IF;

    IF v_promo.starts_at IS NOT NULL AND v_promo.starts_at > NOW() THEN
        RETURN jsonb_build_object('valid', false, 'error', 'PROMO_NOT_STARTED');
    END IF;

    IF v_promo.max_uses IS NOT NULL AND v_promo.used_count >= v_promo.max_uses THEN
        RETURN jsonb_build_object('valid', false, 'error', 'PROMO_MAX_REACHED');
    END IF;

    IF p_order_total < v_promo.min_order_amount THEN
        RETURN jsonb_build_object(
            'valid',     false,
            'error',     'ORDER_BELOW_MIN',
            'min_order', v_promo.min_order_amount
        );
    END IF;

    -- Per-user quota
    SELECT COUNT(*) INTO v_usage_count
    FROM promo_code_usage
    WHERE promo_code_id = v_promo.id
      AND user_id       = p_user_id;

    IF v_promo.per_user_limit IS NOT NULL AND v_usage_count >= v_promo.per_user_limit THEN
        RETURN jsonb_build_object('valid', false, 'error', 'PROMO_ALREADY_USED');
    END IF;

    -- Discount computation
    IF v_promo.discount_type = 'percent' THEN
        v_discount := (p_order_total * v_promo.discount_value) / 100;
        IF v_promo.max_discount IS NOT NULL THEN
            v_discount := LEAST(v_discount, v_promo.max_discount);
        END IF;
    ELSE
        v_discount := v_promo.discount_value;
    END IF;

    -- Never let the discount exceed the order total
    v_discount := LEAST(v_discount, p_order_total);

    RETURN jsonb_build_object(
        'valid',            true,
        'promo_id',         v_promo.id,
        'discount_type',    v_promo.discount_type,
        'discount_value',   v_promo.discount_value,
        'discount_amount',  v_discount,
        'promo_name',       v_promo.name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- FUNCTION: check_reseller_limits
--   Given resource in ('menus','categories','products','banners'),
--   returns whether the reseller can create one more row.
--   Handles plan expiry (falls back to Free plan).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_reseller_limits(
    p_reseller_id   UUID,
    p_resource      VARCHAR
) RETURNS JSONB AS $$
DECLARE
    v_plan          premium_plans%ROWTYPE;
    v_user          users%ROWTYPE;
    v_current_count INT;
    v_limit         INT;
BEGIN
    SELECT * INTO v_user FROM users WHERE id = p_reseller_id;
    IF NOT FOUND OR v_user.role != 'reseller' THEN
        RETURN jsonb_build_object('allowed', false, 'error', 'NOT_RESELLER');
    END IF;

    -- Plan resolution: expired → free; else assigned; else free
    IF v_user.reseller_plan_expires IS NOT NULL AND v_user.reseller_plan_expires < NOW() THEN
        SELECT * INTO v_plan FROM premium_plans WHERE slug = 'free' LIMIT 1;
    ELSIF v_user.reseller_plan_id IS NOT NULL THEN
        SELECT * INTO v_plan FROM premium_plans WHERE id = v_user.reseller_plan_id;
    ELSE
        SELECT * INTO v_plan FROM premium_plans WHERE slug = 'free' LIMIT 1;
    END IF;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('allowed', false, 'error', 'PLAN_NOT_FOUND');
    END IF;

    CASE p_resource
        WHEN 'menus' THEN
            v_limit := v_plan.max_menus;
            SELECT COUNT(*) INTO v_current_count
            FROM menus WHERE reseller_id = p_reseller_id AND is_active = TRUE;
        WHEN 'categories' THEN
            v_limit := v_plan.max_categories;
            SELECT COUNT(*) INTO v_current_count
            FROM categories WHERE reseller_id = p_reseller_id AND is_active = TRUE;
        WHEN 'products' THEN
            v_limit := v_plan.max_products;
            SELECT COUNT(*) INTO v_current_count
            FROM products WHERE reseller_id = p_reseller_id AND is_active = TRUE;
        WHEN 'banners' THEN
            v_limit := v_plan.max_banners;
            SELECT COUNT(*) INTO v_current_count
            FROM banners WHERE reseller_id = p_reseller_id AND is_active = TRUE;
        ELSE
            RETURN jsonb_build_object('allowed', false, 'error', 'UNKNOWN_RESOURCE');
    END CASE;

    RETURN jsonb_build_object(
        'allowed',   v_current_count < v_limit,
        'current',   v_current_count,
        'limit',     v_limit,
        'plan_name', v_plan.name,
        'plan_slug', v_plan.slug
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- FUNCTION: get_user_balance_safe
--   Sanctioned server-side read of a user's balance during a
--   checkout / topup flow. FOR SHARE lock; refuses if user is not
--   status='active'.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_balance_safe(p_user_id UUID)
RETURNS BIGINT AS $$
DECLARE
    v_balance BIGINT;
BEGIN
    SELECT game_balance INTO v_balance
    FROM users
    WHERE id = p_user_id AND status = 'active'
    FOR SHARE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND_OR_INACTIVE: %', p_user_id;
    END IF;

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- FUNCTION: purge_old_location_history (default 30 d retention)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION purge_old_location_history(p_days INT DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM user_location_history
    WHERE recorded_at < NOW() - (p_days || ' days')::INTERVAL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: purge_old_vps_metrics (default 7 d retention)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION purge_old_vps_metrics(p_days INT DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM vps_metrics
    WHERE recorded_at < NOW() - (p_days || ' days')::INTERVAL;
    DELETE FROM vps_physical_metrics
    WHERE recorded_at < NOW() - (p_days || ' days')::INTERVAL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: purge_old_security_logs (default 90 d retention)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION purge_old_security_logs(p_days INT DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM security_logs
    WHERE timestamp < NOW() - (p_days || ' days')::INTERVAL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: auto_cancel_old_orders
--   Marks pending / pending_payment_review orders (non-balance,
--   non-COD) older than N hours as cancelled.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION auto_cancel_old_orders(p_hours INT DEFAULT 24)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE orders
    SET status           = 'cancelled',
        cancelled_at     = NOW(),
        cancelled_reason = 'Auto-cancelled: payment not confirmed within ' || p_hours || ' hours',
        updated_at       = NOW()
    WHERE status IN ('pending', 'pending_payment_review')
      AND payment_method != 'virtual_balance'
      AND payment_method != 'cod'
      AND created_at < NOW() - (p_hours || ' hours')::INTERVAL;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FUNCTION: get_dashboard_stats
--   Returns all numbers for the Admin Dashboard Overview
--   in a single round-trip.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users',         (SELECT COUNT(*) FROM users WHERE role = 'user'),
        'total_resellers',     (SELECT COUNT(*) FROM users WHERE role = 'reseller'),
        'total_orders',        (SELECT COUNT(*) FROM orders),
        'pending_orders',      (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
        'today_orders',        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        'today_revenue',       (SELECT COALESCE(SUM(total),0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status IN ('approved','completed')),
        'total_revenue',       (SELECT COALESCE(SUM(total),0) FROM orders WHERE status IN ('approved','completed')),
        'pending_deposits',    (SELECT COUNT(*) FROM deposit_requests WHERE status = 'pending'),
        'pending_kyc',         (SELECT COUNT(*) FROM reseller_kyc WHERE status = 'pending'),
        'online_users',        (SELECT COUNT(*) FROM user_location_tracking WHERE is_online = TRUE),
        'total_gstore_orders', (SELECT COUNT(*) FROM g2bulk_orders),
        'active_vps',          (SELECT COUNT(*) FROM vps_instances WHERE status = 'running')
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---
### 21.21 Section 20 — Triggers

**Purpose.** Enforce invariants automatically. The application code cannot forget to update a counter, log a status transition, or block a direct balance edit — the database enforces it.

Triggers fall into four families:

1. **`prevent_direct_balance_edit`** — the money guard.
2. **Auto-generators** — `set_order_number`, `set_g2bulk_order_number`, `set_user_referral_code`.
3. **`updated_at` maintainers** — one per table that has `updated_at`.
4. **Denormalised counter / audit maintainers** — rating recompute, category counters, order status log, location history append, promo usage count, last-login update.

#### `prevent_direct_balance_edit` — the load-bearing balance trigger

Fires `BEFORE UPDATE ON users`. If `NEW.game_balance IS DISTINCT FROM OLD.game_balance` **and** the session variable `app.allow_balance_update` is not `'true'`, the trigger:

1. Inserts a `security_logs` row with `event_type='BALANCE_HACK_ATTEMPT'` (recording the old / new / diff).
2. Raises an exception, aborting the update.

The only function that sets `app.allow_balance_update = 'true'` is `update_user_balance()`, and it resets the flag immediately after its UPDATE. This is why direct SQL like `UPDATE users SET game_balance = … WHERE id = …` is impossible outside the RPC.

This trigger runs with `SECURITY DEFINER` so it can INSERT into `security_logs` even when the caller's role would not normally have permission there.

#### Auto-generators

- `fn_set_order_number` — fills in `orders.order_number` on insert if the caller did not provide one.
- `fn_set_g2bulk_order_number` — same for `g2bulk_orders.order_number`.
- `fn_set_user_referral_code` — fills in `users.referral_code` on insert.

#### `updated_at` maintainers

A separate `CREATE TRIGGER` per table, all calling the shared `fn_update_updated_at`. Tables covered: `users`, `menus`, `categories`, `products`, `orders`, `order_items`, `g2bulk_orders`, `reseller_kyc`, `vps_instances`, `vps_physical_config`, `deposit_requests`, `withdrawal_requests`, `banners`, `news`, `reviews`, `reseller_plan_purchases`, `payment_methods_config`, `user_location_tracking`, `premium_plans`, `promo_codes`, `cart_items`.

#### Denormalised counter maintainers

- **`fn_review_rating_change`** — AFTER any DML on `reviews`, recomputes `products.rating_avg` and `products.rating_count` via `recalculate_product_rating()`.
- **`fn_review_helpful_count`** — AFTER INSERT/DELETE on `review_helpful`, +/- `reviews.helpful_count`.
- **`fn_product_category_count`** — AFTER any DML on `products`, refreshes the affected categories' `product_count`. Handles the tricky case where a product's `category_id` changes (updates both old and new category counts).
- **`fn_order_status_change`** — AFTER UPDATE on `orders`, if `status` changed, appends a row to `order_status_history` with a human-readable note per new status.
- **`fn_location_history_append`** — AFTER UPDATE on `user_location_tracking`, if the user moved more than ~50 m (0.0005 degrees), append a row to `user_location_history`. This is what powers the "View movement path" polyline.
- **`fn_promo_usage_count`** — AFTER INSERT/DELETE on `promo_code_usage`, +/- `promo_codes.used_count`.
- **`fn_update_last_login`** — AFTER INSERT on `user_sessions` or `reseller_sessions`, updates `users.last_login_at`, `users.last_login_ip`, `users.updated_at`.

```sql
-- ============================================================
-- SECTION 20: TRIGGERS
-- ============================================================

-- ------------------------------------------------------------
-- TRIGGER: prevent_direct_balance_edit
--   Blocks any UPDATE that changes users.game_balance unless
--   the session variable app.allow_balance_update = 'true'
--   (set only inside update_user_balance()).
--   Any blocked attempt is logged to security_logs.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_prevent_direct_balance_edit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW.game_balance IS DISTINCT FROM OLD.game_balance THEN
            IF current_setting('app.allow_balance_update', true) IS DISTINCT FROM 'true' THEN
                INSERT INTO security_logs (
                    ip_address, event_type, user_id, metadata, result, timestamp
                ) VALUES (
                    '0.0.0.0'::INET,
                    'BALANCE_HACK_ATTEMPT',
                    OLD.id,
                    jsonb_build_object(
                        'old_balance', OLD.game_balance,
                        'new_balance', NEW.game_balance,
                        'diff',        NEW.game_balance - OLD.game_balance
                    ),
                    'blocked',
                    NOW()
                );
                RAISE EXCEPTION 'BALANCE_DIRECT_EDIT_FORBIDDEN: Use update_user_balance() RPC only';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_prevent_direct_balance_edit
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION fn_prevent_direct_balance_edit();

-- ------------------------------------------------------------
-- TRIGGER: auto-set order_number on insert
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_order_number();

-- ------------------------------------------------------------
-- TRIGGER: auto-set g2bulk order_number on insert
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_g2bulk_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_g2bulk_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_g2bulk_order_number
    BEFORE INSERT ON g2bulk_orders
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_g2bulk_order_number();

-- ------------------------------------------------------------
-- TRIGGER: auto-set referral_code on new user
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code(NEW.username);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_user_referral_code
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_user_referral_code();

-- ------------------------------------------------------------
-- TRIGGERS: updated_at maintainers (one per relevant table)
-- ------------------------------------------------------------
CREATE TRIGGER trg_users_updated_at        BEFORE UPDATE ON users        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_menus_updated_at        BEFORE UPDATE ON menus        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_categories_updated_at   BEFORE UPDATE ON categories   FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_products_updated_at     BEFORE UPDATE ON products     FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_orders_updated_at       BEFORE UPDATE ON orders       FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_order_items_updated_at  BEFORE UPDATE ON order_items  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_g2bulk_orders_updated_at BEFORE UPDATE ON g2bulk_orders FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_kyc_updated_at          BEFORE UPDATE ON reseller_kyc FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_vps_instances_updated_at BEFORE UPDATE ON vps_instances FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_vps_physical_config_updated_at BEFORE UPDATE ON vps_physical_config FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_deposit_requests_updated_at    BEFORE UPDATE ON deposit_requests    FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_banners_updated_at      BEFORE UPDATE ON banners      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_news_updated_at         BEFORE UPDATE ON news         FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_reviews_updated_at      BEFORE UPDATE ON reviews      FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_reseller_plan_purchases_updated_at BEFORE UPDATE ON reseller_plan_purchases FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_payment_methods_updated_at BEFORE UPDATE ON payment_methods_config FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_location_updated_at     BEFORE UPDATE ON user_location_tracking FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_premium_plans_updated_at BEFORE UPDATE ON premium_plans FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_promo_codes_updated_at  BEFORE UPDATE ON promo_codes  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();
CREATE TRIGGER trg_cart_items_updated_at   BEFORE UPDATE ON cart_items   FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- ------------------------------------------------------------
-- TRIGGER: recalculate product rating on any review DML
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_review_rating_change()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id UUID;
BEGIN
    v_product_id := COALESCE(NEW.product_id, OLD.product_id);
    IF v_product_id IS NOT NULL THEN
        PERFORM recalculate_product_rating(v_product_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_rating_change
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION fn_review_rating_change();

-- ------------------------------------------------------------
-- TRIGGER: review_helpful count sync
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = OLD.review_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_helpful_count
    AFTER INSERT OR DELETE ON review_helpful
    FOR EACH ROW
    EXECUTE FUNCTION fn_review_helpful_count();

-- ------------------------------------------------------------
-- TRIGGER: category product_count auto-update
--   Handles INSERT/UPDATE/DELETE of products, including the
--   category-changed case (both old and new categories refresh).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_product_category_count()
RETURNS TRIGGER AS $$
DECLARE
    v_old_cat UUID;
    v_new_cat UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM update_category_product_count(OLD.category_id);
        RETURN OLD;
    END IF;

    v_new_cat := NEW.category_id;
    v_old_cat := OLD.category_id;

    IF TG_OP = 'INSERT' THEN
        PERFORM update_category_product_count(v_new_cat);
    ELSIF TG_OP = 'UPDATE' THEN
        IF v_old_cat IS DISTINCT FROM v_new_cat THEN
            IF v_old_cat IS NOT NULL THEN
                PERFORM update_category_product_count(v_old_cat);
            END IF;
        END IF;
        IF v_new_cat IS NOT NULL THEN
            PERFORM update_category_product_count(v_new_cat);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_category_count
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION fn_product_category_count();

-- ------------------------------------------------------------
-- TRIGGER: order_status_history auto-insert on status change
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO order_status_history (
            order_id, old_status, new_status, changed_by, note
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.approved_by,
            CASE NEW.status
                WHEN 'approved'  THEN 'Order approved by admin'
                WHEN 'rejected'  THEN COALESCE(NEW.rejected_reason, 'Order rejected')
                WHEN 'completed' THEN 'Order delivered and completed'
                WHEN 'cancelled' THEN COALESCE(NEW.cancelled_reason, 'Order cancelled')
                WHEN 'refunded'  THEN 'Order refunded'
                ELSE NULL
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_status_change
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION fn_order_status_change();

-- ------------------------------------------------------------
-- TRIGGER: location_history append on significant movement (>50 m)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_location_history_append()
RETURNS TRIGGER AS $$
BEGIN
    -- Only append when the user has moved ~50 m or more (0.0005 degrees).
    IF OLD.latitude IS NULL
       OR ABS(NEW.latitude  - OLD.latitude)  > 0.0005
       OR ABS(NEW.longitude - OLD.longitude) > 0.0005 THEN
        INSERT INTO user_location_history (
            user_id, latitude, longitude,
            accuracy, address, ip_address, platform
        ) VALUES (
            NEW.user_id,
            NEW.latitude, NEW.longitude,
            NEW.accuracy, NEW.address,
            NEW.ip_address, NEW.platform
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_location_history_append
    AFTER UPDATE ON user_location_tracking
    FOR EACH ROW
    EXECUTE FUNCTION fn_location_history_append();

-- ------------------------------------------------------------
-- TRIGGER: promo_codes.used_count sync from promo_code_usage
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_promo_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE promo_codes
        SET used_count = used_count + 1, updated_at = NOW()
        WHERE id = NEW.promo_code_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE promo_codes
        SET used_count = GREATEST(0, used_count - 1), updated_at = NOW()
        WHERE id = OLD.promo_code_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_promo_usage_count
    AFTER INSERT OR DELETE ON promo_code_usage
    FOR EACH ROW
    EXECUTE FUNCTION fn_promo_usage_count();

-- ------------------------------------------------------------
-- TRIGGER: update users.last_login_at when a session is created
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET last_login_at = NOW(),
        last_login_ip = NEW.ip_address,
        updated_at    = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_last_login_user
    AFTER INSERT ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_last_login();

CREATE TRIGGER trg_update_last_login_reseller
    AFTER INSERT ON reseller_sessions
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_last_login();
```

---
### 21.22 Section 21 — Row-Level Security (RLS) policies

**Purpose.** Define, at the DB layer, exactly which rows each role can `SELECT` / `INSERT` / `UPDATE` / `DELETE`. RLS is the security floor — even if application code is compromised, the anon key cannot escape these limits.

**Roles at play** (Supabase's built-in roles):

- **`anon`** — the Supabase public role. This is what a client-side JavaScript request holds if the user is not logged in. `auth.uid()` returns `NULL` for this role.
- **`authenticated`** — the role after a Supabase JWT is present. `auth.uid()` returns the user's UUID.
- **`service_role`** — the server-only role (used by `api/*.js` via `SUPABASE_SERVICE_ROLE_KEY`). **Bypasses RLS entirely.** Every server route validates its own session before using this key.

**Global rule.** If a table has RLS enabled and no matching policy allows a row, that row is invisible. Every table listed here is `ENABLE ROW LEVEL SECURITY`, so no policy = no access.

Below is the policy inventory, grouped by domain. All CREATE POLICY statements are gathered into the SQL block at the end.

#### Users (`users`)

| Op | Who | Rule |
|---|---|---|
| SELECT | authenticated | `id = auth.uid()` (see only your own row). |
| UPDATE | authenticated | `id = auth.uid()` (may only mutate own row). `role`, `status`, `game_balance`, `password_hash` cannot be updated via client — server enforces column-level restriction in `api/*.js`. |
| INSERT | anon | Allowed. Signup is legitimate. But `api/auth.js` still validates + strips server-only columns before insert. |

#### Sessions (`user_sessions`, `reseller_sessions`, `exchange_tokens`, `email_verification_tokens`, `password_reset_tokens`)

For each: authenticated users may `SELECT` / `INSERT` / `DELETE` rows where `user_id = auth.uid()`. Verification / reset token tables are `SELECT`-only (writes are server-only via service_role).

#### Reseller KYC (`reseller_kyc`)

| Op | Who | Rule |
|---|---|---|
| SELECT | authenticated | own row (`user_id = auth.uid()`). |
| INSERT | authenticated | own row. |
| UPDATE | authenticated | own row, and only if `status IN ('pending','resubmit_required')` — so once approved / rejected, the applicant cannot mutate their record. |

#### Reseller plan purchases (`reseller_plan_purchases`)

SELECT + INSERT scoped to own `user_id`.

#### Content — `menus`, `categories`, `products`, `product_variants`, `banners`

**Read pattern (public catalogue).** All four (menus / categories / products / banners) allow anon + authenticated to `SELECT` rows where `is_active = TRUE` AND (`reseller_id IS NULL` OR `reseller_id = auth.uid()`). This is the mechanism that makes global (admin) rows visible to everyone and reseller-scoped rows visible only to that reseller inside their own dashboard. Regular customers browsing the Users Dashboard implicitly see all global rows (they don't have a reseller session).

**Write pattern (reseller CMS).** Insert / Update / Delete requires:
- `reseller_id = auth.uid()` AND
- `(SELECT role FROM users WHERE id = auth.uid()) = 'reseller'`.

The double-check on `role` prevents a race where a user was demoted between JWT issue and query.

`product_variants` is joined to `products` — a variant's access follows the parent product's ownership.

`banners` additionally filters on the active window (`starts_at <= NOW() <= ends_at`).

#### Cart (`cart_items`)

ALL ops require `user_id = auth.uid()`. Simple and complete.

#### Orders (`orders`, `order_items`, `order_status_history`)

- SELECT visible when the requester is either the customer (`user_id = auth.uid()`) or the reseller (`reseller_id = auth.uid()`) — so resellers see orders placed against their products.
- INSERT: `user_id = auth.uid()` (customer placing their own order).
- UPDATE limited to a very narrow "cancel own pending order" case: `user_id = auth.uid()` AND `status IN ('pending','pending_payment_review')` AND the new status must be `cancelled` AND `cancelled_by = auth.uid()`.
- `order_items` and `order_status_history` inherit visibility via `EXISTS` on `orders`.

Admin approvals, rejections, refunds go through `api/admin-action.js` using the service_role key.

#### G Store orders (`g2bulk_orders`)

Same pattern as `orders` — customer + reseller can SELECT, customer can INSERT.

#### Transactions (`transactions`)

- SELECT only (`user_id = auth.uid()`).
- No INSERT / UPDATE / DELETE for anon or authenticated. The only path in is `update_user_balance()` (SECURITY DEFINER).

#### Deposits + withdrawals (`deposit_requests`, `withdrawal_requests`)

- SELECT own rows.
- INSERT own row with `status='pending'` (so a client cannot create an already-approved deposit).
- UPDATE limited to `status='pending' → status='cancelled'` (cancel own pending request).

#### Promo code usage (`promo_code_usage`)

SELECT own rows only. INSERT is server-only (via `apply_promo_code()`).

#### News (`news`)

- Public read of published rows only (`is_published = TRUE`).
- Reseller CRUD on own rows (same reseller-role check as content section).

#### Reviews (`reviews`, `review_helpful`)

- Public: `is_approved = TRUE` visible.
- Reviewer: full CRUD on own rows, but UPDATE / DELETE only while `is_approved = FALSE` (once admin approves, the review is frozen).
- `review_helpful`: public SELECT, own INSERT / DELETE.

#### Notifications (`notifications`)

ALL ops on own rows.

#### Location (`user_location_tracking`, `user_location_history`, `user_ip_history`)

- `user_location_tracking`: ALL ops on own row (client upserts).
- `user_location_history`: SELECT own rows only; inserts are trigger-generated (SECURITY DEFINER).
- `user_ip_history`: SELECT own rows only; inserts are server-generated.

#### VPS (`vps_instances`)

The assigned user (`assigned_user_id = auth.uid()`) can SELECT their own VPS row(s), excluding rows already `status='deleted'`. Admin operations bypass RLS via service_role.

#### Wishlist (`wishlist`)

ALL ops on own rows.

```sql
-- ============================================================
-- SECTION 21: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- ------------------------------------------------------------
-- Enable RLS on all user-facing tables
-- (service_role bypasses; anon / authenticated are policy-constrained)
-- ------------------------------------------------------------
ALTER TABLE users                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_tokens             ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens   ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_kyc                ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_plan_purchases     ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history        ENABLE ROW LEVEL SECURITY;
ALTER TABLE g2bulk_orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_requests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage            ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_location_tracking      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_location_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_history             ENABLE ROW LEVEL SECURITY;
ALTER TABLE vps_instances               ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist                    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES: users
-- ============================================================
CREATE POLICY "users_select_own" ON users
    FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());
    -- Column-level restrictions (role, status, game_balance, password_hash)
    -- are enforced application-side in api/*.js and by trigger for game_balance.

CREATE POLICY "users_insert_signup" ON users
    FOR INSERT
    WITH CHECK (TRUE);      -- signup goes through /api/auth which validates

-- ============================================================
-- POLICIES: user_sessions
-- ============================================================
CREATE POLICY "sessions_select_own" ON user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "sessions_insert_own" ON user_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "sessions_delete_own" ON user_sessions FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: reseller_sessions
-- ============================================================
CREATE POLICY "reseller_sessions_select_own" ON reseller_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reseller_sessions_insert_own" ON reseller_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reseller_sessions_delete_own" ON reseller_sessions FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: exchange_tokens / verification / reset
-- ============================================================
CREATE POLICY "exchange_tokens_own"     ON exchange_tokens             FOR ALL    USING (user_id = auth.uid());
CREATE POLICY "email_verify_own"        ON email_verification_tokens   FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "pw_reset_own"            ON password_reset_tokens       FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: reseller_kyc
-- ============================================================
CREATE POLICY "kyc_select_own"  ON reseller_kyc FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "kyc_insert_own"  ON reseller_kyc FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "kyc_update_own"  ON reseller_kyc FOR UPDATE
    USING (user_id = auth.uid() AND status IN ('pending','resubmit_required'));

-- ============================================================
-- POLICIES: reseller_plan_purchases
-- ============================================================
CREATE POLICY "plan_purchases_select_own" ON reseller_plan_purchases FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "plan_purchases_insert_own" ON reseller_plan_purchases FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- POLICIES: menus / categories / products / variants / banners
-- (Public read; reseller writes own; admin uses service_role)
-- ============================================================
CREATE POLICY "menus_public_read" ON menus FOR SELECT
    USING (is_active = TRUE AND (reseller_id IS NULL OR reseller_id = auth.uid()));
CREATE POLICY "menus_reseller_insert" ON menus FOR INSERT
    WITH CHECK (reseller_id = auth.uid()
                AND (SELECT role FROM users WHERE id = auth.uid()) = 'reseller');
CREATE POLICY "menus_reseller_update" ON menus FOR UPDATE
    USING (reseller_id = auth.uid()) WITH CHECK (reseller_id = auth.uid());
CREATE POLICY "menus_reseller_delete" ON menus FOR DELETE USING (reseller_id = auth.uid());

CREATE POLICY "categories_public_read" ON categories FOR SELECT
    USING (is_active = TRUE AND (reseller_id IS NULL OR reseller_id = auth.uid()));
CREATE POLICY "categories_reseller_insert" ON categories FOR INSERT
    WITH CHECK (reseller_id = auth.uid()
                AND (SELECT role FROM users WHERE id = auth.uid()) = 'reseller');
CREATE POLICY "categories_reseller_update" ON categories FOR UPDATE
    USING (reseller_id = auth.uid()) WITH CHECK (reseller_id = auth.uid());
CREATE POLICY "categories_reseller_delete" ON categories FOR DELETE USING (reseller_id = auth.uid());

CREATE POLICY "products_public_read" ON products FOR SELECT
    USING (is_active = TRUE AND (reseller_id IS NULL OR reseller_id = auth.uid()));
CREATE POLICY "products_reseller_insert" ON products FOR INSERT
    WITH CHECK (reseller_id = auth.uid()
                AND (SELECT role FROM users WHERE id = auth.uid()) = 'reseller');
CREATE POLICY "products_reseller_update" ON products FOR UPDATE
    USING (reseller_id = auth.uid()) WITH CHECK (reseller_id = auth.uid());
CREATE POLICY "products_reseller_delete" ON products FOR DELETE USING (reseller_id = auth.uid());

CREATE POLICY "variants_public_read" ON product_variants FOR SELECT
    USING (is_active = TRUE
           AND EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.is_active = TRUE));
CREATE POLICY "variants_reseller_manage" ON product_variants FOR ALL
    USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.reseller_id = auth.uid()));

CREATE POLICY "banners_public_read" ON banners FOR SELECT
    USING (is_active = TRUE
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at   IS NULL OR ends_at   >= NOW())
           AND (reseller_id IS NULL OR reseller_id = auth.uid()));
CREATE POLICY "banners_reseller_insert" ON banners FOR INSERT
    WITH CHECK (reseller_id = auth.uid()
                AND (SELECT role FROM users WHERE id = auth.uid()) = 'reseller');
CREATE POLICY "banners_reseller_update" ON banners FOR UPDATE
    USING (reseller_id = auth.uid()) WITH CHECK (reseller_id = auth.uid());
CREATE POLICY "banners_reseller_delete" ON banners FOR DELETE USING (reseller_id = auth.uid());

-- ============================================================
-- POLICIES: cart_items
-- ============================================================
CREATE POLICY "cart_all_own" ON cart_items FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- POLICIES: orders / order_items / order_status_history
-- ============================================================
CREATE POLICY "orders_select" ON orders FOR SELECT
    USING (user_id = auth.uid() OR reseller_id = auth.uid());

CREATE POLICY "orders_insert_own" ON orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_update_cancel" ON orders FOR UPDATE
    USING (user_id = auth.uid() AND status IN ('pending', 'pending_payment_review'))
    WITH CHECK (status = 'cancelled' AND cancelled_by = auth.uid());

CREATE POLICY "order_items_select_own" ON order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = order_id
          AND (o.user_id = auth.uid() OR o.reseller_id = auth.uid())
    ));

CREATE POLICY "order_status_history_read" ON order_status_history FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = order_id
          AND (o.user_id = auth.uid() OR o.reseller_id = auth.uid())
    ));

-- ============================================================
-- POLICIES: g2bulk_orders
-- ============================================================
CREATE POLICY "g2bulk_orders_own" ON g2bulk_orders FOR SELECT
    USING (user_id = auth.uid() OR reseller_id = auth.uid());
CREATE POLICY "g2bulk_orders_insert_own" ON g2bulk_orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================
-- POLICIES: transactions (SELECT only; writes via RPC)
-- ============================================================
CREATE POLICY "transactions_own" ON transactions FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: deposit_requests / withdrawal_requests
-- ============================================================
CREATE POLICY "deposits_select_own" ON deposit_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "deposits_insert_own" ON deposit_requests FOR INSERT
    WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "deposits_cancel_own" ON deposit_requests FOR UPDATE
    USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (status = 'cancelled');

CREATE POLICY "withdrawals_select_own" ON withdrawal_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "withdrawals_insert_own" ON withdrawal_requests FOR INSERT
    WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "withdrawals_cancel_own" ON withdrawal_requests FOR UPDATE
    USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (status = 'cancelled');

-- ============================================================
-- POLICIES: promo_code_usage (SELECT only; writes via RPC)
-- ============================================================
CREATE POLICY "promo_usage_own" ON promo_code_usage FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: news
-- ============================================================
CREATE POLICY "news_public_read" ON news FOR SELECT
    USING (is_published = TRUE AND (reseller_id IS NULL OR reseller_id = auth.uid()));
CREATE POLICY "news_reseller_insert" ON news FOR INSERT
    WITH CHECK (reseller_id = auth.uid()
                AND (SELECT role FROM users WHERE id = auth.uid()) = 'reseller');
CREATE POLICY "news_reseller_update" ON news FOR UPDATE
    USING (reseller_id = auth.uid()) WITH CHECK (reseller_id = auth.uid());
CREATE POLICY "news_reseller_delete" ON news FOR DELETE USING (reseller_id = auth.uid());

-- ============================================================
-- POLICIES: reviews + review_helpful
-- ============================================================
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "reviews_own_select"  ON reviews FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reviews_own_insert"  ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_update"  ON reviews FOR UPDATE
    USING (user_id = auth.uid() AND is_approved = FALSE)
    WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_own_delete"  ON reviews FOR DELETE
    USING (user_id = auth.uid() AND is_approved = FALSE);

CREATE POLICY "review_helpful_read"         ON review_helpful FOR SELECT USING (TRUE);
CREATE POLICY "review_helpful_own"          ON review_helpful FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "review_helpful_delete_own"   ON review_helpful FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: notifications
-- ============================================================
CREATE POLICY "notif_own_all" ON notifications FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- POLICIES: location tables
-- ============================================================
CREATE POLICY "location_own_upsert" ON user_location_tracking FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "loc_history_own"     ON user_location_history  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ip_history_own"      ON user_ip_history        FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- POLICIES: vps_instances (assigned user reads only, not deleted)
-- ============================================================
CREATE POLICY "vps_assigned_user_read" ON vps_instances FOR SELECT
    USING (assigned_user_id = auth.uid() AND status != 'deleted');

-- ============================================================
-- POLICIES: wishlist
-- ============================================================
CREATE POLICY "wishlist_own" ON wishlist FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

---
### 21.23 Section 22 — Realtime publications

**Purpose.** Tell Supabase's Realtime service which tables should emit change events over the WebSocket-based `postgres_changes` channel. Every table listed here is a live feed the client can subscribe to.

**Tables published and the UX they power:**

| Table | Client-side subscriber | Purpose |
|---|---|---|
| `orders` | Users Dashboard Orders List (§ 8.9), Admin Orders (§ 9.4) | Live status flips (pending → approved → completed). |
| `order_status_history` | Users Order Detail timeline (§ 8.10) | Live push of new timeline entries. |
| `g2bulk_orders` | Users G Store success page (§ 8.6), Admin G Store Orders (§ 9.10) | Delivery status changes without polling. |
| `transactions` | Users Balance card | Balance mutates → topbar balance number animates. |
| `notifications` | Users notification bell | Unread badge count updates instantly. |
| `user_location_tracking` | Admin Locations Map (§ 11.4) | Live marker updates without page reload. |
| `deposit_requests`, `withdrawal_requests` | Admin deposit / withdrawal queues | New pending items appear at the top with a fade-in. |
| `vps_instances` | Admin VPS panel (§ 13) | Live status changes (creating → running, running → stopped). |
| `reseller_kyc` | Users KYC status page | Live status change when admin decides. |
| `g2bulk_balance_log` | Admin dashboard sparkline | Live G2Bulk USD balance chart. |

**Not published on purpose:** `users` (balance changes surface via `transactions` instead — this avoids leaking sibling user rows), `security_logs`, `vps_metrics` (too high-frequency; pulled via SSE), `product_variants` / `products` (RLS + polling is fine, avoids storm on batch updates).

```sql
-- ============================================================
-- SECTION 22: REALTIME PUBLICATIONS
-- ============================================================
BEGIN;

DROP PUBLICATION IF EXISTS supabase_realtime;

CREATE PUBLICATION supabase_realtime FOR TABLE
    orders,                       -- order status flips
    order_status_history,         -- live timeline entries
    g2bulk_orders,                -- G Store delivery progress
    transactions,                 -- balance changes → topbar balance UI
    notifications,                -- unread bell badge
    user_location_tracking,       -- Admin Locations Map
    deposit_requests,             -- Admin deposit queue
    withdrawal_requests,          -- Admin withdrawal queue
    vps_instances,                -- VPS status changes
    reseller_kyc,                 -- KYC decisions
    g2bulk_balance_log;           -- Admin sparkline

COMMIT;
```

---

### 21.24 Section 23 — Helper views

**Purpose.** Encapsulate common admin / reseller aggregations so the client can query one view and get everything it needs for a page.

Each view is a pure `SELECT` (no side effects) and is subject to the RLS policies of its underlying tables — a view is not a way to bypass RLS.

#### `v_user_summary`

Powers the Admin Users List (§ 9.3) and the User Detail page. Joins `users` with the current location, plan info, and lifetime-total sub-selects. The sub-selects are cheap because they hit indexed columns (`user_id`, `status`).

#### `v_online_users`

Feeds the Admin Locations Map (§ 11.1). Joins `user_location_tracking` with `users` filtered to `status = 'active'`, sorted by online-first, then last-seen desc.

#### `v_daily_revenue`

Feeds the 30-day revenue line chart on the Admin Dashboard Overview (§ 9.2). Groups by day (in `Asia/Yangon`) and provides gross revenue, net revenue (only `approved` + `completed`), total discounts, and average order value.

#### `v_top_products`

Feeds the Admin + Reseller "Top Products" charts. Sorted by `sold_count DESC, rating_avg DESC` so both dashboards can just `LIMIT 10`.

#### `v_pending_admin_tasks`

Feeds the notification bell + alert cards on the Admin Dashboard. A single UNION returns counts (and oldest-created timestamps) for pending deposits, withdrawals, orders, KYCs, and reviews — 1 round-trip instead of 5.

#### `v_reseller_stats`

Feeds the Reseller Dashboard Overview (§ 10.2). Includes plan limits alongside actual usage counts so the "used / total" indicator can render without extra queries.

#### `v_order_detail`

Denormalised order detail with joined `users`, reseller, and promo. Reduces client round-trips for the Order Detail page.

#### `v_security_summary`

Feeds the "Threat Summary Cards" on the Security Logs page (§ 12.2). Groups by `event_type` and returns total / today / last-hour counts.

```sql
-- ============================================================
-- SECTION 23: HELPER VIEWS
-- ============================================================

-- ------------------------------------------------------------
-- v_user_summary — Admin Users List + User Detail
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_user_summary AS
SELECT
    u.id,
    u.username,
    u.email,
    u.phone,
    u.role,
    u.status,
    u.game_balance,
    u.full_name,
    u.avatar_url,
    u.email_verified,
    u.last_login_at,
    u.last_login_ip,
    u.registration_ip,
    u.created_at,
    u.referral_code,
    u.reseller_plan_id,
    u.reseller_plan_expires,
    ult.latitude,
    ult.longitude,
    ult.address     AS location_address,
    ult.city        AS location_city,
    ult.country     AS location_country,
    ult.platform    AS location_platform,
    ult.ip_address  AS location_ip,
    ult.is_online,
    ult.last_seen,
    ult.browser     AS location_browser,
    ult.os          AS location_os,
    ult.device_type AS location_device_type,
    (SELECT COUNT(*)               FROM orders           WHERE user_id = u.id)                                          AS total_orders,
    (SELECT COALESCE(SUM(total),0) FROM orders           WHERE user_id = u.id AND status IN ('approved','completed'))    AS total_spent,
    (SELECT COUNT(*)               FROM g2bulk_orders    WHERE user_id = u.id)                                          AS total_gstore_orders,
    (SELECT COUNT(*)               FROM deposit_requests WHERE user_id = u.id AND status = 'approved')                   AS total_deposits,
    (SELECT status                 FROM reseller_kyc     WHERE user_id = u.id)                                          AS kyc_status,
    (SELECT COUNT(*)               FROM vps_instances    WHERE assigned_user_id = u.id AND status != 'deleted')         AS vps_count,
    pp.name         AS reseller_plan_name
FROM users u
LEFT JOIN user_location_tracking ult ON ult.user_id = u.id
LEFT JOIN premium_plans           pp ON pp.id       = u.reseller_plan_id;

-- ------------------------------------------------------------
-- v_online_users — Admin Locations Map + Users table
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_online_users AS
SELECT
    u.id            AS user_id,
    u.username,
    u.email,
    u.avatar_url,
    u.role,
    u.status,
    ult.id          AS tracking_id,
    ult.latitude,
    ult.longitude,
    ult.accuracy,
    ult.address,
    ult.city,
    ult.township,
    ult.country,
    ult.country_code,
    ult.ip_address,
    ult.platform,
    ult.app_version,
    ult.browser,
    ult.os,
    ult.device_type,
    ult.is_online,
    ult.last_seen
FROM user_location_tracking ult
JOIN users u ON u.id = ult.user_id
WHERE u.status = 'active'
ORDER BY ult.is_online DESC, ult.last_seen DESC;

-- ------------------------------------------------------------
-- v_daily_revenue — Admin Dashboard 30-day revenue chart
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT
    DATE(created_at AT TIME ZONE 'Asia/Yangon')  AS date,
    COUNT(*)                                      AS order_count,
    SUM(total)                                    AS gross_revenue,
    SUM(CASE WHEN status IN ('approved','completed') THEN total ELSE 0 END) AS net_revenue,
    SUM(discount)                                 AS total_discounts,
    AVG(total)                                    AS avg_order_value
FROM orders
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at AT TIME ZONE 'Asia/Yangon')
ORDER BY date DESC;

-- ------------------------------------------------------------
-- v_top_products — Admin + Reseller Top Products chart
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_top_products AS
SELECT
    p.id,
    p.name_mm,
    p.name_en,
    p.main_image_url,
    p.price,
    p.sold_count,
    p.view_count,
    p.rating_avg,
    p.rating_count,
    p.stock,
    p.is_active,
    p.reseller_id,
    p.display_style,
    p.ribbon,
    c.name_mm   AS category_name,
    m.name_mm   AS menu_name,
    u.username  AS reseller_username
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN menus      m ON m.id = p.menu_id
LEFT JOIN users      u ON u.id = p.reseller_id
WHERE p.is_active = TRUE
ORDER BY p.sold_count DESC, p.rating_avg DESC;

-- ------------------------------------------------------------
-- v_pending_admin_tasks — dashboard alert cards
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_pending_admin_tasks AS
SELECT 'deposit'    AS task_type, COUNT(*) AS count, MIN(created_at) AS oldest FROM deposit_requests    WHERE status = 'pending'
UNION ALL
SELECT 'withdrawal',                COUNT(*),         MIN(created_at)          FROM withdrawal_requests WHERE status = 'pending'
UNION ALL
SELECT 'order',                     COUNT(*),         MIN(created_at)          FROM orders              WHERE status IN ('pending','pending_payment_review')
UNION ALL
SELECT 'kyc',                       COUNT(*),         MIN(created_at)          FROM reseller_kyc        WHERE status IN ('pending','under_review')
UNION ALL
SELECT 'review',                    COUNT(*),         MIN(created_at)          FROM reviews             WHERE is_approved = FALSE;

-- ------------------------------------------------------------
-- v_reseller_stats — Reseller Dashboard Overview
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_reseller_stats AS
SELECT
    u.id            AS reseller_id,
    u.username,
    u.reseller_plan_id,
    u.reseller_plan_expires,
    pp.name         AS plan_name,
    pp.max_menus,
    pp.max_categories,
    pp.max_products,
    pp.max_banners,
    (SELECT COUNT(*) FROM menus         WHERE reseller_id = u.id AND is_active = TRUE) AS used_menus,
    (SELECT COUNT(*) FROM categories    WHERE reseller_id = u.id AND is_active = TRUE) AS used_categories,
    (SELECT COUNT(*) FROM products      WHERE reseller_id = u.id AND is_active = TRUE) AS used_products,
    (SELECT COUNT(*) FROM banners       WHERE reseller_id = u.id AND is_active = TRUE) AS used_banners,
    (SELECT COUNT(*) FROM orders o      WHERE o.reseller_id = u.id)                    AS total_orders,
    (SELECT COALESCE(SUM(o.total),0) FROM orders o WHERE o.reseller_id = u.id AND o.status IN ('approved','completed')) AS total_revenue,
    (SELECT COUNT(*) FROM orders o      WHERE o.reseller_id = u.id AND o.status IN ('pending','pending_payment_review')) AS pending_orders,
    (SELECT COUNT(DISTINCT o.user_id) FROM orders o WHERE o.reseller_id = u.id)        AS total_customers
FROM users u
LEFT JOIN premium_plans pp ON pp.id = u.reseller_plan_id
WHERE u.role = 'reseller';

-- ------------------------------------------------------------
-- v_order_detail — denormalised order detail
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_order_detail AS
SELECT
    o.id, o.order_number, o.status,
    o.subtotal, o.discount, o.delivery_fee, o.tax, o.total,
    o.payment_method, o.payment_screenshot_url, o.payment_reference,
    o.promo_code_id,
    o.delivery_name, o.delivery_phone, o.delivery_address,
    o.delivery_city, o.delivery_township, o.delivery_note,
    o.tracking_number, o.admin_notes,
    o.created_at, o.updated_at, o.approved_at, o.completed_at, o.cancelled_at,
    o.rejected_reason,
    u.username    AS user_username,
    u.email       AS user_email,
    u.phone       AS user_phone,
    r.username    AS reseller_username,
    pc.code       AS promo_code,
    o.promo_discount
FROM orders o
LEFT JOIN users       u  ON u.id  = o.user_id
LEFT JOIN users       r  ON r.id  = o.reseller_id
LEFT JOIN promo_codes pc ON pc.id = o.promo_code_id;

-- ------------------------------------------------------------
-- v_security_summary — threat summary cards
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_security_summary AS
SELECT
    event_type,
    COUNT(*)                                                          AS total_count,
    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours')   AS today_count,
    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '1 hour')     AS last_hour_count,
    MAX(timestamp)                                                    AS last_occurred
FROM security_logs
GROUP BY event_type
ORDER BY today_count DESC;
```

---

### 21.25 Section 24 — Initial seed data

**Purpose.** Deliver a working install after a fresh migration. Every seed insert uses `ON CONFLICT DO NOTHING` (or `DO NOTHING` for legacy) so re-running the migration is safe.

Four seed sets are provided:

1. **Premium plans** — the five tiers (Free / Bronze / Silver / Gold / Platinum) with their limits pre-filled. Change the prices in the Admin Settings page after go-live if needed.
2. **Payment methods** — KBZ Pay / Wave Pay / AYA Pay / CB Pay / Bank Transfer / COD / Virtual Balance / Other. Admin edits phone number, QR-code image, and instructions per method after install.
3. **VPS OS templates** — Ubuntu 22.04 / 20.04, Debian 12 / 11, CentOS Stream 9, AlmaLinux 9, Rocky Linux 9. Image URL + checksum are filled in when admin uploads / mirrors an image.
4. **Global settings** — ~40 site-wide toggles (maintenance mode, delivery fee defaults, PIN attempts / lockouts, cache TTLs, homepage tile counts, retention windows).
5. **Cities** — 15 Myanmar cities with default `delivery_fee` and `delivery_days`. Admin refines and adds townships from Settings.

```sql
-- ============================================================
-- SECTION 24: INITIAL SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Premium plans (five tiers)
-- ------------------------------------------------------------
INSERT INTO premium_plans (
    name, slug, price, duration_days,
    max_menus, max_categories, max_products, max_banners, max_storage_mb,
    max_customers, analytics_access, priority_support,
    custom_domain, api_access, color, sort_order
) VALUES
    ('Free',     'free',     0,       30,  1,   5,    20,    2,   100,   100,   FALSE, FALSE, FALSE, FALSE, '#64748b', 0),
    ('Bronze',   'bronze',   15000,   30,  3,   15,   50,    5,   500,   500,   FALSE, FALSE, FALSE, FALSE, '#cd7f32', 1),
    ('Silver',   'silver',   30000,   30,  5,   30,   150,   10,  2000,  2000,  TRUE,  FALSE, FALSE, FALSE, '#94a3b8', 2),
    ('Gold',     'gold',     60000,   30,  10,  60,   400,   20,  5000,  10000, TRUE,  TRUE,  FALSE, FALSE, '#fbbf24', 3),
    ('Platinum', 'platinum', 120000,  30,  30,  200,  1000,  50,  20000, 99999, TRUE,  TRUE,  TRUE,  TRUE,  '#a855f7', 4)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- Payment methods
-- ------------------------------------------------------------
INSERT INTO payment_methods_config (
    method_key, display_name, is_active,
    is_deposit, is_withdrawal, sort_order,
    min_amount, max_amount
) VALUES
    ('kbz_pay',        'KBZ Pay',           TRUE,  TRUE,  TRUE,  0, 1000, 5000000),
    ('wave_pay',       'Wave Pay',          TRUE,  TRUE,  TRUE,  1, 1000, 5000000),
    ('aya_pay',        'AYA Pay',           TRUE,  TRUE,  TRUE,  2, 1000, 5000000),
    ('cb_pay',         'CB Pay',            TRUE,  TRUE,  TRUE,  3, 1000, 5000000),
    ('bank_transfer',  'Bank Transfer',     TRUE,  TRUE,  TRUE,  4, 5000, 10000000),
    ('cod',            'Cash on Delivery',  TRUE,  FALSE, FALSE, 5, 1000, 500000),
    ('virtual_balance','Virtual Balance',   TRUE,  FALSE, FALSE, 6, 100,  999999999),
    ('other',          'Other',             FALSE, TRUE,  FALSE, 7, 1000, 5000000)
ON CONFLICT (method_key) DO NOTHING;

-- ------------------------------------------------------------
-- VPS OS templates
-- ------------------------------------------------------------
INSERT INTO vps_os_templates (name, slug, version, arch, min_disk_gb, min_ram_gb, is_active, sort_order) VALUES
    ('Ubuntu 22.04 LTS', 'ubuntu-22.04',    '22.04', 'x86_64', 10, 1, TRUE, 0),
    ('Ubuntu 20.04 LTS', 'ubuntu-20.04',    '20.04', 'x86_64', 10, 1, TRUE, 1),
    ('Debian 12',        'debian-12',       '12',    'x86_64', 10, 1, TRUE, 2),
    ('Debian 11',        'debian-11',       '11',    'x86_64', 10, 1, TRUE, 3),
    ('CentOS Stream 9',  'centos-stream-9', '9',     'x86_64', 20, 2, TRUE, 4),
    ('AlmaLinux 9',      'almalinux-9',     '9',     'x86_64', 20, 2, TRUE, 5),
    ('Rocky Linux 9',    'rocky-9',         '9',     'x86_64', 20, 2, TRUE, 6)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- Global settings — ~40 keys
-- ------------------------------------------------------------
INSERT INTO settings (key, value, value_type, description, is_public) VALUES
    ('site_name',                 '"CR7 Game Shop"',                                                'string',  'Website display name',                       TRUE),
    ('site_logo_url',             '"/assets/logo.svg"',                                             'string',  'Logo SVG path',                              TRUE),
    ('site_contact_phone',        '"+95 9xxxxxxxxx"',                                               'string',  'Contact phone number',                       TRUE),
    ('site_contact_email',        '"contact@cr7game.shop"',                                         'string',  'Contact email',                              TRUE),
    ('maintenance_mode',          'false',                                                          'boolean', 'Toggle site maintenance mode',               FALSE),
    ('maintenance_message',       '"ကျွနုပ်တို့ ဝက်ဘ်ဆိုဒ်ကို ယာယီ ပြုပြင်နေပါသည်"',                   'string',  'Maintenance message (fallback string)',      TRUE),
    ('delivery_fee_default',      '1500',                                                           'number',  'Default delivery fee (MMK)',                 FALSE),
    ('delivery_fee_free_over',    '50000',                                                          'number',  'Free delivery over this amount (MMK)',       FALSE),
    ('min_deposit_amount',        '1000',                                                           'number',  'Minimum deposit amount (MMK)',               FALSE),
    ('max_deposit_amount',        '5000000',                                                        'number',  'Maximum deposit amount (MMK)',               FALSE),
    ('min_withdrawal_amount',     '5000',                                                           'number',  'Minimum withdrawal amount (MMK)',            FALSE),
    ('max_withdrawal_amount',     '1000000',                                                        'number',  'Maximum withdrawal amount (MMK)',            FALSE),
    ('order_auto_cancel_hours',   '24',                                                             'number',  'Auto-cancel unpaid orders after N hours',    FALSE),
    ('gstore_pin_max_attempts',   '5',                                                              'number',  'Transaction PIN max wrong attempts',         FALSE),
    ('gstore_pin_lockout_seconds','60',                                                             'number',  'Transaction PIN lockout duration (seconds)', FALSE),
    ('login_max_attempts',        '5',                                                              'number',  'Login max failed attempts',                  FALSE),
    ('login_lockout_seconds',     '60',                                                             'number',  'Login lockout duration (seconds)',           FALSE),
    ('signup_captcha_enabled',    'true',                                                           'boolean', 'Enable CAPTCHA on signup',                   FALSE),
    ('location_update_interval',  '30000',                                                          'number',  'Location tracking interval (ms)',            FALSE),
    ('map_auto_refresh_ms',       '30000',                                                          'number',  'Admin map refresh interval (ms)',            FALSE),
    ('youtube_cache_ttl_hours',   '6',                                                              'number',  'YouTube cache TTL (hours)',                  FALSE),
    ('nominatim_cache_days',      '30',                                                             'number',  'Nominatim cache TTL (days)',                 FALSE),
    ('ip_geo_cache_days',         '7',                                                              'number',  'IP geo cache TTL (days)',                    FALSE),
    ('max_cart_items',            '20',                                                             'number',  'Max items in cart',                          FALSE),
    ('max_cart_quantity',         '100',                                                            'number',  'Max quantity per cart item',                 FALSE),
    ('review_require_purchase',   'true',                                                           'boolean', 'Only allow review after purchase',           FALSE),
    ('reseller_kyc_auto_notify',  'true',                                                           'boolean', 'Auto-notify on KYC status change',           FALSE),
    ('vps_max_instances',         '10',                                                             'number',  'Max VPS instances per physical server',      FALSE),
    ('vps_agent_port',            '7777',                                                           'number',  'VPS agent port',                             FALSE),
    ('g2bulk_auto_retry_count',   '3',                                                              'number',  'G2Bulk order auto-retry attempts',           FALSE),
    ('g2bulk_retry_delay_ms',     '5000',                                                           'number',  'G2Bulk retry delay (ms)',                    FALSE),
    ('free_plan_menu_limit',      '1',                                                              'number',  'Free plan menu limit (reseller)',            FALSE),
    ('security_log_retention_days','90',                                                            'number',  'Security log retention (days)',              FALSE),
    ('location_history_days',     '30',                                                             'number',  'Location history retention (days)',          FALSE),
    ('vps_metrics_days',          '7',                                                              'number',  'VPS metrics retention (days)',               FALSE),
    ('banner_home_max',           '5',                                                              'number',  'Max banners on home page',                   FALSE),
    ('homepage_featured_count',   '6',                                                              'number',  'Featured products on home page',             TRUE),
    ('homepage_news_count',       '4',                                                              'number',  'Latest news on home page',                   TRUE),
    ('homepage_youtube_count',    '4',                                                              'number',  'YouTube videos on home page',                TRUE),
    ('homepage_reviews_count',    '6',                                                              'number',  'Reviews on home page',                       TRUE),
    ('search_min_chars',          '2',                                                              'number',  'Minimum characters to trigger search',       FALSE),
    ('search_max_results',        '10',                                                             'number',  'Max search results per category',            FALSE)
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------
-- Cities (15 Myanmar major cities / capitals)
-- ------------------------------------------------------------
INSERT INTO cities (state, name, name_mm, delivery_fee, delivery_days, is_active, sort_order) VALUES
    ('Yangon Region',             'Yangon',      'ရန်ကုန်',        1500, 1, TRUE, 0),
    ('Mandalay Region',           'Mandalay',    'မန္တလေး',         2500, 2, TRUE, 1),
    ('Naypyidaw Union Territory', 'Naypyidaw',   'နေပြည်တော်',    2500, 2, TRUE, 2),
    ('Sagaing Region',            'Sagaing',     'စစ်ကိုင်း',       3000, 3, TRUE, 3),
    ('Bago Region',               'Bago',        'ပဲခူး',          2000, 2, TRUE, 4),
    ('Magway Region',             'Magway',      'မကွေး',          3000, 3, TRUE, 5),
    ('Ayeyarwady Region',         'Pathein',     'ပုသိမ်',         2500, 2, TRUE, 6),
    ('Mon State',                 'Mawlamyine',  'မော်လမြိုင်',     3000, 3, TRUE, 7),
    ('Kayah State',               'Loikaw',      'လိုင်ကော်',       4000, 4, TRUE, 8),
    ('Kayin State',               'Hpa-an',      'ဘားအံ',          3500, 3, TRUE, 9),
    ('Chin State',                'Hakha',       'ဟားခါး',         5000, 5, TRUE, 10),
    ('Kachin State',              'Myitkyina',   'မြစ်ကြီးနား',     4500, 4, TRUE, 11),
    ('Shan State',                'Taunggyi',    'တောင်ကြီး',       3500, 3, TRUE, 12),
    ('Rakhine State',             'Sittwe',      'စစ်တွေ',          4000, 4, TRUE, 13),
    ('Tanintharyi Region',        'Dawei',       'ထားဝယ်',          4000, 4, TRUE, 14)
ON CONFLICT DO NOTHING;
```

---

### 21.26 Section 25 — Scheduled maintenance (pg_cron compatible)

**Purpose.** Housekeeping cron jobs. Two options are provided:

- **Option A: `pg_cron`** — if the Supabase project has `pg_cron` enabled, uncomment the `cron.schedule(...)` block. This is the preferred route because it runs in-database and cannot miss a run just because Vercel is down.
- **Option B: Vercel Cron** — an alternative implementation using Vercel's serverless cron. Each cron pings `/api/cron?key=<CRON_SECRET>&task=<task_name>`, and `api/cron.js` dispatches to the appropriate RPC. Use this if `pg_cron` is unavailable.

Scheduled tasks and their cadence:

| Task | Cadence | RPC called |
|---|---|---|
| Clean up expired sessions | Every hour, on the hour | `cleanup_expired_sessions()` |
| Update user online status | Every minute | `update_user_online_status()` |
| Auto-cancel old unpaid orders | Every 2 hours | `auto_cancel_old_orders(24)` |
| Purge old security logs | Daily at 03:00 | `purge_old_security_logs(90)` |
| Purge old location history | Daily at 04:00 | `purge_old_location_history(30)` |
| Purge old VPS metrics | Daily at 05:00 | `purge_old_vps_metrics(7)` |
| Purge nominatim cache | Weekly (Sunday 06:00) | `DELETE FROM nominatim_cache WHERE cached_at < NOW() - INTERVAL '30 days'` |

```sql
-- ============================================================
-- SECTION 25: SCHEDULED MAINTENANCE (pg_cron compatible)
-- ============================================================
-- OPTION A — pg_cron  (uncomment if pg_cron is enabled)
/*
SELECT cron.schedule('cleanup-expired-sessions',   '0 * * * *',   $$SELECT cleanup_expired_sessions()$$);
SELECT cron.schedule('update-online-status',       '* * * * *',   $$SELECT update_user_online_status()$$);
SELECT cron.schedule('auto-cancel-old-orders',     '0 */2 * * *', $$SELECT auto_cancel_old_orders(24)$$);
SELECT cron.schedule('purge-security-logs',        '0 3 * * *',   $$SELECT purge_old_security_logs(90)$$);
SELECT cron.schedule('purge-location-history',     '0 4 * * *',   $$SELECT purge_old_location_history(30)$$);
SELECT cron.schedule('purge-vps-metrics',          '0 5 * * *',   $$SELECT purge_old_vps_metrics(7)$$);
SELECT cron.schedule('purge-nominatim-cache',      '0 6 * * 0',   $$DELETE FROM nominatim_cache WHERE cached_at < NOW() - INTERVAL '30 days'$$);
*/

-- OPTION B — Vercel Cron
-- Configure vercel.json crons to POST /api/cron?key=<CRON_SECRET>&task=<task_name>
-- See api/cron.js for dispatch table.
```

---

### 21.27 Section 26 — Grant permissions (anon + authenticated roles)

**Purpose.** Explicitly grant the two client-side roles the minimum set of privileges they need.

- **`authenticated`** may `EXECUTE` the safe RPCs (`update_user_balance`, `apply_promo_code`, `check_reseller_limits`, `get_user_balance_safe`, `increment_product_view`, `get_dashboard_stats`, `recalculate_product_rating`). The functions themselves enforce RLS-like checks (e.g. `get_user_balance_safe` verifies `status='active'`).
- **`anon`** (non-logged-in) may `SELECT` from the public-catalogue tables (menus, categories, products, product_variants, banners, news, reviews, premium_plans, payment_methods_config, cities, townships, youtube_videos_cache) *and* `EXECUTE increment_product_view` (so page views are still counted even for logged-out visitors).
- Every other privilege is implicitly denied — including any function not listed here. If a new RPC is added later, remember to `GRANT EXECUTE` on it.

```sql
-- ============================================================
-- SECTION 26: GRANT PERMISSIONS
-- ============================================================

-- Authenticated users may EXECUTE these safe RPCs
GRANT EXECUTE ON FUNCTION update_user_balance         TO authenticated;
GRANT EXECUTE ON FUNCTION apply_promo_code            TO authenticated;
GRANT EXECUTE ON FUNCTION check_reseller_limits       TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_balance_safe       TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_view      TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats         TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_product_rating  TO authenticated;

-- Anonymous users may SELECT the public catalogue
GRANT SELECT ON menus                  TO anon;
GRANT SELECT ON categories             TO anon;
GRANT SELECT ON products               TO anon;
GRANT SELECT ON product_variants       TO anon;
GRANT SELECT ON banners                TO anon;
GRANT SELECT ON news                   TO anon;
GRANT SELECT ON reviews                TO anon;
GRANT SELECT ON premium_plans          TO anon;
GRANT SELECT ON payment_methods_config TO anon;
GRANT SELECT ON cities                 TO anon;
GRANT SELECT ON townships              TO anon;
GRANT SELECT ON youtube_videos_cache   TO anon;
GRANT EXECUTE ON FUNCTION increment_product_view TO anon;

-- ============================================================
-- END OF SCHEMA
-- Total surface area:
--   • 40+ tables
--   • 25+ RPC functions
--   • 30+ triggers
--   • 60+ RLS policies
--   • 1  Realtime publication (11 tables)
--   • 10+ helper views
--   • Seed data for plans / payment methods / OS templates / settings / cities
--   • 7  scheduled maintenance tasks
-- ============================================================
```

---
## Part 22 — Build Order & Delivery Manifesto

This is the operating manual for the implementing team. It tells you *in what order* to build, *what invariants* must never be violated, and *what to deliver* at the end.

### 22.1 Build sequence (sequential — no confirmation between steps)

Build in seven phases. Do not skip ahead. Each phase depends on the phases above it.

```
Phase 1 — Foundation
  1.1  package.json                       (dependencies + scripts)
  1.2  vercel.json                        (routes, headers, functions)
  1.3  middleware.js                      (per-hostname routing)
  1.4  robots.txt, sitemap.xml
  1.5  404.html
  1.6  /assets/icons.svg                  (SVG sprite — every icon in one file)
  1.7  /assets/bg-*.svg                   (pattern backgrounds)
  1.8  /assets/logo.svg

Phase 2 — Database (Part 21, all sections in order)
  2.1  Extensions + ENUMs                 (Sections 1–2)
  2.2  Core tables                        (Sections 3–5)
  2.3  Content tables                     (Section 6)
  2.4  Cart + orders + G Store            (Sections 7–8)
  2.5  Transactions + payments            (Section 9)
  2.6  Promo codes                        (Section 10)
  2.7  News + reviews                     (Section 11)
  2.8  Notifications + tracking + logs    (Sections 12–14)
  2.9  VPS management                     (Section 15)
  2.10 YouTube cache + settings + wishlist(Sections 16–18)
  2.11 Functions                          (Section 19)
  2.12 Triggers                           (Section 20)
  2.13 RLS policies                       (Section 21)
  2.14 Realtime publications              (Section 22)
  2.15 Helper views                       (Section 23)
  2.16 Seed data                          (Section 24)
  2.17 Scheduled jobs                     (Section 25)
  2.18 GRANT permissions                  (Section 26)

Phase 3 — API layer (10 files under api/)
  3.1  api/supabase.js                    (client factory + RPC helpers)
  3.2  api/auth.js                        (login / signup / session / IP filter / exchange tokens)
  3.3  api/admin-action.js                (all admin mutations — ADMIN_APPROVE_PASSWORD gate)
  3.4  api/balance.js                     (deposit / withdrawal / RPC wrapper)
  3.5  api/location.js                    (geo save + Nominatim reverse geocode)
  3.6  api/imgbb.js                       (upload + masking proxy)
  3.7  api/g2bulk-v1.js                   (topup)
  3.8  api/g2bulk-v2.js                   (gift cards)
  3.9  api/youtube.js                     (channel videos with 5-min cache)
  3.10 api/vps.js                         (VPS agent proxy + WebSocket for terminal)

Phase 4 — Users Dashboard (21 files)
  4.1  index.html                         (shell)
  4.2  css/index/01-base.css … 10-responsive.css
  4.3  js/index/01-core.js … 10-news-reseller-link.js

Phase 5 — Reseller Dashboard (13 files)
  5.1  reseller.html
  5.2  css/reseller/01-base.css … 06-animations.css
  5.3  js/reseller/01-core.js … 06-analytics.js

Phase 6 — Admin Dashboard (21 files)
  6.1  admin.html
  6.2  css/admin/01-base.css … 10-animations.css
  6.3  js/admin/01-core.js … 10-vps-panel.js

Phase 7 — QA checklist (see 22.3)
  7.1  Manual smoke test — every page, every flow, every state
  7.2  Security audit — F12 block, balance hack attempt, IP filter, rate limits
  7.3  Performance check — Lighthouse mobile score > 90
  7.4  Realtime test — two browsers side-by-side (Admin + User) confirming live updates
  7.5  VPS agent connection test — install script → agent handshake → terminal open
```

**Why this order.** Foundation first because middleware / assets are required by every page. Database second because API code depends on the schema being live. API third because the client depends on the routes. The three dashboards are ordered Users → Reseller → Admin because the Users Dashboard is the biggest and its patterns (buttons, cards, modals) are reused by the other two.

### 22.2 Absolute constraints (zero tolerance)

These are the invariants the reviewer will check first. Violating any of them is grounds for rejection of the entire build.

| # | Constraint | Where it's enforced |
|---:|---|---|
| 1 | JavaScript file ≤ 5,000 lines | Reviewer runs `wc -l js/**/*.js`. Any file over the limit → split into sub-modules. |
| 2 | CSS file ≤ 3,000 lines | Same check. |
| 3 | ≤ 10 files per folder | Restructure into sub-folders if exceeded. |
| 4 | Zero features omitted | Every section in this prompt must be present in the code. |
| 5 | Zero `TODO` / `// implement later` / stub placeholders | Grep the whole repo. |
| 6 | Zero emoji anywhere in the code / UI | Grep for common emoji ranges. SVG icons only. |
| 7 | Zero inline `<style>` / `<script>` blocks in HTML | Grep. Only `<link>` and `<script type="module" src=…>` allowed. |
| 8 | Zero hard-coded secrets in the repo | `process.env.*` only, server-side only. |
| 9 | Zero client-side API keys | Server proxies every third-party call. |
| 10 | Every admin mutation requires `ADMIN_APPROVE_PASSWORD` | Server-side validated in `api/admin-action.js`. |
| 11 | Real endpoints (G2Bulk / Supabase / YouTube) — no mocks | Reviewer inspects `api/*.js`. |
| 12 | Fixed topbar + bottom nav — never hide, never animate away | Grep for `window.addEventListener('scroll',` that touches these bars. |
| 13 | Native browser geolocation only — no fake "please allow" UI | Reviewer checks `js/index/02-location-gate.js`. |
| 14 | Clipped + animated buttons everywhere | Every `.btn` uses `clip-path` and the shine animation. |
| 15 | SVG pattern backgrounds on sections — no plain flat backgrounds | Reviewer inspects the CSS. |
| 16 | App-grade UI — dark theme + glassmorphism + glow | The design tokens from Part 16 must be used unmodified. |
| 17 | 5 states designed per component (Loading / Empty / Success / Error / Interactive) | Reviewer opens each list in dev tools and forces each state. |
| 18 | Two-step confirm modal + Admin Password on every destructive action | Reviewer clicks every red button on Admin. |
| 19 | Balance changes via `update_user_balance()` RPC only | Trigger `prevent_direct_balance_edit` guards; a rejection is easy to trigger from the SQL editor and must show `BALANCE_DIRECT_EDIT_FORBIDDEN`. |
| 20 | RLS enabled on every user-data table | Reviewer runs `\dp` in psql; every listed table must show `+ROW LEVEL SECURITY`. |

### 22.3 Testing checklist (per domain)

Every checkbox below must be visibly passing before delivery.

#### Users Domain (`cr7game.shop`)

- [ ] Location permission gate blocks every other module until permission is granted.
- [ ] Signup with slider-CAPTCHA succeeds; a second signup with the same email is refused with `SIGNUP_EMAIL_EXISTS`.
- [ ] Wrong login 5 times → user is locked out for 60 seconds; the toast shows the remaining time counting down.
- [ ] Home page renders every section (Banner carousel, Menus, Featured products, News, YouTube, Reviews) — no missing block.
- [ ] Menu tile click → full-page navigation to Menu Detail (categories grid).
- [ ] Category card click → full-page navigation to Category Detail; products render in the correct `display_style` per product.
- [ ] Product card click → Product Detail with gallery, description, variants, quantity selector, reviews, and fixed bottom action bar.
- [ ] Add to Cart triggers the fly-to-cart animation and updates the badge with the bounce animation.
- [ ] Cart page: quantity change is optimistic + debounced-saved; delete is soft-delete + Undo toast.
- [ ] Checkout works for every enabled payment method (balance / KBZ / Wave / AYA / CB / COD).
- [ ] Order Detail shows the vertical status timeline with the correct entries.
- [ ] G Store deposit modal → screenshot upload → server accepts → status shows pending → admin approves → user's balance card animates the new value in-place.
- [ ] G Store topup: player-ID verification → PIN modal → server processes → G2Bulk order ID displayed on success screen.
- [ ] G Store gift card: PIN modal → server processes → redemption code shown (with Reveal + Copy).
- [ ] G2Bulk failure path: automatic refund via RPC, `MESSAGES.GSTORE_ORDER_FAILED_REFUND` toast appears.
- [ ] Profile → Edit avatar / bio works. KYC application form submits with all three photos.
- [ ] Approved KYC user sees the "Reseller Dashboard" link in the avatar dropdown; clicking it uses the exchange-token flow.
- [ ] Production F12 is blocked; right-click menu is disabled; non-input text cannot be selected.
- [ ] Topbar and bottom nav never move on scroll (verify by scrolling on the longest page — Home).

#### Admin Domain (`cr7adminpanel.vercel.app`)

- [ ] Request from a non-allow-listed IP → `404.html` + a `security_logs` row with `event_type='ADMIN_IP_BLOCKED'`.
- [ ] `ADMIN_IPADDRESS` env unset → the IP-setup screen is shown (with copy-IP button + Vercel instructions).
- [ ] Slider CAPTCHA + password login uses `crypto.timingSafeEqual`; three wrong attempts triggers the exponential-backoff cooldown.
- [ ] Session cookie is `HttpOnly; Secure; SameSite=Strict`.
- [ ] Dashboard Overview shows stat cards, revenue chart, orders chart, recent orders, recent signups.
- [ ] Users List → filters work → click a row → Per-User Detail loads with all seven tabs (Overview, Orders, G Store, Balance, IP History, VPS).
- [ ] Balance add / deduct on User Detail requires the admin-password modal and calls `update_user_balance()`; the ledger tab immediately shows the new row.
- [ ] Orders: Approve, Reject (with reason), Refund — each opens the admin-password modal; the Users Dashboard receives the realtime status update.
- [ ] Menus / Categories / Products / Banners: create, edit, drag-drop reorder, delete — all work.
- [ ] Product editor covers all four display styles + variants + the gallery upload.
- [ ] G2Bulk Sync: import products, assign to a category, set the price markup — one full round trip visible.
- [ ] Deposit + withdrawal approvals correctly call `update_user_balance()`; user's balance card updates via realtime.
- [ ] Promo codes: create + apply + usage list.
- [ ] News CMS with rich-text editor produces sanitised HTML.
- [ ] Reviews moderation flips visibility.
- [ ] Reseller KYC approval flips `users.role` to `'reseller'` and notifies the user.
- [ ] Premium Plans management round-trip.
- [ ] Locations Map: markers appear live via Realtime; the 30-second interval refresh also works (test by unplugging network briefly). Marker click → right-side slide-in panel with all sections.
- [ ] Security Logs: threat summary cards + event-type filter + IP + country flag.
- [ ] VPS Panel: all seven tabs work (Overview, Instances, Create wizard, Physical Server, Setup Wizard). Terminal opens over WebSocket and renders correctly in xterm.js.
- [ ] Agent connection ping shows latency in the Physical Server tab.
- [ ] Every mutation triggers the admin-password modal — no exceptions.

#### Reseller Domain (`reselleradmin.vercel.app`)

- [ ] Login: Gmail + password succeeds only when `users.role='reseller'` **and** `reseller_kyc.status='approved'`.
- [ ] `role='user'` login → error `RESELLER_NOT_ROLE` with a link to apply for KYC.
- [ ] KYC pending → error `RESELLER_KYC_PENDING` with a friendly countdown.
- [ ] Exchange token from Users Domain is consumed once and produces a valid reseller session.
- [ ] Reseller Overview: own sales, own customers, plan status card.
- [ ] My Menus / Categories / Products / Banners: only own rows visible (RLS-enforced); create is refused past the plan limit.
- [ ] The usage indicator ("5 / 100 products") is accurate; when at the limit, the `+ Add` button becomes `Upgrade plan`.
- [ ] Reseller Orders shows only orders whose products belong to this reseller.
- [ ] Analytics charts render with real data.
- [ ] Plan upgrade: pay → admin approves → limits update instantly.
- [ ] Reseller mutations (approve / reject own orders) require the **reseller's transaction PIN**, not the admin password.

### 22.4 Delivery format

The delivery bundle must contain:

- **`schema.sql`** — the complete Part 21 SQL, top to bottom, ready to paste into Supabase's SQL Editor.
- **Full project archive** (zip or tar.gz) with the exact directory structure from Part 3.
- **`README.md`** with:
  - One-line description
  - Prerequisites (Node version, Supabase project, ImgBB key, G2Bulk key, YouTube Data API v3 key)
  - Local setup (`npm install`, env file example, `vercel dev`)
  - Production deploy (Vercel domains configuration, environment variables, DNS records)
  - VPS agent install (curl-pipe-bash one-liner + fingerprint verification)
  - Post-deploy QA checklist (this Part 22.3)
- **`ENV.example`** — the full list from Part 2, all keys, no values.
- **`CHANGELOG.md`** — versioned; the initial version is `v1.0.0`.
- **No placeholders** anywhere. `grep -r 'TODO\|FIXME\|XXX\|// implement' src/ api/` must return zero matches.

### 22.5 Non-negotiable deliverables

The implementing developer / AI must produce **all** of the following, without omission:

1. **Every file listed in Part 3** — with the exact path and respecting the line-count limits (Rule 8).
2. **Every page listed in Parts 8, 9, 10** — with all five states designed (Loading / Empty / Success / Error / Interactive).
3. **Every modal, popup, dropdown** described in this document — fully designed and animated.
4. **Every SQL table, function, trigger, RLS policy, index, view, seed row** from Part 21.
5. **Every toast message key** from Part 17.2 — used at the correct call sites; no ad-hoc strings.
6. **Every design rule** from Part 16 — fixed bars, clipped buttons, glassmorphism cards, SVG pattern backgrounds.
7. **Every security measure** from Parts 5, 6, 15, 20 — F12 block on Users Dashboard, balance RPC + trigger, IP filter, rate limits, CORS, encryption at rest for VPS credentials.

---

# ✅ End of Master Specification — v2.0 (Full English Edition)

**What this rewrite improves over the original Burmese draft:**

1. ⭐ **Every part rewritten in fluent English** — no mixed-language sections, no untranslated notes.
2. ⭐ **Users Dashboard, complete page-by-page contract** — Home → Menu Detail → Category Detail → Product Detail → Cart → Checkout → Orders List → Order Detail → Profile → KYC → My VPS → Global Search (all 12+ pages, each with layout diagram, data flow, all five states).
3. ⭐ **Admin Dashboard, complete page-by-page contract** — Dashboard Overview, Users List + Per-User Detail (with all seven tabs), Orders, CMS (Menus / Categories / Products / Banners), G2Bulk Sync, Deposit / Withdrawal, Promo Codes, News, Reviews, Reseller KYC, Premium Plans, Locations Map, Security Logs, VPS Panel (all seven tabs), Settings.
4. ⭐ **Reseller Dashboard, complete contract** — Overview, plan-limited CMS, own-shop Orders, Analytics, Premium Plan upgrade.
5. ⭐ **Four product display styles fully documented** — GRID_CARD, LIST_HORIZONTAL, FEATURED_LARGE, COMPACT_MASONRY.
6. ⭐ **Every state designed** — Loading (skeleton matching final layout), Empty (SVG illustration + CTA), Success (as-designed render), Error (retry button + reference), Interactive (hover / active / focus / disabled).
7. ⭐ **Complete database schema** — 40+ tables, 25+ RPC functions, 30+ triggers, 60+ RLS policies, 1 Realtime publication (11 tables), 10+ helper views, seed data for plans / payment methods / OS templates / settings / cities, 7 scheduled maintenance jobs, GRANT statements — every entity documented in English with purpose / relationships / index rationale.
8. ⭐ **Anti-enumeration auth** — identical error messages for "wrong password" and "user not found".
9. ⭐ **Two-step destructive confirmation** — modal + admin password on every destructive action.
10. ⭐ **Rate limits per endpoint** — explicit numbers per API route (Part 20.2).
11. ⭐ **Realtime channels enumerated** — orders, order_status_history, g2bulk_orders, transactions, notifications, user_location_tracking, deposit_requests, withdrawal_requests, vps_instances, reseller_kyc, g2bulk_balance_log.
12. ⭐ **Comprehensive per-domain QA checklist** — every feature, every flow, every state, every security check.

**Build command to the implementing AI / developer:**

> Build the site described above, in the order given in Part 22.1, without omitting a single feature, page, state, table, function, trigger, policy, view, or seed row. Respect every constraint in Part 22.2. Verify every checkbox in Part 22.3 before delivery. Deliver the artefacts in Part 22.4 with zero placeholders.

