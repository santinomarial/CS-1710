# Stretch goal: room-type highlight interaction

## Shared state and behavior

`src/routes/+page.svelte:7` owns one shared interaction state object: `selection = $state({ hovered: null, selected: null })`. There are no independent category selection states. Line 8 derives `activeRoomType` from the temporary hover value, falling back to the persistent selection. Preview and toggle callbacks at lines 9-13 are passed to ListingScatter with the selected and active category.

Hovering a legend button previews its room type. Pointer leave clears only the preview, restoring the previous persistent selection or the unselected chart. Clicking toggles the persistent category and clears the preview so a second click immediately restores the default appearance even while the pointer remains on the button.

`ListingScatter.svelte:5` derives marker appearance from the active category. Selected/previewed marks retain their original colors and shapes with opacity 1. Other marks use neutral #B8B8B8 at opacity 0.12. With no active category, all original colors and opacity 0.65 return. The axes, x/y positions, sizes, shapes, record order, and #333333/0.75 outlines are preserved. No rows are filtered or removed.

The legend uses native buttons (lines 40-43), supporting Tab, Enter, and Space. Persistent selection is communicated by aria-pressed, bold text, a heavier border, and the visible word Selected. A focus-visible outline supports keyboard navigation. A live status line distinguishes a preview from a persistent selection and explains that other records are dimmed rather than removed.

## Browser verification

Production build passed; see build.log. Tests were performed in headless Chrome against the live app, not inferred from code. See test-interaction.mjs and browser-tests.json.

- All 4,777 markers remain present throughout every tested state.
- Each category's hover, mouseleave restoration, click persistence, and second-click clearing passed.
- Hovering another category while a category was selected showed a temporary preview; leaving restored the persistent selection for all three cases.
- Highlighted counts matched 3,014 entire homes/apartments, 1,666 private rooms, and 97 hotel rooms.
- Rendered fills and opacity matched each state. Positions, symbol paths, record order, and outline styles remained unchanged throughout.
- Tab reached all three controls. Enter toggled selection; Space toggled selection; the focused button had a visible solid outline.
- No console errors or uncaught page errors were recorded.
- Hotel-room highlighting was captured under Chrome deuteranopia and protanopia emulation. Both commands changed the rendered screenshot; resetting emulation restored the ordinary screenshot exactly. These checks do not constitute a complete accessibility audit or new numerical contrast measurements.

## Visual assessment

The hotel-room highlight makes the smaller category easier to locate. Triangles near the left edge and a few near roughly 100 reviews stand apart from the neutral background. In both simulated views, the triangles retain a recognizable silhouette, and the Selected text and button border identify the active category without relying solely on hue.

Overlap remains a limitation: gray background marks accumulate into a dense region, and some hotel triangles are still partially covered. The original drawing order is preserved, so highlighted marks are not raised above other marks. Small or coincident hotel markers cannot all be distinguished individually. Dimming helps focus attention but intentionally makes the other categories harder to read until selection is cleared. Large marks still attract more attention because the required size encoding is unchanged.

## Screenshots

- default-view.png: no selection; original mark appearance restored, with the new legend controls.
- entire-home-highlight.png: persistent entire-home selection.
- private-room-highlight.png: persistent private-room selection.
- hotel-room-highlight.png: persistent hotel-room selection.
- hotel-room-deuteranopia.png: keyboard-selected hotel category under deuteranopia.
- hotel-room-protanopia.png: keyboard-selected hotel category under protanopia.

No process-book PDF was modified. Existing baseline and revision commits and evidence remain preserved.
