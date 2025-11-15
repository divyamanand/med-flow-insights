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
