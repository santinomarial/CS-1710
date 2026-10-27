<script>
  import * as d3 from 'd3';

  let { data, activeRoomType = null, selectedRoomType = null, onPreview, onToggle } = $props();
  let appearance = $derived((roomType) => ({
    fill: activeRoomType && roomType !== activeRoomType ? '#B8B8B8' : color(roomType),
    opacity: activeRoomType ? (roomType === activeRoomType ? 1 : 0.12) : 0.65
  }));
  const width = 1100;
  const height = 600;
  const margin = { top: 20, right: 24, bottom: 66, left: 80 };
  const roomTypes = ['Entire home/apt', 'Private room', 'Hotel room'];
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];

  let x = $derived(d3.scaleLinear()
    .domain([0, d3.max(data, d => d.number_of_reviews) ?? 1]).nice()
    .range([margin.left, width - margin.right]));
  let y = $derived(d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price) ?? 1]).nice()
    .range([height - margin.bottom, margin.top]));
  const color = d3.scaleOrdinal().domain(roomTypes).range(colors);
  const shape = d3.scaleOrdinal().domain(roomTypes)
    .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);
  const symbolPath = (roomType, area) => d3.symbol().type(shape(roomType)).size(area).digits(6)();
  // A minimum radius keeps listings with zero reviews per month visible.
  let radius = $derived(d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.reviews_per_month) ?? 1])
    .range([2, 15]));
  let xAxis;
  let yAxis;
  $effect(() => {
    d3.select(xAxis).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format(',d')));
    d3.select(yAxis).call(d3.axisLeft(y).ticks(8).tickFormat(d3.format('$,')));
  });
</script>

<figure>
  <div class="legend" aria-label="Room type legend">
    {#each roomTypes as roomType}
      <button type="button" aria-pressed={selectedRoomType === roomType}
        aria-label={roomType} class:preview={activeRoomType === roomType}
        onmouseenter={() => onPreview(roomType)} onmouseleave={() => onPreview(null)}
        onclick={() => onToggle(roomType)}><svg class="legend-marker" viewBox="-10 -10 20 20" aria-hidden="true"><path d={symbolPath(roomType, Math.PI * 6 ** 2)} fill={color(roomType)} /></svg>{roomType}<span class="selection-label">{selectedRoomType === roomType ? "Selected" : ""}</span></button>
    {/each}
  </div>
  <p class="interaction-hint">Hover to preview. Click or use Enter/Space to select; activate again to clear.</p>
  <p class="interaction-status" aria-live="polite">{activeRoomType ? `Highlighting ${activeRoomType}${activeRoomType === selectedRoomType ? ' (selected)' : ' (preview)'}. Other listings are dimmed, not removed.` : 'Showing all room types.'}</p>
  <p class="size-key">Marker size: average reviews per month (larger markers mean more reviews).</p>
  <svg viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of all 4,777 Boston and Cambridge Airbnb listings. X is number of reviews, Y is nightly price in dollars, color and shape are room type, and marker size is reviews per month.">
    <g class="axis" transform="translate(0,{height - margin.bottom})" bind:this={xAxis}></g>
    <g class="axis" transform="translate({margin.left},0)" bind:this={yAxis}></g>
    <g class="marks">
      {#each data as listing, i (i)}
        <path
          transform="translate({x(listing.number_of_reviews)},{y(listing.price)})"
          data-room-type={listing.room_type}
          fill={appearance(listing.room_type).fill}
          d={symbolPath(listing.room_type, Math.PI * radius(listing.reviews_per_month) ** 2)}
          opacity={appearance(listing.room_type).opacity}
        />
      {/each}
    </g>
    <text class="axis-title" x={(margin.left + width - margin.right) / 2} y={height - 14} text-anchor="middle">Number of reviews (total)</text>
    <text class="axis-title" transform="translate(20,{(margin.top + height - margin.bottom) / 2}) rotate(-90)" text-anchor="middle">Nightly price (USD)</text>
  </svg>
</figure>

<style>
  .marks path, .legend-marker path { stroke: #333333; stroke-width: 0.75; }
  figure { margin: 0; }
  .legend { display: flex; flex-wrap: wrap; gap: 24px; }
  .legend button { display: inline-flex; align-items: center; gap: 8px; font: inherit; color: inherit; background: white; border: 1px solid #888; border-radius: 4px; padding: 8px; cursor: pointer; }
  .legend button[aria-pressed="true"] { border: 2px solid #333; padding: 7px; font-weight: bold; }
  .legend button.preview { background: #eee; }
  .legend button:focus-visible { outline: 3px solid #222; outline-offset: 3px; }
  .selection-label { min-width: 56px; font-size: 12px; }
  .interaction-hint, .interaction-status { font-size: 14px; margin: 10px 0; }
  .legend .legend-marker { display: inline-block; width: 12px; height: 12px; overflow: visible; flex-shrink: 0; }
  .size-key { font-size: 14px; color: #555; margin: 12px 0; }
  svg { display: block; width: 100%; height: auto; }
  .axis :global(text) { fill: #444; font-size: 12px; }
  .axis :global(path), .axis :global(line) { stroke: #888; }
  .axis-title { fill: #333; font-size: 15px; }
</style>
