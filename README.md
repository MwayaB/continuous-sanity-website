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

## Campaign attribution

The landing page preserves `utm_source`, `utm_medium`, `utm_campaign`, and
`utm_content` for the current browser tab and adds them to every Calendly demo
link. No cookies, personal data, or fingerprinting are used.

Demo clicks also dispatch a `demo_cta_clicked` browser event with campaign fields
and a `location` of `hero`, `nav`, or `footer`. To retain these events, set
`VITE_CAMPAIGN_EVENT_ENDPOINT` at build time to an HTTPS endpoint that accepts a
JSON `POST`. The payload is:

```json
{
  "event": "demo_cta_clicked",
  "properties": {
    "source": "cold_email",
    "medium": "outbound",
    "campaign": "design_partner_discovery",
    "content": "human_uat_v1",
    "location": "hero"
  }
}
```

Without an endpoint, Calendly attribution still works and the browser event is
available to a future first-party analytics listener; no network analytics
request is made.

## Editing guide

- Hero copy and page narrative live in `src/App.tsx`, in the `Hero`, `ProblemSection`, `HowItWorks`, and section components.
- Replace the clearly marked `DEMO_URL` and `PILOT_URL` constants near the top of `src/App.tsx` with final Calendly and email destinations.
- The browser, side panel, contextual pin, and dashboard visuals are JSX/CSS mockups in `src/App.tsx`; replace these components with real product screenshots later if needed.
- Color tokens, typography, reveals, texture, and layout helpers live in `src/index.css`.

There is intentionally no auth, API, pricing, signup, blog, chatbot, waitlist, or customer portal in this artifact.
