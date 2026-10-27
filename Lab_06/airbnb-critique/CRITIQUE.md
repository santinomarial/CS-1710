# Lab 6: Perceptual critiques

## Critique 1 — Deuteranopia

- **Observation:** In the deuteranopia screenshot, entire homes/apartments remain blue, while private rooms appear mustard yellow and hotel rooms appear darker olive. The private-room and hotel-room legend swatches are not identical, but their colors are much closer than either is to blue. Some isolated hotel-colored points remain visible near the left edge, including near $2,000, but the small hotel-room group is difficult to identify reliably in the crowded lower-left region. Overlapping translucent circles blend and obscure category boundaries. The dense blue/yellow cluster attracts attention first, followed by large isolated circles toward the right. Size differences show variation in reviews per month, but also draw attention away from comparing price and room type.
- **Principle:** Categorical distinction is weakened when room type relies on color alone and two category colors become similar under simulation. Redundant encoding can provide a second category cue. Occlusion and competing size emphasis further reduce the visibility of a small group; size cannot identify room type because it encodes a different variable.
- **Fix:** Add redundant marker shapes for room type: circles for Entire home/apt, squares for Private room, and triangles for Hotel room. Update the legend to show those same shapes. Keep the current color mapping, x = number_of_reviews, y = price, all 4,777 records, and size = reviews_per_month. Keep opacity and axes unchanged for this first targeted revision. Match symbol areas to the existing circle areas at equivalent reviews-per-month values so changing shape does not accidentally introduce a new size difference. Then recheck the same deuteranopia view to see whether hotel markers are actually identifiable at their displayed sizes and under overlap. This is a proposed fix, not an implemented or verified improvement.

### Evidence and scope

- Screenshot: `evidence/activity-4/deuteranopia-before.png` (1280 × 1000, full page including legend, axes, and all plot bounds).
- Applied Chrome DevTools Protocol `Emulation.setEmulatedVisionDeficiency` with `type: deuteranopia` before capture. The command succeeded. The simulated capture differed from the ordinary control; resetting to `none` restored an identical ordinary capture.
- Verification log: `evidence/activity-4/simulation-verification.json`.
- All 4,777 circles rendered; no console or uncaught page errors were recorded.
- Observations are from this simulated desktop view. The simulation approximates a viewing condition and does not certify accessibility for every reader.
- No protanopia simulation, contrast measurement, chart revision, or Activity 5 work was performed.

### Revision implemented and rechecked

The initial evidence and proposed fix above are retained as the before record. The approved revision is now implemented, without a Git commit.

- Replaced data circles with Svelte-rendered D3 symbol paths: Entire home/apt = circle, Private room = square, Hotel room = triangle. The legend displays the same category shapes.
- For every listing, symbol area is `Math.PI * radius(reviews_per_month) ** 2`, using the original radius scale. D3 symbol size is an area in square SVG units, so the geometry matches the original circle area, subject to six-decimal path-coordinate rounding.
- Preserved the original x/y scales and positions, category colors, size variable and scale, opacity of 0.65, record order, and all 4,777 listings. The explanatory text now says marker size and mentions shape so it describes the revised chart accurately.

**Before/after comparison:** Before, private rooms and hotel rooms were represented by circles with similar mustard/olive colors in the simulated view. After, the legend clearly gives them different silhouettes. Private-room squares are distinguishable from entire-home circles among separated marks, and hotel triangles are easier to recognize near the left edge, particularly the isolated points near $2,000. All three room types now have a second identification cue independent of hue.

**Outcome:** The change partially addresses the original problem. Shapes help when their boundaries are visible, but I cannot reliably identify all three categories throughout the dense lower-left region. Small triangles can still be hidden by other marks or be too small to recognize readily. The similar simulated colors remain unchanged. Large markers continue to attract attention and obscure smaller ones. No additional revision was made to address those remaining limitations.

**Checks actually performed:**

- `npm run build` passed.
- Chrome rendered 4,777 symbol paths: 3,014 entire homes/apartments, 1,666 private rooms, and 97 hotel rooms.
- Automated comparison of every rendered mark with the CSV and original scales confirmed its position, color, opacity, and expected equal-area symbol path.
- No browser console errors or uncaught page errors were recorded.
- Applied Chrome DevTools Protocol `Emulation.setEmulatedVisionDeficiency` with `type: deuteranopia` and captured the full page at the original 1280 × 1000 viewport. The simulated screenshot differed from an ordinary capture, and resetting to `none` restored an identical ordinary capture.
- Visually inspected the saved before and after simulated screenshots.
- No protanopia simulation, numerical contrast measurement, or Activity 5 work was performed. These results do not certify accessibility for every reader.

**Evidence:**

- Original simulated chart: `evidence/activity-4/deuteranopia-before.png` (preserved).
- Revised simulated chart: `evidence/activity-4/deuteranopia-after.png`.
- Original simulation verification: `evidence/activity-4/simulation-verification.json`.
- Original ordinary control: `evidence/activity-4/ordinary-control.png`.
- Revised rendering, encoding, and simulation verification: `evidence/activity-4/revision-verification.json`.

## Critique 2 — Protanopia

