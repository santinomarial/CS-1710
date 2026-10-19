<script>
	import * as d3 from 'd3';

	/**
	 * @type {{
	 *   data: Array<Record<string, number>>,
	 *   measure?: 'fatalities' | 'rate_per_100m_vmt',
	 *   xDomain?: [number, number] | null,
	 *   highlightedYear?: number | null,
	 *   annotatedYear?: number | null
	 * }}
	 */
	let {
		data,
		measure = 'fatalities',
		xDomain = null,
		highlightedYear = null,
		annotatedYear = null
	} = $props();

	// Labels and number formats for each supported column.
	const MEASURES = {
		fatalities: {
			title: 'U.S. road deaths per year',
			axis: 'Annual road deaths',
			tick: (/** @type {number} */ n) => d3.format('~s')(n).replace('k', 'K'),
			value: d3.format(',')
		},
		rate_per_100m_vmt: {
			title: 'U.S. road death rate per year',
			axis: 'Deaths per 100 million vehicle-miles',
			tick: d3.format('.1f'),
			value: d3.format('.2f')
		}
	};

	const margin = { top: 16, right: 20, bottom: 48, left: 64 };

	let width = $state(640);
	let height = $derived(Math.max(280, Math.min(460, width * 0.6)));
	let innerWidth = $derived(Math.max(0, width - margin.left - margin.right));
	let innerHeight = $derived(height - margin.top - margin.bottom);

	let config = $derived(MEASURES[measure]);

	// The measure prop names the CSV column; this accessor reads that column from each row.
	let value = $derived((/** @type {Record<string, number>} */ d) => d[measure]);

	// null means the full range of years in the data.
	let domain = $derived(
		xDomain ?? /** @type {[number, number]} */ (d3.extent(data, (d) => d.year))
	);

	let x = $derived(d3.scaleLinear().domain(domain).range([0, innerWidth]));

	let visibleData = $derived(data.filter((d) => d.year >= domain[0] && d.year <= domain[1]));

	// Zero baseline so year-to-year wiggles are shown at their true proportion.
	// The y maximum comes from all years, so zooming in on x never rescales y.
	let y = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(data, value) ?? 1])
			.nice()
			.range([innerHeight, 0])
	);

	let linePath = $derived(
		d3
			.line()
			.x((d) => x(d.year))
			.y((d) => y(value(d)))(/** @type {any} */ (visibleData)) ?? ''
	);

	// Shrink markers when years are tightly packed (narrow screens).
	let markerRadius = $derived(
		Math.max(1.5, Math.min(3.5, innerWidth / Math.max(visibleData.length, 1) / 3))
	);

	// A highlight outside the visible years is hidden; the prop itself is left unchanged.
	let highlighted = $derived(
		highlightedYear == null ? null : (visibleData.find((d) => d.year === highlightedYear) ?? null)
	);

	// Label for one visible year: its value and the change from the year before, read from the data.
	let annotation = $derived.by(() => {
		if (annotatedYear == null) return null;
		const d = visibleData.find((r) => r.year === annotatedYear);
		const prev = data.find((r) => r.year === annotatedYear - 1);
		if (!d || !prev) return null;
		const change = value(d) - value(prev);
		return {
			x: x(d.year),
			y: y(value(d)),
			headline: `${d.year}: ${config.value(value(d))}`,
			detail: `${change >= 0 ? 'Up' : 'Down'} ${config.value(Math.abs(change))} from ${config.value(value(prev))} in ${prev.year}`
		};
	});

	/** @type {SVGGElement} */
	let xAxisG = $state();
	/** @type {SVGGElement} */
	let yAxisG = $state();

	$effect(() => {
		d3.select(xAxisG)
			.call(
				d3
					.axisBottom(x)
					// Whole years only, so a short zoomed range never shows 2019.5.
					.tickValues(x.ticks(width < 520 ? 5 : 10).filter(Number.isInteger))
					.tickFormat(d3.format('d'))
					.tickSizeOuter(0)
			)
			.call((g) => g.select('.domain').attr('class', 'domain baseline'));
	});

	$effect(() => {
		d3.select(yAxisG)
			.call(
				d3
					.axisLeft(y)
					.ticks(6)
					.tickFormat(/** @type {any} */ (config.tick))
					.tickSize(-innerWidth)
			)
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('.tick line').attr('class', 'grid'));
	});

	let [firstYear, lastYear] = $derived(x.domain());
	let description = $derived(
		visibleData.length
			? `Line chart of ${config.axis.toLowerCase()} from ${firstYear} to ${lastYear}. ` +
					`${firstYear}: ${config.value(value(visibleData[0]))}; ` +
					`${lastYear}: ${config.value(value(visibleData[visibleData.length - 1]))}.` +
					(highlighted
						? ` Highlighted: ${highlighted.year}, ${config.value(value(highlighted))}.`
						: '') +
					(annotation ? ` Annotation: ${annotation.headline}, ${annotation.detail}.` : '')
			: 'Loading chart.'
	);
