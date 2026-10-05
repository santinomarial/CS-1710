# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Quake Encoding: project context

CS 1710 (data visualization) Lab 03: build and *judge* visual encodings of a USGS earthquake dataset. The git repo root is the parent directory (`CS 1710/`), which also holds `Lab_01` and `Lab_02`; only work inside `Lab_03/` unless asked otherwise. The project started from the `sv` minimal SvelteKit starter (JavaScript, no TypeScript).

## Commands

- `npm install` — install deps (`.npmrc` sets `engine-strict=true`, so Node must satisfy engine requirements)
- `npm run dev` — dev server at http://localhost:5173 (`-- --open` to open a browser)
- `npm run build` / `npm run preview` — production build and preview

There are no lint, typecheck, or test scripts configured.

## Stack

- SvelteKit 2 (on Vite) + Svelte 5 with **runes mode forced** for all project files (`vite.config.js`). Use `$state`, `$derived`, `$props`, `{@render children()}` — not legacy `export let` / `$:`.
- D3 v7 for scales, axes, and CSV loading. **Svelte creates the earthquake marks with `{#each}`** — never create them with `d3.select`/`append`. D3 axis generators may use selections only to draw inside dedicated axis `<g>` elements.

## Conventions

- One component per `.svelte` file in `src/lib/`; import with the `$lib` alias. `src/routes/+page.svelte` is the single page.
- Load the dataset client-side with `d3.csv('/earthquakes_M6.0_1year.csv')` inside `onMount` (files in `static/` are served from the site root).
- Convert `longitude`, `latitude`, `depth`, `mag` to numbers on load (CSV values arrive as strings).
- Use the D3 margin convention; label axes with units.

## Encoding rules

- **Size:** `d3.scaleSqrt` for circle radius — for area proportional to a nonnegative value, radius must be proportional to its square root. Domain AND range must start at 0 for proportional areas. If using e.g. `[6, 8.8] -> [3, 30]` instead, state that size preserves order, not value ratios.
- **Magnitude is logarithmic** (each +1 ≈ 32× energy). Size represents magnitude, not energy. Include an M6/M7/M8 size legend and explain this distinction.
- **Position:** x/y via `scaleLinear`. SVG y grows downward, so the y range is `[height, 0]`; high latitude / high magnitude goes to the TOP. Longitude over [−180, 180] is a valid plate carrée map; the Pacific is split at the edges.
- **Color:** a sequential scale for the chosen quantitative column (e.g. `d3.scaleSequential` + `d3.interpolateViridis`). Depth has a long right tail (5.6–636 km, most <70 km) that swamps a naive domain; if limiting the domain, enable clamping and label the cutoff in the legend.
- `magType` is categorical → ordinal scale if ever encoded.

## Data: `static/earthquakes_M6.0_1year.csv`

USGS catalog, 155 rows, M6.0+ worldwide, 2025-05-28 → 2026-05-28. Full notes in `earthquakes_README.md`.

- Relevant columns: `longitude`, `latitude`, `depth` (km), `mag`, `magType`, `time` (ISO UTC), `place` (good for tooltips).
- No nulls in `longitude`/`latitude`/`depth`/`mag`.
- M6.0+ only — small quakes are filtered out. Don't imply quakes are rare.

## Definition of done

- `npm run dev` runs with no console errors.
- Four channels: longitude→x, latitude→y, mag→size (`scaleSqrt`), chosen quantitative column→color. State the color column in the legend.
- Legends and units on size and color; latitude points north-up.
- Readers can interpret the encodings.
- The binding and the scale are identifiable in code (`{#each}` and a `scale(d.field)` call).
