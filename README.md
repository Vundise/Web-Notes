# Notes

A small browser-based notes app built with plain HTML, CSS, and JavaScript. Notes are stored locally in the browser with `localStorage`; there is no backend.

## Requirements

- Node.js 20.19 or newer
- npm

## Install

```sh
npm install
npx playwright install chromium
```

## Run locally

```sh
npm run dev
```

The app is served at <http://127.0.0.1:5173>. Vite uses strict port mode, so startup fails if port 5173 is already occupied.

## Test

```sh
npm test
```

The Playwright configuration starts and stops its own Vite server. Tests use isolated browser state, and the browser-restart test creates a temporary persistent Chromium profile rather than using your normal browser profile.

## Production build

```sh
npm run build
```

The generated production files are written to `dist/`.
