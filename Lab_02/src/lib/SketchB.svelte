<script>
  import { scaleLinear } from 'd3';

  let { data } = $props();

  // --- layout (SVG user units; the svg scales to the card via viewBox) ---
  const W = 520;
  const M = { top: 10, right: 56, bottom: 46, left: 136 };
  const ROW = 30;      // one terminal per row
  const DOT = 5;       // radius -> 10px marker
  const innerW = W - M.left - M.right;

  // Same ranking as Sketch A: most positive at the top, most negative at the bottom.
  const sorted = $derived([...data].sort((a, b) => b.Change_percent - a.Change_percent));
  const innerH = $derived(sorted.length * ROW);
  const H = $derived(M.top + innerH + M.bottom);

  const x = $derived(scaleLinear().domain([-60, 10]).range([0, innerW]));
  const x0 = $derived(x(0));
  const ticks = $derived(x.ticks(8));

  const most = $derived(sorted[0]);                   // largest increase
  const least = $derived(sorted[sorted.length - 1]);  // largest decrease

  const fmtPct = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}%`;
  const fmtTick = (t) => `${t < 0 ? '−' : ''}${Math.abs(t)}%`;
</script>

<section aria-labelledby="heading-B">
  <h2 id="heading-B">Sketch B · Ranked dot plot</h2>
  <p class="sub">
    Percentage change in passenger movements by terminal,
    <strong>Jan–Oct 2019 vs. Jan–Oct 2023</strong>. Each dot's horizontal position is
    its terminal's change, read against the 0% reference line.
  </p>

  <ul class="legend">
    <li><span class="sw up"></span>Increase since 2019</li>
    <li><span class="sw down"></span>Decrease since 2019</li>
  </ul>

  <svg viewBox="0 0 {W} {H}" width="100%" role="img"
       aria-label="Ranked dot plot of percentage change in passenger movements at ten LAX terminals, January to October 2019 compared with January to October 2023. Largest increase {most?.Terminal} at {fmtPct(most?.Change_percent ?? 0)}; largest decrease {least?.Terminal} at {fmtPct(least?.Change_percent ?? 0)}.">
    <g transform="translate({M.left},{M.top})">

      <!-- gridlines: solid hairlines, one shade off the surface -->
      {#each ticks as t}
        {#if t !== 0}
          <line x1={x(t)} x2={x(t)} y1="0" y2={innerH} class="grid" />
        {/if}
      {/each}

      {#each sorted as d, i}
        {@const cy = i * ROW + ROW / 2}
        {@const xv = x(d.Change_percent)}
        {@const neg = d.Change_percent < 0}
        {@const col = neg ? 'var(--down)' : 'var(--up)'}
        {@const extreme = d === most || d === least}

        <text class="name" class:extreme x={-10} y={cy} dy="0.34em">{d.Terminal}</text>

        <!-- position alone carries the value: no stem back to the baseline -->
        <circle cx={xv} cy={cy} r={DOT} fill={col} stroke="#fff" stroke-width="2" />

        <!-- values in an aligned column so any two terminals compare directly -->
        <text class="val" class:extreme x={innerW + 50} y={cy} dy="0.34em">{fmtPct(d.Change_percent)}</text>
      {/each}

      <!-- 0% reference line: the anchor every dot is read against -->
      <line x1={x0} x2={x0} y1="-2" y2={innerH + 4} class="zero" />
      <text class="zerolab" x={x0} y={innerH + 18} text-anchor="middle">0%</text>

      <!-- x axis -->
      {#each ticks as t}
        {#if t !== 0}
          <text class="tick" x={x(t)} y={innerH + 18} text-anchor="middle">{fmtTick(t)}</text>
        {/if}
      {/each}
      <text class="axis-title" x={innerW / 2} y={innerH + 38} text-anchor="middle">
        Change in passenger movements (%)
      </text>
    </g>
  </svg>

  <p class="read">
    Largest increase: <strong>{most?.Terminal} ({fmtPct(most?.Change_percent ?? 0)})</strong>.
    Largest decrease: <strong>{least?.Terminal} ({fmtPct(least?.Change_percent ?? 0)})</strong>.
  </p>
  <p class="note">
    Ten comparable terminals. Both periods sum arrivals and departures, domestic and
    international. TBIT West Gates (no 2019 baseline) and Imperial Terminal (no records
    in either period) are excluded — absence is not zero. These ten are not all-airport
    totals for 2023. Counts are passenger movements, not unique people, and do not
    explain causes.
  </p>
</section>

<style>
  section {
    --up: #2a78d6;
    --down: #e34948;
    --ink: #0b0b0b;
    --ink-2: #52514e;
    --muted: #898781;
    --grid: #e1e0d9;
    padding: 1.5rem;
    background: white;
    border: 1px solid #bbb;
    border-radius: 6px;
  }
  h2 { margin: 0 0 0.35rem; font-size: 1.05rem; color: var(--ink); }
  .sub { margin: 0 0 0.6rem; font-size: 0.8rem; line-height: 1.45; color: var(--ink-2); }
  .sub strong { font-weight: 600; }

  .legend { display: flex; gap: 1rem; list-style: none; margin: 0 0 0.5rem; padding: 0;
            font-size: 0.75rem; color: var(--ink-2); }
  .legend li { display: flex; align-items: center; gap: 0.35rem; }
  .sw { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
  .sw.up { background: var(--up); }
  .sw.down { background: var(--down); }

  .grid { stroke: var(--grid); stroke-width: 1; }
  .zero { stroke: var(--muted); stroke-width: 1.5; }

  text { font-family: system-ui, sans-serif; }
  .name { font-size: 11px; fill: var(--ink-2); text-anchor: end; }
  .name.extreme { fill: var(--ink); font-weight: 600; }
  .val { font-size: 10.5px; fill: var(--ink-2); text-anchor: end;
         font-variant-numeric: tabular-nums; }
  .val.extreme { fill: var(--ink); font-weight: 700; }
  .tick, .zerolab { font-size: 10px; fill: var(--muted); font-variant-numeric: tabular-nums; }
  .zerolab { fill: var(--ink-2); font-weight: 600; }
  .axis-title { font-size: 10.5px; fill: var(--ink-2); }

  .read { margin: 0.7rem 0 0.4rem; font-size: 0.8rem; color: var(--ink); }
  .note { margin: 0; font-size: 0.7rem; line-height: 1.5; color: var(--muted); }
</style>
