# Lab 6: Critique and Perceptual Judgment

## Project context

- Work in this existing `Lab_06/airbnb-critique` project. Do not create another project or modify previous labs.
- Stack: minimal SvelteKit 3, Svelte 5, JavaScript (no TypeScript), npm, and D3.
- Use Svelte 5 runes (`$state`, `$derived`, `$props`) and the scaffold's `#lib` import alias for components in `src/lib/`.
- Complete only the activity the student requests. Activity 1 is complete; Activity 2 adds these instructions. Do not generate the scatterplot or begin Activities 3-5 until requested.

## Commands and structure

- `npm run dev`: start the development server. Use the URL printed by Vite; Activity 1 used port 5174 because 5173 was occupied.
- `npm run build`: check the production build.
- `npm run preview`: preview the production build.
- `node scripts/verify-data.mjs http://127.0.0.1:5174`: repeat the Activity 1 data check against a running scaffold server. Adjust the URL to the actual port. This script currently also checks for the default welcome page, so that assertion will need updating after the chart replaces it.
- `src/routes/+page.svelte`: currently the default welcome page; future data-loading page.
- `src/routes/+layout.svelte`: shared layout.
- `src/lib/`: reusable components; `ListingScatter.svelte` will be created in Activity 3, not now.
- `static/airbnb_boston_cambridge.csv`: supplied course data, served at `/airbnb_boston_cambridge.csv`.
- `airbnb_README.md`: course data description and preprocessing notes.
- `scripts/verify-data.mjs`: repeatable data verification.
- `evidence/`: saved setup and data verification evidence. Preserve evidence as the lab progresses.
- This project belongs to the existing course Git repository. Do not initialize a nested repository. Stage only this project's changes when requested, and preserve unrelated work.

## Data integrity

- Preserve the supplied dataset. Do not modify, invent, substitute, or silently filter records.
- Full data verification passed: 4,777 listings; Entire home/apt 3,014; Private room 1,666; Hotel room 97; Boston 3,705; Cambridge 1,072; price minimum $8, maximum $1,995, median $269.
- CSV values load as strings. Convert numeric fields explicitly and keep `room_type`, `city`, and other labels categorical.
- The optional `airbnb_slice20.csv` has not been located. Obtain the actual course file from Canvas or the course download folder rather than constructing a substitute.

## Perceptual rules

- `room_type` is categorical and contains three unordered values. Use a categorical palette, never a sequential or continuous color ramp.
- Choose a categorical palette and verify it under color-vision simulations. Okabe-Ito and ColorBrewer palettes are possible starting points, not proof of accessibility.
- If categories are difficult to distinguish under a color-vision simulation, revise the palette or add a redundant encoding, such as a distinct marker shape.
- Use position on a common scale for the main quantitative comparison.
- Consider whether quantities encoded by area would be easier to compare using position.
- Keep each visual channel tied to a clear variable.
- Use redundant category encodings when necessary for accessibility, and remove distracting encodings.
- Axis labels and legend text must have at least a 4.5:1 contrast ratio against their backgrounds.
- Essential data marks must have at least a 3:1 contrast ratio against adjacent backgrounds through their fill or outline.
- Account for opacity when checking displayed colors.
- Set SVG text colors through CSS rather than individual `fill` attributes where practical.
- Use a contrast checker when DevTools does not provide a numerical ratio.

## Rules for responding to critiques

- Use the student's observations and test results as evidence when revising the rendered chart. If evidence is unclear, ask for clarification or repeat the relevant check when authorized.
- Make exactly the requested changes without introducing unrelated improvements.
- If asked whether a chart is colorblind-safe, identify the actual checks performed and the evidence for the answer.
- If browser access is unavailable, explicitly say so instead of claiming to have tested a simulation.
- Preserve the original chart and relevant screenshots before making revisions.
- Do not invent observations, accessibility measurements, or simulation results.
- When the later accessibility activity is requested, inspect the actual rendered chart under both deuteranopia and protanopia. Verify that all three room types remain identifiable, including through redundant cues where used. Measure text and essential mark contrast separately, accounting for opacity and adjacent backgrounds.
- Treat simulation results as evidence about the tested display, not a guarantee of accessibility for every reader. A code-only assessment or palette name does not establish that the rendered chart passes.
- Record later critique entries as observation -> principle -> fix, with actual evidence when a check passes and no change is needed. Do not create those entries or perform simulations during Activity 2.

## Later activity boundaries

- In Activity 3 only, follow the handout's explicitly requested baseline encodings even where they conflict with simplification rules: x = number_of_reviews, y = price, color = room_type, size = reviews_per_month. Restore the simplification rules for subsequent revisions.
- Preserve the first returned chart and screenshot before any correction. Keep code-only and rendered-chart assessments distinct, and report simulation and contrast measurements separately from visual impressions.
- No chart, critique, or accessibility test is part of the current Activity 2 work.
