<script>
	import * as d3 from 'd3';

	let { songs = [] } = $props();

	const width = 880;
	const height = 520;
	const margin = { top: 12, right: 16, bottom: 52, left: 56 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	// Both features are published on a fixed 0–100 scale, so the axes are fixed too.
	const DOMAIN = [0, 100];

	let points = $derived(songs.filter((d) => d.danceability !== null && d.energy !== null));
	let missing = $derived(songs.length - points.length);

	const x = d3.scaleLinear().domain(DOMAIN).range([0, innerWidth]);
	const y = d3.scaleLinear().domain(DOMAIN).range([innerHeight, 0]);

	let xAxisGroup = $state();
	let yAxisGroup = $state();

	$effect(() => {
		if (!xAxisGroup) return;
		d3.select(xAxisGroup).call(d3.axisBottom(x).ticks(10).tickSizeOuter(0));
	});

	$effect(() => {
		if (!yAxisGroup) return;
		d3.select(yAxisGroup)
			.call(d3.axisLeft(y).ticks(10).tickSize(-innerWidth).tickSizeOuter(0))
			.call((g) => g.select('.domain').remove());
	});
</script>

<figure class="chart">
	<figcaption>
		<h2>Danceability versus energy</h2>
		<p>
			One dot per song. Both are Spotify-style audio features on a 0–100 scale (unitless), so both
			axes run the full 0–100.
			{#if missing > 0}
				{missing} song{missing === 1 ? '' : 's'} with a blank value {missing === 1 ? 'is' : 'are'} not
				plotted.
			{/if}
		</p>
	</figcaption>

	<svg viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of danceability on the x axis against energy on the y axis for every number-one song">
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis grid" bind:this={yAxisGroup}></g>
			<g class="axis" bind:this={xAxisGroup} transform="translate(0,{innerHeight})"></g>

			{#each points as d, i (d.song + d.artist + i)}
				<circle class="dot" cx={x(d.danceability)} cy={y(d.energy)} r="4" />
			{/each}

			<text class="axis-title" x={innerWidth / 2} y={innerHeight + 44} text-anchor="middle">
				Danceability (0–100)
			</text>
			<text
				class="axis-title"
				transform="rotate(-90)"
				x={-innerHeight / 2}
				y={-40}
				text-anchor="middle"
			>
				Energy (0–100)
			</text>
		</g>
	</svg>
</figure>

<style>
	.dot {
		fill: var(--series-1);
		fill-opacity: 0.5;
		stroke: var(--surface-1);
		stroke-width: 1;
	}
</style>
