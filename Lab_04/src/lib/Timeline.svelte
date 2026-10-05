<script>
	import * as d3 from 'd3';
	import { YEAR_MIN, YEAR_MAX } from '#lib/data.js';
	import { topRoundedBar } from '#lib/shapes.js';

	let { songs = [] } = $props();

	const width = 880;
	const height = 320;
	const margin = { top: 12, right: 12, bottom: 46, left: 52 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const years = d3.range(YEAR_MIN, YEAR_MAX + 1);

	// Every year in 1958–2025 gets a slot, so a year with no #1 debut reads as zero.
	let counts = $derived.by(() => {
		const byYear = d3.rollup(
			songs.filter((d) => d.year !== null),
			(v) => v.length,
			(d) => d.year
		);
		return years.map((year) => ({ year, count: byYear.get(year) ?? 0 }));
	});

	let x = $derived(d3.scaleBand().domain(years).range([0, innerWidth]).padding(0.22));
	let y = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(counts, (d) => d.count) || 1])
			.nice()
			.range([innerHeight, 0])
	);

	let xAxisGroup = $state();
	let yAxisGroup = $state();

	$effect(() => {
		if (!xAxisGroup) return;
		d3.select(xAxisGroup).call(
			d3
				.axisBottom(x)
				.tickValues(years.filter((yr) => yr % 10 === 0))
				.tickSizeOuter(0)
				.tickFormat(d3.format('d'))
		);
	});

	$effect(() => {
		if (!yAxisGroup) return;
		d3.select(yAxisGroup)
			.call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickSizeOuter(0))
			.call((g) => g.select('.domain').remove());
	});
</script>

<figure class="chart">
	<figcaption>
		<h2>Songs reaching #1 per year</h2>
		<p>Count of songs whose first week at #1 fell in that year, {YEAR_MIN}–{YEAR_MAX}.</p>
	</figcaption>

	<svg viewBox="0 0 {width} {height}" role="img" aria-label="Bar chart of the number of songs that reached number one each year from 1958 to 2025">
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis grid" bind:this={yAxisGroup}></g>
			<g class="axis" bind:this={xAxisGroup} transform="translate(0,{innerHeight})"></g>

			{#each counts as d (d.year)}
				<path
					class="bar"
					d={topRoundedBar(x(d.year), y(d.count), x.bandwidth(), innerHeight - y(d.count), 2)}
				/>
			{/each}

			<line class="baseline" x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} />

			<text class="axis-title" x={innerWidth / 2} y={innerHeight + 40} text-anchor="middle">
				Year the song reached #1
			</text>
			<text
				class="axis-title"
				transform="rotate(-90)"
				x={-innerHeight / 2}
				y={-38}
				text-anchor="middle"
			>
				Songs (count)
			</text>
		</g>
	</svg>
</figure>

<style>
	.bar {
		fill: var(--series-1);
	}

	.baseline {
		stroke: var(--axis);
		stroke-width: 1;
	}
</style>
