import { chromium } from '/Users/santinomarial/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto('http://127.0.0.1:5174/',{waitUntil:'networkidle'});
await page.waitForFunction(()=>document.querySelectorAll('.marks path').length===4777);
const styles=await page.evaluate(()=>{
 const read=e=>{const s=getComputedStyle(e);return {fill:s.fill,color:s.color,opacity:s.opacity,stroke:s.stroke,strokeWidth:s.strokeWidth,background:s.backgroundColor};};
 const axes=document.querySelectorAll('g.axis');
 return {body:read(document.body),main:read(document.querySelector('main')),texts:[['X tick',axes[0].querySelector('text')],['Y tick',axes[1].querySelector('text')],['X title',document.querySelectorAll('.axis-title')[0]],['Y title',document.querySelectorAll('.axis-title')[1]],['Legend text',document.querySelector('.legend span')]].map(([name,e])=>({name,...read(e)})),marks:[...new Map([...document.querySelectorAll('.marks path')].map(e=>[getComputedStyle(e).fill,read(e)])).values()],legend:[...document.querySelectorAll('.legend-marker path')].map(read)};
});
const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
const hex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
const mix=(f,b,a)=>f.map((v,i)=>a*v+(1-a)*b[i]);
const lum=c=>c.map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[0.2126,0.7152,0.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const white=rgb(styles.body.background),rows=[];
const add=(element,source,fg,bg,threshold,scope)=>rows.push({element,source,foreground:hex(fg),background:hex(bg),ratio:ratio(fg,bg),threshold,result:ratio(fg,bg)>=threshold?'PASS':'FAIL',scope});
for(const t of styles.texts)add(t.name,t.name==='Legend text'?t.color:t.fill,rgb(t.name==='Legend text'?t.color:t.fill),white,4.5,'Unobscured text on page background');
const names={'rgb(31, 119, 180)':'Entire home/apt','rgb(255, 127, 14)':'Private room','rgb(44, 160, 44)':'Hotel room'};
for(const m of styles.marks){const fg=mix(rgb(m.fill),white,+m.opacity);add(names[m.fill]+' fill',m.fill+' at '+m.opacity,fg,white,3,'Isolated fill over white');}
const m=styles.marks[0],outline=mix(rgb(m.stroke),white,+m.opacity);
add('Data outline on white',m.stroke+' at '+m.opacity,outline,white,3,'Exposed outer boundary against white');
for(const m of styles.marks){const under=mix(rgb(m.fill),white,+m.opacity);const strokeOver=mix(rgb(m.stroke),under,+m.opacity);add('Outline over '+names[m.fill]+' fill',m.stroke+' at '+m.opacity,strokeOver,under,3,'Compositing scenario: one existing translucent fill over white under another marker outline; not a pixel measurement or exhaustive overlap audit');}
add('Legend outlines',styles.legend[0].stroke,rgb(styles.legend[0].stroke),white,3,'Opaque legend outline against white');
await fs.writeFile('evidence/activity-5/contrast-results.json',JSON.stringify({checkedAt:new Date().toISOString(),method:'WCAG relative luminance and contrast; sRGB source-over opacity compositing before linearization',rounding:'Ratios use unrounded RGB composites; hex values are nearest 8-bit display colors',styles,rows,errors,limitations:'Computed full-coverage colors, not antialiased edge pixels. Actual overlap backgrounds depend on stacking; scenario rows are not observations of specific pixels. No claim of universal marker contrast.'},null,2)+'\n');
console.log(rows.map(r=>`${r.element}: ${r.foreground} / ${r.background} ${r.ratio.toFixed(4)} ${r.result}`).join('\n'));
await browser.close();
