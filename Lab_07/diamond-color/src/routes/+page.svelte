<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import DiamondScatter from '#lib/DiamondScatter.svelte';
  let mode = $state('clarity');
  let diamonds = $state([]);
  let loading = $state(true);
  let error = $state(null);
  const numericColumns = ['carat','price','depth','table','x','y','z','price_resid'];
  onMount(async () => {
    try {
      diamonds = await d3.csv('/diamonds.csv', row => {
        for (const column of numericColumns) row[column] = Number(row[column]);
        return row;
      });
    } catch (e) { error = e.message; }
    finally { loading = false; }
  });
</script>

<svelte:head><title>Diamond weight and price | Lab 7</title></svelte:head>
<main>
  <h1>Diamond weight and price</h1>
  <p>Each point represents one diamond. Both axes use linear scales.</p>
  {#if error}<p role="alert">Could not load data: {error}</p>
  {:else if loading}<p>Loading diamonds...</p>
  {:else}
    <p>Showing all {d3.format(',')(diamonds.length)} diamonds. No records filtered.</p>
    <div class="view-controls" aria-label="Color encoding">
      <button aria-pressed={mode === 'clarity'} onclick={() => mode = 'clarity'}>Clarity grades</button>
      <button aria-pressed={mode === 'residual'} onclick={() => mode = 'residual'}>Price residual</button>
    </div>
    <p>{mode === 'clarity' ? 'Color shows clarity from worst to best. Neighboring grades can be difficult to separate where points overlap.' : 'Color shows observed log price minus the prediction from weight. Zero matches the model; this is not a dollar difference or a causal effect.'}</p>
    <DiamondScatter data={diamonds} {mode} />
  {/if}
  <footer>Source: course diamonds dataset, based on ggplot2 / seaborn-data. Hover over an exposed point for its weight, price, clarity, and residual. Overlapping points may hide individual stones.</footer>
</main>

<style>
  :global(body) { margin: 0; font-family: Arial, sans-serif; background: #fff; color: #222; }
  main { max-width: 1100px; padding: 32px 24px; margin: auto; }
  button { padding: 8px 14px; margin-right: 8px; background: white; color: #222; border: 1px solid #555; cursor: pointer; }
  button[aria-pressed="true"] { font-weight: bold; border-bottom: 4px solid #222; }
  button:focus-visible { outline: 3px solid #222; outline-offset: 3px; }
  h1 { margin: 0 0 16px; font-size: 30px; }
  p { line-height: 1.5; }
  footer { color: #555; font-size: 13px; line-height: 1.5; margin-top: 20px; }
</style>
