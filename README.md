# Caicai — Frontend

React SPA for [Caicai](https://caicai.app), a weight management and nutrition tracking web app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 with custom `@theme` variables |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Date handling | date-fns |
| Hosting | AWS S3 + CloudFront |
| CI/CD | GitHub Actions → S3 → CloudFront invalidation |

---

## Local Setup

### Prerequisites

- Node 20+

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

```env
VITE_API_URL=http://localhost:8080
```

> Vite bakes env vars at compile time. `.env.local` is gitignored. Never commit secrets.
>
> In local dev the Vite dev server proxies `/api/*` to `http://localhost:8080` automatically (configured in `vite.config.js`), so `VITE_API_URL` is only needed for production builds.

### 3. Run

```bash
npm run dev
```

The app runs on `http://localhost:5173`. The backend must also be running — see the [backend repo](https://github.com/your-org/caicai-backend).

---

## Environment Variables (Production)

| Variable | Description |
|---|---|
| `VITE_API_URL` | The CloudFront distribution URL (e.g. `https://xxx.cloudfront.net`) |

This is the only env var. It is passed to the build via GitHub Actions secrets and baked into the bundle at compile time.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shared components used across pages
│   │   ├── AuthShell.jsx
│   │   ├── Button.jsx
│   │   ├── CalorieRing.jsx
│   │   ├── DatePicker.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FilterPills.jsx
│   │   ├── FoodItemCard.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MacroBadge.jsx
│   │   ├── Pagination.jsx
│   │   ├── PageHeader.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── RadioCard.jsx
│   │   ├── SessionExpiredModal.jsx
│   │   └── StatCard.jsx
│   ├── layout/             # App shell, navigation
│   │   ├── AppShell.jsx
│   │   ├── BottomNav.jsx
│   │   ├── MobileHeader.jsx
│   │   └── Sidebar.jsx
│   └── water/
│       └── WaterModal.jsx
├── context/
│   └── AuthContext.jsx     # Auth state + current user
├── pages/
│   ├── auth/               # Login, Register, ForgotPassword, ResetPassword, Verify
│   ├── onboarding/         # 3-step onboarding flow + AI goal suggestion
│   ├── dashboard/          # Daily summary, macros, water, weight trend
│   ├── food-log/           # Food search, log entries, favourites, copy day
│   ├── favourites/         # Favourite foods list
│   ├── ai/                 # AI goal re-suggestion
│   ├── settings/           # Account settings (password, delete account)
│   └── profile/            # Read-only profile (stats, goals, personal details)
├── apiClient.js            # Single HTTP wrapper — all API calls go through this
└── App.jsx                 # Routes + auth guards
```

---

## Key Conventions

### apiClient
All API calls go through `src/apiClient.js`. Never use raw `fetch` in components.

```javascript
// Always named import — never default
import { apiClient } from '@/apiClient'

// apiClient unwraps the envelope automatically
// Never do res.data — use res directly
const user = await apiClient('/api/users/me')
```

Errors are thrown with a consistent shape:

```javascript
try {
  await apiClient('/api/logs', { method: 'POST', body })
} catch (err) {
  if (err.fieldErrors) setFieldErrors(err.fieldErrors)  // validation errors
  else setError(err.message)                             // general error
}
```

### Path alias
`@` maps to `src/`. Always use it — never use relative `../../` imports.

```javascript
import Button from '@/components/ui/Button'
```

### Design tokens
Colors and spacing come from Tailwind `@theme` variables defined in `src/index.css`. Never hardcode hex values in components. Use the token classes (`text-green`, `bg-bg-card`, `border-border`, etc.).

Locked color assignments — never deviate:
- **Protein** → purple (`#a855f7`)
- **Carbs** → orange
- **Fat** → yellow/amber
- **Water** → blue (`#3b82f6`)
- **Calories / primary action** → green (`#10b981`)

### Mobile-first layout
The app uses a bottom nav on mobile and a left sidebar on desktop (`md:` breakpoint). `AppShell` handles this split — pages never manage their own navigation.

Mobile header is fixed at `h-14`. All page content has `pt-14` to clear it.

---

## Routes

| Path | Page | Auth required |
|---|---|---|
| `/login` | Login | No |
| `/register` | Register | No |
| `/forgot-password` | Forgot Password | No |
| `/reset-password` | Reset Password | No |
| `/verify` | Email Verification | No |
| `/onboarding` | Onboarding flow | Yes (no shell) |
| `/dashboard` | Dashboard | Yes |
| `/log` | Food Log | Yes |
| `/favourites` | Favourite Foods | Yes |
| `/ai` | AI Goals | Yes |
| `/settings` | Settings | Yes |
| `/profile` | Profile | Yes |

Unauthenticated users are redirected to `/login`. Authenticated users hitting auth pages are redirected to `/dashboard` or `/onboarding` depending on onboarding status.

---

## Deployment

Deployment is automatic on push to `main` via GitHub Actions.

The pipeline:
1. Builds the app with `npm run build` (injects `VITE_API_URL` from GitHub secrets)
2. Syncs `dist/` to S3 bucket `caicai-frontend` with `--delete`
3. Invalidates the CloudFront distribution cache

### Manual deploy (if needed)

```bash
npm run build

aws s3 sync dist/ s3://caicai-frontend --delete

aws cloudfront create-invalidation \
  --distribution-id <your-distribution-id> \
  --paths "/*"
```

---

## AWS Infrastructure

| Service | Purpose |
|---|---|
| S3 (`caicai-frontend`) | Hosts the built static files |
| CloudFront | CDN, HTTPS, SPA routing, and API proxy |

CloudFront is configured with two behaviours:
- `/*` → S3 (serves the React app)
- `/api/*` → EC2:8080 (proxies API requests)

The API proxy exists because the frontend is served over HTTPS but EC2 runs over HTTP. Browsers block mixed content. CloudFront handles the HTTPS termination and proxies `/api/*` to EC2 internally — no SSL cert needed on EC2.

---

## Related Repos

- **Backend:** [caicai-backend](https://github.com/your-org/caicai-backend) — Spring Boot 3, Java 17, PostgreSQL