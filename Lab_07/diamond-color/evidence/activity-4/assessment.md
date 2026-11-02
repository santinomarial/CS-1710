# Activity 4 assessment and verification

Assistant assessment, not student or peer feedback.

Both views use all 53,940 unchanged records. The shared mode state switches the color encoding and legend, not the dataset or axes. Build passed and Chrome reported no console/page errors. Mouse and Enter/Space keyboard switching were tested. Browser results are in browser-checks.json.

Residual uses d3.scaleDiverging(t => d3.interpolatePuOr(t)).domain([-1.5083, 0, 1.5083]). Negative purple, positive orange. The neutral color returned for zero is rgb(243, 238, 234), matching the midpoint of the legend. The initial implementation accidentally reversed the specified hues, so it was corrected before completion. Both initial and final screenshots are preserved. This was an end-hue correction, not a midpoint or data change.

The displayed pattern places positive residuals above the weight-model curve and negative residuals below it. This follows the model definition, not a claim that clarity causes price. At large weights the observed price ceiling contributes to mostly negative residuals.

Deuteranopia and protanopia were applied with Chrome's Emulation.setEmulatedVisionDeficiency. Each image changed from normal; resetting to none reproduced the original normal image. Inspected all three simulated images, including achromatopsia. Both color-vision simulations retain broad sign separation, while near-neutral marks are faint. Greyscale removes reliable hue-based sign identification. Added a labeled dashed predicted-price curve as a positional sign reference. It is approximate to the CSV's rounded four-decimal residuals at the boundary.

Limitations: 53,940 points overlap; opacity blends colors; pale neutral marks have weak figure-ground separation; the legend shows opaque colors; a tooltip only reveals exposed points. The reference curve helps sign reading but does not make every mark individually distinguishable.

No process-book questions or personal reflection answers were generated.
