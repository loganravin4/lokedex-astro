# Lokédex

An interactive Pokédex-style portfolio device -- a single retro handheld you open, boot, and navigate to browse projects, experience, and more.

**Live:** [loganravinuthala.dev](https://loganravinuthala.dev)

## Tech stack

- **Vite + React** -- single-page app, no routing (navigation is internal device state)
- **Tailwind CSS v4** -- styling and design tokens
- **Sanity** -- headless CMS for projects and experience content
- **Tone.js** -- runtime-synthesized hardware sound effects (no audio files)
- **Framer Motion** -- the open/fold animation and panel transitions
- **Vercel** -- hosting, plus a serverless function for the Spotify now-playing widget

## Local development

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Environment variables

Create a `.env` file in the project root. Client-side values must be `VITE_`-prefixed to be exposed to the browser.

```sh
# Sanity (required)
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production

# Analytics (optional -- features no-op if unset)
VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
VITE_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id

# Spotify now-playing (server-side, used by the Vercel function)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

## Build

```sh
npm run build     # production build to ./dist
npm run preview   # preview the build locally
```
