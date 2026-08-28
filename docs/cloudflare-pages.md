# Cloudflare Pages deployment

## Build settings

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Production branch: `main`

The repository is intended to be connected to Cloudflare Pages through the GitHub integration. Each push to `main` should trigger a new deployment.

## D1 next step

Create a D1 database in the Cloudflare dashboard, then apply `cloudflare-d1.sql` from this directory. Keep database credentials and future AI API keys out of the repository.
