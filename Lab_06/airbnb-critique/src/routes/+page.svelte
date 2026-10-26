<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import ListingScatter from '#lib/ListingScatter.svelte';

  let listings = $state([]);
  let loading = $state(true);
  let error = $state(null);
  const numericColumns = ['latitude', 'longitude', 'price', 'minimum_nights', 'number_of_reviews', 'reviews_per_month', 'availability_365', 'number_of_reviews_ltm'];

  onMount(async () => {
    try {
      listings = await d3.csv('/airbnb_boston_cambridge.csv', row => {
        for (const column of numericColumns) row[column] = Number(row[column]);
        return row;
      });
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head><title>Boston and Cambridge Airbnb listings | Lab 6 baseline</title></svelte:head>
<main>
  <h1>Boston and Cambridge Airbnb listings</h1>
  <p class="intro">Nightly price and total reviews, with room type shown by color and reviews per month shown by circle size.</p>
  {#if error}
    <p role="alert">Could not load listings: {error}</p>
  {:else if loading}
    <p>Loading listings...</p>
  {:else}
    <p class="count">Showing all {d3.format(',')(listings.length)} listings. June 2026 course dataset.</p>
    <ListingScatter data={listings} />
  {/if}
  <footer>Source: Inside Airbnb, Boston and Cambridge, June 2026. Course dataset excludes unpublished prices, extreme price outliers, and shared rooms. Reviews are not booking counts.</footer>
</main>

<style>
  :global(body) { margin: 0; background: white; color: #222; font-family: Arial, sans-serif; }
  main { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
  h1 { margin: 0 0 12px; font-size: 30px; }
  .intro { line-height: 1.5; margin: 0 0 14px; }
  .count { color: #555; font-size: 14px; margin-bottom: 24px; }
  footer { color: #555; font-size: 13px; line-height: 1.5; margin-top: 20px; }
</style>
