# Initial map
Created in the existing empty Lab_08 folder with the official handout downloads. All 732 stations rendered (607 bike, 125 subway); all 148,943 trips retained. Missing ID X32999 affects 15 trips, reported on screen. Numeric fields parsed; local timestamps use d3.timeParse.

Production build passed. Chrome rendered OSM tiles with attribution and no console errors. Pan test moved Harvard's SVG position by 100px/50px before mouse release, matching the pointer movement. Zoom in/out tested; projected positions changed. No invalid coordinates. Evidence: browser-checks.json, initial-map.png, after-pan-zoom.png.

Leaflet owns the base map; Svelte owns all station circles. Green branches collapse to one line before deciding whether a station is a transfer. Base-map colors are unmuted. No pin, selection, linked charts, or every-trip experiment implemented.

Map decisions were agreed in chat before implementation and saved when this build was authorized. They were not committed before the user's first map prompt; do not claim otherwise in the process book.
