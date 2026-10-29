"""Give source-derived static Geist weights distinct CoreText identities.

Run with the existing local fontTools installation on PYTHONPATH. Original font
files are retained under preserved reference/; outlines and metrics must not change.
"""
from pathlib import Path
from hashlib import sha256
import json
import shutil
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
directory = root / 'assets/fonts'
backup = root / 'reference/fonts-before-coretext-identity-fix'
backup.mkdir(parents=True, exist_ok=True)
provenance_path = directory / 'provenance.json'
provenance = json.loads(provenance_path.read_text())
labels = {400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}

for entry in provenance:
    if entry['family'] != 'Geist':
        continue
    path = directory / entry['asset']
    original_hash = sha256(path.read_bytes()).hexdigest()
    if entry.get('nativeIdentityFix'):
        assert original_hash == entry['sha256'], f'Unexpected font changes: {path.name}'
        continue
    assert original_hash == entry['sha256'], f'Unexpected font changes: {path.name}'
    preserved = backup / path.name
    if preserved.exists():
        assert sha256(preserved.read_bytes()).hexdigest() == original_hash
    else:
        shutil.copy2(path, preserved)
    font = TTFont(path, recalcBBoxes=False, recalcTimestamp=False)
    before = {tag: font.getTableData(tag) for tag in font.keys() if tag not in ['GlyphOrder', 'name', 'head']}
    label = labels[entry['weight']]
    family = 'Geist' if label == 'Regular' else f'Geist {label}'
    postscript = f'Geist-{label}'
    names = {1: family, 2: 'Regular', 3: f'{postscript};Bouldy source weight instance',
             4: f'Geist {label}', 6: postscript, 16: 'Geist', 17: label}
    for key, value in names.items():
        for platform, encoding, language in {(n.platformID, n.platEncID, n.langID) for n in font['name'].names}:
            font['name'].setName(value, key, platform, encoding, language)
    font.save(path)
    saved = TTFont(path, recalcBBoxes=False, recalcTimestamp=False)
    assert all(saved.getTableData(tag) == data for tag, data in before.items()), 'Outlines/metrics changed'
    entry['sha256'] = sha256(path.read_bytes()).hexdigest()
    entry['nativeIdentityFix'] = {'previousSha256': original_hash, 'postscriptName': postscript,
                                  'change': 'name table only; every non-name/non-head table verified unchanged',
                                  'preservedAt': str(preserved.relative_to(root))}

provenance_path.write_text(json.dumps(provenance, indent=2) + '\n')
print('Geist static font identities verified; original files retained; glyph/metric tables unchanged.')
