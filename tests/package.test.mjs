import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { packageZip } from '../scripts/package.mjs';
import { harness } from './harness.mjs';
test('manifest matches personal extension precedent and required permission/runtime/key', () => {
  const m = JSON.parse(readFileSync('manifest.json')); assert.equal(m.kind, 'marinara.personal-extension');
  assert.equal(m.version, 1); assert.equal(m.config.version, '0.2.0');
  assert.equal(JSON.parse(readFileSync('package.json')).version, '0.2.0'); assert.equal(m.config.runtime, 'client'); assert.equal(m.config.jsPath, 'extension.js');
  assert.deepEqual(m.config.capabilities, ['full_page_access']); assert.equal(m.config.enabled, false);
  assert.ok(m.config.description.includes('translation_regex_me'));
});
test('all reference snapshots match recorded upstream SHA-256', () => {
  for (const [path, hash] of Object.entries(JSON.parse(readFileSync('vendor/UPSTREAM.json'))))
    assert.equal(createHash('sha256').update(readFileSync('vendor/upstream/' + path.split('/').pop())).digest('hex'), hash, path);
});
test('DOMPurify fixed vendor bytes and licenses included in bundle/NOTICE', () => {
  for (const line of readFileSync('vendor/dompurify/SHA256SUMS', 'utf8').trim().split('\n')) {
    const [hash, name] = line.split('  '); assert.equal(createHash('sha256').update(readFileSync('vendor/dompurify/' + name)).digest('hex'), hash);
  }
  assert.match(readFileSync('dist/extension.js', 'utf8'), /DOMPurify 3\.4\.13/);
  const notice = readFileSync('NOTICE', 'utf8'); assert.match(notice, /Apache License/); assert.match(notice, /GNU AFFERO GENERAL PUBLIC LICENSE/);
});
test('360px panel CSS supplies viewport width cap, internal overflow and usable controls (not a layout test)', async t => {
  const h = await harness(); t.after(() => h.cleanup());
  const css = h.ui.querySelector('style').textContent;
  assert.match(css, /max-width:calc\(100vw - 24px\)/); assert.match(css, /max-height:70vh;overflow:auto/);
  assert.match(css, /overflow-wrap:anywhere/); assert.match(css, /padding:8px 12px/);
  const button = h.ui.querySelector('button[aria-controls="settings"]'); button.click();
  assert.equal(h.ui.querySelector('section').hidden, false); assert.equal(button.getAttribute('aria-expanded'), 'true');
  h.ui.querySelector('section').dispatchEvent(new h.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(h.ui.querySelector('section').hidden, true);
});
test('deterministic import ZIP has exactly four root files with identical bytes', async () => {
  const before = await packageZip();
  assert.deepEqual(await packageZip(), before);
  const names = []; let offset = 0;
  while (before.readUInt32LE(offset) === 0x04034b50) {
    const size = before.readUInt32LE(offset + 18), length = before.readUInt16LE(offset + 26);
    const name = before.subarray(offset + 30, offset + 30 + length).toString(); names.push(name);
    const bytes = inflateRawSync(before.subarray(offset + 30 + length, offset + 30 + length + size));
    assert.deepEqual(bytes, readFileSync(`dist/${name}`)); offset += 30 + length + size;
  }
  assert.deepEqual(names, ['manifest.json', 'extension.js', 'README.md', 'NOTICE']);
});
