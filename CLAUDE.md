# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`biclever.github.io` is the Biclever marketing site (custom domain `biclever.com`, see `CNAME`). It is a Jekyll 4 build deployed via Netlify (`netlify.toml` runs `jekyll build` → `_site`).

## Common commands

```bash
bundle install                    # install Jekyll + plugins (first time / after Gemfile changes)
bundle exec jekyll serve          # local dev server with live reload
bundle exec jekyll build          # production build into _site
JEKYLL_ENV=production bundle exec jekyll build   # mirrors Netlify build
```

There are no tests or linters.

## Architecture

The site has two areas that share one header, footer and design system:

- **Agent site** (default): `/` (`index.html`), `/how-it-works/`, `/pilot/` (+ `/pilot/thanks/`), `/pricing/`, `/for-bi-teams/`, `/for-finance/`, `/maconomy/`, `/about/`, `/contact/`, `/privacy/`. The persona pages are linked from the footer column "Who it's for", not the main menu. Main menu `site.data.menus.agent`; top bar is a two-item site switch, "Biclever Agent" · "Tools for BO developers", with the current side marked `aria-current`.
- **Tools area**: any page with `section: tools` — `/products/` (tools home), `_products/*` tool pages, `/pro/` (PRO licenses), and the Docs collection. Main menu `site.data.menus.tools` (Tools, PRO licenses); "Tools for BO developers" is the current side in the top bar.

`_layouts/default.html` picks the menu, top bar and header button from `page.section`. `_config.yml` defaults give `_products/*` and `_pages/*` `section: tools`; an Agent article in `_pages/` sets `section: agent` (see `biclever-agent-security.md`, `biclever-agent-demo-transcript.md`) and appears under "Biclever Agent" in the Docs index.

The Docs index (`/pages/`) is linked only from the footer ("For developers" column): it is a site map, not a destination. Individual articles are meant to be linked from the product pages and other pages that need them.

- Collections: `products` (`_products/*.md` → `_layouts/product.html`, `tier: pro|free`, `weight` orders them) and `pages` (`_pages/*.md` → `_layouts/page.html`, the Docs). Inside layouts, `site.pages` is the `pages` collection (Jekyll gives collections priority).
- `_data/`: `menus.yml` (agent, tools, footer columns), `agent.yml` (Agent price, pilot terms, tool user numbers, demo video — edit numbers here, not in pages; per-task credit prices are deliberately not published, only the demo transcript shows what its tasks used), `tiers.yml` (PRO price and Stripe link), `seo.yml`, `contact.yml`.
- Layouts: `default` (shell), `page` (Docs article: one centred column, "← Tools" or "← Biclever Agent" back link, no sidebar), `pages` (Docs index), `product` (tool page), `products` (tools home), `pro` (PRO licenses), `basic` (plain prose: About, Contact).
- Forms: `/pilot/` and `/contact/` use Netlify Forms (`data-netlify="true"`, honeypot `company-website`); submissions appear in the Netlify dashboard.
- Redirects live in `netlify.toml` (`/products/biclever-agent/` → `/how-it-works/`, `/agent/`, `/security/`, and the retired BO SQL Connector and KeyMetrika → `/products/`). The old Agent product file is kept with `published: false`.
- Analytics and consent: `_includes/google-analytics.html` shows a small cookie banner and loads Google Analytics only after "Accept" (choice in `localStorage` key `bc-consent`). "Cookie settings" in the footer (`data-consent-open`) reopens it. The measurement ID is only rendered in production builds.
- "Coming soon" features get `<span class="badge badge-neutral soon">Coming soon</span>` after the heading.

### Styles

`assets/css/style.scss` loads three partials:

- `_sass/_tokens.scss` and `_sass/_components.scss` are copies of the **Biclever design system** (claude.ai artifact "Biclever": `tokens.css` and `components/bundle.css`, with the Google Fonts `@import` removed because `default.html` links the fonts). Don't hand-edit them; change the design system and copy again.
- `_sass/_site.scss` is layout glue for this site only (mobile menu, docs layout, video embed, product header, old transcript class names).

Fonts: Schibsted Grotesk and IBM Plex Mono from Google Fonts. Components are plain HTML classes (`btn`, `badge`, `section`, `section-head`, `steps`, `features`, `request`, `chat`/`msg`, `plan`, `faq`, `form`/`field`, `cta-band`, `prose`); see the design system's component READMEs for markup.

### Content authoring notes

- Product pages: front matter `title`, `description` (shown as the lead and on `/products/`), `date`, `published`, `weight`, `tier`. Downloads and screenshots stay in the Markdown body.
- Docs articles: optional `lead`, `updated` (shows "Last updated"), `wide: true` for a wider text column. Slugs are URL-significant (`permalink: pretty`).
- Markdown renders inside `.prose` (max 40rem). Add `{:.full}` after an image to span the column.
- Placeholders still to fill are written in square brackets, e.g. `[Founder photo]`, `[Hosting and data residency: to confirm before launch.]`. Search for `\[` before launch.
- `404.html` is at repo root (Jekyll/Netlify convention).
