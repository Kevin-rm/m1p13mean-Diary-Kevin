# Frontend — CLAUDE.md

## Stack

- Angular 21
- PrimeNG 21 (Aura preset)
- Tailwind CSS 4 via `tailwindcss-primeui`
- RxJS (async), signals (sync state)
- Vitest (unit tests)

## Architecture

- `src/app/core/` — infrastructure (models, interceptors, utils)
- `src/app/shared/` — reusable UI components
- `src/app/auth/` — auth (guards, service, login, register)
- `src/app/frontoffice/` — front-office features
- `src/app/backoffice/` — back-office features

## Conventions

- Standalone components only (no NgModules)
- Signals + `computed` for state
- `loadComponent` for lazy routes
- `interface` for object shapes
- PrimeNG FloatLabel: `"on"`
- Component selector prefix: `app-`
- **Mobile-first and responsive** for all layout and styling
- **PrimeNG first** for UI and design tokens  
  **Tailwind CSS only** when PrimeNG has no suitable API
