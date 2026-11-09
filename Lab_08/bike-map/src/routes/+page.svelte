<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import 'leaflet/dist/leaflet.css';
  let container;
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
    let disposed=false, instance;
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
        instance=L.map(container,{zoomAnimation:false}).setView([harvard.lat,harvard.lon],13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(instance);
        instance.on('move zoom resize',()=>revision++);
        map=instance; loading=false;
      }catch(e){error=e.message;loading=false;}
    }
    initialize();
    return ()=>{disposed=true;instance?.remove();};
  });
</script>
<svelte:head><title>Bluebikes and the T | Lab 8</title></svelte:head>
<main>
  <header>
    <h1>Bluebikes and the T</h1>
    <p>September 14–20, 2026 · Drag to pan; use + and − to zoom.</p>
    <div class="legend"><span>● Bike dock</span>{#each Object.entries(colors).filter(([name])=>name!=='Mattapan') as [name,color]}<span><i style:border-color={color}></i>{name}</span>{/each}<span><i style:border-color="#222222"></i>Transfer</span></div>
    {#if loading}<p>Loading stations and trips…</p>{:else if error}<p role="alert">{error}</p>{:else}<p>{stations.length} stations · {d3.format(',')(trips.length)} trips loaded; trips are not drawn.</p><p class="note">{unmatched.affected} trips reference missing station {unmatched.ids.join(', ')}. Rows are retained; unavailable locations cannot be plotted.</p>{/if}
  </header>
  <div class="map-frame">
    <div class="map" bind:this={container}></div>
    <svg class="overlay" aria-label="Bike and subway stations" role="img">
      {#each projected as station (station.id)}
        <circle data-station={station.id} data-lat={station.lat} data-lon={station.lon} cx={station.point.x} cy={station.point.y} r={station.kind==='bike'?3:7} fill={station.kind==='bike'?'#666':'white'} fill-opacity={station.kind==='bike'?0.75:0.9} stroke={station.kind==='bike'?'none':colorFor(station)} stroke-width="3" />
      {/each}
    </svg>
  </div>
</main>
<style>
  :global(.leaflet-tile-pane){filter:grayscale(1) opacity(0.55);}
  :global(body){margin:0;font-family:Arial,sans-serif;color:#222;}
  main{height:100dvh;display:flex;flex-direction:column;}
  header{padding:14px 22px;background:white;}
  h1{font-size:24px;margin:0 0 6px;}p{margin:5px 0;font-size:14px;}
  .note{color:#555;font-size:12px;}.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;margin:10px 0;}.legend span{display:flex;align-items:center;gap:6px;}.legend i{width:10px;height:10px;border:3px solid;border-radius:50%;display:inline-block;}
  .map-frame{flex:1;min-height:300px;position:relative;}.map{position:absolute;inset:0;}.overlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:500;}
</style>