- **Observation:** In the current shape-based chart under protanopia, entire homes/apartments appear blue, while private rooms and hotel rooms appear very similar yellow/olive tones. The legend's circle, square, and triangle silhouettes remain recognizable. Separated squares and circles are also recognizable in the plot, and some hotel triangles are visible near the left edge, particularly near $2,000. However, hotel triangles are not reliably identifiable in the dense lower-left region: overlapping translucent marks obscure their edges. All three categories can be identified in the legend and in some separated marks, but not consistently throughout the plot. Large isolated markers and the dense lower-left mass still attract attention; size communicates reviews per month but competes with price and room-type comparison.
- **Principle:** Redundant shape encoding preserves category information when colors become similar under simulation, but that cue depends on visible silhouettes. Occlusion and weak separation of overlapping boundaries can defeat the shape cue. Competing size emphasis further favors large marks over small ones.
- **Fix:** As the smallest next trial, add a thin dark outline (for example, a 0.75 SVG-unit #333 stroke) to the existing marker shapes, with matching legend outlines. Preserve x/y positions, category fills, shapes, size mapping, opacity, data order, and all records. Recheck both simulations to determine whether the outlines help readers follow exposed shape boundaries without making the dense region more cluttered. This is a recommendation only, not an implemented or validated improvement. Outlines cannot reveal fully occluded marks, and this check does not establish any numerical contrast ratio.

### Assessment details and evidence

1. All three room types are identifiable in the legend and in some separated marks, but identification is not reliable throughout crowded regions.
2. Private-room and hotel-room colors are particularly similar under protanopia. Shape is doing necessary work to distinguish them.
3. Circles, squares, and triangles remain recognizable when large enough and not obscured. Tiny or overlapped silhouettes are harder to read.
4. Hotel rooms remain difficult to locate within crowded regions, despite visible isolated hotel triangles.
5. Overlap hides boundaries and blends translucent fills. The shape revision did not remove this problem.
6. Large markers attract attention and cover smaller ones. Size still conveys the required reviews-per-month variable but competes with the main comparison.
7. A fresh deuteranopia check of this same unchanged chart shows the earlier shape benefit remains: visible squares and triangles provide a second category cue. Similar colors and heavy overlap remain limitations there too. Neither check supports an unqualified claim that all marks are distinguishable.

The category-shape mapping is retained. Another small revision is recommended to test boundary separation, rather than claiming the current chart fully passes. The outline proposal awaits approval.

- Protanopia checked view: `evidence/activity-4/protanopia-before.png`. This captures the existing shape revision before any second revision.
- Fresh deuteranopia checked view: `evidence/activity-4/deuteranopia-recheck.png`.
- Verification log: `evidence/activity-4/protanopia-verification.json`.
- Chrome DevTools Protocol `Emulation.setEmulatedVisionDeficiency` was applied with `protanopia`, then separately `deuteranopia`. Each simulated screenshot differed from the ordinary capture. Resetting to `none` after each simulation reproduced the ordinary capture exactly.
- Both captures use a 1280 × 1000 viewport and include the full chart, legend, axes, and data marks. Chrome rendered 4,777 symbol paths with no console or uncaught page errors.
- Source and dataset hashes were unchanged throughout this assessment. No chart revision, contrast measurement, Activity 5 work, or commit was performed.
- These are observations of simulated views, not a guarantee of accessibility for every reader.

### Second revision implemented and verified: marker outlines

The approved outline revision has now been implemented. Earlier proposals and checked views above remain preserved as the chronological record.

**Implemented:** Added one CSS rule applying `stroke: #333333` and `stroke-width: 0.75` to data marker paths and legend symbol paths. No other chart changes were made during this revision. The existing marker opacity of 0.65 also applies to the data-mark outlines. Filled symbol geometry and the size mapping are unchanged; the centered stroke adds a small visible border around each shape.

**Protanopia before/after:** In the before screenshot, nearby translucent fills often merge without clearly visible edges. In the after screenshot, circular curves and square corners are easier to follow among separated and moderately overlapping marks. The isolated hotel triangles near the top-left have clearer borders. However, the dense lower-left region now has a visibly busier mesh of dark edges. Outlines improve local boundary recognition, but do not make every hotel triangle identifiable or reveal fully covered marks. This is a partial improvement with a clutter tradeoff, not a complete solution to overplotting.

**Deuteranopia recheck:** The final simulated view retains recognizable circles, squares, and triangles in the legend and wherever enough of each mark is exposed. Outlines clarify those silhouettes. Private-room and hotel-room fills remain similar yellow/olive tones, and crowded hotel markers remain hard to locate. The added edge texture is also visible under this simulation.

**Remaining limitations:** Heavy overlap still hides small shapes, large markers continue to dominate attention, and adding many outlines increases visual density. Category identification still depends on exposed shape boundaries. No numerical contrast measurement or universal accessibility claim is made.

**Verification performed:**

- Production build passed; output saved in `evidence/activity-4/outline-build.log`.
- Chrome rendered all 4,777 data markers with no console errors or uncaught page errors.
- Every rendered mark was compared in CSV order against expected x/y positions, category colors, shape path, original equal-area size mapping, and opacity. All checks passed.
- Computed styles confirmed #333333 strokes and 0.75 SVG-unit widths on all data markers and all three legend symbols. Legend paths and colors matched the category mapping.
- Protanopia and deuteranopia were applied using Chrome DevTools Protocol `Emulation.setEmulatedVisionDeficiency`. Each simulated screenshot differed from the ordinary capture; resetting to `none` restored the ordinary capture exactly.
- Captures use the same 1280 × 1000 viewport as the before images. The before, after, and final simulated views were visually inspected.

**New evidence:**

- `evidence/activity-4/protanopia-after.png`
- `evidence/activity-4/deuteranopia-final.png`
- `evidence/activity-4/outline-verification.json`
- `evidence/activity-4/outline-build.log`

All previous screenshots are preserved. No Activity 5 work or Git commit was performed.
