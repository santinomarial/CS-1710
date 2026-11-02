# Color specification

Assistant-drafted Activity 3 specification for student review. Written after the first unspecified-palette trial, as Activity 3 requires. No residual encoding has been implemented.

## Clarity

- **Variable:** clarity.
- **Type:** ordinal, eight grades. No meaningful numeric midpoint.
- **Family:** sequential. The visual progression communicates increasing quality rather than unrelated categories. Use Viridis in explicit rank order.
- **Domain and anchor:** I1 < SI2 < SI1 < VS2 < VS1 < VVS2 < VVS1 < IF. Map integer ranks 0 through 7 to d3.scaleSequential(d3.interpolateViridis).domain([0, 7]). I1 anchors the dark end; IF anchors the light yellow end. Equal rank spacing does not assert equal quality intervals.
- **Legend:** eight labeled swatches in that same order. Explicitly label “Clarity: worst → best.” Grades are unitless. Do not sort alphabetically. No zero or neutral midpoint is appropriate.
- **Ordering check:** implementation and rendered legend use the stated order. First palette already matches; retain it unchanged.
- **Color-vision checks:** Chrome CDP deuteranopia and protanopia emulation applied to the rendered chart. Screenshots differ from normal, and resetting emulation reproduces the normal screenshot. The broad dark-to-light ordering remains visible; neighboring grades still require legend reference and are not reliably separable in dense regions. This is not an unconditional colorblind-safe claim.
- **Greyscale check:** Chrome achromatopsia emulation shows the eight legend swatches progressing dark to light. Pale high-rank points are faint; overlap makes density and clarity lightness hard to disentangle. Individual grade identification remains limited.
- **Evidence:** evidence/activity-3/first-clarity.png, clarity-deuteranopia.png, clarity-protanopia.png, clarity-achromatopsia.png, simulation-checks.json, first-palette-assessment.md.
