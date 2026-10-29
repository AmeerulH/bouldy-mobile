"""Opt-in fixture-only Android UI smoke (adb/UIAutomator authorised by the user).
Requires an already signed-in local Expo Go preview, Metro8081 + fixture4010.
Snapshots demonstrate route rendering, not full visual/state/device acceptance.
Run: python3 tests/android/route-smoke.py
"""
from pathlib import Path
import datetime, json, os, re, subprocess, urllib.request, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
SDK = Path(os.environ.get('ANDROID_SDK_ROOT', str(Path.home() / 'Library/Android/sdk')))
ADB = [str(SDK / 'platform-tools/adb'), '-s', os.environ.get('BOULDY_ANDROID_SERIAL', 'emulator-5554')]
STAMP = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
OUT = ROOT / 'docs/evidence' / ('android-route-smoke-' + STAMP)
OUT.mkdir()
CASES = [
 ('/', ['KEEP\nSHOWING UP.']),
 ('/sessions', ['Every attempt has a place.']),
 ('/sessions/3', ['Live session', '2026-10-24']),
 ('/routes/11', ['YOUR ROUTE HISTORY', 'The patient heel hook']),
 ('/gyms', ['Choose your wall.', 'ALL GYMS']),
 ('/gyms/1', ['SAMPLE BOULDER CLUB', 'Kuala Lumpur']),
 ('/gyms/1/routes/new', ['ADD A ROUTE', 'New route at Sample Boulder Club']),
 ('/gyms/1/routes/11/edit', ['EDIT ROUTE', 'The patient heel hook']),
 ('/sessions/3/routes/new', ['ADD A ROUTE', 'ready to log.']),
 ('/climbs', ["Every route you've logged."]),
 ('/explore', ['Climb with others.', 'CLOSED FOR SETTING']),
 ('/explore/feed', ["CLIMBERS' SESSIONS", 'Planned']),
 ('/explore/climbers', ['FIND CLIMBERS', 'Planned']),
 ('/explore/leaderboards', ['LEADERBOARDS', 'Planned']),
 ('/explore/challenges', ['CHALLENGES', 'Planned']),
 ('/explore/groups', ['GROUPS AND LEAGUES', 'Planned']),
 ('/profile', ['Only you can see this page.', 'sample-climber']),
 ('/profile/edit', ['EDIT PROFILE', 'Planned']),
 ('/profile/public', ['PUBLIC PROFILE', 'Planned']),
 ('/profile/privacy', ['PRIVACY', 'Planned']),
 ('/routes/11/beta', ['BETA', 'The patient heel hook', 'Planned']),
]

def adb(*args):
    return subprocess.check_output(ADB + list(args), timeout=30)

def state():
    with urllib.request.urlopen('http://127.0.0.1:4010/__state', timeout=5) as response:
        return json.load(response)

def hierarchy(label):
    remote = '/sdcard/bouldy-route-smoke-' + label + '.xml'
    result = adb('shell', 'uiautomator', 'dump', remote)
    if b'dumped to:' not in result:
        raise RuntimeError('UIAutomator could not obtain an idle hierarchy; never reuse stale XML')
    raw = adb('exec-out', 'cat', remote)
    (OUT / (label + '.xml')).write_bytes(raw)
    return raw, '\n'.join(n.get('text', '') + '\n' + n.get('content-desc', '') for n in ET.fromstring(raw).iter('node'))

def normalized(text):
    return ' '.join(text.casefold().split())

report = {'scope': 'Fixture Android native route-render smoke only; not all states/visual/motion/physical/release acceptance', 'cases': []}
try:
    before = state()
    _, initial = hierarchy('initial')
    assert 'Sample journal · local preview' in initial, 'Refusing to test without fixture-preview banner'
    for i, (path, expected) in enumerate(CASES, 1):
        label = f'{i:02d}'
        if path == '/':
            # Expo Go treats a bare experience/root URL as reopen, preserving
            # the current nested screen. Exercise the actual Home tab instead.
            raw, _ = hierarchy('before-home')
            node = next(n for n in ET.fromstring(raw).iter('node') if n.get('content-desc') == 'Home' and n.get('clickable') == 'true')
            x1, y1, x2, y2 = map(int, re.findall(r'\d+', node.get('bounds')))
            adb('shell', 'input', 'tap', str((x1+x2)//2), str((y1+y2)//2))
        else:
            adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'exp://127.0.0.1:8081/--' + path, 'host.exp.exponent')
        ok = False
        for _ in range(4):
            _, visible = hierarchy(label)
            if all(normalized(needle) in normalized(visible) for needle in expected) and 'Sample journal · local preview' in visible:
                ok = True
                break
        (OUT / (label + '.png')).write_bytes(adb('exec-out', 'screencap', '-p'))
        report['cases'].append({'route': path, 'expected': expected, 'passed': ok, 'xml': label + '.xml', 'screenshot': label + '.png'})
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(('PASS' if ok else 'FAIL') + ' ' + path, flush=True)
        assert ok, 'Missing expected settled route content: ' + path
    after = state()
    assert after['writes'] == before['writes'], 'Read-only route smoke unexpectedly changed fixture records'
    report['writesUnchanged'] = True
    report['passed'] = True
except Exception as error:
    report['passed'] = False
    report['error'] = str(error)
    raise
finally:
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print('Evidence: ' + str(OUT), flush=True)
