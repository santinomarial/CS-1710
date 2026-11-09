# Activity 5: transit-line identity

## Observation
Before the fix, the Kendall screenshot under both Chrome protanopia and deuteranopia simulations shows Red and Green Line rings as similar olive tones. Blue remains more distinct, but color alone is not a reliable way to identify every line. Dark transfer rings do not name their constituent lines.

## Principle
Nominal colors can distinguish categories for some readers, but line identity should not depend on color alone. Redundant labels preserve the category information when hues become difficult to distinguish.

## Fix implemented
Retained MBTA colors and added R, O, B, G, and M text inside subway rings. Transfers show combined letters and colored ring segments. Green branches collapse into one G category. The legend explains the letters. All 732 station marks, original trip data, projection, selection, and view calculations are preserved.

## Before/after evidence
before-normal.png and after-normal.png show the visible design change. before-protanopia.png and after-protanopia.png show the main check. before-deuteranopia.png and after-deuteranopia.png provide the second check. Chrome CDP Emulation.setEmulatedVisionDeficiency applied each simulation. Screenshots differ from normal; resetting to none reproduced normal screenshots exactly. These were real simulated browser views, not recolored ordinary screenshots.

The after screenshots allow exposed Red and Green stations to be identified by R/G even though their ring hues remain similar. Combined labels identify transfer lines. Overlap at dense downtown locations can still obscure symbols, and the seven-pixel transfer labels are small; zooming helps separate station positions but does not enlarge text. This is an improvement, not a claim of complete accessibility. Pin location hides the station directly under its handle. The numeric side panel continues to explain the current selection.

## Three map decisions checked
Starting view is explicitly Harvard at zoom 13, rather than fitting all stations. At desktop dimensions it still covers a fairly wide area; judge whether the 400 m circle needs a closer initial view in actual peer testing.
Weekday/weekend bars are per-day rates divided by 5 and 2 and labeled accordingly. Harvard/Central/Kendall match the supplied known answers.
Pin and map have distinct instructions and a visible cross handle. Real mouse tests confirm pin updates and map panning work separately. Novice discoverability remains untested until a tablemate tries it without coaching.

## Comparison with agent self-grade
The initial agent assessment already flagged color-only line identification as a failure and left simulation results unverified. The simulations confirmed that concern. Do not claim the agent originally passed colorblind safety or invented a problem it missed. Its provisional discoverability judgment still needs a real person's test.

## Presentation connection for student consideration
Leaflet's slippy-map projection changes with pan and zoom. The new letters and split rings use the same projected station coordinates as the circles, so they stay attached to locations as the map moves. This is factual supporting material; the student's Q5 reflection has not been written.
