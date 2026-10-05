<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { magRadius, MAX_RADIUS } from '$lib/scales.js';

	// sizeScale: 'linear' (radius ∝ magnitude) or 'sqrt' (area ∝ magnitude).
	let { sizeScale = 'sqrt', title = '' } = $props();

	const width = 800;
	const height = 500;
	const margin = { top: 20, right: 30, bottom: 50, left: 60 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const maxRadius = MAX_RADIUS;
	// Inset the scale ranges so even the largest circle fits inside the plot at every edge.
	const pad = maxRadius + 4;

	let data = $state([]);
	let xAxisG = $state();
	let yAxisG = $state();

	onMount(async () => {
		data = await d3.csv('/earthquakes_M6.0_1year.csv', (d) => ({
			...d,
			depth: +d.depth,
			mag: +d.mag
		}));
	});

	let xScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.depth) ?? 1])
			.range([pad, innerWidth - pad])
			.nice()
	);

	// Reversed range: SVG y grows downward, so higher magnitudes go to the top.
	let yScale = $derived(
		d3
			.scaleLinear()
			.domain(d3.extent(data, (d) => d.mag).map((v) => v ?? 0))
			.range([innerHeight - pad, pad])
			.nice()
	);

	let rScale = $derived(
		sizeScale === 'linear'
			? // Linear on radius: size preserves order, not value ratios (area grows with r²).
				d3
					.scaleLinear()
					.domain(d3.extent(data, (d) => d.mag).map((v) => v ?? 0))
					.range([3, maxRadius])
			: magRadius
	);

	const legendMags = [6, 7, 8];
	const legendHeight = 2 * maxRadius + 30;

	$effect(() => {
		d3.select(xAxisG).call(d3.axisBottom(xScale));
		d3.select(yAxisG).call(d3.axisLeft(yScale));
	});
</script>

<figure>
	{#if title}<h2>{title}</h2>{/if}

	<svg viewBox="0 0 {width} {height}">
		<g transform="translate({margin.left},{margin.top})">
			<g bind:this={xAxisG} transform="translate(0,{innerHeight})"></g>
			<g bind:this={yAxisG}></g>

			<text x={innerWidth / 2} y={innerHeight + 40} text-anchor="middle">Depth (km)</text>
			<text transform="rotate(-90)" x={-innerHeight / 2} y={-45} text-anchor="middle">
				Magnitude
			</text>

			{#each data as d (d.id)}
				<circle
					cx={xScale(d.depth)}
					cy={yScale(d.mag)}
					r={rScale(d.mag)}
					fill="steelblue"
					fill-opacity="0.7"
				/>
			{/each}
		</g>
	</svg>

	<svg viewBox="0 0 {width} {legendHeight}">
		<g transform="translate({margin.left},0)">
			<text x="0" y={maxRadius + 5}>Circle size: magnitude</text>
			{#each legendMags as m, i}
				<circle
					cx={220 + i * 80}
					cy={maxRadius + 2}
					r={rScale(m)}
					fill="steelblue"
					fill-opacity="0.7"
				/>
				<text x={220 + i * 80} y={2 * maxRadius + 22} text-anchor="middle">M{m}</text>
			{/each}
		</g>
	</svg>

	<p class="note">
		{#if sizeScale === 'linear'}
			Radius grows linearly with magnitude, so area grows with its square: an M8.8 circle has
			about 100× the area of an M6.0. Size preserves order, not value ratios.
		{:else}
			Magnitude is logarithmic: each step of 1 releases about 32× more energy, so an M8 releases
			roughly 1,000× the energy of an M6. Circle area here is proportional to the magnitude
			number, not to energy, so an M8 circle is only 8/6 ≈ 1.3× the area of an M6 circle.
		{/if}
	</p>
</figure>

<style>
	figure {
		margin: 0;
		min-width: 0;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.note {
		font-size: 0.9rem;
		padding-left: 7.5%;
	}
</style>
