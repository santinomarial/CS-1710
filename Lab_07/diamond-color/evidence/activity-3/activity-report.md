# Activities 2 and 3

## Activity 2
Created CLAUDE.md with project context, commands, column types, exact rank orders, color-family rules, and requirements for following COLOR.md. It was created directly by Codex, not by running Claude Code /init. D is the best diamond color grade. Clarity should use a sequential ramp because its eight grades are ranked.

## Activity 3 sequence and outcome
1. Loaded all 53,940 diamonds with d3.csv in onMount and converted numeric fields.
2. Built a fixed-color, fixed-radius scatterplot with carat on X and price in USD on Y, using linear scales and 0.35 opacity. Svelte renders marks; D3 creates scales and axes.
3. Captured single-color.png and preserved both source files as .svelte.txt snapshots.
4. Added clarity color without a user-specified palette. The existing CLAUDE.md rules guided the choice of sequential Viridis, with explicit grade ranks and an ordered legend.
5. Captured first-clarity.png and preserved its component source. Saved the complete palette assessment.
6. Wrote the clarity COLOR.md specification. Since the first palette already complied, retained it. No artificial before/after palette change was introduced.
7. Checked Chrome deuteranopia, protanopia, and achromatopsia emulations. Inspected each saved screenshot. The dark-to-light legend order remains visible. Dense overlap and pale high-rank points remain limitations. No claim that all eight grades can be identified in crowded regions.

The single-color view shows a strong positive weight-price association. Adding clarity reveals a tendency for better grades to sit higher in price at comparable weight. This does not establish a causal clarity effect, and precise comparisons require more than a crowded scatterplot.

Activity 4's diverging residual plot has not been started. Formal legend contrast auditing and tablemate feedback remain for Activity 5.

## Prompt provenance
Actual user request: “now on to activity 2 and 3”.

The implementation followed the supplied handout. The student did not separately type the single-color or color-by-clarity prompts in this exchange. Do not present reconstructed prompts as word-for-word student prompts or as messages sent to Claude Code. The handout asks the student to write the scatterplot prompt; the student should document the actual workflow and review the assistant-drafted specification in their own words.
