# Lab 7: Color, Colormaps, and Legends

## Project context
- Work only in the existing Lab_07/diamond-color project; preserve previous labs and unrelated changes.
- Minimal SvelteKit 3, Svelte 5 runes, JavaScript (no TypeScript), npm, D3. Use the scaffold's #lib alias.
- Commands: npm run dev (use printed URL), npm run build, npm run preview, node scripts/verify-data.mjs.
- src/routes/+page.svelte loads /diamonds.csv in onMount using d3.csv and converts numeric columns. src/lib/DiamondScatter.svelte renders marks declaratively with Svelte; D3 supplies CSV parsing, scales, axes, and color interpolation. Use dedicated axis groups for D3; do not use D3 to append data marks.
- static/diamonds.csv contains all 53,940 course rows, including price_resid. static/diamonds_slice20.csv is the course verification slice. diamonds_README.md describes the data. Do not edit or silently filter the supplied files.
- Preserve screenshots, prompts, assessments, and Git-log evidence under evidence/. Use the existing course Git repository, not a nested repository. Stage only intended Lab 7 files.
- Work incrementally on the requested activities; do not start Activity 4 or 5 before requested.

## Column types and rank orders
- cut, color, clarity are ORDINAL, not nominal labels.
  - cut: Fair < Good < Very Good < Premium < Ideal
  - color: J < I < H < G < F < E < D (D is BEST; reverse alphabetical)
  - clarity: I1 < SI2 < SI1 < VS2 < VS1 < VVS2 < VVS1 < IF
- Never sort these grades alphabetically or by order of appearance. Use the explicit ranks above.
- price_resid is signed and zero is meaningful: zero means the observed log price matches the model prediction for carat. It is not a dollar difference, and it does not establish causation or account for every quality variable.
- carat, price, depth, table, x, y, z are quantitative. depth and table are percentages; x, y, z are millimetres.

## Color rules
- Ordinal variable: use one sequential ramp or a perceptually uniform interpolator in explicit rank order. Unrelated categorical hues do not communicate ordering.
- Nominal variable: use a categorical palette with distinct hues. Check distinguishability; consider another channel when there are many categories.
- Signed variable with meaningful zero: diverging scale, neutral exactly at zero, symmetric bounds. Set m = max(abs(min), abs(max)); use d3.scaleDiverging with domain [-m, 0, m].
- Never use rainbow/jet colormaps.
- Provide another means to identify values or categories when color alone is insufficient. Legends must be readable, ordered, and label direction and units.
- Price is right-skewed: consider a logarithmic scale when it supports the task, and disclose the transformation in the legend.
- Check deuteranopia, protanopia, and greyscale when requested. Do not invent visual observations, simulation outcomes, contrast measurements, or peer feedback.
- Legend text must meet 4.5:1 contrast; account for opacity and background when assessing rendered colors.

## When given a color specification
- Read the relevant block in COLOR.md when asked to apply it. Follow its family, domain, anchor, and legend requirements exactly.
- Change only what was requested; do not introduce unrelated improvements.
- Explain scale suitability from the variable's type and intended comparison, not just appearance.
- Activity 3 begins with a single-color chart, then an unspecified-palette clarity trial. Preserve its first color choice and explanation before deciding whether a revision is needed. Do not deliberately choose an incorrect palette to manufacture a revision.
- Identify assistant-drafted specifications and prompts honestly. Never attribute generated observations or plans to the student or a tablemate.
