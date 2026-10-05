<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { prepareSongs, YEAR_MIN, YEAR_MAX } from '#lib/data.js';
	import KpiRow from '#lib/KpiRow.svelte';
	import Timeline from '#lib/Timeline.svelte';
	import GenreBars from '#lib/GenreBars.svelte';
	import Scatter from '#lib/Scatter.svelte';

	let songs = $state([]);
	let loading = $state(true);
	let loadError = $state(null);

	// Shared interaction state, both owned here.
	// hoveredGenre only changes how marks are drawn — it never filters anything.
	// yearRange is the one filter, as an inclusive [startYear, endYear]; null = all years.
	let hoveredGenre = $state(null);
	let yearRange = $state(null);

	// The single filtered array behind the KPIs, genre bars, and scatterplot.
	// The timeline deliberately does not use it.
	let filtered = $derived(
		yearRange === null
			? songs
			: songs.filter((d) => d.year !== null && d.year >= yearRange[0] && d.year <= yearRange[1])
	);

	let scope = $derived(
		yearRange === null
			? `all years, ${YEAR_MIN}–${YEAR_MAX}`
			: yearRange[0] === yearRange[1]
				? `${yearRange[0]}`
				: `${yearRange[0]}–${yearRange[1]}`
	);

	function clearSelection() {
		yearRange = null;
	}

	onMount(async () => {
		try {
			songs = prepareSongs(await d3.csv('/billboard_hot_100_no1.csv'));
		} catch (error) {
			loadError = error instanceof Error ? error.message : String(error);
		} finally {
			loading = false;
		}
	});

	let undated = $derived(songs.filter((d) => d.year === null).length);
</script>

<svelte:head><title>Lab 4: Billboard Dashboard</title></svelte:head>

<main>
	<header>
		<h1>Every Billboard Hot 100 #1, {YEAR_MIN}–{YEAR_MAX}</h1>
		<p>
			One row per song, recorded in the week it reached #1. This is the tip of the chart only — it
			says nothing about songs that peaked lower, or about the Hot 100 as a whole.
		</p>
	</header>

	{#if loadError}
		<p class="status error">Could not load the dataset: {loadError}</p>
	{:else if loading}
		<p class="status">Loading the dataset…</p>
	{:else}
		<KpiRow songs={filtered} {scope} />

		<div class="views">
			<Timeline {songs} {yearRange} onYearRange={(range) => (yearRange = range)} />

			<div class="controls">
				<p class="range-note" aria-live="polite">
					{#if yearRange === null}
						<strong>No year selected.</strong> Drag across the timeline to filter the views below.
					{:else}
						Selected <strong>{scope}</strong> — {filtered.length} of {songs.length} songs.
					{/if}
				</p>
				<button type="button" onclick={clearSelection} disabled={yearRange === null}>
					Clear selection
				</button>
			</div>

			<p class="hint">
				Hover a genre bar to highlight those songs in the scatterplot. Every song stays plotted —
				the rest just fade — so the counts never change.
			</p>

			<div class="two-up">
				<GenreBars
					songs={filtered}
					{scope}
					{hoveredGenre}
					onGenreHover={(genre) => (hoveredGenre = genre)}
				/>
				<Scatter songs={filtered} {scope} {hoveredGenre} />
			</div>
		</div>

		<footer>
			<p>
				Source: “Uncharted Territory” by Chris Dalla Riva — {songs.length} songs,
				{YEAR_MIN}–{YEAR_MAX}.
				{#if undated > 0}
					{undated} row{undated === 1 ? '' : 's'} had an unreadable date and {undated === 1
						? 'is'
						: 'are'} left out of the yearly chart.
				{/if}
				Averages skip blank values rather than counting them as zero; each card names the number of
				songs behind it.
			</p>
		</footer>
	{/if}
</main>

<style>
	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 40px 24px 64px;
	}

	header h1 {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	header p {
		margin: 8px 0 28px;
		max-width: 70ch;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.views {
		display: grid;
		gap: 24px;
		margin-top: 24px;
	}

	.two-up {
		display: grid;
		gap: 24px;
		/* Side by side once there is room for two readable charts; stacked below that. */
		grid-template-columns: 1fr;
	}

	@media (min-width: 900px) {
		.two-up {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 16px;
		background: var(--surface-1);
		border: 1px solid var(--border);
		border-radius: 10px;
	}

	.range-note {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.controls button {
		flex: none;
		padding: 7px 14px;
		font: inherit;
		font-size: 0.8125rem;
		color: var(--text-primary);
		background: var(--page);
		border: 1px solid var(--axis);
		border-radius: 7px;
		cursor: pointer;
	}

	.controls button:hover:not(:disabled) {
		border-color: var(--series-1-strong);
		color: var(--series-1-strong);
	}

	.controls button:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.hint {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.status {
		color: var(--text-secondary);
		font-size: 0.9375rem;
	}

	.error {
		color: #d03b3b;
	}

	footer p {
		margin: 28px 0 0;
		max-width: 80ch;
		font-size: 0.75rem;
		line-height: 1.6;
		color: var(--text-muted);
	}
</style>
