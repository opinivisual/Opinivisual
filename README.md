# Opini Visual

White-label post-production website for Opini Visual — an outsourced video editing
partner for wedding studios and filmmakers who want to take on more bookings without
hiring in-house editors.

**Live site:** _add your GitHub Pages / custom domain URL here once deployed_

---

## About

Opini Visual helps wedding studios scale their editing capacity without growing their
team. This repository contains the full marketing website: 10 pages, a modular CSS
design system, and vanilla JavaScript components — no build step, no framework, no
dependencies required.

## Tech Stack

- **HTML5** — 10 static pages, no templating engine
- **CSS3** — modular stylesheet system with CSS custom properties (design tokens)
- **Vanilla JavaScript** — self-initializing modules, no framework or bundler
- Hosted on **GitHub Pages**

## Project Structure

```
opini-visual/
├── index.html            Homepage
├── about.html             About / team
├── services.html          Service packages
├── portfolio.html         Filterable portfolio + lightbox
├── workflow.html          Step-by-step process
├── pricing.html           Pricing cards
├── faq.html                FAQ accordion
├── contact.html            Contact form (Formspree)
├── privacy.html            Privacy policy
├── terms.html               Terms of service
│
├── assets/
│   ├── css/                Modular stylesheets (see below)
│   ├── js/                  Modular scripts (see below)
│   ├── images/               Photos, icons, logo
│   ├── video/                 Hero and background video
│   ├── icons/                  Software/tool icons
│   └── fonts/                   Self-hosted fonts (if not using Google Fonts CDN)
│
├── data/
│   ├── portfolio.json         Portfolio items (rendered by portfolio.js)
│   └── faq.json                 FAQ items (rendered by faq.js)
│
└── docs/
    └── brand-guide.pdf          Internal brand reference
```

## CSS Architecture

Stylesheets are loaded in a fixed order through `assets/css/main.css` via `@import`.
Each layer builds on the one before it — do not reorder these imports.

| # | File | Purpose |
|---|------|---------|
| 1 | `reset.css` | Cross-browser baseline |
| 2 | `variables.css` | Design tokens: color, type, spacing, shadow, z-index |
| 3 | `typography.css` | Base text styles |
| 4 | `buttons.css` | Button variants |
| 5 | `navigation.css` | Navbar |
| 6 | `footer.css` | Footer |
| 7 | `cards.css` | Card components (service, portfolio, testimonial, pricing, team, stat) |
| 8 | `forms.css` | Form fields and states |
| 9 | `animation.css` | Keyframes, scroll-reveal, marquee |
| 10 | `sections.css` | Page-level layout (hero, split, workflow, CTA, FAQ) |
| 11 | `responsive.css` | Cross-breakpoint overrides and utilities |

Every HTML page links only `assets/css/main.css`.

## JavaScript Modules

Each script is a self-initializing IIFE — it checks for its relevant DOM elements and
does nothing if they're absent. All scripts can be safely loaded on every page.

| File | Responsibility |
|------|-----------------|
| `navbar.js` | Scroll state, mobile menu, active link highlight |
| `hero.js` | Video autoplay/fallback, parallax, scroll cue |
| `counter.js` | Animated number counters (`data-counter`) |
| `testimonials.js` | Testimonial slider/carousel |
| `portfolio.js` | Fetches `data/portfolio.json`, filtering, lightbox |
| `faq.js` | Fetches `data/faq.json`, accordion toggle |
| `form.js` | Contact form validation + Formspree submission |
| `animation.js` | Intersection Observer scroll-reveal |
| `main.js` | Global utilities: current year, smooth scroll, lazy-load, external links |

Load order (before `</body>` on every page):

```html
<script src="assets/js/navbar.js" defer></script>
<script src="assets/js/hero.js" defer></script>
<script src="assets/js/counter.js" defer></script>
<script src="assets/js/testimonials.js" defer></script>
<script src="assets/js/portfolio.js" defer></script>
<script src="assets/js/faq.js" defer></script>
<script src="assets/js/form.js" defer></script>
<script src="assets/js/animation.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

## Setup

1. Clone the repository
2. Add real assets to `assets/images/`, `assets/video/`, and `assets/icons/`
3. Replace the Formspree endpoint in `contact.html` (`data-endpoint`) with your own form ID
4. Update `data/portfolio.json` and `data/faq.json` with real content
5. Open `index.html` directly in a browser, or serve locally:
   ```bash
   npx serve .
   ```

## Deployment (GitHub Pages)

1. Push this repository to GitHub
2. Go to **Settings → Pages**, set source to the `main` branch, root folder
3. If using a custom domain, add it to the `CNAME` file and configure DNS accordingly

## License

See [LICENSE](./LICENSE).
