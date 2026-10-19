<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import LineChart from '#lib/LineChart.svelte';

	// One entry per scene in STORYBOARD.md; xDomain/highlightedYear/annotatedYear null mean full range / none.
	const SCENES = [
		{
			measure: 'fatalities',
			xDomain: null,
			highlightedYear: null,
			annotatedYear: null,
			text: 'Every year, tens of thousands of people die on American roads. This chart shows the total number of road deaths each year from 1975 to 2024. The line does not move in one direction: it climbs, falls, and climbs again, ranging between about 32,000 and 51,000 deaths a year. The 2024 figure is preliminary.'
		},
		{
			measure: 'fatalities',
			xDomain: null,
			highlightedYear: 1979,
			annotatedYear: null,
			text: 'The highest count came in 1979, when 51,093 people died in traffic crashes, the most of any year in this dataset. 1980 was nearly identical, at 51,091. Keep in mind that this is a raw count of deaths: it tells us how many people died, not how risky each mile of driving was.'
		},
		{
			measure: 'fatalities',
			xDomain: null,
			highlightedYear: 2011,
			annotatedYear: null,
			text: 'Three decades later, the count reached its lowest point. In 2011, 32,479 people died on U.S. roads, about 18,600 fewer than in 1979. But the low did not last. Deaths rose again in later years, and the preliminary 2024 count of 39,254 sits well above the 2011 low.'
		},
		{
			measure: 'fatalities',
			xDomain: null,
			highlightedYear: 2024,
			annotatedYear: null,
			text: 'Compare the two ends of the line. In 1975, 44,525 people died on U.S. roads; in 2024, the preliminary count was 39,254. That is about 12% fewer deaths across the fifty years of data: a real decline, but a modest one, and the path between those years was far from steady.'
		},
		{
			measure: 'rate_per_100m_vmt',
			xDomain: null,
			highlightedYear: 2024,
			annotatedYear: null,
			text: 'Now look at the same years through a different measure: deaths per 100 million vehicle-miles traveled, which accounts for how much Americans drove. This rate fell from 3.35 in 1975 to 1.19 in preliminary 2024 data, a drop of about 64%, far steeper than the 12% decline in total deaths.'
		},
		{
			measure: 'rate_per_100m_vmt',
			xDomain: [2019, 2024],
			highlightedYear: 2024,
			annotatedYear: 2020,
			text: 'The decline was not steady. In 2020, vehicle-miles traveled fell about 11% from 2019, yet road deaths rose about 7%, from 36,355 to 39,007. Fewer miles and more deaths pushed the rate from 1.11 to 1.34 deaths per 100 million vehicle-miles, its sharpest one-year rise in this dataset. It reached 1.38 in 2021, then eased to a preliminary 1.19 in 2024.'
		},
		{
			measure: 'rate_per_100m_vmt',
			xDomain: null,
			highlightedYear: 2024,
			annotatedYear: null,
			text: 'Step back to the full fifty years and the long-term pattern is clear. The death rate per mile driven fell by roughly two-thirds, even though it rose in ten individual years, including 2020 and 2021. Total deaths tell a more uneven story. Which measure we choose shapes the story we tell.'
		}
	];

	let step = $state(0);

	let measure = $derived(SCENES[step].measure);
	let xDomain = $derived(SCENES[step].xDomain);
	let highlightedYear = $derived(SCENES[step].highlightedYear);
	let annotatedYear = $derived(SCENES[step].annotatedYear);

	let data = $state([]);
	let error = $state(null);

	onMount(() => {
		d3.csv('/us_road_deaths_by_year.csv', (d) => ({
			year: +d.year,
			fatalities: +d.fatalities,
			vmt_billions: +d.vmt_billions,
			rate_per_100m_vmt: +d.rate_per_100m_vmt,
			population: +d.population
		}))
			.then((rows) => (data = rows))
			.catch((e) => (error = e.message));

		// Scrollama reads window/document, so load and set it up only in the browser.
		let scroller;
		let destroyed = false;
		const handleResize = () => scroller?.resize();

		import('scrollama').then(({ default: scrollama }) => {
			if (destroyed) return;
			scroller = scrollama();
			scroller
				.setup({ step: '.step', offset: 0.6 })
				.onStepEnter((response) => (step = response.index));
			window.addEventListener('resize', handleResize);
		});

		return () => {
			destroyed = true;
			window.removeEventListener('resize', handleResize);
			scroller?.destroy();
		};
	});
