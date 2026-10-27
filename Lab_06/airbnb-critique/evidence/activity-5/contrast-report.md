# Activity 5: Contrast measurements

Computed styles were inspected in Chrome on the current rendered chart. Body background is #FFFFFF; chart and containing surfaces are transparent. No vision-deficiency emulation was active for these WCAG calculations.

Method: WCAG sRGB relative luminance; contrast = (lighter luminance + 0.05) / (darker luminance + 0.05). Opacity is composited in sRGB before luminance conversion. Ratios use unrounded composite channels; displayed hex values are rounded to nearest 8-bit colors. Text threshold: 4.5:1. Graphical marks: 3:1.

| Element | Effective foreground | Background | Ratio | Result |
| --- | --- | --- | --- | --- |
| X tick | #444444 | #FFFFFF | 9.7398:1 | PASS |
| Y tick | #444444 | #FFFFFF | 9.7398:1 | PASS |
| X title | #333333 | #FFFFFF | 12.6347:1 | PASS |
| Y title | #333333 | #FFFFFF | 12.6347:1 | PASS |
| Legend text | #222222 | #FFFFFF | 15.9100:1 | PASS |
| Private room fill | #FFAC62 | #FFFFFF | 1.8559:1 | FAIL |
| Entire home/apt fill | #6DA7CE | #FFFFFF | 2.6096:1 | FAIL |
| Hotel room fill | #76C176 | #FFFFFF | 2.1696:1 | FAIL |
| Data outline on white | #7A7A7A | #FFFFFF | 4.2684:1 | PASS |
| Outline over Private room fill | #7A5D44 | #FFAC62 | 3.2410:1 | PASS |
| Outline over Entire home/apt fill | #475B69 | #6DA7CE | 2.6924:1 | FAIL |
| Outline over Hotel room fill | #4A654A | #76C176 | 2.9805:1 | FAIL |
| Legend outlines | #333333 | #FFFFFF | 12.6347:1 | PASS |

## Interpretation and limits

All requested text checks pass. Original marker fills are #1F77B4, #FF7F0E, and #2CA02C, each with element opacity 0.65. The outline source is #333333, also affected by element opacity 0.65. Legend outlines are opaque #333333.

All three fill-only checks fail on white. The exposed outer outline passes against white, so the isolated marker can be identified by its boundary despite its fill failure. This does not establish a blanket pass for overlapping marks. The overlap rows calculate source-over compositing of an outline over one underlying fill already composited on white. They are explicitly scenarios, not sampled pixel measurements. Actual backgrounds in the dense chart can include multiple fills and strokes; fully obscured boundaries cannot be evaluated as visible cues. Two scenario ratios fall below 3:1, and the green scenario at 2.9805 must not be rounded up to a pass. No exhaustive per-pixel overlap audit or contrast certification is claimed. Thin-edge antialiasing can also affect apparent visibility.

Recommended next trial, not implemented: use fill-opacity 0.65 with overall opacity 1 and an opaque #333333 outline. This retains translucent fills while making outlines stronger. Recheck the actual crowded chart and both simulations afterward; opaque strokes still do not guarantee 3:1 against every stacked background. If necessary, evaluate a contrasting halo separately. No data or chart changes were made for Activity 5.

Build passed immediately before Activity 4 commit 7470ac9. Current browser inspection recorded no errors. Full computed styles, numerical results, and calculation scope are in contrast-results.json. Reproduction script: measure-contrast.mjs (uses this machine's bundled Playwright path).
