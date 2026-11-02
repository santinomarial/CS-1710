# Legend audit

Computed browser colors were inspected in both views. Background is #FFFFFF. Ratios use WCAG sRGB linearization and relative luminance, (Llighter + .05)/(Ldarker + .05). Text is fully opaque. Full numerical output: contrast.json.

| Element | Foreground | Background | Ratio | 4.5:1 |
|---|---|---|---|---|
| Clarity legend labels and heading | #222222 | #FFFFFF | 15.91:1 | Pass |
| Residual labels, numbers, heading | #222222 | #FFFFFF | 15.91:1 | Pass |
| Axis ticks | #444444 | #FFFFFF | 9.74:1 | Pass |
| Axis titles | #333333 | #FFFFFF | 12.63:1 | Pass |
| Source caption | #555555 | #FFFFFF | 7.46:1 | Pass |

Clarity: all eight grades appear in explicit rank order, with worst-to-best direction. IF is best; I1 is worst. The eight grades are not equally easy to identify among overlapping marks.

Residual: symmetric bounds -1.5083 to +1.5083, center marked 0. Ends say lower/higher price than predicted. Units are explicitly log-price residual, not dollars. Price axis separately says USD. Neutral midpoint matches the scale's returned zero color.

No text contrast correction was needed. Near-zero point visibility and eight-grade separation remain limitations, not text-contrast failures. Opaque legend swatches and translucent plotted points differ in appearance. No claim that all data marks achieve 3:1 contrast.

The checked desktop viewport is 1280x1100. A full mobile or screen-reader audit has not been performed.
