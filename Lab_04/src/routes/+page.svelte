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
		<KpiRow {songs} />

		<div class="views">
			<Timeline {songs} />
			<GenreBars {songs} />
			<Scatter {songs} />
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
