# Lab 8: Bike Map
JavaScript SvelteKit, npm, D3, Leaflet. Run npm run dev and npm run build. Work only in Lab_08/bike-map.
Load Leaflet JavaScript dynamically inside onMount; it needs window and must not run in SSR. Leaflet CSS can be imported at module level.
Leaflet draws tiles and the future single draggable pin. Svelte draws every data mark through each blocks in an SVG overlay. Never create Leaflet layers per station or trip.
Project lat/lon using map.latLngToContainerPoint. Increment a reactive counter on move and zoom; read it in derived projected positions. Overlay ignores pointer events so the map receives drags.
Load both original CSVs with d3.csv. Parse numeric columns and local timestamps. Retain all trips in memory and report unmatched IDs. Never plot NaN. Draw aggregates, not individual trips.
Future pin position is one shared state; all selection and views derive from it. Weekday/weekend comparisons are per day (5 vs 2). Filter starts only.
Preserve evidence, actual prompts, and checkpoints. Never invent observations or feedback.

## Map decisions
Agreed in this conversation before implementation; saved here after the user authorized the build, not claimed as a student-authored file predating the prompt.
- Start at Harvard Square at zoom 13 to show Cambridge and nearby Boston rather than all twelve towns.
- Bike stations: small gray dots. Subway: line-colored rings. Collapse Green branches to Green. Multi-line stations: dark ring so no line is arbitrarily prioritized.
- Future selection: pin starts at Harvard; radius 400 m; count trips starting at selected bike stations, including destinations outside the circle. Station click also moves the pin.
- Future views: hourly departures per weekday/weekend day, top outside-circle destinations with flow lines and list, selected bike-station count and weekly trip starts.
- Current stage: muted map, pin, and linked views. Keep live drag updates: tested counts changed during dragging (3,555 to 3,962), while release-only stayed stale until release.
- Interaction detail: station pointer targets within the pin handle must not intercept pin dragging.
