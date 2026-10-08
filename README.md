# Babji Consult Techies — website

Marketing site for Babji Consult Techies (BCT) and its enterprise AI assistant, **BCT Context**.
React 19, TypeScript and Vite. There is no UI framework: styling is plain CSS driven by design tokens, and the 3D scenes use three.js through `@react-three/fiber` or plain CSS 3D.

## Quick start

```bash
npm install
cp .env.example .env     # only needed if you want the contact form to send mail
npm run dev              # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server. Also serves `POST /api/contact`. |
| `npm run build` | Type-checks (`tsc -b`) then builds to `dist/`. |
| `npm run preview` | Serves the production build, including `/api/contact`. |

## Pages

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/Home.tsx` | 3D hero, product teaser, technology and trust. |
| `/product` | `src/pages/Product.tsx` | Live demo (simulated), intelligence layer, forecasting, capabilities. |
| `/solutions` | `src/pages/Solutions.tsx` | Use cases by role. |
| `/technology` | `src/pages/Technology.tsx` | Architecture and security. |
| `/clients` | `src/pages/Clients.tsx` | Client orbit, flagship scroll scene, pinned client ecosystem. |
| `/about` | `src/pages/About.tsx` | Company story. |
| `/contact` | `src/pages/Contact.tsx` | Demo request form and office globe. `#request` jumps to the form. |

Pages other than Home are lazy-loaded in `src/App.tsx`. `ScrollManager` there handles `#hash` links, including into lazy pages.

## Where to change things

| To change | Edit |
|---|---|
| Brand name, product name, nav links, contact details, office addresses | `src/content/site.ts` |
| Clients, their logos, and the four ecosystem groups | `src/content/clients.ts` |
| Journey / company story copy | `src/content/journey.ts` |
| Product dropdown items | `PRODUCT_MENU` in `src/components/Navigation.tsx` |
| Live demo questions and sample figures | `src/components/demo/scenarios.ts` |
| Colours, spacing, type scale, light and dark themes | `src/styles/tokens.css` |
| Layout and component styles | `src/styles/components.css`, `src/styles/sections.css` |

The demo data is illustrative and labelled as sample data on the page. It is not real client data.

## Contact form

The form posts to `/api/contact`, handled by a small middleware in `server/` that sends mail through Microsoft Graph. `vite.config.ts` mounts it in both `vite` and `vite preview`, so one command runs everything.

Set these in `.env` (git-ignored, read on the server only, never exposed to the browser):

| Variable | Purpose |
|---|---|
| `MAIL_TO` | Where demo requests are delivered. |
| `MAIL_FROM` | Mailbox the message is sent from. |
| `CC_EMAIL` | Optional copy address. |
| `AZURE_TENANT`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | Azure app registration (client-credentials flow, `Mail.Send`). |

If any required value is missing the endpoint answers `503` and the form says the message could not be sent. A hidden `website` field acts as a spam trap.

To use a hosted form service instead (for example Formspree), set `VITE_CONTACT_ENDPOINT` at build time.

## Client logos

Logos live in `src/assets/clients/<name>/`, one folder per client, in three sizes (`-256`, `-512`, `-1024`) plus the supplied original. See `src/assets/clients/README.md` for file naming, sources, and which logos are still low resolution.

## 3D and motion

- `src/components/hero/HeroScene.tsx` and `ClientsOrbitScene.tsx`, `OfficeGlobeScene.tsx`, `ConnectorOrbitScene.tsx` use WebGL and are lazy-loaded. Devices without WebGL, or with weak hardware, get a fallback (`canUseWebGL` in `src/components/three/webgl.ts`).
- `ClientEcosystem.tsx` and `FlagshipScroll.tsx` are pinned scroll scenes. They use plain CSS and a single animation loop, with no WebGL.
- Every animated scene respects `prefers-reduced-motion` and pauses when off screen.

## Before launch

- The canonical host `https://consulttechies.ai` is a placeholder. Update it in `index.html`, `public/sitemap.xml`, `public/robots.txt` and `src/content/site.ts`.
- Several clients (tellgo, Prezien, H&S Store) have no description, and the ecosystem grouping on the Clients page is editorial. Confirm both with the client owner.
- Confirm the Kout Food Group figures on the Clients page (250+ stores, 4,000+ people, 40 nationalities) are current.
- Client logos are trademarks of their owners and should be used with permission.
