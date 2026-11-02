<script>
  import * as d3 from 'd3';
  let { data } = $props();
  const clarityOrder = ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF'];
  const clarityRank = new Map(clarityOrder.map((grade, rank) => [grade, rank]));
  const clarityColor = d3.scaleSequential(d3.interpolateViridis).domain([0, 7]);
  const colorFor = grade => clarityColor(clarityRank.get(grade));
  const width = 1100, height = 600;
  const margin = { top: 20, right: 24, bottom: 60, left: 80 };
  let x = $derived(d3.scaleLinear().domain([0, d3.max(data, d => d.carat) ?? 1]).nice().range([margin.left, width - margin.right]));
  let y = $derived(d3.scaleLinear().domain([0, d3.max(data, d => d.price) ?? 1]).nice().range([height - margin.bottom, margin.top]));
  let xAxis, yAxis;
  $effect(() => {
    d3.select(xAxis).call(d3.axisBottom(x).ticks(10));
    d3.select(yAxis).call(d3.axisLeft(y).ticks(8).tickFormat(d3.format('$,')));
  });
</script>

<figure>
  <div class="legend" aria-label="Clarity, ordered from worst to best">
    <strong>Clarity: worst → best</strong>
    <div class="swatches">
      {#each clarityOrder as grade}
        <div class="legend-item"><span class="swatch" style:background={colorFor(grade)}></span><span>{grade}</span></div>
      {/each}
    </div>
  </div>
  <svg class="plot" viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of all 53,940 diamonds: carat weight on the horizontal axis and price in US dollars on the vertical axis.">
    <g class="axis" bind:this={xAxis} transform="translate(0,{height-margin.bottom})"></g>
    <g class="axis" bind:this={yAxis} transform="translate({margin.left},0)"></g>
    <g class="marks">
      {#each data as stone, i (i)}
        <circle cx={x(stone.carat)} cy={y(stone.price)} r="2" fill={colorFor(stone.clarity)} opacity="0.35">
          <title>{stone.carat} carat; ${d3.format(',')(stone.price)}; clarity {stone.clarity}</title>
        </circle>
      {/each}
    </g>
    <text class="axis-title" x={(margin.left+width-margin.right)/2} y={height-14} text-anchor="middle">Weight (carats)</text>
    <text class="axis-title" transform="translate(20,{(margin.top+height-margin.bottom)/2}) rotate(-90)" text-anchor="middle">Price (USD)</text>
  </svg>
</figure>

<style>
  .legend { margin: 12px 0 20px 80px; color: #222; font-size: 14px; }
  .swatches { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
  .legend-item { display: flex; align-items: center; gap: 5px; }
  .swatch { display: inline-block; width: 24px; height: 16px; }
  figure { margin: 0; }
  .plot { display: block; width: 100%; height: auto; }
  .axis :global(text) { fill: #444; font-size: 12px; }
  .axis :global(path), .axis :global(line) { stroke: #888; }
  .axis-title { fill: #333; font-size: 15px; }
</style>
