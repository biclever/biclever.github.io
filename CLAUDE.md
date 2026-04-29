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
