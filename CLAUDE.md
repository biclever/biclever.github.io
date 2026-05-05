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

- `_config.yml` defines two Jekyll collections, each auto-assigned a layout via `defaults`:
  - `products` (`_products/*.md`) → `_layouts/product.html`, sorted by `weight`, surfaced on the home page (capped by `home.limit_products`).
  - `pages` (`_pages/*.md`) → `_layouts/page.html` (knowledge-base / EULA / how-to articles, distinct from top-level `*.md` like `about.md`, `contact.md`).
- Top-level `.md` files (`index.md`, `about.md`, `products.md`, `pages.md`, `contact.md`) are landing pages that use the corresponding layouts in `_layouts/`.
- `_data/*.{yml,json}` holds site-wide content consumed by includes/layouts: `menus.yml`, `social.json`, `features.json`, `seo.yml`, `contact.yml`. Edit these rather than hard-coding values in templates.
- `_includes/` is small and shared (header, footer, menus, social, GA snippet); `_sass/` feeds `assets/css/style.css`. Sass output is `compressed`.
- Plugins enabled: `jekyll-environment-variables`, `jekyll-sitemap`. Both are GitHub-Pages-incompatible, which is why deployment goes through Netlify, not GH Pages.

### Content authoring notes

- Product pages live in `_products/*.md` with front matter including `title`, `description`, `date`, `published`, and `weight` (controls home-page ordering).
- `_pages/*.md` are SEO/long-tail articles — slugs are URL-significant because of `permalink: pretty`.
- `404.html` is at repo root (Jekyll/Netlify convention).

### Page text-width / image-width convention

Body copy on content pages is capped at `37.5rem` (~600px) for readability, while the surrounding column is wider (Bootstrap container ~1140px). The cap is implemented in `_sass/components/_content.scss` on direct children of `.content` (`> p, > ul, > ol, > h1..h6, > blockquote, > pre, > table, > .call`) with `margin-left/right: auto` to centre them in the column.

Implications when adding pages or layouts:
- Wrap rendered Markdown in `<div class="content">{{ content }}</div>` (see `_layouts/page.html`, `_layouts/pro.html`). Anything you want capped at the text width must be a direct child of `.content` and one of the selectors above — wrap custom blocks accordingly, or move them inside `.content` so they inherit the cap (this is what `pro.html` does for `.pro-buy`, the "Included tools" `<h2>`, and `.pro-products`).
- Images in Markdown are wrapped in `<p>` by kramdown and so inherit the text cap. To let an image span the full column width, add `{:.full}` after it:
  ```markdown
  ![alt](/images/foo.png)
  {:.full}
  ```
  The `.full` class (and `p.full`) is whitelisted in `_content.scss` to break out to `max-width: 100%` and centre.
- Custom `<div>`s inside `.content` are NOT in the selector list, so they keep the column's full width unless you give them their own `max-width` (e.g. `.pro-buy` is capped at 280px in `_page-pro.scss` with `margin: ... auto ...` to align with the centred text).
