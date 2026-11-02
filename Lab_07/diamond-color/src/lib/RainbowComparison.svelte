<script>
  import DiamondScatter from './DiamondScatter.svelte';
  let { data } = $props();
  let greyscale = $state(false);
</script>
<section aria-labelledby="comparison-title">
  <h2 id="comparison-title">Rainbow, measured</h2>
  <p>Same diamonds, positions, scales, radius 2, and opacity 0.35. Only the palette changes. Scroll horizontally on smaller screens to compare full-size charts.</p>
  <label><input type="checkbox" bind:checked={greyscale} /> Show both palettes in greyscale</label>
  <p>Viridis follows ranks 0–7. Rainbow samples its circular ramp at 0/8 through 7/8 to avoid repeating the endpoint color. Grade spacing does not imply equal differences in quality.</p>
  <div class="comparison-scroll" tabindex="0" role="region" aria-label="Side-by-side clarity charts, horizontally scrollable">
    <div class="comparison-grid" class:greyscale>
      <article data-palette="viridis">
        <h3>Sequential Viridis</h3>
        <DiamondScatter {data} mode="clarity" />
      </article>
      <article data-palette="rainbow">
        <h3>Rainbow (comparison only)</h3>
        <DiamondScatter {data} mode="clarity" comparisonPalette="rainbow" />
      </article>
    </div>
  </div>
  <p>Greyscale uses CSS grayscale(1) on both charts, including their legends. It is a lightness comparison, not a color-vision-deficiency simulation.</p>
</section>
<style>
  .comparison-scroll { overflow-x: auto; }
  .comparison-scroll:focus-visible { outline: 3px solid #222; }
  .comparison-grid { display: grid; grid-template-columns: 1100px 1100px; gap: 24px; width: 2224px; }
  .greyscale { filter: grayscale(1); }
  h3 { margin-bottom: 12px; }
  label { display: inline-flex; align-items: center; gap: 6px; }
</style>
