"""Build a portable local gallery from the actual Android capture manifests."""
from pathlib import Path
import csv,html,json,re,shutil,struct,sys
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/screenshots/android'
CAPTURE=BASE/(sys.argv[1] if len(sys.argv)>1 else '20261029T045007Z')
normal=json.loads((CAPTURE/'manifest.json').read_text())
manual=json.loads((CAPTURE/'manual-pages.json').read_text())
auth=json.loads((CAPTURE/'auth-pages.json').read_text())
states=json.loads((CAPTURE/'state-pages.json').read_text())
assert auth['passed'] and states['passed']
rows=list(csv.DictReader((ROOT/'docs/migration/screen-parity.csv').open()))
def disposition(route):
 for row in rows:
  if re.fullmatch(re.sub(r'\[[^]]+\]',r'[^/]+',row['route']),route):return row
 return None
pages=normal['pages']+manual['pages']+auth['states']
FEATURES=[
 ('Route sheet / existing project',['015-sheet','019-sent-sheet']),
 ('Attempt increment / Send anchor',['010-plus-one','032-anchor-regression']),
 ('Correction and native result menu',['020-correction','021-result-picker','023-correction-bottom']),
 ('First-lifetime Flash',['069-flash-sheet','070-flash-saved']),
 ('Private note editor / simulated failed save',['027-note-draft','028-note-failed','030-resumed-draft','031-note-saved']),
 ('History private-note sheet / cancel',['100-history-note-modal','101-history-note-draft','102-history-note-cancelled']),
 ('Completed visit note add / clear',['103-completed-sheet','104-completed-note-editor','106-completed-note-saved','108-completed-note-empty','109-completed-note-cleared']),
 ('Filters and dependent result count',['087-filter-clear-before','081-filter-verified','088-filter-clear-fixed']),
 ('Route search / no match / clear',['091-search-no-match-fixed','092-search-clear-fixed']),
 ('Add gym / required validation / success',['037-add-gym','042-gym-required-error','043-gym-filled','044-gym-created']),
 ('Route colour grid / style selection',['046-route-colours','054-style-retest-picker','055-style-retest-after','056-extra-styles']),
 ('Add route fields / create',['057-route-name','058-route-ready','059-route-created']),
 ('Edit route / preserve fields',['060-edit-route-01','060-edit-route-02','060-edit-route-03','060-edit-route-04','060-edit-route-05','061-edit-filled','062-route-edited']),
 ('Start session / add route in session',['063-session-started','064-session-add-route','067-session-route-ready','068-session-route-created']),
 ('End session / completed visit',['071-end-session','073-completed-session']),
 ('Private read error / explicit recovery',['110-error-retry-before','111-error-retry-success']),
 ('Logout / signed-out state',['112-logout-before','113-logout-welcome']),
]
extra=CAPTURE/'features';extra.mkdir(exist_ok=True)
features=[]
for index,(title,names) in enumerate(FEATURES,1):
 item={'title':title,'frames':[]}
 for name in names:
  src=ROOT/'docs/evidence/android-retest-ui'/(name+'.png');assert src.is_file(),src
  target=extra/(name+'.png');shutil.copy2(src,target);item['frames'].append(str(target.relative_to(CAPTURE)))
 features.append(item)
# Authentication validations/expiry are added only once their actual captures exist.
for name,title in [('120-login-required','Login required validation'),('124-signup-required','Signup required validation'),('128-signup-success','Synthetic signup / register-login completion'),('131-expired-welcome','Expired identity on foreground return')]:
 src=ROOT/'docs/evidence/android-retest-ui'/(name+'.png')
 if src.exists():shutil.copy2(src,extra/src.name);features.append({'title':title,'frames':['features/'+src.name]})
source_ids={disposition(p['route'])['id'] for p in pages if disposition(p['route']) and disposition(p['route'])['id'].startswith('S')}
assert len(source_ids)==27,sorted(source_ids)
entries=[]
for page in pages:
 row=disposition(page['route']);title=row['title'] if row else 'Component catalogue';kind='Page'
 if row and row['id'] in ['S26','S27']:kind='Development only'
 elif row and 'planned' in row['currentStatus'].lower():kind='Source planned page'
 elif not row:kind='Development catalogue'
 entries.append({'title':title,'route':page['route'],'kind':kind,'frames':page['frames']})
entries += [{'title':state['name'].replace('-',' ').title(),'route':state['route'],'kind':'Fixture state','frames':state['frames']} for state in states['states']]
entries += [{'title':f['title'],'route':'','kind':'Feature','frames':f['frames']} for f in features]
all_files=set()
for entry in entries:
 for relative in entry['frames']:
  path=CAPTURE/relative;assert path.is_file();data=path.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',data[16:24])==(1080,1920);all_files.add(relative)
