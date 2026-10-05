# Lab 4: Billboard Dashboard

## Stack and files
- SvelteKit, JavaScript, Svelte 5 runes, npm, and D3. Use `$state`, `$derived`, `$props`, and modern event handlers, not legacy `$:` or `on:click`.
- `npm run dev` starts Vite; use its printed local URL. `npm run build` verifies the production build.
- Page: `src/routes/+page.svelte`. Components: `src/lib/`. CSV: `static/billboard_hot_100_no1.csv`. Data reference: `billboard_README.md`.
- This scaffold uses SvelteKit 3 and its generated `#lib` import alias (for example `#lib/Timeline.svelte`), rather than the older `$lib` spelling in the handout. Keep the installed stack and use the scaffold's conventions.
- D3 handles CSV loading, scales, axes, and brushes. Svelte renders marks with `{#each}`. D3 may manage axes and brushes inside dedicated `<g>` elements.
- Summarize changed files in plain language after each change.

## Work in stages
- The current project is a scaffold only. Follow the student's next prompt to build the static dashboard first, then hover linking, then brush filtering.
- Four separate components: Timeline, GenreBars, Scatter, KpiRow. Preserve the first dashboard screenshot before corrections.
- Planned static views: song count, average BPM, average weeks at #1; yearly song counts; primary-genre counts sorted descending; Danceability versus Energy with both axes 0–100.

## Coordination rules
- The page owns one `yearRange = $state(null)` and one `hoveredGenre = $state(null)`.
- One `$derived` filtered array includes songs in the inclusive year range; null means all songs.
- KpiRow, GenreBars, and Scatter receive that same filtered array via props.
- Timeline retains the full dataset and year domain for context and brushing.
- A D3 brush reports pixels: invert through the x scale to years before updating state through a callback.
- Genre hover highlights matching scatterplot songs and dims nonmatches without removing data or changing aggregates. Mouse leave restores normal opacity.
- Clearing the brush restores all songs. Hover must still work after filtering.

## Data constraints
- Load `/billboard_hot_100_no1.csv` using `d3.csv` in `onMount`.
- Use Date, Song, Artist, Weeks at Number One, CDR Genre, BPM, Energy, Danceability, Happiness, Acousticness, Loudness (dB), and Length (Sec).
- Convert numeric strings carefully; missing values must not silently become zero. Explain any exclusions and average denominators.
- Parse two-digit years to the dataset's 1958–2025 range: 58 is 1958, not 2058. Expand to four digits before parsing or correct parsed years above 2025.
- One row is one song, not one chart-week. Label row counts separately from Weeks at Number One.
- Primary genre is the trimmed text before the first semicolon. Blank genres become Unlabeled and remain included.
- Audio features are 0–100. BPM, loudness, and length have separate units.
- Preserve the supplied data. These are #1 songs only, not all music or all Hot 100 entries.
- Verify totals and genre counts against the actual CSV: the handout's listed genre counts do not reconcile with its stated total.
- The optional 20-row verification slice has not been supplied; do not fabricate it.

## Git workflow
- Use the existing repository at the parent CS 1710 folder; do not initialize a nested repository.
- Preserve unrelated changes in other labs. Stage only Lab_04 files, never blanket-stage the parent repository.
- Save working checkpoints for scaffold, static dashboard, hover linking, and brush filtering after verification.
- Show a meaningful diff before committing so the student can read and save it for the process book.
- Before restoring anything, explain what would be discarded and preserve work the student needs. Never run a broad restore over other labs.

## Definition of done
- Dev server and build work; no browser errors during interactions.
- Four views, one brush filter, one hover link, accurate labels and units, and a discoverable reset.
- All filtered aggregates agree on the selected subset; Timeline remains full context.
- Check the 1990s filter, clearing, hover before and after filtering, and the lab's temporary frozen-view experiment; restore the correct prop afterward.
- Keep evidence for Q1–Q7, a reviewed Git diff, and a supported data observation. The student supplies personal reflections and real peer feedback.
