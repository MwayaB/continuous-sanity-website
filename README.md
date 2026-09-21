# Continuous Sanity landing page

Editorial, product-led static landing page for Continuous Sanity — a lightweight browser layer for human UAT, beta testing, stakeholder review, and exploratory testing.

## Run locally

From the repository root:

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm --dir artifacts/continuous-sanity dev
```

The artifact is also compatible with the workspace workflow, which supplies `PORT` and `BASE_PATH` automatically.

## Build

```bash
PORT=5173 BASE_PATH=/ pnpm --dir artifacts/continuous-sanity build
```

## Editing guide

- Hero copy and page narrative live in `src/App.tsx`, in the `Hero`, `ProblemSection`, `HowItWorks`, and section components.
- Replace the clearly marked `DEMO_URL` and `PILOT_URL` constants near the top of `src/App.tsx` with final Calendly and email destinations.
- The browser, side panel, contextual pin, and dashboard visuals are JSX/CSS mockups in `src/App.tsx`; replace these components with real product screenshots later if needed.
- Color tokens, typography, reveals, texture, and layout helpers live in `src/index.css`.

There is intentionally no auth, API, pricing, signup, blog, chatbot, waitlist, or customer portal in this artifact.