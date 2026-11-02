# Color specification

Assistant-drafted Activity 3 specification for student review. Written after the first unspecified-palette trial, as Activity 3 requires. Residual specification added before implementation in Activity 4.

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

## Price residual (specification before implementation)

- **Variable:** price_resid.
- **Type:** signed quantitative log-price residual, not a dollar difference.
- **Family:** diverging purple-orange (D3 interpolatePuOr). Opposite hues distinguish below and above the weight-model prediction.
- **Domain and anchor:** min -1.5083, max +1.3379. The negative extreme has greater absolute magnitude. Set m=1.5083 and domain [-1.5083, 0, +1.5083], neutral exactly at zero. Use d3.scaleDiverging(t => d3.interpolatePuOr(t)) for purple below and orange above.
- **Legend:** continuous ramp with -1.5083, 0, +1.5083 marked; label “Lower price than predicted”, “Matches prediction”, “Higher price than predicted”. Title “Log-price residual (unitless)”.
- **Checks:** verify scale(0) equals interpolator(0.5); inspect both color-vision simulations and greyscale, and check legend text contrast. Results recorded after rendering below.

- **Rendered check and correction:** The initial trial reversed the intended end hues. Corrected to interpolatePuOr(t), so negative is purple and positive is orange as specified. Zero remains unchanged. Original trial screenshots are preserved with initial- prefixes.
- **Redundant reference:** Greyscale lost reliable sign discrimination. A labeled dashed prediction curve now marks zero residual in position: points above it are positive and below it are negative.
- **Observed pattern:** At a given carat, orange points lie above the model curve and purple points lie below it; pale near-zero points cluster around the curve and can be difficult to see.
- **Simulation results:** Chrome deuteranopia and protanopia preserve a broad blue-versus-yellow distinction for negative versus positive residuals. Near-zero points are faint, and individual residual magnitudes cannot be read precisely in dense regions. Greyscale loses hue-based sign identification, but the dashed zero-residual curve supplies a positional reference. No claim that every mark passes graphical contrast.
- **Neutral verification:** scale(0) = rgb(243, 238, 234), exactly interpolatePuOr(0.5); the legend's 50% stop uses the same scale and zero is marked at its center.
