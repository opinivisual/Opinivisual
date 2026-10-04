# Opini Visual

Portfolio site of a Bali-based wedding video editor (Premiere Pro, DaVinci Resolve,
After Effects, colour grading).

**Live site:** https://opinivisual.github.io/Opinivisual/

## Structure

- `portfolio.html` — the single page: intro, filterable video grid with YouTube lightbox, skills
- `index.html` — redirects to `portfolio.html`
- `data/portfolio.json` — portfolio items (`id`, `title`, `category`, `youtube`)
- `assets/` — CSS (loaded through `assets/css/main.css`), JS, images

No build step. Open `portfolio.html` in a browser, or run `npx serve .`.

## Adding a project

Add an entry to `data/portfolio.json`. The thumbnail is taken automatically from the
YouTube link. Categories used by the filter buttons: `Feature Film`, `Highlight Reel`,
`Social Media Reel`.

## License

See [LICENSE](./LICENSE).
