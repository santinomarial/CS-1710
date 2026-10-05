<script>
	import * as d3 from 'd3';

	let { songs = [], hoveredGenre = null, scope = '' } = $props();

	const width = 470;
	const height = 496;
	const margin = { top: 10, right: 14, bottom: 48, left: 46 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	// Both features are published on a fixed 0–100 scale, so the axes are fixed too.
	const DOMAIN = [0, 100];

	let points = $derived(songs.filter((d) => d.danceability !== null && d.energy !== null));
	let missing = $derived(songs.length - points.length);

	// Hover only changes opacity — every song stays on screen and nothing is recounted.
	let highlighted = $derived(
		hoveredGenre === null ? 0 : points.filter((d) => d.genre === hoveredGenre).length
	);

	const x = d3.scaleLinear().domain(DOMAIN).range([0, innerWidth]);
	const y = d3.scaleLinear().domain(DOMAIN).range([innerHeight, 0]);

	let xAxisGroup = $state();
	let yAxisGroup = $state();

	$effect(() => {
		if (!xAxisGroup) return;
		d3.select(xAxisGroup).call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
	});

	$effect(() => {
		if (!yAxisGroup) return;
		d3.select(yAxisGroup)
			.call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickSizeOuter(0))
			.call((g) => g.select('.domain').remove());
	});
</script>

<figure class="chart">
	<figcaption>
		<h2>Danceability versus energy</h2>
		<p>
			One dot per song from <strong>{scope}</strong>. Both are Spotify-style audio features on a
			0–100 scale (unitless), so both axes run the full 0–100 whatever is selected.
			{#if missing > 0}
				{missing} of these {songs.length} songs {missing === 1 ? 'has' : 'have'} a blank value and
				{missing === 1 ? 'is' : 'are'} not plotted.
			{:else}
				All {songs.length} have both values.
			{/if}
		</p>
	</figcaption>

	<svg viewBox="0 0 {width} {height}" role="img" aria-label="Scatterplot of danceability on the x axis against energy on the y axis for every number-one song">
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis grid" bind:this={yAxisGroup}></g>
			<g class="axis" bind:this={xAxisGroup} transform="translate(0,{innerHeight})"></g>

			{#each points as d, i (d.song + d.artist + i)}
				<circle
					class="dot"
					class:dimmed={hoveredGenre !== null && d.genre !== hoveredGenre}
					class:highlighted={hoveredGenre !== null && d.genre === hoveredGenre}
					cx={x(d.danceability)}
					cy={y(d.energy)}
					r="3.5"
				/>
			{/each}

			<text class="axis-title" x={innerWidth / 2} y={innerHeight + 40} text-anchor="middle">
				Danceability (0–100)
			</text>
			<text
				class="axis-title"
				transform="rotate(-90)"
				x={-innerHeight / 2}
				y={-34}
				text-anchor="middle"
			>
				Energy (0–100)
			</text>
		</g>
	</svg>

	<p class="readout" aria-live="polite">
		{#if hoveredGenre === null}
			Showing all {points.length} plotted songs.
		{:else}
			Highlighting {highlighted} {hoveredGenre} song{highlighted === 1 ? '' : 's'} — the other
			{points.length - highlighted} are dimmed, not removed.
		{/if}
	</p>
</figure>

<style>
	.dot {
		fill: var(--series-1);
		fill-opacity: 0.5;
		stroke: var(--surface-1);
		stroke-width: 1;
	}

	.dot.dimmed {
		opacity: 0.15;
	}

	.dot.highlighted {
		fill-opacity: 0.85;
	}

	.readout {
		margin: 6px 0 4px;
		font-size: 0.75rem;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
	}
</style>
