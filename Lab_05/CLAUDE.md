# Lab 5: Scrollytelling U.S. Road Deaths

## Stack and files
- SvelteKit, JavaScript (not TypeScript), Svelte 5 runes, npm, D3, and Scrollama. Use `$state`, `$derived`, `$props`, and modern event handlers, not legacy `$:`, `export let`, or `on:click`.
- `npm run dev` starts Vite; use its printed local URL. `npm run build` verifies the production build.
- Page: `src/routes/+page.svelte`. Chart component: `src/lib/LineChart.svelte`. CSV: `static/us_road_deaths_by_year.csv`. Data reference: `static/road_deaths_README.md`. Storyboard: `STORYBOARD.md`.
- This scaffold uses SvelteKit 3 and its generated `#lib` import alias (for example `#lib/LineChart.svelte`), rather than the older `$lib` spelling in the handout. Keep the installed stack and use the scaffold's conventions.
- D3 handles CSV loading, scales, axes, and line-path calculation (`d3.line`). Svelte renders data marks declaratively (`<path d={...}>`, `{#each}`). D3 may manage axes only inside dedicated `<g>` elements.
- Scrollama touches `window`/`document`: create and set it up only inside `onMount`, and destroy it in the cleanup function to avoid SSR errors and duplicate observers.
- Summarize changed files in plain language after each change.

## Work in stages
- Order: storyboard in `STORYBOARD.md` → static chart → narration text steps → scroll wiring. Do not write narration or scrolling code before the storyboard exists.
- The student's next prompt sets the stage; do not jump ahead.

## Architecture
- `src/routes/+page.svelte` owns a single `let step = $state(0)`.
- Only Scrollama's `onStepEnter` updates `step` (from `response.index`).
- `measure`, `xDomain`, `highlightedYear`, and `annotatedYear` are each `$derived` from `step`. No other scene state.
- These are passed to `LineChart.svelte` as props. LineChart is purely presentational: it never updates scene state, never imports Scrollama, and never reads `step`.
- Layout: a sticky graphic container beside a column of scrolling text steps; each step element maps to one scene index.

## Pacing
- Scene 0 establishes the chart (title, axes, labeled measure).
- Each later scene makes exactly one independent visual change (e.g. switch measure, change x domain, or highlight one year), never two at once.
- Plan 5–7 scenes following the Freytag Pyramid: exposition, rising action, climax, resolution.
- `STORYBOARD.md` lists, per scene: the narration claim, the single visual change, and the values of `measure`, `xDomain`, and `highlightedYear`. Keep it in sync with the implementation.

## Data constraints
- Load `/us_road_deaths_by_year.csv` with `d3.csv` inside `onMount`.
- Convert `year`, `fatalities`, `vmt_billions`, `rate_per_100m_vmt`, and `population` to numbers; all load as strings.
- 50 rows, one per year, 1975–2024, no gaps.
- `fatalities` is the total count of people killed in U.S. motor-vehicle traffic crashes that year. It is not crashes, injuries, or near-misses.
- `rate_per_100m_vmt` is deaths per 100 million vehicle-miles traveled: risk per unit of driving.
- Count and rate can show different patterns (driving more than doubled since 1975). Every chart label, axis title, and sentence must say which measure it shows, with units.
- Do not invent causal explanations or unsupported trends. Check every number and claim against the actual CSV, and consult `road_deaths_README.md` for sources, revisions (e.g. 2024 is a preliminary estimate, not Final), and known quirks such as 2020.
- Preserve the supplied data; do not edit or fabricate rows.

## Git workflow
- `Lab_05` belongs to the existing repository at the parent CS 1710 folder. Never initialize a nested repository.
- Keep all changes within `Lab_05`. Preserve unrelated changes in other labs; stage only `Lab_05` files, never blanket-stage the parent repository.
- Preserve working versions with commits after verification, but never commit automatically: show a meaningful diff and wait for the student to ask.
- Before restoring anything, explain what would be discarded. Never run a broad restore over other labs.

## Definition of done
- Dev server and build work with no build or browser console errors.
- A correctly labeled line chart (title, axes, units, measure name).
- A sticky graphic with 5–7 scroll-driven scenes, one visual change per transition.
- An accurate count-versus-rate comparison.
- A complete `STORYBOARD.md` that matches the implementation.
