import {chromium} from '/Users/santinomarial/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const dir='/Users/santinomarial/CS 1710/Lab_07/diamond-color/evidence/stretch-goal';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:2320,height:1200}});const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.goto('http://127.0.0.1:5173/');await p.waitForFunction(()=>document.querySelectorAll('.marks circle').length===53940);
await p.getByRole('button',{name:'Rainbow, measured',exact:true}).click();await p.waitForFunction(()=>document.querySelectorAll('.marks circle').length===107880);
const check=await p.evaluate(()=>{
const a=[...document.querySelectorAll('[data-palette="viridis"] .marks circle')],b=[...document.querySelectorAll('[data-palette="rainbow"] .marks circle')];
return {counts:[a.length,b.length],sameGeometry:a.every((e,i)=>['cx','cy','r','opacity'].every(k=>e.getAttribute(k)===b[i].getAttribute(k))),fills:[...new Set(a.map(e=>e.getAttribute('fill')))],rainbowFills:[...new Set(b.map(e=>e.getAttribute('fill')))]};});
for(const mode of ['color','greyscale']){
 if(mode==='greyscale')await p.getByRole('checkbox').check();
 await p.screenshot({path:`${dir}/comparison-${mode}.png`,fullPage:true});
 for(const palette of ['viridis','rainbow'])await p.locator(`[data-palette="${palette}"]`).screenshot({path:`${dir}/${palette}-${mode}.png`});
}
await p.getByRole('checkbox').uncheck();check.greyscaleCleared=await p.locator('.comparison-grid').evaluate(e=>getComputedStyle(e).filter==='none');
for(const name of ['Clarity grades','Price residual']){await p.getByRole('button',{name,exact:true}).click();check[name]=await p.locator('.marks circle').count();}
check.errors=errors;fs.writeFileSync(`${dir}/browser-checks.json`,JSON.stringify(check,null,2));await b.close();
