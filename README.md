# Babji Consult Techies — website

React + TypeScript + Vite. No UI framework; design tokens live in `src/styles/tokens.css`.

- `npm run dev` / `npm run build` / `npm run preview`
- Brand, product name ("Context"), nav and contact details: `src/content/site.ts`
- Contact form: set `VITE_CONTACT_ENDPOINT` (e.g. a Formspree URL) at build time. Without it the form validates but says nothing was sent.
- Canonical host `https://consulttechies.ai` is a placeholder (index.html, sitemap.xml, robots.txt, `site.ts`).
- The 3D hero (`src/components/hero/HeroScene.tsx`) is lazy-loaded; no-WebGL and low-power devices get an SVG fallback.
- Demo data (`src/components/demo/scenarios.ts`) is illustrative sample data, labelled as such on the page.
