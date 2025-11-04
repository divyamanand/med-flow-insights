# Client Monolith Architecture

This repository now adopts a monolithic, feature-oriented client architecture mirroring the server's layered structure (controllers/services/dto) while staying idiomatic to React.

## Structure

- `src/app/`
  - `providers/Providers.tsx` — Top-level composition of app providers (Auth, Query, Theme, Tooltips, Toasters)
  - `router/AppRouter.tsx` — Central route configuration (nested layout)
- `src/features/` — Feature modules (patients, appointments, dashboard, etc.)
  - Each module can contain `pages/`, `components/`, `api/` (service calls), `types/` (DTOs), `hooks/`
  - Example (planned): `src/features/patients/{pages,components,api,types}`
- `src/shared/`
  - `components/` — Generalized UI building blocks used across features (PageHeader, DataTable, ResourceToolbar, etc.)
  - `ui/` — Base UI primitives live under `src/components/ui` today; over time we may move or re-export from `shared`
- `src/components/`
  - `layout/` — App shell: Sidebar + Header
  - `ui/` — Shadcn-based primitives (Buttons, Cards, Table, etc.)
- `src/pages/`
  - Transitional location for existing pages. As we iterate, these will migrate into `src/features/<feature>/pages`.
- `src/services/`
  - Transitional location for API service wrappers. As we iterate, move each file into its matching `src/features/<feature>/api`.

## Principles

- Feature-first: co-locate UI, service calls, and types per feature.
- Shared-first: extract reusable widgets (toolbar, data table, dialogs) into `shared/components`.
- Progressive migration: avoid big bang refactors; route remains stable during moves.

## New Shared Components

- `PageHeader` — Standard page heading with breadcrumbs and actions.
- `ResourceToolbar` — Search + filter + primary action layout.
- `DataTable<T>` — Lightweight typed table wrapper around the existing Shadcn `Table`.
- `EmptyState` — Consistent empty state.
- `LoadingOverlay` — Consistent loading indicator.
- `ConfirmDialog` — Standard confirmation modal.

## Next Steps

- Migrate remaining pages into `src/features/*/pages` and align services to `src/features/*/api`.
- Add typed DTOs per feature and remove `any` usage.
- Centralize route registration by feature (e.g., `src/features/patients/routes.ts`).
- Add unit tests for shared components.