</script>

<svelte:head>
	<title>U.S. Road Deaths: Why the Measure Matters</title>
</svelte:head>

<section class="scrolly">
	<div class="graphic">
		<div class="graphic-inner">
			{#if error}
				<p class="status">Could not load data: {error}</p>
			{:else if data.length === 0}
				<p class="status">Loading data…</p>
			{:else}
				<LineChart {data} {measure} {xDomain} {highlightedYear} {annotatedYear} />
			{/if}
		</div>
	</div>

	<div class="steps">
		<header class="intro">
			<h1>U.S. Road Deaths: Why the Measure Matters</h1>
			<p>Fifty years of U.S. traffic deaths, 1975–2024. Scroll to read.</p>
		</header>

		{#each SCENES as scene, i}
			<div class="step" class:active={step === i}>
				<p>{scene.text}</p>
			</div>
		{/each}
	</div>
</section>

<footer class="source">
	<p>
		Source: NHTSA Fatality Analysis Reporting System (FARS); vehicle-miles from FHWA. 2024 is a
		preliminary estimate.
	</p>
</footer>

<style>
	:global(:root) {
		color-scheme: light;
		--surface: #fcfcfb;
		--text-primary: #0b0b0b;
		--text-secondary: #52514e;
		--grid: #e8e7e3;
		--axis: #a3a29c;
		--series-1: #2a78d6;
		--highlight: #eb6834;
		--card: rgb(252 252 251 / 0.94);
		--card-border: #e0dfdb;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light'])) {
			color-scheme: dark;
			--surface: #1a1a19;
			--text-primary: #f0efec;
			--text-secondary: #c3c2b7;
			--grid: #2e2e2c;
			--axis: #6b6a65;
			--series-1: #3987e5;
			--highlight: #d95926;
			--card: rgb(26 26 25 / 0.94);
			--card-border: #3a3a37;
		}
	}

	:global(:root[data-theme='dark']) {
		color-scheme: dark;
		--surface: #1a1a19;
		--text-primary: #f0efec;
		--text-secondary: #c3c2b7;
		--grid: #2e2e2c;
		--axis: #6b6a65;
		--series-1: #3987e5;
		--highlight: #d95926;
		--card: rgb(26 26 25 / 0.94);
		--card-border: #3a3a37;
	}

	:global(body) {
		margin: 0;
		background: var(--surface);
		color: var(--text-primary);
		font-family:
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			sans-serif;
		line-height: 1.5;
	}

	.source {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* The intro sits in the text column, above the first step, so it never pushes the sticky graphic down. */
	.intro {
		padding: 3rem 0 2rem;
	}

	.intro h1 {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		line-height: 1.2;
		margin: 0 0 0.5rem;
	}

	.intro p {
		color: var(--text-secondary);
		margin: 0;
	}

	.scrolly {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
		gap: 2rem;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.graphic {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		align-items: center;
	}

	.graphic-inner {
		width: 100%;
	}


	/* The card sits at the top of its step, so it is on screen when the step's top crosses the 60% trigger line. */
	.step {
		min-height: 90vh;
	}

	.step p {
		margin: 0;
		padding: 1.25rem 1.5rem;
		background: var(--card);
		border: 1px solid var(--card-border);
		border-left: 4px solid var(--card-border);
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 1.0625rem;
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.step.active p {
		color: var(--text-primary);
		border-left-color: var(--series-1);
	}

	.status,
	.source {
		color: var(--text-secondary);
		font-size: 0.8125rem;
	}

	.source {
		padding-bottom: 3rem;
	}

	/* Mobile: chart pinned to the top of the screen, text cards scroll over the lower part. */
	@media (max-width: 800px) {
		.scrolly {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
		}

		.graphic,
		.steps {
			grid-area: 1 / 1;
		}

		.graphic {
			align-items: flex-start;
			padding-top: 1rem;
			box-sizing: border-box;
		}

		.steps {
			position: relative;
			z-index: 1;
			padding-top: 55vh;
		}

		.intro {
			padding: 1.25rem 1.5rem;
			margin-bottom: 2rem;
			background: var(--card);
			border: 1px solid var(--card-border);
			border-radius: 8px;
		}

		.step p {
			font-size: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.step p {
			transition: none;
		}
	}
</style>
