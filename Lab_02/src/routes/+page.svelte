<script>
  import { rows } from '$lib/data.js';
  import SketchA from '$lib/SketchA.svelte';
  import SketchB from '$lib/SketchB.svelte';
</script>

<svelte:head><title>Lab 2: LAX Sketches</title></svelte:head>

<main>
  <h1>Lab 02: LAX Sketches</h1>
  <p class="question">
    Which of the ten included LAX terminals had the largest percentage increases and
    decreases in passenger traffic between January–October 2019 and January–October 2023?
  </p>
  <p class="meta">
    Measure: percentage change in passenger movements (<code>Change_percent</code>),
    Jan–Oct 2019 vs. Jan–Oct 2023 · Ten comparable terminals · Two alternative sketches
    of the same data
  </p>
  <div class="sketches">
    <SketchA data={rows} />
    <SketchB data={rows} />
  </div>
</main>

<style>
  :global(body) { margin: 0; font-family: system-ui, sans-serif; color: #222; background: #fafafa; }
  main { max-width: 1200px; margin: auto; padding: 2rem; }
  h1 { font-size: 1.6rem; margin-bottom: 0.5rem; }
  .question { font-size: 1rem; line-height: 1.5; max-width: 60ch; margin: 0 0 0.5rem; color: #0b0b0b; }
  .meta { font-size: 0.8rem; color: #52514e; margin: 0 0 1.5rem; }
  code { font-size: 0.95em; background: #eeede8; padding: 0.05rem 0.25rem; border-radius: 3px; }
  .sketches { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
  @media (max-width: 750px) { .sketches { grid-template-columns: 1fr; } }
</style>
