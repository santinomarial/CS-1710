<script>
 import * as d3 from 'd3';
 let {data}=$props();
 let y=$derived(d3.scaleLinear().domain([0,Math.max(1,d3.max(data,d=>Math.max(d.weekday,d.weekend)))]).nice().range([150,15]));
 const x=d3.scaleBand().domain(d3.range(24)).range([35,370]).padding(.15);
</script>
<h2>When: departures per day</h2>
<p class="key">■ Weekday (5 days) <span>□ Weekend (2 days)</span></p>
<svg viewBox="0 0 385 190" role="img" aria-label="Hourly departures averaged per weekday and weekend day">
 {#each y.ticks(4) as tick}<line x1="35" x2="370" y1={y(tick)} y2={y(tick)} stroke="#ddd"/><text x="30" y={y(tick)+3} text-anchor="end">{tick}</text>{/each}
 {#each data as d}<rect data-hour={d.hour} data-kind="weekday" data-value={d.weekday} x={x(d.hour)} y={y(d.weekday)} width={x.bandwidth()/2} height={150-y(d.weekday)} fill="#245c83"><title>{d.hour}:00 weekday: {d.weekday.toFixed(1)} departures/day</title></rect><rect data-hour={d.hour} data-kind="weekend" data-value={d.weekend} x={x(d.hour)+x.bandwidth()/2} y={y(d.weekend)} width={x.bandwidth()/2} height={150-y(d.weekend)} fill="white" stroke="#245c83" stroke-width="1"><title>{d.hour}:00 weekend: {d.weekend.toFixed(1)} departures/day</title></rect>{#if d.hour%4===0}<text x={x(d.hour)} y="165">{d.hour}:00</text>{/if}{/each}
 <text x="200" y="185" text-anchor="middle">Hour of day (Boston local time)</text>
</svg>
<style>h2{font-size:17px;margin:16px 0 8px;}svg{width:100%;display:block;}text{font:10px Arial;fill:#333;}.key{font-size:12px;color:#245c83;}.key span{margin-left:10px;}</style>
