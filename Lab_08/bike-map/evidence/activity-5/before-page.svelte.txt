<script>
  import { onMount, tick } from 'svelte';
  import * as d3 from 'd3';
  import 'leaflet/dist/leaflet.css';
  import HourlyChart from '../lib/HourlyChart.svelte';
  import {selectedIds, summaries} from '../lib/selection.js';
  let container;
  let pin;
  let center = $state({lat:42.373362,lon:-71.118956});
  let selectionName = $state('Harvard');
  const lookup = $derived(new Map(stations.map(s=>[s.id,s])));
  const selected = $derived(selectedIds(stations,center));
  const summary = $derived(summaries(trips,selected,lookup));
  const pinPoint = $derived.by(()=>{revision;return map?map.latLngToContainerPoint([center.lat,center.lon]):{x:0,y:0};});
  const radiusPx = $derived.by(()=>{revision;if(!map)return 0;const east=map.latLngToContainerPoint([center.lat,center.lon+400/(111195*Math.cos(center.lat*Math.PI/180))]);return Math.abs(east.x-pinPoint.x);});
  const flows = $derived.by(()=>{revision;return map?summary.destinations.map(d=>({...d,point:map.latLngToContainerPoint([d.lat,d.lon])})):[];});
  function choose(s){center={lat:s.lat,lon:s.lon};selectionName=s.name;pin?.setLatLng([s.lat,s.lon]);}

  let map = $state.raw(null);
  let stations = $state.raw([]);
  let trips = $state.raw([]);
  let revision = $state(0);
  let error = $state('');
  let loading = $state(true);
  const colors = {Red:'#DA291C', Orange:'#ED8B00', Blue:'#003DA5', Green:'#00843D', Mattapan:'#DA291C'};
  const linesFor = s => [...new Set(s.lines.split('|').filter(Boolean).map(l => l.startsWith('Green') ? 'Green' : l))];
  const colorFor = s => { const lines = linesFor(s); return lines.length > 1 ? '#222222' : colors[lines[0]] ?? '#222222'; };
  let projected = $derived.by(() => {
    revision;
    if (!map) return [];
    return stations.map(station => ({...station, point: map.latLngToContainerPoint([station.lat, station.lon])}));
  });
  let unmatched = $derived.by(() => {
    const ids = new Set(stations.map(s=>s.id));
    const missing = new Set(); let affected=0;
    for(const trip of trips){let bad=false;for(const id of [trip.start_id,trip.end_id])if(!ids.has(id)){missing.add(id);bad=true;}if(bad)affected++;}
    return {ids:[...missing],affected};
  });
  onMount(() => {
    let disposed=false, instance, observer;
    const parseTime=d3.timeParse('%Y-%m-%d %H:%M');
    async function initialize(){
      try {
        const [L, loadedStations, loadedTrips] = await Promise.all([
          import('leaflet'),
          d3.csv('/stations.csv', s=>({...s,lat:Number(s.lat),lon:Number(s.lon),capacity:s.capacity===''?null:Number(s.capacity)})),
          d3.csv('/trips_week.csv', t=>({...t,started:parseTime(t.started),dur_min:Number(t.dur_min)}))
        ]);
        if(disposed)return;
        if(loadedStations.some(s=>!Number.isFinite(s.lat)||!Number.isFinite(s.lon)))throw Error('Invalid station coordinates');
        if(loadedTrips.some(t=>!t.started||!Number.isFinite(t.dur_min)))throw Error('Invalid trip time or duration');
        stations=loadedStations; trips=loadedTrips;
        const harvard=stations.find(s=>s.id==='place-harsq');
        center={lat:harvard.lat,lon:harvard.lon};loading=false;await tick();
        instance=L.map(container,{zoomAnimation:false}).setView([harvard.lat,harvard.lon],13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
        instance.on('move zoom resize',()=>revision++);
        map=instance;
        pin=L.marker([center.lat,center.lon],{draggable:true,autoPan:true,title:'Drag to move the 400 m selection',icon:L.divIcon({className:'selection-pin',html:'<span>✥</span>',iconSize:[32,32],iconAnchor:[16,16]})}).addTo(instance);
        const update=()=>{const ll=pin.getLatLng();center={lat:ll.lat,lon:ll.lng};selectionName='Custom location';};
        pin.on('drag',update);
        observer=new ResizeObserver(()=>instance.invalidateSize());observer.observe(container);

      }catch(e){error=e.message;loading=false;}
    }
    initialize();
    return ()=>{disposed=true;observer?.disconnect();instance?.remove();};
  });
</script>
<svelte:head><title>Bluebikes and the T | Lab 8</title></svelte:head>
<main>
  <header>
    <h1>Bluebikes and the T</h1>
    <p>September 14–20, 2026 · Drag the map to pan. Drag the ✥ handle or click a station to move the 400 m selection.</p>
    <div class="legend"><span>● Bike dock</span>{#each Object.entries(colors).filter(([name])=>name!=='Mattapan') as [name,color]}<span><i style:border-color={color}></i>{name}</span>{/each}<span><i style:border-color="#222222"></i>Transfer</span></div>
    {#if loading}<p>Loading stations and trips…</p>{:else if error}<p role="alert">{error}</p>{:else}<p>{stations.length} stations · {d3.format(',')(trips.length)} trips loaded; trips in memory; only aggregate flows are drawn.</p><p class="note">{unmatched.affected} trips reference missing station {unmatched.ids.join(', ')}. Rows are retained; unavailable locations cannot be plotted.</p>{/if}
  </header>
  <div class="workspace">
  <div class="map-frame">
    <div class="map" bind:this={container}></div>
    <svg class="overlay" aria-label="Bike and subway stations" role="img">
      <circle cx={pinPoint.x} cy={pinPoint.y} r={radiusPx} fill="#245c83" fill-opacity="0.08" stroke="#245c83" stroke-dasharray="5 4" />
      {#each flows as destination}<line x1={pinPoint.x} y1={pinPoint.y} x2={destination.point.x} y2={destination.point.y} stroke="#245c83" opacity="0.55" stroke-width={1+5*Math.sqrt(destination.count/(summary.destinations[0]?.count||1))} />{/each}
      {#each projected as station (station.id)}
        <circle data-station={station.id} data-lat={station.lat} data-lon={station.lon} cx={station.point.x} cy={station.point.y} r={station.kind==='bike'?(selected.has(station.id)?5:3):9} fill={station.kind==='bike'?(selected.has(station.id)?'#245c83':'#666'):'white'} fill-opacity={station.kind==='bike'?0.75:0.9} stroke={station.kind==='bike'?'none':colorFor(station)} stroke-width="3" class="station" style:pointer-events={Math.hypot(station.point.x-pinPoint.x,station.point.y-pinPoint.y)<22?'none':'auto'} role="button" tabindex="0" aria-label={'Select '+station.name} onclick={()=>choose(station)} onkeydown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(station);}}}><title>{station.name}: {station.kind==='subway'?station.lines:'bike dock'}</title></circle>
      {/each}
      <circle cx={pinPoint.x} cy={pinPoint.y} r="18" fill="white" stroke="#111" stroke-width="2" /><text x={pinPoint.x} y={pinPoint.y+7} text-anchor="middle" class="handle">✥</text>
    </svg>
  </div>
  <aside>
    <h2>Around {selectionName}</h2>
    <p>Within 400 m · trips counted by start station</p>
    <p data-testid="counts"><strong>{selected.size} bike stations · {d3.format(',')(summary.total)} trips started this week</strong></p>
    <p>{summary.weekday.toFixed(1)} per weekday / {summary.weekend.toFixed(1)} per weekend day</p>
    <nav aria-label="Check a T station">{#each ['place-harsq','place-cntsq','place-knncl'] as id}{#if lookup.has(id)}<button onclick={()=>choose(lookup.get(id))}>{lookup.get(id).name}</button>{/if}{/each}</nav>
    <HourlyChart data={summary.hourly} />
    <h2>Where to: top destinations outside the circle</h2>
    <p>Weekly trips; thicker lines mean more trips. Lines connect the pin to destinations, not actual cycling routes.</p>
    <ol>{#each summary.destinations as d}<li>{d.name} <strong>{d.count}</strong></li>{/each}</ol>
    {#if !summary.total}<p>No trip starts in this selection.</p>{/if}
    {#if summary.missingEnds}<p>{summary.missingEnds} selected trips have unknown destinations and are excluded from flow lines.</p>{/if}
  </aside>
  </div>
</main>
<style>
  :global(.leaflet-tile-pane){filter:grayscale(1) opacity(0.55);}
  :global(body){margin:0;font-family:Arial,sans-serif;color:#222;}
  main{height:100dvh;display:flex;flex-direction:column;}
  header{padding:14px 22px;background:white;}
  h1{font-size:24px;margin:0 0 6px;}p{margin:5px 0;font-size:14px;}
  .note{color:#555;font-size:12px;}.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;margin:10px 0;}.legend span{display:flex;align-items:center;gap:6px;}.legend i{width:10px;height:10px;border:3px solid;border-radius:50%;display:inline-block;}
  .handle{fill:#111;font-size:25px;}
  .workspace{display:flex;flex:1;min-height:0;}aside{width:390px;flex-shrink:0;overflow:auto;padding:16px;box-sizing:border-box;border-left:1px solid #ddd;}aside h2{font-size:17px;}aside p,li{font-size:12px;line-height:1.4;}li{padding-bottom:7px;}button{padding:6px;margin:3px;color:#222;background:white;border:1px solid #777;cursor:pointer;}button:focus-visible{outline:3px solid #245c83;}.station{pointer-events:auto;cursor:pointer;}.station:focus{outline:none;stroke:#111;stroke-width:5;} :global(.selection-pin){background:white;border:2px solid #111;border-radius:50%;box-sizing:border-box;display:grid;place-items:center;font-size:24px;cursor:grab;}
  .map-frame{flex:1;min-height:300px;position:relative;}.map{position:absolute;inset:0;}.overlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:500;}
</style>
