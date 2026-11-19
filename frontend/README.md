# HRL Refacciones Laptop

Frontend de la plataforma web pública de HRL, construido con Vue 3, Vite,
Vue Router y Pinia.

## Requisitos

- Node.js compatible con Vite 8.
- npm.

## Instalación

```sh
npm ci
```

## Desarrollo local

```sh
npm run dev
```

## Validaciones

```sh
npm run lint
npm run build
```

Para previsualizar localmente la compilación de producción:

```sh
npm run preview
```

## Despliegue (Vercel)

- Proyecto de Vercel con **Root Directory** `frontend`; `vercel.json` define la compilación y
  redirige todas las rutas a `index.html` (Vue Router en modo historial).
- Variables de entorno en Vercel: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
  `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` y, cuando Strapi esté en línea, `VITE_STRAPI_URL`.
- El portal de seguimiento lee Cloud Firestore (proyecto `hrl-web`); el contrato está en
  `docs/CONTRATO-FIRESTORE.md`.
