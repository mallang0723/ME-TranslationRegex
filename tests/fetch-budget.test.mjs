import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harness, message, rule } from './harness.mjs';
const history = () => Array.from({ length: 100 }, (_, i) => message({ id: `m${i + 1}`, createdAt: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString() }));
const html = id => `<main data-message-id="${id}"><div class="translation-text">체력 90</div><div class="mari-message-actions"><button>번역</button></div></main>`;
const reads = h => h.requests.filter(r => r.init.method === 'GET' && new URL(r.path, 'http://fixture.invalid').pathname.endsWith('/messages'));
const limits = h => reads(h).map(r => Number(new URL(r.path, 'http://fixture.invalid').searchParams.get('limit')));
async function setup(t, options = {}) { const h = await harness({ html: html('m100'), fixture: { messages: history() }, ...options }); t.after(() => h.cleanup()); return h; }
function split(h) {
  h.w.document.querySelector('button[data-translation-regex-action]').dispatchEvent(new h.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  h.ui.querySelector('#split-translation').click();
}
function writer(h) {
  h.fixture.write = async (path, init) => {
    const body = JSON.parse(init.body);
    if (path === '/api/translate') return { ok: true, json: async () => ({ translatedText: body.text.trim() }) };
    const id = decodeURIComponent(path.split('/')[5]);
    const m = h.fixture.messages.find(m => m.id === id);
    m.extra = { ...JSON.parse(typeof m.extra === 'string' ? m.extra : JSON.stringify(m.extra)), ...body };
    return { ok: true, json: async () => m };
  };
}
test('room entry fetches one recent slice; a mutation burst and confirmed polls fetch no message lists', async t => {
  const h = await setup(t);
  assert.deepEqual(limits(h), [3]); assert.equal(h.requests.length, 4); assert.ok(h.wrapper);
  const root = h.w.document.querySelector('main');
  for (let i = 0; i < 80; i++) root.className = `render-${i}`;
  await h.settle(); await h.poll(); await h.poll();
  assert.equal(h.requests.length, 4); assert.deepEqual(limits(h), [3]);
  root.insertAdjacentHTML('afterend', html('m99'));
  await h.settle();
  // Still-valid recent slice is shared with a newly visible message.
  assert.deepEqual(limits(h), [3]);
  assert.equal(h.w.document.querySelectorAll('[data-translation_regex_me]').length, 2);
});
test('room entry reuses only visible loaded rows and absolute depth without fetching history', async t => {
  const h = await setup(t, { loaded: true, html: html('m5'), fixture: { messages: history(), rules: [rule({ minDepth: 95, maxDepth: 95 })] } });
  assert.equal(reads(h).length, 0); assert.equal(h.body.textContent, '체력 90');
  assert.equal(h.requests.filter(r => r.path.endsWith('/message-count')).length, 1);
  await h.poll(); assert.equal(reads(h).length, 0);
});
test('unlocatable older visible message tries one small slice and never walks history', async t => {
  const h = await setup(t, { html: html('m5') });
  assert.deepEqual(limits(h), [3]); assert.equal(h.wrapper, null);
  await h.poll(); await h.poll(); assert.deepEqual(limits(h), [3]);
});
test('generation end and pending translation use limit=3 and stop immediately after attachment', async t => {
  const h = await setup(t);
  h.setState({ isStreaming: true, streamingChatId: 'c' }); await h.settle();
  assert.deepEqual(limits(h), [3]);
  h.fixture.messages.at(-1).extra = {};
  h.setState({ isStreaming: false, streamingChatId: null }); await h.settle();
  assert.deepEqual(limits(h), [3, 3]); assert.equal(h.wrapper, null);
  await h.poll(); assert.deepEqual(limits(h), [3, 3, 3]);
  h.fixture.messages.at(-1).extra = message().extra;
  await h.poll(); assert.ok(h.wrapper); assert.deepEqual(limits(h), [3, 3, 3, 3]);
  await h.poll(); await h.poll(); assert.equal(reads(h).length, 4);
  assert.equal(h.requests.length, 10);
});
test('host query success detects same-text swipe updates without periodic message GETs', async t => {
  const h = await setup(t, { loaded: true });
  h.fixture.messages.at(-1).activeSwipeIndex = 1;
  h.fixture.messages.at(-1).extra = { translation: '<status>새 스와이프</status>', translationSource: 'original' };
  await h.querySuccess(); assert.equal(h.body.textContent, '새 스와이프');
  assert.equal(reads(h).length, 0);
});
test('one split uses a recent lookup then one-row verification windows and a bounded display refresh', async t => {
  const messages = history(); messages.at(-1).content = 'English paragraph. '.repeat(400);
  const h = await setup(t, { settings: null, fixture: { messages } }); writer(h); split(h); await h.settle(); await h.settle();
  const posts = h.requests.filter(r => r.path === '/api/translate');
  assert.ok(posts.length >= 2);
  assert.deepEqual(limits(h), [3, ...Array(posts.length + 1).fill(1), 3]);
  assert.equal(h.requests.filter(r => r.init.method === 'PATCH').length, 1);
  assert.equal(h.requests.length, 9 + 2 * posts.length);
});
test('older single-message split uses the adjacent loaded cursor with limit=1 for every check', async t => {
  const h = await setup(t, { loaded: true, settings: null, html: html('m5') }); writer(h); split(h); await h.settle(); await h.settle();
  assert.deepEqual(limits(h), [1, 1, 1]);
  for (const r of reads(h)) assert.equal(new URL(r.path, 'http://fixture.invalid').searchParams.get('before'), `${h.fixture.messages[5].createdAt}|m6`);
  assert.equal(h.fixture.messages[4].extra.translation, 'original');
});

test('changed visible text discards stale host cache and fetches just one recent slice', async t => {
  const h = await setup(t, { loaded: true });
  h.fixture.messages.at(-1).extra = { translation: '<status>새 번역</status>', translationSource: 'original' };
  h.original.textContent = '새 번역'; await h.settle();
  assert.equal(h.body.textContent, '새 번역'); assert.deepEqual(limits(h), [3]);
  await h.poll(); assert.deepEqual(limits(h), [3]);
});

test('missing latest translation stops after 15 polls; DOM changes still recheck without restarting polling', async t => {
  const h = await setup(t);
  h.w.performance.now = () => 0; // Count limit must work even before the time limit.
  h.setState({ isStreaming: true, streamingChatId: 'c' }); await h.settle();
  h.fixture.messages.at(-1).extra = {};
  h.setState({ isStreaming: false, streamingChatId: null }); await h.settle();
  const before = reads(h).length;
  for (let i = 0; i < 20; i++) await h.poll();
  assert.equal(reads(h).length - before, 15);
  h.original.textContent = 'host DOM update'; await h.settle();
  assert.equal(reads(h).length - before, 16);
  for (let i = 0; i < 3; i++) await h.poll();
  assert.equal(reads(h).length - before, 16);
  h.fixture.messages.at(-1).extra = message().extra;
  h.original.textContent = '체력 90'; await h.settle();
  assert.ok(h.wrapper); assert.equal(reads(h).length - before, 17);
  assert.ok(limits(h).every(n => n === 3));
});

test('30-second deadline stops pending polls early; host message events start a fresh bounded window', async t => {
  const h = await setup(t, { loaded: true });
  let now = 0; h.w.performance.now = () => now;
  h.setState({ isStreaming: true, streamingChatId: 'c' }); await h.settle();
  h.fixture.messages.at(-1).extra = {};
  h.setState({ isStreaming: false, streamingChatId: null }); await h.settle();
  const before = reads(h).length;
  now = 29999; await h.poll(); assert.equal(reads(h).length - before, 1);
  now = 30000; await h.poll();
  now = 60000; await h.poll(); assert.equal(reads(h).length - before, 1);
  await h.querySuccess(); await h.poll(); assert.equal(reads(h).length - before, 2);
  now = 90000; await h.poll(); assert.equal(reads(h).length - before, 2);
  h.fixture.messages.at(-1).extra = message().extra;
  await h.querySuccess(); assert.ok(h.wrapper);
  await h.poll(); assert.equal(reads(h).length - before, 2);
});
