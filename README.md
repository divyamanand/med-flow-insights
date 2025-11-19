# Hospital Client

A React + TypeScript app powered by Vite, with ESLint, Prettier, Vitest, and React Router.

## Prerequisites
- Node.js 18+ and npm

## Quick Start (Windows PowerShell)
```powershell
# From the project root
npm install
npm run dev
```

Open the URL shown (typically http://localhost:5173).

## Scripts
- `npm run dev`: Start the Vite dev server
- `npm run build`: Type-check and build for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint
- `npm run format`: Format with Prettier
- `npm run test`: Run unit tests once
- `npm run test:watch`: Run unit tests in watch mode
- `npm run typecheck`: Type-check the project

## Env Vars
Create a `.env` file based on `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```
Access in code via `import.meta.env.VITE_API_BASE_URL`.

## Project Structure
- `src/` app source (components, routes, styles)
- `index.html` Vite HTML entry
- `vite.config.ts` Vite configuration
- `eslint.config.js` ESLint flat config
- `vitest.config.ts` Unit test config (jsdom)

## Testing
```powershell
npm run test
```

## Build
```powershell
npm run build
npm run preview
```

## Deployment (Vercel)
For client-side routing (React Router) on Vercel you must ensure all non-file paths rewrite to `index.html` so deep links do not 404. Additionally, to avoid mixed-content errors when your site is served over HTTPS, proxy API calls through the same origin using rewrites.

This project includes a `vercel.json` with SPA fallback and an API proxy:

```json
{
	"version": 2,
	"buildCommand": "npm run build",
	"outputDirectory": "dist",
	"rewrites": [
		{ "source": "/api/(.*)", "destination": "http://13.201.19.12/$1" }
	],
	"routes": [
		{ "handle": "filesystem" },
		{ "src": "/.*", "dest": "/index.html" }
	]
}
```

Deployment steps:
```powershell
# 1. Build locally (optional)
npm run build

# 2. Push to GitHub; connect repo in Vercel dashboard
#    Framework preset: Other / Vite
#    Build Command:    npm run build
#    Output Directory: dist

# 3. Set environment variables in Vercel
#    Production suggestion: VITE_API_BASE_URL=/api
#    (Axios auto-switches to /api on HTTPS if an http:// base is provided.)

# 4. Trigger deploy; visit any route like /patients or /staff directly
```

If you see 404s or mixed-content errors after deployment, confirm:
- `vercel.json` is at repository root.
- Build output contains `dist/index.html`.
- No conflicting `public/` directory overriding routes.
- API requests use `/api/...` (network tab) and are being rewritten.

To add headers or additional rewrites, extend `vercel.json` accordingly.
