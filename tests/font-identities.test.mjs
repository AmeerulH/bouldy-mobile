import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';

function nameOf(buffer, nameId) {
  for (let i = 0; i < buffer.readUInt16BE(4); i++) {
    const record = 12 + i * 16;
    if (buffer.toString('ascii', record, record + 4) !== 'name') continue;
    const start = buffer.readUInt32BE(record + 8), strings = start + buffer.readUInt16BE(start + 4);
    for (let n = 0; n < buffer.readUInt16BE(start + 2); n++) {
      const offset = start + 6 + n * 12;
      if (buffer.readUInt16BE(offset) !== 3 || buffer.readUInt16BE(offset + 6) !== nameId) continue;
      const length = buffer.readUInt16BE(offset + 8), valueStart = strings + buffer.readUInt16BE(offset + 10);
      const value = Buffer.from(buffer.subarray(valueStart, valueStart + length));
      return value.swap16().toString('utf16le');
    }
  }
  throw new Error(`Missing name ${nameId}`);
}
test('all bundled weights have distinct native PostScript identities and match provenance', () => {
  const provenance = JSON.parse(readFileSync('assets/fonts/provenance.json'));
  const names = new Set();
  for (const file of readdirSync('assets/fonts').filter(file => file.endsWith('.ttf'))) {
    const bytes = readFileSync(`assets/fonts/${file}`), name = nameOf(bytes, 6);
    assert.ok(!names.has(name), `${file} collides with another font: ${name}`);
    names.add(name);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), provenance.find(entry => entry.asset === file).sha256);
  }
  assert.equal(names.size, 9);
});
