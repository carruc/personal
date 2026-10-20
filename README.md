# Pietro Carrucciu’s website

A Markdown-powered Eleventy site using the light [Clarity template](https://shikun.io/projects/clarity). The public site has an intro, a research/projects listing, and an article archive. No backend or CMS is required.

## Local development

Use Node.js 24 (Node 22 or newer is supported).

```sh
npm ci
npm run dev
```

Open the local URL printed by Eleventy. Development includes drafts and rebuilds when files change.

```sh
npm run build  # production output in _site/
npm run check  # build, internal links/assets, metadata, XML, output isolation
npm test       # isolated content fixtures; does not change your content
```

`_site/` and `node_modules/` are generated and ignored by Git. The production build cleans output automatically, including any previously previewed draft pages.

## Profile and navigation

Edit `src/index.md` for your introduction. Edit `src/_data/site.json` for your name, description, canonical domain, optional social preview image, and social links. Social links appear as Font Awesome icons beside the name in the top bar. Set each entry’s `icon` to its Font Awesome Free classes; omitted icons use a generic link. Accessible labels and tooltips use `label`. Empty social URLs are hidden. Add additional links to the `socials` array; use `mailto:you@example.com` for email. Existing GitHub, LinkedIn, and résumé links are retained.

Shared navigation and metadata live in `src/_includes/base.njk`; shared detail pages in `detail.njk`. Clarity’s free styling is kept in `assets/stylesheets/main_free.css`, with personal-site adjustments in `assets/stylesheets/site.css`. Existing assets retain their `/assets/` URLs. The unused original Clarity demonstrations remain in the repository for reference.

## Articles

Copy `examples/article.md` into `src/articles/your-slug.md`. The filename determines `/articles/your-slug/`.

Required front matter: `title`, `summary`, and `date` (ISO `YYYY-MM-DD`). Optional: `draft` (default false), `image` (root-relative asset URL or HTTPS URL), `imageAlt`, `toc`, and `math` (both default false). Quote text containing YAML punctuation. Use a nonempty image description for meaningful images; omitted alt text marks a decorative image.

Write ordinary Markdown after the front matter. Fenced code blocks are highlighted during the build. With `toc: true`, headings produce a keyboard-accessible “On this page” list. With `math: true`, MathJax renders `$...$` and `$$...$$`; it is loaded only on opted-in pages. Articles are listed newest first and automatically added to `/feed.xml`.

## Research and projects

Copy `examples/project.md` into `src/research/your-slug.md`. Required fields: `title` and `summary`. Optional fields: `draft`, `date` (for ordering), `image`, `imageAlt`, and `links` containing `paper`, `code`, `demo`, or other named links.

A Markdown body creates `/research/your-slug/`; leaving the body empty creates only a listing entry with its external links. Dated entries sort newest first; use dates when you want explicit ordering. Detail pages also support `toc` and `math`.

## Drafts and publishing

Examples are outside `src/` and never published. Copy one into the relevant content folder to start writing. `draft: true` entries appear only in local preview, with a draft banner and `noindex`; RSS and sitemap always omit drafts. Change to `draft: false` when ready. Production builds omit draft pages and their listing entries.

There is no search, analytics, comments, or tag filtering. Empty listings show a short empty state until you publish content.

## GitHub Pages

The workflow runs `npm ci`, the production checks, and content tests before uploading only `_site/`. It deploys on pushes to `main` or `master`, or manual dispatch. In the repository’s Pages settings, choose **GitHub Actions** as the source.

`CNAME` preserves `carruc.eu`; the site assumes deployment at this domain’s root. DNS and GitHub’s custom-domain/HTTPS settings must point to the Pages site. If changing domains, update both `CNAME` and `site.url`. The build generates canonical metadata, `/feed.xml`, `/sitemap.xml`, and `/404.html`; the 404 uses root-relative links for nested missing URLs.

## Attribution

Clarity was designed by [Shikun Liu](https://shikun.io/). Its attribution remains in the shared footer. See `LICENSE` for the original template’s CC BY-SA 4.0 license and bundled font/icon licenses for asset-specific terms.
