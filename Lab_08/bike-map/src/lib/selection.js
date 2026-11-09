export function distance(a,b){const rad=Math.PI/180,dlat=(b.lat-a.lat)*rad,dlon=(b.lon-a.lon)*rad;const h=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export function selectedIds(stations,center){return new Set(stations.filter(s=>s.kind==='bike'&&distance(center,s)<=400).map(s=>s.id));}
export function summaries(trips,ids,lookup,mode='start'){
 const selectedKey=mode==='end'?'end_id':'start_id';
 const otherKey=mode==='end'?'start_id':'end_id';
 const rows=trips.filter(t=>ids.has(t[selectedKey]));const hourly=Array.from({length:24},(_,hour)=>({hour,weekday:0,weekend:0}));let weekday=0,weekend=0,missingEnds=0;const dest=new Map();
 for(const t of rows){const day=t.started.getDay();const type=day===0||day===6?'weekend':'weekday';hourly[t.started.getHours()][type]++;if(type==='weekday')weekday++;else weekend++;if(!lookup.has(t[otherKey]))missingEnds++;else if(!ids.has(t[otherKey]))dest.set(t[otherKey],(dest.get(t[otherKey])||0)+1);}
 return {total:rows.length,weekday:weekday/5,weekend:weekend/2,missingEnds,hourly:hourly.map(h=>({...h,weekday:h.weekday/5,weekend:h.weekend/2})),destinations:[...dest].map(([id,count])=>({...lookup.get(id),count})).sort((a,b)=>b.count-a.count).slice(0,10)};
}
