<script>
	import * as d3 from 'd3';

	let { songs = [], scope = '' } = $props();

	const count = d3.format(',');
	const oneDecimal = d3.format('.1f');

	// Each average states its own denominator: blanks are skipped, never zeroed.
	let bpm = $derived(songs.map((d) => d.bpm).filter((v) => v !== null));
	let weeks = $derived(songs.map((d) => d.weeksAtNumberOne).filter((v) => v !== null));

	let cards = $derived([
		{
			label: 'Songs that reached #1',
			value: count(songs.length),
			unit: 'songs',
			note: `One row per song, not per chart-week`
		},
		{
			label: 'Average tempo',
			value: bpm.length ? oneDecimal(d3.mean(bpm)) : '—',
			unit: 'BPM',
			note: `Mean of ${count(bpm.length)} songs with a BPM value`
		},
		{
			label: 'Average time at #1',
			value: weeks.length ? oneDecimal(d3.mean(weeks)) : '—',
			unit: 'weeks',
			note: weeks.length
				? `Mean of ${count(weeks.length)} songs; range ${d3.min(weeks)}–${d3.max(weeks)} weeks`
				: 'No songs selected'
		}
	]);
</script>

<p class="kpi-scope">Summarising <strong>{scope}</strong> — every figure below is for this selection.</p>

<div class="kpi-row">
	{#each cards as card (card.label)}
		<div class="kpi-card">
			<div class="kpi-label">{card.label}</div>
			<div class="kpi-value">
				{card.value}<span class="kpi-unit">{card.unit}</span>
			</div>
			<div class="kpi-note">{card.note}</div>
		</div>
	{/each}
</div>

<style>
	.kpi-scope {
		margin: 0 0 12px;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.kpi-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 16px;
	}

	.kpi-card {
		background: var(--surface-1);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 18px 20px;
	}

	.kpi-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.kpi-value {
		margin-top: 6px;
		font-size: 2.25rem;
		line-height: 1.1;
		color: var(--text-primary);
	}

	.kpi-unit {
		margin-left: 8px;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.kpi-note {
		margin-top: 8px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
