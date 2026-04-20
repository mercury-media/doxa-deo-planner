# Web App (Angular 20 + Tailwind + PrimeNG)

This folder is reserved for the Angular frontend.

## Planned setup

- Angular 20 standalone app
- Tailwind CSS for layout/utilities
- PrimeNG for rich UI components
- PWA enabled via Angular service worker

## Why this is not scaffolded yet

Scaffolding Angular in this environment would add large generated files without improving architectural clarity.
The backend/API foundation is implemented first so frontend development can connect immediately.

## Recommended first commands (run locally)

```bash
cd apps/web
npx @angular/cli@20 new web --standalone --routing --style=css --skip-git
npm i primeng primeicons @angular/cdk
npm i -D tailwindcss postcss autoprefixer
```