</script>

<figure class="chart" bind:clientWidth={width}>
	<figcaption class="title">{config.title}, {firstYear}–{lastYear}</figcaption>

	<svg {width} {height} role="img" aria-label={description}>
		<g transform="translate({margin.left},{margin.top})">
			<g class="axis y-axis" bind:this={yAxisG}></g>
			<g class="axis x-axis" transform="translate(0,{innerHeight})" bind:this={xAxisG}></g>

			<path class="line" d={linePath} />

			{#each visibleData as d (d.year)}
				<circle class="marker" cx={x(d.year)} cy={y(value(d))} r={markerRadius} />
			{/each}

			{#if highlighted}
				<circle
					class="highlight"
					cx={x(highlighted.year)}
					cy={y(value(highlighted))}
					r={Math.max(6, markerRadius * 2)}
				/>
			{/if}

			{#if annotation}
				<!-- Sits above the point, in the empty space over the line; anchored left so it stays inside the plot. -->
				<g class="annotation" transform="translate({annotation.x},{annotation.y})">
					<line x1="0" x2="0" y1="-36" y2="-8" />
					<text class="annotation-headline" x="-6" y="-58">{annotation.headline}</text>
					<text class="annotation-detail" x="-6" y="-42">{annotation.detail}</text>
				</g>
			{/if}

			<text
				class="axis-label"
				transform="rotate(-90)"
				x={-innerHeight / 2}
				y={-margin.left + 16}
				text-anchor="middle">{config.axis}</text
			>
			<text class="axis-label" x={innerWidth / 2} y={innerHeight + 40} text-anchor="middle"
				>Year</text
			>
		</g>
	</svg>
</figure>

<style>
	.chart {
		margin: 0;
		width: 100%;
	}

	.title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	svg {
		display: block;
		overflow: visible;
	}

	.line {
		fill: none;
		stroke: var(--series-1);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.marker {
		fill: var(--series-1);
		stroke: var(--surface);
		stroke-width: 1;
	}

	.highlight {
		fill: var(--highlight);
		stroke: var(--surface);
		stroke-width: 2;
	}

	.annotation line {
		stroke: var(--axis);
		stroke-width: 1;
	}

	.annotation text {
		paint-order: stroke;
		stroke: var(--surface);
		stroke-width: 3px;
		stroke-linejoin: round;
		font-variant-numeric: tabular-nums;
	}

	.annotation-headline {
		fill: var(--text-primary);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.annotation-detail {
		fill: var(--text-secondary);
		font-size: 0.75rem;
	}

	.axis-label {
		fill: var(--text-secondary);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.axis :global(text) {
		fill: var(--text-secondary);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
	}

	.axis :global(.tick line) {
		stroke: var(--axis);
	}

	.axis :global(.tick line.grid) {
		stroke: var(--grid);
	}

	.axis :global(.baseline) {
		stroke: var(--axis);
	}
</style>
