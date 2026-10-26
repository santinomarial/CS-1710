<script>
  import * as d3 from 'd3';

  let { data } = $props();
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
      <span><i style:background={color(roomType)}></i>{roomType}</span>
    {/each}
  </div>
  <p class="size-key">Circle size: average reviews per month (larger circles mean more reviews).</p>
  <svg viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of all 4,777 Boston and Cambridge Airbnb listings. X is number of reviews, Y is nightly price in dollars, color is room type, and circle size is reviews per month.">
    <g class="axis" transform="translate(0,{height - margin.bottom})" bind:this={xAxis}></g>
    <g class="axis" transform="translate({margin.left},0)" bind:this={yAxis}></g>
    <g class="marks">
      {#each data as listing, i (i)}
        <circle
          cx={x(listing.number_of_reviews)}
          cy={y(listing.price)}
          fill={color(listing.room_type)}
          r={radius(listing.reviews_per_month)}
          opacity="0.65"
        />
      {/each}
    </g>
    <text class="axis-title" x={(margin.left + width - margin.right) / 2} y={height - 14} text-anchor="middle">Number of reviews (total)</text>
    <text class="axis-title" transform="translate(20,{(margin.top + height - margin.bottom) / 2}) rotate(-90)" text-anchor="middle">Nightly price (USD)</text>
  </svg>
</figure>

<style>
  figure { margin: 0; }
  .legend { display: flex; flex-wrap: wrap; gap: 24px; }
  .legend span { display: inline-flex; align-items: center; gap: 8px; }
  .legend i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }
  .size-key { font-size: 14px; color: #555; margin: 12px 0; }
  svg { display: block; width: 100%; height: auto; }
  .axis :global(text) { fill: #444; font-size: 12px; }
  .axis :global(path), .axis :global(line) { stroke: #888; }
  .axis-title { fill: #333; font-size: 15px; }
</style>
