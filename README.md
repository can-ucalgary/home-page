# UCalgary Chinese Alumni Network

A bilingual React website for CAN / 卡大中国校友圈, built with Vite and deployed as static files on GitHub Pages. The refactor keeps the existing CSS, images, content, layouts, and interactions.

## Development

Use Node.js 22.12 or newer; Node 24 is used in deployment.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Vite serves all three pages and reloads component edits. Stop any old preview process before starting Vite on the same port. JSON changes appear after refreshing the page.

```sh
npm run check
npm run build
npm run preview
```

Stop the development server before starting the production preview, or use `npm run preview -- --port 4174`. Serve the site over HTTP rather than opening HTML files directly.

## Pages and shared components

Three physical HTML entrypoints preserve direct links and refreshes on GitHub Pages without rewrite rules:

| URL | HTML entrypoint | React page |
| --- | --- | --- |
| `/` | `index.html` | `src/pages/HomePage.jsx` |
| `/events/` | `events/index.html` | `src/pages/EventsPage.jsx` |
| `/benefits/` | `benefits/index.html` | `src/pages/BenefitsPage.jsx` |

The HTML files contain page metadata and the React mount point. Edit visible page content in `src/`, rather than in the HTML entrypoints.

- `src/App.jsx` selects the page from the HTML entrypoint.
- `src/components/SiteLayout.jsx` shares the header, navigation, mobile menu, and footer.
- `src/components/DirectoryLayout.jsx` shares the events/benefits page introduction and contact section.
- `src/components/Events.jsx` shares event cards between the homepage's latest three and the complete directory.
- `src/components/Benefits.jsx` shares the annual pass overview and merchant cards between both pages.
- `src/components/Partners.jsx` renders community partner cards.
- `src/components/Carousel.jsx` shares the partner and homepage merchant scrolling controls.
- `src/components/CategoryFilter.jsx` shares category buttons, counts, and selected states.
- `src/hooks/` manages JSON loading, category URL/history state, horizontal scrolling, and motion preferences. Listeners and observers are cleaned up when components unmount.
- `src/lib/site.js` contains site-relative URL helpers, event sorting/date formatting, bilingual category labels, and status messages.
- `styles.css` remains the existing stylesheet. Vite CSS minification is disabled to avoid optimizer rewrites during this appearance-preserving refactor.

## Content

Content remains in editable JSON files fetched at runtime. All three sections handle loading errors independently.

### Events

Edit `data/events.json`. Each entry has:

```json
{
  "title": "Event title",
  "date": "2026-11-13",
  "category": "COMMUNITY & CONNECTION",
  "description": "A short description.",
  "url": "https://example.com/event",
  "poster": "assets/events/event-poster.jpg"
}
```

This is a format example. Use the actual event date in `YYYY-MM-DD` format. Events sort newest first, with equal dates retaining JSON order. Use `date: null` when the exact date is unknown; those entries follow dated events in JSON order. Use `url: null` when there is no details/registration link. The homepage shows the latest three; `/events/` shows all entries and supports category filtering. Posters open their local full-size files in a new tab.

### Partners

Edit `data/partners.json`. Each entry has a `name`, local `logo`, optional information `image` and `description`, and `url`. Current links are disabled with `url: null`. Cards display in JSON order in a horizontal list, with previous/next buttons, keyboard and touch/trackpad scrolling, and a visible scrollbar. There is no automatic scrolling. Failed images fall back to the partner name.

### Benefits

Edit `data/benefits.json`. The `pass` object contains the title, year, validity, purchase URL, local banner, eligibility, and instructions. Each entry in `merchants` contains `name`, `category`, `discount`, local `image`, and optional `address`, `mapUrl`, `website`, and `wechat`. Use `null` for optional fields that do not apply.

The homepage displays merchant cards in a horizontal strip. `/benefits/` displays a grid with category filters. Update the pass year, validity, and merchant offers when renewing the pass.

Filters are generated from JSON categories. Add bilingual labels in `categoryLabels` in `src/lib/site.js` as needed. Selections are stored in `?category=...` for sharing, refreshing, and browser back/forward. Empty arrays show an empty state.

## Images and branding

- `assets/brand/`: current logo and retained legacy brand files.
- `assets/images/`: shared campus and community photography.
- `assets/events/`: local activity posters.
- `assets/partners/`: partner logos and information artwork.
- `assets/benefits/`: pass banner, merchant images, and supporting photography.

The primary color is `#ffadad`; the secondary color is `#C8A2FF`. All images are local, and fonts use the existing system-font stacks. Offscreen content images use lazy loading. Motion respects the system's reduced-motion preference. The AI chatbot remains described as a vision; the newsletter contact button opens an email draft and does not automatically subscribe anyone.

## Build and GitHub Pages

`scripts/check.mjs` validates entrypoints, React source syntax/imports, JSON content, dates, URLs, and local images. `scripts/build.mjs` runs Vite, copies `assets/` and `data/`, and writes `.nojekyll` into `dist/`. Vite cleans obsolete build output and emits real HTML files for all three routes. Relative bundle URLs and each entrypoint's `data-site-root` support both a domain root and a GitHub Pages repository prefix.

The workflow in `.github/workflows/deploy-pages.yml` installs locked dependencies with `npm ci`, validates, builds, and publishes `dist/` when changes are pushed to `main`. It uses Node 24 and `ubuntu-24.04`.

If a repository needs first-time setup, select **Settings → Pages → Build and deployment → Source → GitHub Actions**. The default workflow token cannot enable an unconfigured Pages site. After configuring Pages, push the updated workflow and use **Actions → Deploy homepage to GitHub Pages → Run workflow**. Rerunning an old run uses its old workflow revision.

Manage `ucalgarycan.ca` and HTTPS in the repository's Pages settings and domain DNS settings. Content links use the destinations configured in JSON; update those links when moving any remaining detail pages. This refactor does not change hosting settings or publish a deployment.