report={'sourceRoutes':27,'productRoutes':24,'extraDevelopmentCatalogues':1,'entryCount':len(entries),'uniqueScreenshots':len(all_files),'resolution':'1080x1920','platform':'Android API31 ARM64 / Nexus5 profile / Expo Go58.0.5','scope':'Unedited actual emulator viewport and vertical-scroll screenshots using synthetic local fixtures. Planned pages retain source planned status. Developer tooling overlays may be visible. Not fresh web/iOS/PWA screenshots or source-golden/pixel acceptance.','captureNotes':['22 normal routes captured with XML readiness and scroll-bottom checks.','Two always-animated development catalogues captured via framebuffer and visually verified; UIAutomator could not idle, and its initial failure log is retained.','Four signed-out routes and ten fixture states captured with scroll-bottom checks.'],'entries':entries}
(CAPTURE/'gallery-manifest.json').write_text(json.dumps(report,indent=2)+'\n')
escape=html.escape
cards=[]
for index,entry in enumerate(entries):
 images=''.join(f'<a href="{escape(CAPTURE.name+"/"+relative)}" target="_blank" rel="noopener"><img loading="lazy" src="{escape(CAPTURE.name+"/"+relative)}" width="216" height="384" alt="{escape(entry["title"])} — section {i}"><span>Section {i}</span></a>' for i,relative in enumerate(entry['frames'],1))
 cards.append(f'<section data-search="{escape((entry["title"]+" "+entry["route"]+" "+entry["kind"]).lower())}"><header><span class="tag">{escape(entry["kind"])}</span><h2>{escape(entry["title"])}</h2><code>{escape(entry["route"])}</code></header><div class="frames">{images}</div></section>')
body='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bouldy — Android screenshot gallery</title><style>
*{box-sizing:border-box}body{margin:0;background:#f6f5f3;color:#171615;font:15px/1.55 system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:32px 24px}h1{font-size:32px;line-height:1.12;margin:12px 0}p{max-width:82ch;color:#55504e}.intro{padding-bottom:24px;border-bottom:1px solid #dad6d2}.eyebrow{font-weight:750;color:#b31323;letter-spacing:.08em}input{display:block;width:min(100%,560px);margin:24px 0;padding:14px 16px;border:1px solid #c4bdb8;border-radius:12px;background:white;font:inherit}section{margin:32px 0;padding:24px;background:white;border:1px solid #ddd7d1;border-radius:16px}section[hidden]{display:none}header{margin-bottom:20px}h2{margin:8px 0 4px;font-size:22px}.tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9a1826}code{color:#68615c}.frames{display:flex;flex-wrap:wrap;gap:20px}.frames a{display:block;max-width:100%;text-align:center;color:#514943;text-decoration:none}.frames img{display:block;width:216px;max-width:100%;height:auto;border:1px solid #e1dcd8;border-radius:8px}.frames span{display:block;margin-top:8px;font-size:12px}footer{padding:24px 0;color:#645c57}a:focus-visible,input:focus-visible{outline:3px solid #bd1526;outline-offset:4px}
</style></head><body><main><div class="intro"><div class="eyebrow">BOULDY · LOCAL REVIEW · 29 OCTOBER 2026</div><h1>Every source page, plus feature states.</h1><p>27 original routes (24 product pages), the component catalogue, and fixture states. These are actual, unedited Android emulator screenshots. Open any image for full resolution; numbered sections show the page as it scrolls.</p><p>Planned features remain planned, matching the original app. Sample records and the Expo Go tooling icon belong to this development preview. Web/PWA and fresh iOS screenshots are outside this Android set. These images are for review; full migration acceptance remains open.</p><strong>''' + str(len(all_files))+''' screenshots · 1080 × 1920 · Android API 31</strong></div><label for="search">Find a page or feature</label><input id="search" type="search" placeholder="Try: notes, profile, filters, empty, signup"><div id="gallery">'''+''.join(cards)+'''</div><footer>Source repository preserved. Local fixture testing only. No commits, pushes, deployment or production-record writes.</footer></main><script>document.getElementById('search').addEventListener('input',function(){const q=this.value.trim().toLowerCase();document.querySelectorAll('section[data-search]').forEach(card=>card.hidden=!card.dataset.search.includes(q));});</script></body></html>'''
(BASE/'index.html').write_text(body)
lines=['# Bouldy Android screenshots','',f'{len(all_files)} real PNG screenshots covering all 27 original page routes, the extra development catalogue and feature/fixture states.','',report['scope'],'','Open [the searchable gallery](index.html). Click any thumbnail for the full 1080×1920 PNG. Each page has sequential scroll sections.','','## Captures','']
for entry in entries:
 links=' · '.join(f'[Section {i}]({CAPTURE.name}/{relative})' for i,relative in enumerate(entry['frames'],1));lines += [f'**{entry["title"]}** — {entry["kind"]} {entry["route"]}', '', links, '']
(BASE/'README.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({key:report[key] for key in ['sourceRoutes','productRoutes','entryCount','uniqueScreenshots','resolution']}))
