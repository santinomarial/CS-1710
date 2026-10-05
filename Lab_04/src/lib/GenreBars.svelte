<script>
	import * as d3 from 'd3';
	import { UNLABELED } from '#lib/data.js';
	import { rightRoundedBar } from '#lib/shapes.js';

	let { songs = [], hoveredGenre = null, onGenreHover = () => {}, scope = '' } = $props();

	const width = 470;
	const rowHeight = 28;
	const margin = { top: 10, right: 44, bottom: 44, left: 108 };

	// Sorted by count, descending — the ordering is the comparison.
	let counts = $derived(
		d3
			.rollups(
				songs,
				(v) => v.length,
				(d) => d.genre
			)
			.map(([genre, count]) => ({ genre, count }))
			.sort((a, b) => d3.descending(a.count, b.count) || d3.ascending(a.genre, b.genre))
	);

	let innerHeight = $derived(Math.max(counts.length, 1) * rowHeight);
	let height = $derived(innerHeight + margin.top + margin.bottom);
	const innerWidth = width - margin.left - margin.right;

	let y = $derived(
		d3
			.scaleBand()
			.domain(counts.map((d) => d.genre))
			.range([0, innerHeight])
			.padding(0.24)
	);
	let x = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(counts, (d) => d.count) || 1])
			.nice()
			.range([0, innerWidth])
	);

	let unlabeled = $derived(counts.find((d) => d.genre === UNLABELED)?.count ?? 0);

	let xAxisGroup = $state();
	let yAxisGroup = $state();

	$effect(() => {
		if (!xAxisGroup) return;
		d3.select(xAxisGroup).call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
	});

	$effect(() => {
		if (!yAxisGroup) return;
		d3.select(yAxisGroup)
			.call(d3.axisLeft(y).tickSize(0))
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('text').attr('x', -10));
	});
</script>

<figure class="chart">
	<figcaption>
		<h2>Songs by primary genre</h2>
		<p>
			Primary genre is the text before the first semicolon in <code>CDR Genre</code>. Counting the
			{songs.length} songs from <strong>{scope}</strong>.
			{#if unlabeled > 0}
				The {unlabeled} with no genre are kept as “{UNLABELED}”, not dropped.
			{:else}
				Every one of them carries a genre, so this selection has no “{UNLABELED}” bar.
			{/if}
		</p>
	</figcaption>

	<svg viewBox="0 0 {width} {height}" role="img" aria-label="Horizontal bar chart of the number of number-one songs in each primary genre, sorted from most to fewest">
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis" bind:this={yAxisGroup}></g>
			<g class="axis" bind:this={xAxisGroup} transform="translate(0,{innerHeight})"></g>

			{#each counts as d (d.genre)}
				<path
					class="bar"
					class:active={hoveredGenre === d.genre}
					d={rightRoundedBar(0, y(d.genre), x(d.count), y.bandwidth(), 3)}
				/>
				<text class="value" x={x(d.count) + 8} y={y(d.genre) + y.bandwidth() / 2} dy="0.35em">
					{d.count}
				</text>
			{/each}

			<line class="baseline" x1="0" y1="0" x2="0" y2={innerHeight} />

			<!-- Full-width transparent rows: a bigger hover target than the bar itself,
			     so the one-song genres are still reachable. -->
			{#each counts as d (d.genre)}
				<rect
					class="hit"
					x={-margin.left}
					y={y(d.genre) - (y.step() - y.bandwidth()) / 2}
					width={width}
					height={y.step()}
					role="button"
					tabindex="0"
					aria-label="Highlight {d.count} {d.genre} songs in the scatterplot"
					onmouseenter={() => onGenreHover(d.genre)}
					onmouseleave={() => onGenreHover(null)}
					onfocus={() => onGenreHover(d.genre)}
					onblur={() => onGenreHover(null)}
				/>
			{/each}

			<text class="axis-title" x={innerWidth / 2} y={innerHeight + 38} text-anchor="middle">
				Songs (count)
			</text>
		</g>
	</svg>
</figure>

<style>
	.bar {
		fill: var(--series-1);
	}

	.bar.active {
		fill: var(--series-1-strong);
	}

	.baseline {
		stroke: var(--axis);
		stroke-width: 1;
	}

	.value {
		fill: var(--text-secondary);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
	}

	.hit {
		fill: transparent;
		cursor: pointer;
	}

	.hit:focus-visible {
		outline: 2px solid var(--series-1-strong);
		outline-offset: -2px;
	}
</style>
