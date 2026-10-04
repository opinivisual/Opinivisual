# Opini Visual

Portfolio site of a Bali-based wedding video editor (Premiere Pro, DaVinci Resolve,
After Effects, colour grading).

**Live site:** https://opinivisual.github.io/Opinivisual/

## Structure

- `portfolio.html` — the single page: cinematic hero, filterable film grid with YouTube lightbox, about, services, contact
- `index.html` — redirects to `portfolio.html`
- `data/portfolio.json` — portfolio items (`id`, `title`, `category`, `youtube`)
- `assets/css/cinematic.css` — the whole design system (palette, type and motion tokens in `:root`)
- `assets/js/cinematic.js` — header/menu, scroll reveal, hero video; `assets/js/portfolio.js` — grid, filters, lightbox
- `assets/` — also hero video/poster and images

No build step. Open `portfolio.html` in a browser, or run `npx serve .`.

## Adding a project

Add an entry to `data/portfolio.json`. The thumbnail is taken automatically from the
YouTube link. Categories used by the filter buttons: `Feature Film`, `Highlight Reel`,
`Social Media Reel`.

## License

See [LICENSE](./LICENSE).
