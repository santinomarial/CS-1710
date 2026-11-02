import {chromium} from '/Users/santinomarial/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const dir='/Users/santinomarial/CS 1710/Lab_07/diamond-color/evidence';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1280,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>document.querySelectorAll('.marks circle').length===53940);
const c=await page.context().newCDPSession(page);const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const results={};
for(const [mode,label] of [['clarity','Clarity grades'],['residual','Price residual']]){
 await page.getByRole('button',{name:label,exact:true}).click();await settle();
 const base=await page.screenshot({path:`${dir}/activity-4/${mode}-default.png`,fullPage:true});results[mode]={markers:await page.locator('.marks circle').count(),checks:{}};
 for(const type of ['deuteranopia','protanopia','achromatopsia']){
 await c.send('Emulation.setEmulatedVisionDeficiency',{type});await settle();const shot=await page.screenshot({path:`${dir}/activity-4/${mode}-${type}.png`,fullPage:true});results[mode].checks[type]=!base.equals(shot);
 }
 await c.send('Emulation.setEmulatedVisionDeficiency',{type:'none'});await settle();results[mode].resetMatches=base.equals(await page.screenshot({fullPage:true}));
 results[mode].textColors=await page.locator('.legend strong,.legend text,.legend-item span:not(.swatch),.axis text,.axis-title').evaluateAll(es=>[...new Set(es.map(e=>getComputedStyle(e).fill==='none'?getComputedStyle(e).color:(e instanceof SVGElement?getComputedStyle(e).fill:getComputedStyle(e).color)))]);
}
await page.getByRole('button',{name:'Clarity grades',exact:true}).focus();await page.keyboard.press('Enter');results.keyboardClarity=await page.getByRole('button',{name:'Clarity grades',exact:true}).getAttribute('aria-pressed');
await page.keyboard.press('Tab');await page.keyboard.press('Space');results.keyboardResidual=await page.getByRole('button',{name:'Price residual',exact:true}).getAttribute('aria-pressed');results.errors=errors;
fs.writeFileSync(`${dir}/activity-4/browser-checks.json`,JSON.stringify(results,null,2));await browser.close();
