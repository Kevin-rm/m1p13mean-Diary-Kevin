# Frontend — CLAUDE.md

## Stack

- Angular 21
- PrimeNG 21 (Aura preset)
- Tailwind CSS 4 via `tailwindcss-primeui`
- RxJS (async), Signals (sync state)

## Architecture

- Feature-oriented structure
- Clear separation between domain and UI
- Dependency flow: bottom → top

### Layers

- `core` — domain & infrastructure (non-UI)
- `shared` — reusable, domain-agnostic UI
- `auth` — authentication
- `frontoffice` — end-user features
- `backoffice` — admin features

### Dependency Rules

```
core → shared → (auth | frontoffice | backoffice)
```

## Conventions

- Standalone components only
- Lazy loading via `loadComponent`
- Use `interface` for object shapes
- Component selector: `app-*`
- PrimeNG FloatLabel: `"on"`

## State & Async

- Signals for synchronous state
- `computed` for derived values
- RxJS for async only
- Do not mix Signals and Observables for the same state

## Styling

- Mobile-first
- PrimeNG first
- Tailwind only if PrimeNG has no suitable API
