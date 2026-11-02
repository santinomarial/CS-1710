<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import DiamondScatter from '#lib/DiamondScatter.svelte';
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
    <DiamondScatter data={diamonds} />
  {/if}
  <footer>Source: course diamonds dataset, based on ggplot2 / seaborn-data. Hover over an exposed point for its weight, price, and clarity. Overlapping points may hide individual stones.</footer>
</main>

<style>
  :global(body) { margin: 0; font-family: Arial, sans-serif; background: #fff; color: #222; }
  main { max-width: 1100px; padding: 32px 24px; margin: auto; }
  h1 { margin: 0 0 16px; font-size: 30px; }
  p { line-height: 1.5; }
  footer { color: #555; font-size: 13px; line-height: 1.5; margin-top: 20px; }
</style>
