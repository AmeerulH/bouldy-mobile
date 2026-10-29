import { chromium } from '@playwright/test';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
const out='docs/evidence/source-current';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',timezoneId:'Asia/Kuala_Lumpur',locale:'en-MY'});
await context.addInitScript(()=>{const Original=Date;const fixed=new Original('2026-10-24T04:00:00Z').valueOf();globalThis.Date=class extends Original{constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}};});
const page=await context.newPage();
async function control(scenario='normal'){await fetch('http://127.0.0.1:4010/__control',{method:'POST',body:JSON.stringify({scenario,reset:true})});}
const rows=[];const data=JSON.parse(await readFile('reference/source/docs/visual-walkthrough/walkthrough-data.json','utf8'));
const paths={welcome:'/welcome',login:'/login',signup:'/signup',home:'/',gyms:'/gyms','add-gym':'/gyms?sheet=add-gym',gym:'/gyms/1',filters:'/sessions/3?sheet=route-filters','add-route':'/gyms/1/routes/new','edit-route':'/gyms/1/routes/11/edit','session-add-route':'/sessions/3/routes/new',sessions:'/sessions',session:'/sessions/3','route-sheet':'/sessions/3?sheet=route-11','flash-sheet':'/sessions/3?sheet=route-16',correction:'/sessions/3?sheet=route-11',note:'/sessions/3?sheet=route-11','end-session':'/sessions/3?sheet=end-session','completed-session':'/sessions/2',climbs:'/climbs',history:'/routes/11','retired-history':'/routes/13',profile:'/profile',explore:'/explore','edit-profile':'/profile/edit','public-profile':'/profile/public',privacy:'/profile/privacy',feed:'/explore/feed',climbers:'/explore/climbers',leaderboards:'/explore/leaderboards',challenges:'/explore/challenges',groups:'/explore/groups',beta:'/routes/11/beta','partial-history':'/routes/11','empty-climbs':'/climbs','not-found':'/unknown-reference'};
for(const item of data.items){
 await control(item.id==='partial-history'?'partial':item.id==='empty-climbs'?'empty':'normal');await context.clearCookies();if(!['welcome','login','signup'].includes(item.id))await context.addCookies([{name:'bouldy_token',value:'walkthrough-sample',url:'http://localhost:3100'}]);
 const path=paths[item.id];if(!path)throw new Error(`Missing path ${item.id}`);
 await page.goto(`http://localhost:3100${path}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.addStyleTag({content:'nextjs-portal {visibility:hidden}'});
 if(item.id==='correction')await page.getByText('Correct this log',{exact:true}).first().click();
 if(item.id==='note')await page.getByRole('button',{name:'Edit note',exact:true}).first().click();
 for(const image of item.images){
  if(image==='login-error'){await page.goto('http://localhost:3100/login?error=Incorrect%20email%20or%20password',{waitUntil:'networkidle'});await page.addStyleTag({content:'nextjs-portal {visibility:hidden}'});}
  if(image.endsWith('-bottom'))await page.locator('.app-shell__scroll').evaluate(e=>e.scrollTop=e.scrollHeight);
  if(image==='climbs-gym')await page.getByRole('button',{name:/Sample Boulder Club/}).first().click();
  await page.screenshot({path:`${out}/${image}.png`});rows.push({id:image,path,url:page.url(),viewport:'390x844',scenario:item.id==='partial-history'?'partial':item.id==='empty-climbs'?'empty':'normal',image:`${out}/${image}.png`});
 }
}
for(const [id,path,scenario] of [['route-sheet','/sessions/3?sheet=route-11','normal'],['flash-sheet','/sessions/3?sheet=route-16','normal'],['end-session','/sessions/3?sheet=end-session','normal'],['partial-history','/routes/11','partial'],['empty-home','/','empty'],['unavailable-home','/','unavailable'],['duplicate-session','/sessions/3?sheet=route-11','duplicate'],['attempt-error','/sessions/3?sheet=route-11&error=Could%20not%20save%20this%20sample%20attempt.%20Try%20again.','attempt-error'],['expired','/sessions/3','expired']]){
 await control(scenario);await context.addCookies([{name:'bouldy_token',value:'walkthrough-sample',url:'http://localhost:3100'}]);await page.goto(`http://localhost:3100${path}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/${id}.png`});rows.push({id,path,scenario,url:page.url(),image:`${out}/${id}.png`});
}
await control();await writeFile(`${out}/captures.json`,JSON.stringify(rows,null,2));await browser.close();console.log(`Captured ${rows.length} current-source states`);
