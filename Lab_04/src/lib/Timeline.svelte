<script>
	import * as d3 from 'd3';
	import { YEAR_MIN, YEAR_MAX } from '#lib/data.js';
	import { topRoundedBar } from '#lib/shapes.js';

	// `songs` is always the FULL dataset: the timeline is the context view, so its
	// bars and its year domain never shrink when a selection is active.
	let { songs = [], yearRange = null, onYearRange = () => {} } = $props();

	const width = 880;
	const height = 232;
	const margin = { top: 10, right: 12, bottom: 44, left: 48 };
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

	function inRange(year) {
		return yearRange === null || (year >= yearRange[0] && year <= yearRange[1]);
	}

	/**
	 * d3.brushX hands back pixels. scaleBand has no .invert(), so divide by the
	 * step to get band indices and read the years off the domain.
	 */
	function yearsFromPixels([px0, px1]) {
		const step = x.step();
		const first = x(years[0]); // left edge of the 1958 band, past the outer padding
		const last = years.length - 1;
		// Band i occupies the slot [first + i*step, first + (i+1)*step); a year is
		// selected when its slot overlaps the brush. EPS absorbs float error when a
		// snapped handle lands exactly on a boundary — without it (i*step)/step can
		// come back as i.000000000000004 and the range grows a year on every re-snap.
		const EPS = 1e-6;
		const clamp = (i) => Math.max(0, Math.min(last, i));
		const lo = clamp(Math.floor((px0 - first) / step + EPS));
		const hi = clamp(Math.ceil((px1 - first) / step - EPS) - 1);
		return hi < lo ? [years[lo], years[lo]] : [years[lo], years[hi]];
	}

	/**
	 * Snap the handles out to the selected bars' own edges, so the brush rectangle
	 * lines up with the bars instead of floating a fraction of a band to the left.
	 */
	function pixelsFromYears([y0, y1]) {
		return [x(y0), x(y1) + x.bandwidth()];
	}

	let xAxisGroup = $state();
	let yAxisGroup = $state();
	let brushGroup = $state();
	let brush;

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
			.call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickSizeOuter(0))
			.call((g) => g.select('.domain').remove());
	});

	$effect(() => {
		if (!brushGroup) return;
		brush = d3
			.brushX()
			.extent([
				[0, 0],
				[innerWidth, innerHeight]
			])
			.on('brush', (event) => {
				if (event.selection) onYearRange(yearsFromPixels(event.selection));
			})
			.on('end', (event) => {
				if (!event.selection) {
					onYearRange(null);
					return;
				}
				const range = yearsFromPixels(event.selection);
				onYearRange(range);
				// Only re-snap after a real drag; a programmatic move has no sourceEvent,
				// so this cannot loop.
				if (event.sourceEvent) {
					d3.select(brushGroup).call(brush.move, pixelsFromYears(range));
				}
			});
		d3.select(brushGroup).call(brush);
	});

	// Lets an outside reset (the Clear button) wipe the brush rectangle too.
	$effect(() => {
		const range = yearRange;
		if (!brushGroup || !brush) return;
		if (range === null && d3.brushSelection(brushGroup) !== null) {
			d3.select(brushGroup).call(brush.move, null);
		}
	});
</script>

<figure class="chart">
	<figcaption>
		<h2>Songs reaching #1 per year</h2>
		<p>
			Count of songs whose first week at #1 fell in that year. {YEAR_MIN} and {YEAR_MAX} are
			<strong>partial years</strong> — the chart debuted on 4 August {YEAR_MIN} and the data stops on
			11 January {YEAR_MAX} — so their low bars reflect a short window, not a quiet year.
			<strong>Drag across the chart to filter the views below</strong>; this chart always shows all
			{YEAR_MIN}–{YEAR_MAX} for context.
		</p>
	</figcaption>

	<svg viewBox="0 0 {width} {height}" role="img" aria-label="Bar chart of the number of songs that reached number one each year from 1958 to 2025, with a draggable year-range selection">
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis grid" bind:this={yAxisGroup}></g>
			<g class="axis" bind:this={xAxisGroup} transform="translate(0,{innerHeight})"></g>

			{#each counts as d (d.year)}
				<path
					class="bar"
					class:outside={!inRange(d.year)}
					d={topRoundedBar(x(d.year), y(d.count), x.bandwidth(), innerHeight - y(d.count), 2)}
				/>
			{/each}

			<line class="baseline" x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} />

			<g class="brush" bind:this={brushGroup}></g>

			<text class="axis-title" x={innerWidth / 2} y={innerHeight + 38} text-anchor="middle">
				Year the song reached #1
			</text>
			<text
				class="axis-title"
				transform="rotate(-90)"
				x={-innerHeight / 2}
				y={-34}
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

	/* Years outside the selection stay drawn — only their emphasis drops. */
	.bar.outside {
		fill-opacity: 0.25;
	}

	.baseline {
		stroke: var(--axis);
		stroke-width: 1;
	}

	.brush :global(.selection) {
		fill: var(--series-1);
		fill-opacity: 0.1;
		stroke: var(--series-1-strong);
		stroke-width: 1;
		shape-rendering: crispEdges;
	}

	.brush :global(.handle) {
		fill: var(--series-1-strong);
	}
</style>
