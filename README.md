# UCalgary Chinese Alumni Network

A responsive, bilingual homepage for CAN / 卡大中国校友圈, rebuilt from the existing [WordPress website](https://ucalgarycan.ca/) for GitHub Pages. Plain HTML, CSS, and JavaScript; no runtime dependencies or WordPress subscription needed.

## Preview

Use Node.js 20 or newer. No package installation is needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Use the local server rather than opening `index.html` directly: the events, partners, and benefits load JSON through `fetch`, which requires HTTP(S).

```sh
npm run check
npm run build
```

The build copies only the public website files to `dist/`.

## Deploy to GitHub Pages

1. Commit and push this project to the `main` branch of `can-ucalgary/home-page`.
2. In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Run **Actions → Deploy homepage to GitHub Pages → Run workflow**, or push a new commit to `main`.
4. The workflow validates and publishes `dist/`. Its deployment output provides the live URL, normally `https://can-ucalgary.github.io/home-page/`.

All asset paths are relative, so the site works at both a repository subpath and a custom domain. This checkout has not been pushed or deployed.

## Move ucalgarycan.ca when ready

Keep the WordPress site available until the remaining pages have been migrated. This deliverable is the homepage; the event detail, partner detail, and Opportunities pages have not been recreated; annual pass benefits and merchant offers are now shown on the homepage. Homepage navigation uses local sections, email, Instagram, and LinkedIn. Imported event and partner links currently point to the original WordPress detail pages; migrate those pages and update the JSON URLs before retiring WordPress. All displayed images, including event posters, are stored locally. The optional `dateSource` links are maintenance references and are not fetched by the page.

When the replacement site is ready, set `ucalgarycan.ca` as the custom domain in the repository's Pages settings, configure the domain's DNS for GitHub Pages, and enable HTTPS after GitHub verifies it. Keep domain registration active independently of the WordPress business hosting plan. The deployment workflow publishes an artifact; manage the custom domain through Pages settings or add a `CNAME` file to the build output when switching domains. A custom domain is intentionally not enabled in this draft.

## Content and maintenance

- Edit headings, section descriptions, and general links in `index.html`.
- Edit events in `data/events.json`, community partners in `data/partners.json`, and annual pass/merchant offers in `data/benefits.json`; the page loads both dynamically. The build copies `data/` into `dist/`, so this works on GitHub Pages without a backend.
- Edit colors, typography, and responsive layout in `styles.css`.
- `script.js` controls the mobile navigation, scroll effects, JSON rendering, partner scrolling, and copyright year.
- `assets/` contains local copies of images and selected partner logos from the existing website, plus the supplied `assets/brand/logo.png`, used in the header, footer, and browser favicon. No images rely on WordPress hosting. The campus photo is retained. The primary color is `#ffadad` and the secondary color is `#C8A2FF`, with dark text for contrast.
- Existing events are presented as community highlights, with no invented future dates or registration links. Update the section when new events are confirmed.
- The AI chatbot is described as a vision, not an available product.
- **Newsletter:** the WordPress signup form is replaced by an explicitly labeled email contact action. It opens a draft in the visitor's email app; it does not store addresses or automatically subscribe anyone. To restore automatic subscriptions, connect a newsletter provider's hosted form, and update the button and accompanying text.
- Community organization names and the three strategic pillars come from the existing website. Partner logos remain the property of their respective owners. Original stock-photo source filenames: `pexels-olly-3830745.jpg`; campus: `0.jpeg`.

The visual design uses an immersive, full-width campus backdrop, staggered oversized headings, a translucent introduction panel, and pink/purple gradients inspired by https://phanvic.ca/. All visual effects are implemented locally in CSS and JavaScript; no reference-site assets or runtime dependencies are used. Scroll reveals, subtle background movement, and hover states respect reduced-motion preferences. The site uses system fonts, so visitors do not need third-party font services.

## JSON content

`data/events.json` is an array of events:

```json
{
  "title": "Event title",
  "date": "2026-11-06",
  "category": "COMMUNITY & CULTURE",
  "description": "A short description.",
  "url": "https://example.com/event",
  "poster": "assets/events/event-poster.jpg"
}
```

The date above is a format example, not a real CAN event. Use the actual event date in `YYYY-MM-DD` format. The homepage sorts dates newest first and displays at most three entries, including future events when present. Equal dates retain their order in the file. The imported WordPress list contains ten events. Nine event dates were verified from their posters, linked in each entry’s optional `dateSource` field; these are event dates, not WordPress publication dates. The 7-Day Matchmaking Challenge poster specifies March 2026 without an exact day, so its `date` remains `null`; undated events follow dated ones in JSON order. Use `url: null` if there is no event link. An empty array shows a friendly empty state.

`data/partners.json` is an array of partners:

```json
{
  "name": "Partner name",
  "logo": "assets/partners/partner-logo.png",
  "url": null
}
```

Add the logo to `assets/partners/`. Set `url` to the partner's verified website or resource detail page to make its card clickable, or leave it `null`. Imported cards link to their existing CAN resource pages. The optional `image` field retains the partner's original information artwork when it differs from the logo. Partner order follows the JSON file. The list has a visible horizontal scrollbar, touch/trackpad and keyboard scrolling, plus previous/next controls. It does not auto-scroll. Failed logos fall back to the partner name. Each section handles its own loading errors independently.

Run `npm run check` after content edits to validate required fields, calendar dates, links, and local logo files.

## Asset folders and benefits

- `assets/brand/`: current logo plus retained legacy brand files.
- `assets/images/`: shared campus and community photography.
- `assets/events/`: all ten original activity posters, named by event slug. The latest three cards link to these local posters in a new tab.
- `assets/partners/`: images for all nine entries from the resources page, with existing CGSA and Paw logos retained separately from their information artwork.
- `assets/benefits/`: annual pass banner, ten merchant images, and two supporting photographs from the benefits page.
- `data/asset-sources.json`: original download URL for each imported poster/resource/benefit image. These URLs are attribution and maintenance references, not runtime image dependencies.

`data/benefits.json` contains a `pass` object and a `merchants` array. Edit the pass title, year, validity, purchase URL, banner, eligibility, and redemption instructions in `pass`. Each merchant has `name`, `discount`, local `image`, optional `address`, `mapUrl`, `website`, and `wechat`. Use `null` for fields that do not apply. The homepage displays all merchant offers in JSON order and loads benefits independently of events and partners. The imported offers, addresses, and redemption rules follow https://ucalgarycan.ca/benefits/; update the year and confirm merchant offers when renewing the pass.

The build clears generated `dist/` before copying current files, so renamed assets do not leave obsolete copies in deployments. Downloaded originals retain their source resolution; offscreen posters, partner artwork, and benefits images use lazy loading.
