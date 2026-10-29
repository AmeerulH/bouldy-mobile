"""Capture all signed-in pages and their vertical scroll sections, fixture-only.
User explicitly authorised adb/UIAutomator for this emulator and requested screenshots.
Requires signed-in Expo Go fixture preview. No data mutations are performed.
"""
from pathlib import Path
import ast, datetime, json, os, re, subprocess, urllib.request, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
SDK=Path(os.environ.get('ANDROID_SDK_ROOT',str(Path.home()/'Library/Android/sdk')))
ADB=[str(SDK/'platform-tools/adb'),'-s',os.environ.get('BOULDY_ANDROID_SERIAL','emulator-5554')]
STAMP=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT=ROOT/'docs/screenshots/android'/STAMP
OUT.mkdir(parents=True)
module=ast.parse((Path(__file__).with_name('route-smoke.py')).read_text())
CASES=next(ast.literal_eval(n.value) for n in module.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='CASES' for t in n.targets))
# Infinite animation catalogues require framebuffer/visual capture separately.
CASES += [('/history',['Every attempt has a place.'])]
def adb(*args):return subprocess.check_output(ADB+list(args),timeout=30)
def state():
 with urllib.request.urlopen('http://127.0.0.1:4010/__state',timeout=5) as response:return json.load(response)
def dump(folder,frame):
 remote='/sdcard/bouldy-gallery-frame.xml';result=adb('shell','uiautomator','dump',remote)
 if b'dumped to:' not in result:raise RuntimeError('UIAutomator idle hierarchy unavailable; stale XML refused')
 raw=adb('exec-out','cat',remote);tree=ET.fromstring(raw);(folder/(frame+'.xml')).write_bytes(raw);return tree
def text(tree):return '\n'.join(n.get('text','')+'\n'+n.get('content-desc','') for n in tree.iter('node'))
def signature(tree):return [(n.get('text'),n.get('content-desc'),n.get('bounds')) for n in tree.iter('node') if n.get('text') or n.get('content-desc')]
def bounds(node):return list(map(int,re.findall(r'\d+',node.get('bounds'))))
def norm(value):return ' '.join(value.casefold().split())
report={'device':'Nexus 5 profile / API31 ARM64 / 1080x1920 / Expo Go58.0.5','scope':'Real unedited Android emulator captures, synthetic local fixture; viewport scroll sections. Not source comparison or physical/release acceptance. Expo Go developer Tools overlay may be visible.','pages':[]}
try:
 before=state()
 initial=dump(OUT,'initial');assert 'Sample journal · local preview' in text(initial),'Fixture banner required'
 for index,(path,expected) in enumerate(CASES,1):
  slug='home' if path=='/' else path.strip('/').replace('/','-');folder=OUT/slug;folder.mkdir()
  if path=='/':
   node=next(n for n in initial.iter('node') if n.get('content-desc')=='Home' and n.get('clickable')=='true');x1,y1,x2,y2=bounds(node);adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
  else:adb('shell','am','start','-a','android.intent.action.VIEW','-d','exp://127.0.0.1:8081/--'+path,'host.exp.exponent')
  for _ in range(5):
   tree=dump(folder,'01');visible=text(tree)
   if all(norm(e) in norm(visible) for e in expected):break
  else:raise AssertionError('Expected page missing: '+path)
  page={'route':path,'frames':[],'expected':expected,'bottomReached':False}
  report['pages'].append(page)
  previous=None
  limit=100 if path=='/component-preview' else 9
  for frame in range(1,limit+1):
   name=f'{frame:02d}';current=signature(tree)
   if current==previous:
    page['bottomReached']=True;break
   (folder/(name+'.png')).write_bytes(adb('exec-out','screencap','-p'));page['frames'].append(str((folder/(name+'.png')).relative_to(OUT)))
   (OUT/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
   candidates=[n for n in tree.iter('node') if n.get('class')=='android.widget.ScrollView' and n.get('scrollable')=='true']
   if not candidates:
    page['bottomReached']=True;break
   node=max(candidates,key=lambda n:(bounds(n)[3]-bounds(n)[1])*(bounds(n)[2]-bounds(n)[0]));x1,y1,x2,y2=bounds(node);x=x2-12;start=y2-70;end=max(y1+70,start-730)
   if start-end<100:break
   previous=current;adb('shell','input','swipe',str(x),str(start),str(x),str(end),'400');tree=dump(folder,f'{frame+1:02d}')
  assert page['bottomReached'], 'Scroll capture limit reached: '+path
  print(f'CAPTURED {path}: {len(page["frames"])} frames',flush=True)
  initial=tree
 after=state();assert after['writes']==before['writes'],'Screenshot pass unexpectedly mutated fixture records'
 report['writesUnchanged']=True;report['passed']=True
except Exception as error:
 report['passed']=False;report['error']=str(error);raise
finally:
 (OUT/'manifest.json').write_text(json.dumps(report,indent=2)+'\n');print('Gallery source: '+str(OUT),flush=True)
