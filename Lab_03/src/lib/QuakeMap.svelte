<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { feature } from 'topojson-client';
	import landTopo from 'world-atlas/land-110m.json';
	import { magRadius, MAX_RADIUS } from '$lib/scales.js';

	// depthRange: 'full' (min → max depth) or 'p95' (min → 95th percentile, clamped).
	let { depthRange = 'full', title = '' } = $props();
	const uid = $props.id();

	// Plot area is exactly 2:1 so 360° of longitude and 180° of latitude get the same px per degree.
	const mapWidth = 900;
	const mapHeight = mapWidth / 2;
	// Margins at least MAX_RADIUS so circles near ±180° or the poles are not cut off by the SVG edge.
	const pad = MAX_RADIUS + 4;
	const width = mapWidth + 2 * pad;
	const height = mapHeight + 2 * pad;

	let data = $state([]);

	onMount(async () => {
		data = await d3.csv('/earthquakes_M6.0_1year.csv', (d) => ({
			...d,
			longitude: +d.longitude,
			latitude: +d.latitude,
			depth: +d.depth,
			mag: +d.mag
		}));
	});

	const xScale = d3.scaleLinear().domain([-180, 180]).range([0, mapWidth]);
	// Reversed range: SVG y grows downward, so north (+90°) goes to the top.
	const yScale = d3.scaleLinear().domain([-90, 90]).range([mapHeight, 0]);

	// Equirectangular projection set up to match xScale/yScale exactly:
	// x = s·λ + mapWidth/2 with s = mapWidth / 2π (λ in radians) equals xScale(lon), and likewise
	// for y because mapHeight = mapWidth / 2. D3's projection also cuts coastlines at ±180°.
	const projection = d3
		.geoEquirectangular()
		.scale(mapWidth / (2 * Math.PI))
		.translate([mapWidth / 2, mapHeight / 2]);
	const landPath = d3.geoPath(projection)(feature(landTopo, landTopo.objects.land));

	// Depth has a long right tail (median ~23 km, max 636 km). The 'p95' version stops the domain
	// at the 95th percentile and clamps deeper quakes to the top color.
	let depthMin = $derived(d3.min(data, (d) => d.depth) ?? 0);
	let depthMax = $derived(
		(depthRange === 'p95'
			? d3.quantile(data, 0.95, (d) => d.depth)
			: d3.max(data, (d) => d.depth)) ?? 1
	);
	let colorScale = $derived(
		d3
			.scaleSequential(d3.interpolateViridis)
			.domain([depthMin, depthMax])
			.clamp(depthRange === 'p95')
	);

	// Draw the largest circles first so smaller ones stay visible on top.
	let quakes = $derived(d3.sort(data, (d) => -d.mag));

	// Legends
	// At least tall enough for the two-line depth note (baseline at y = 84).
	const legendHeight = Math.max(2 * MAX_RADIUS + 60, 96);
	const legendMags = [6, 7, 8];
	const colorLegendX = 520;
	const colorLegendWidth = 300;
	let colorLegendScale = $derived(
		d3.scaleLinear().domain([depthMin, depthMax]).range([0, colorLegendWidth])
	);
	const gradientStops = d3.range(0, 1.01, 0.1);
	let colorAxisG = $state();
	const fmt1 = d3.format('.1f');

	// Exact endpoints plus round interior ticks, dropping any too close to an endpoint to fit a label.
	let colorTicks = $derived.by(() => {
		const gap = (depthMax - depthMin) * 0.12;
		const inner = colorLegendScale
			.ticks(5)
			.filter((t) => t > depthMin + gap && t < depthMax - gap);
		return [depthMin, ...inner, depthMax];
	});

	$effect(() => {
		d3.select(colorAxisG).call(
			d3
				.axisBottom(colorLegendScale)
				.tickValues(colorTicks)
				.tickFormat((d) => {
					if (d === depthMax) return depthRange === 'p95' ? `≥ ${fmt1(d)}` : fmt1(d);
					return d === depthMin ? fmt1(d) : d;
				})
		);
	});
</script>

<figure>
	{#if title}<h2>{title}</h2>{/if}

	<svg viewBox="0 0 {width} {height}">
		<g transform="translate({pad},{pad})">
			<rect width={mapWidth} height={mapHeight} fill="#f7f9fb" stroke="#ddd" />
			<path d={landPath} fill="#e4e4e4" stroke="#c8c8c8" stroke-width="0.5" />

			{#each quakes as d (d.id)}
				<circle
					cx={xScale(d.longitude)}
					cy={yScale(d.latitude)}
					r={magRadius(d.mag)}
					fill={colorScale(d.depth)}
					fill-opacity="0.6"
					stroke="#333"
					stroke-width="0.5"
				/>
			{/each}
		</g>
	</svg>

	<svg viewBox="0 0 {width} {legendHeight}">
		<defs>
			<linearGradient id="depth-gradient-{uid}">
				{#each gradientStops as t}
					<stop offset="{t * 100}%" stop-color={colorScale.interpolator()(t)} />
				{/each}
			</linearGradient>
		</defs>

		<g transform="translate({pad},0)">
			<text x="0" y={MAX_RADIUS + 5}>Circle size: magnitude</text>
			{#each legendMags as m, i}
				<circle
					cx={220 + i * 80}
					cy={MAX_RADIUS + 2}
					r={magRadius(m)}
					fill="none"
					stroke="#333"
				/>
				<text x={220 + i * 80} y={2 * MAX_RADIUS + 22} text-anchor="middle">M{m}</text>
			{/each}

			<g transform="translate({colorLegendX},14)">
				<text x="0" y="0">Depth (km)</text>
				<rect y="8" width={colorLegendWidth} height="14" fill="url(#depth-gradient-{uid})" />
				<g bind:this={colorAxisG} transform="translate(0,22)"></g>
				<text x="0" y="56" font-size="12">
					{#if depthRange === 'p95'}
						<tspan x="0">Quakes at or deeper than {fmt1(depthMax)} km</tspan>
						<tspan x="0" dy="14">(95th percentile) use the top color.</tspan>
					{:else}
						Full range: {fmt1(depthMin)}–{fmt1(depthMax)} km.
					{/if}
				</text>
			</g>
		</g>
	</svg>

	<figcaption>
		<strong>M6.0 and larger only.</strong> Magnitude is logarithmic: each step of 1 releases about
		32× more energy. Circle area is proportional to the magnitude number, not to energy, so an M8
		circle is only about 1.3× the area of an M6 even though it released roughly 1,000× the energy.
	</figcaption>
</figure>

<style>
	figure {
		margin: 0;
		max-width: 1100px;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	figcaption {
		font-size: 0.9rem;
		padding: 0 3.5%;
	}
</style>
