# Rainbow, Measured

Added an isolated comparison view using the same DiamondScatter component twice. Existing Viridis and residual scale definitions are unchanged. Rainbow is enabled only through a comparisonPalette prop. Each view uses the same 53,940 rows, linear domains/ranges, 1100×600 SVG geometry, radius 2, and opacity 0.35. On narrower screens the pair scrolls horizontally rather than shrinking the labels. The original clarity and residual buttons remain available.

Rainbow samples d3.interpolateRainbow at ranks divided by 8, from 0/8 to 7/8. This avoids assigning the same circular-ramp endpoint color to the worst and best grades. All legends retain I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF.

## Observations from rendered screenshots
Viridis communicates the ranking more effectively. Its legend becomes consistently lighter from I1 to IF in greyscale. Rainbow becomes lighter through VS1, then darker again toward IF. Some nonadjacent grades therefore look similarly gray. In color, rainbow creates vivid hue bands but their order requires repeated legend lookup; hue changes alone do not express increasing quality. Viridis provides a consistent directional cue, although pale high grades remain faint against white.

The full scatterplots are crowded. Overlap and alpha compositing make density influence darkness in both versions. Neither view permits reliable identification of all eight grades in dense regions. Monotonic palette lightness does not eliminate overplotting.

## Measurement
lightness.json records exact hex colors and WCAG relative luminance for each opaque swatch, plus isolated points composited at 35% opacity over white. These are relative luminance measurements, not a claim of equal perceptual intervals or measurements of overlapping marks. Opaque Viridis luminance increases 0.019, 0.051, 0.104, 0.176, 0.275, 0.407, 0.579, 0.782. Rainbow rises 0.099, 0.199, 0.302, 0.462, 0.722, then falls 0.664, 0.450, 0.212.

Greyscale uses CSS grayscale(1), applied to both rendered charts and legends together. This is not deuteranopia or protanopia emulation. Both color and greyscale images were visually inspected.

## Verification
Production build passed. Actual Chrome tests counted 53,940 circles per chart, 107,880 in the pair, and checked every pair of circles for identical cx, cy, radius, and opacity. Original clarity and residual views each still render 53,940 circles. Greyscale toggles on and off. No console/page errors. Browser results are preserved in browser-checks.json. Dataset files are unchanged. No commit was made.

## Screenshots
- comparison-color.png
- comparison-greyscale.png
- viridis-color.png
- viridis-greyscale.png
- rainbow-color.png
- rainbow-greyscale.png
