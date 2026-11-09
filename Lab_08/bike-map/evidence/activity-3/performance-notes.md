# Measured performance experiment

Overlay-only count: 732 station elements versus 149,660 elements with 148,928 trip lines added. The broader handout selector svg * counted 735 versus 149,663 because it includes three Leaflet control SVG descendants outside the overlay. Fifteen trip rows have an unmatched endpoint and cannot become valid lines; all remain in memory. These counts differ from the handout reference build and are the actual results here.

Twelve programmatic 8px pan steps were measured from panBy to two animation frames later. Mean elapsed time was 32.55 ms with stations and 2830.95 ms with trip lines. This measures end-to-end frame response, not pure computation time. Headless Chrome and development-mode Svelte affect the results. A separate ten-step mouse drag took 193 ms versus 21588 ms. The trip-line version was severely delayed, not just slightly less smooth. Raw timings and screenshots are preserved.

Temporary per-trip rendering and the window test handle were removed after measurement. This is assistant-measured evidence for the student's required reflection, not a prewritten student answer. The experiment script is preserved but needs the temporary implementation to be restored before rerunning; do not run it against the final map unchanged.
