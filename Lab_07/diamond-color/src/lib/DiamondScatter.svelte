<script>
  import * as d3 from 'd3';
  let { data, mode = 'clarity', comparisonPalette = null } = $props();
  const clarityOrder = ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF'];
  const clarityRank = new Map(clarityOrder.map((grade, rank) => [grade, rank]));
  const clarityColor = d3.scaleSequential(d3.interpolateViridis).domain([0, 7]);
  const rainbowColor = d3.scaleSequential(d3.interpolateRainbow).domain([0, 8]);
  const colorFor = grade => comparisonPalette === 'rainbow'
    ? rainbowColor(clarityRank.get(grade))
    : clarityColor(clarityRank.get(grade));
  const residualColor = d3.scaleDiverging(t => d3.interpolatePuOr(t)).domain([-1.5083, 0, 1.5083]);
  const stops = Array.from({length: 101}, (_, i) => ({offset: i, color: residualColor(-1.5083 + i / 100 * 3.0166)}));
  const width = 1100, height = 600;
  const margin = { top: 20, right: 24, bottom: 60, left: 80 };
  let x = $derived(d3.scaleLinear().domain([0, d3.max(data, d => d.carat) ?? 1]).nice().range([margin.left, width - margin.right]));
  let y = $derived(d3.scaleLinear().domain([0, d3.max(data, d => d.price) ?? 1]).nice().range([height - margin.bottom, margin.top]));
  let predictionPath = $derived(d3.line().x(d => x(d.carat)).y(d => y(d.price))(
    Array.from({length: 250}, (_, i) => {
      const carat = 0.2 + i * 0.02;
      return {carat, price: Math.exp(8.448661 + 1.675817 * Math.log(carat))};
    }).filter(d => d.price <= y.domain()[1])
  ));
  let xAxis, yAxis;
  $effect(() => {
    d3.select(xAxis).call(d3.axisBottom(x).ticks(10));
    d3.select(yAxis).call(d3.axisLeft(y).ticks(8).tickFormat(d3.format('$,')));
  });
</script>

<figure>
  {#if mode === 'clarity'}
  <div class="legend" aria-label="Clarity, ordered from worst to best">
    <strong>Clarity: worst → best</strong>
    <div class="swatches">
      {#each clarityOrder as grade}
        <div class="legend-item"><span class="swatch" style:background={colorFor(grade)}></span><span>{grade}</span></div>
      {/each}
    </div>
  </div>
  {:else}
  <div class="legend residual-legend">
    <strong>Log-price residual (unitless)</strong>
    <svg viewBox="0 0 800 90" role="img" aria-label="Purple means lower price than predicted; zero matches prediction; orange means higher price than predicted.">
      <defs><linearGradient id="residual-ramp">{#each stops as stop}<stop offset="{stop.offset}%" stop-color={stop.color} />{/each}</linearGradient></defs>
      <rect x="5" y="10" width="790" height="20" fill="url(#residual-ramp)" />
      <path d="M5,30v8 M400,10v28 M795,30v8" stroke="#333" />
      <text x="5" y="52">−1.5083</text><text x="400" y="52" text-anchor="middle">0</text><text x="795" y="52" text-anchor="end">+1.5083</text>
      <text x="5" y="75">Lower price than predicted</text><text x="400" y="75" text-anchor="middle">Matches prediction</text><text x="795" y="75" text-anchor="end">Higher price than predicted</text>
    </svg>
    <p>Dashed line: predicted price for weight. Above the line = positive residual; below = negative.</p>
  </div>
  {/if}
  <svg class="plot" viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of all 53,940 diamonds: carat weight on the horizontal axis and price in US dollars on the vertical axis.">
    <g class="axis" bind:this={xAxis} transform="translate(0,{height-margin.bottom})"></g>
    <g class="axis" bind:this={yAxis} transform="translate({margin.left},0)"></g>
    <g class="marks">
      {#each data as stone, i (i)}
        <circle cx={x(stone.carat)} cy={y(stone.price)} r="2" fill={mode === 'clarity' ? colorFor(stone.clarity) : residualColor(stone.price_resid)} opacity="0.35">
          <title>{stone.carat} carat; ${d3.format(',')(stone.price)}; clarity {stone.clarity}; log-price residual {stone.price_resid}</title>
        </circle>
      {/each}
    </g>
    {#if mode === 'residual'}
      <path d={predictionPath} fill="none" stroke="#333" stroke-width="1.5" stroke-dasharray="5 4"><title>Predicted price for weight: zero log-price residual</title></path>
    {/if}
    <text class="axis-title" x={(margin.left+width-margin.right)/2} y={height-14} text-anchor="middle">Carat (ct)</text>
    <text class="axis-title" transform="translate(20,{(margin.top+height-margin.bottom)/2}) rotate(-90)" text-anchor="middle">Price (USD)</text>
  </svg>
</figure>

<style>
  .residual-legend svg { display: block; width: 100%; max-width: 800px; margin-top: 8px; }
  .residual-legend text { fill: #222; font-size: 13px; }
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
