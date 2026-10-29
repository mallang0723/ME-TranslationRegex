import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { harness, message, delay } from './harness.mjs';
const built = await build({ entryPoints: ['src/translation.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { splitTranslation, protectTags, truncation, continuationOffset, sourceMatches, translationConfig } =
  await import('data:text/javascript;base64,' + Buffer.from(built.outputFiles[0].text).toString('base64'));
const html = '<main data-message-id="m"><div class="translation-text">기존 번역</div><div class="mari-message-actions"><button>번역</button><div data-translation-polisher-ui><button>다듬기</button><button>설정 슬라이더</button></div></div></main>';
async function setup(t, options = {}) {
  const h = await harness({ html, settings: null, ...options }); t.after(() => h.cleanup());
  h.w.document.querySelector('button[data-translation-regex-action]').dispatchEvent(new h.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  return h;
}
const click = (h, id) => h.ui.querySelector('#' + id).click();
const writes = h => h.requests.filter(r => r.init.method !== 'GET');
function writer(h, translate = text => text.replaceAll('English', '한국어')) {
  h.fixture.write = async (path, init) => {
    assert.equal(init.headers['x-marinara-csrf'], '1');
    assert.equal(init.headers['Content-Type'], 'application/json');
    assert.equal(init.credentials, 'same-origin');
    const body = JSON.parse(init.body);
    if (path === '/api/translate') return { ok: true, json: async () => ({ translatedText: await translate(body.text) }) };
    assert.equal(path, '/api/chats/c/messages/m/extra?swipeIndex=0');
    h.fixture.messages[0].extra = { ...JSON.parse(JSON.stringify(typeof h.fixture.messages[0].extra === 'string' ? JSON.parse(h.fixture.messages[0].extra) : h.fixture.messages[0].extra)), ...body };
    return { ok: true, json: async () => h.fixture.messages[0] };
  };
}

test('chunks preserve every byte, paragraph/sentence boundaries, nested/quoted tags and large atomic blocks', () => {
  for (const text of ['A sentence. '.repeat(800), 'x'.repeat(8000), '😀'.repeat(3500),
    'P'.repeat(2200) + '\n\n' + '<status title="a > b">' + 'nested <b>English</b> '.repeat(300) + '</status>\n\nTail.',
    'Intro\n\n<status>' + 'x'.repeat(4000), '<status><nested>bad</status>' + 'x'.repeat(4000)]) {
    const chunks = splitTranslation(text); assert.equal(chunks.join(''), text);
    if (text.includes('<status')) assert.equal(chunks.filter(c => c.includes('<status')).length, 1);
    for (const chunk of chunks) assert.ok(!/^[\uDC00-\uDFFF]|[\uD800-\uDBFF]$/.test(chunk));
  }
  assert.deepEqual(splitTranslation('A'.repeat(2000) + '\n\n' + 'B'.repeat(2000)), ['A'.repeat(2000) + '\n\n', 'B'.repeat(2000)]);
  const block = '<status>' + 'x'.repeat(6000) + '</status>';
  assert.deepEqual(splitTranslation(block), [block]);
});
test('tag placeholders protect attributes and restore nested tags; corrupt, duplicate, reordered markers fall back intact', () => {
  const source = 'Before <status title="English > value"><b>English</b></status> after';
  const p = protectTags(source);
  assert.ok(!p.text.includes('<status')); assert.ok(!p.text.includes('value'));
  assert.deepEqual(p.restore(p.text.replace('English', '한국어')), { text: source.replace('<b>English', '<b>한국어'), fallback: false });
  const tokens = p.text.match(/\[\[TRX_TAG_\d+\]\]/g);
  for (const bad of [p.text.replace(tokens[0], ''), p.text + tokens[0], p.text.replace(/\[\[TRX_TAG_[01]\]\]/g, token => token === tokens[0] ? tokens[1] : tokens[0]), '<b>' + p.text]) {
    assert.deepEqual(p.restore(bad), { text: source, fallback: true });
  }
  const collision = protectTags('[[TRX_TAG_0]] <status>x</status>');
  assert.equal(collision.restore(collision.text).text, '[[TRX_TAG_0]] <status>x</status>');
});
test('truncation heuristic distinguishes low ratio, unfinished sentence and short labels', () => {
  assert.equal(truncation('English sentence. '.repeat(80), '한국어 문장입니다.').lowRatio, true);
  assert.equal(truncation('English sentence. '.repeat(30), '아직 끝나지 않은 문장 '.repeat(25)).midSentence, true);
  assert.equal(truncation('English sentence. '.repeat(30), '한국어 문장입니다. '.repeat(30)).suspected, false);
  assert.equal(truncation('HP 99', '체력').suspected, false);
});
test('continuation uses unique preserved block/exact prefix; ambiguous or mid-tag location refuses', () => {
  const anchor = '<status code="1">HP 90</status>';
  const source = 'First source paragraph.\n' + anchor + '\nRemaining source.';
  assert.equal(continuationOffset(source, '첫 문단.\n' + anchor), source.indexOf('\nRemaining'));
  assert.equal(continuationOffset(source + anchor + 'Tail', anchor), null);
  assert.equal(continuationOffset(source, '문장 중간에서 끊긴 번역'), null);
  assert.equal(continuationOffset('abc def', 'abc'), 3);
  assert.equal(continuationOffset('<status>test</status> end', '<status>test'), null);
});
test('host provider/language/config legacy and reset semantics; polisher source alias is exact', () => {
  assert.deepEqual(translationConfig({ id: 'c', metadata: { translationProvider: 'deepl', translationTargetLang: 'ko',
    translationOutputTargetLang: ' ', translationPrompt: 'legacy', translationOutputPrompt: null, translationDeeplApiKey: 'fake-key' } }),
  { chatId: 'c', provider: 'deepl', targetLanguage: 'ko', connectionId: undefined, systemPrompt: undefined, deeplApiKey: 'fake-key', deeplxUrl: undefined });
  assert.ok(sourceMatches({ content: 'original', extra: { translationSource: 'long transformed', translationPolisherLongSource: 'original' } }));
  assert.equal(sourceMatches({ content: 'swipe2', extra: { translationSource: 'long transformed', translationPolisherLongSource: 'original' } }), false);
});
test('split translates sequential chunks with host config, PATCHes only translation fields, reapplies regex', async t => {
  const source = 'English. '.repeat(380) + '\n\n<status>English</status>';
  const h = await setup(t, { fixture: { messages: [message({ content: source, extra: { translation: '기존 번역', translationSource: source, translationPolisherOriginal: 'preserve me' } })],
    chat: { id: 'c', mode: 'roleplay', metadata: { translationProvider: 'ai', translationOutputTargetLang: 'ko', translationConnectionId: 'conn', translationOutputPrompt: 'prompt' } } } });
  writer(h); click(h, 'split-translation'); await h.settle(); await h.settle();
  const requests = writes(h), post = requests.filter(r => r.init.method === 'POST'), patch = requests.at(-1);
  assert.ok(post.length >= 2); assert.equal(patch.init.method, 'PATCH');
  assert.equal(post.map(r => JSON.parse(r.init.body).text).join('').includes('[[TRX_TAG_'), true);
  for (const r of post) {
    const b = JSON.parse(r.init.body); assert.equal(b.provider, 'ai'); assert.equal(b.targetLanguage, 'ko'); assert.equal(b.connectionId, 'conn'); assert.equal(b.systemPrompt, 'prompt'); assert.equal(b.chatId, 'c');
  }
  assert.deepEqual(Object.keys(JSON.parse(patch.init.body)), ['translation', 'translationSource', 'translationHidden']);
  assert.equal(h.fixture.messages[0].extra.translation, source.replaceAll('English', '한국어'));
  assert.equal(h.fixture.messages[0].extra.translationPolisherOriginal, 'preserve me');
  assert.ok(h.body.querySelector('.dem')); assert.match(h.body.textContent, /한국어/);
});
test('continue translates only remaining source and uncertain alignment makes no writes', async t => {
  const anchor = '<status code="1">HP 90</status>', source = 'First source.\n' + anchor + '\nEnglish remaining.';
  const h = await setup(t, { fixture: { messages: [message({ content: source, extra: { translation: '첫 문단.\n' + anchor, translationSource: source } })] } });
  writer(h); click(h, 'continue-translation'); await h.settle();
  assert.equal(JSON.parse(writes(h)[0].init.body).text, '\nEnglish remaining.');
  assert.equal(h.fixture.messages[0].extra.translation, '첫 문단.\n' + anchor + '\n한국어 remaining.');
  h.fixture.messages[0].extra.translation = '중간에서 끊긴'; click(h, 'continue-translation'); await h.settle();
  assert.equal(writes(h).length, 2); assert.match(h.ui.textContent, /위치가 불확실.*나눠서 다시 번역/);
});
test('failure retains old translation, offers partial save/discard, save retries and keeps completed chunks', async t => {
  const source = 'English. '.repeat(800);
  const h = await setup(t, { fixture: { messages: [message({ content: source, extra: { translation: 'old', translationSource: source } })] } });
  let n = 0; writer(h, text => { if (++n === 2) throw Error('second chunk failed'); return text.replaceAll('English', '한국어'); });
  click(h, 'split-translation'); await h.settle();
  assert.equal(h.fixture.messages[0].extra.translation, 'old'); assert.equal(h.ui.querySelector('#save-partial').hidden, false);
  assert.equal(writes(h).filter(r => r.init.method === 'PATCH').length, 0);
  click(h, 'save-partial'); await h.settle();
  assert.equal(h.fixture.messages[0].extra.translation, splitTranslation(source)[0].replaceAll('English', '한국어'));
  assert.equal(h.ui.querySelector('#save-partial').hidden, true);
});
test('PATCH failure leaves API and DOM translation intact until an explicit partial retry', async t => {
  const h = await setup(t); writer(h); const normal = h.fixture.write;
  h.fixture.write = (p, i) => i.method === 'PATCH' ? { ok: false, status: 500 } : normal(p, i);
  click(h, 'split-translation'); await h.settle();
  assert.equal(JSON.parse(h.fixture.messages[0].extra).translation, '<status>체력 90</status>'); assert.equal(h.original.textContent, '기존 번역');
  assert.equal(h.ui.querySelector('#save-partial').hidden, false);
  h.fixture.write = normal; click(h, 'save-partial'); await h.settle();
  assert.equal(h.fixture.messages[0].extra.translation, 'original');
});
test('cancel aborts an unresponsive provider, partial discard writes nothing; cleanup clears deadlines', async t => {
  const source = 'English. '.repeat(800);
  const h = await setup(t, { fixture: { messages: [message({ content: source })] } });
  let count = 0, release;
  h.fixture.write = async () => ++count === 1 ? { ok: true, json: async () => ({ translatedText: 'first chunk.' }) } : new Promise(r => release = r);
  click(h, 'split-translation'); await h.settle(); assert.match(h.ui.textContent, /청크 2\//);
  click(h, 'cancel-translation'); await h.settle();
  assert.equal(writes(h)[1].init.signal.aborted, true); assert.equal(h.ui.querySelector('#save-partial').hidden, false);
  click(h, 'discard-partial'); assert.equal(h.ui.querySelector('#save-partial').hidden, true);
  release({ ok: true, json: async () => ({ translatedText: 'late' }) }); await h.settle();
  assert.equal(writes(h).filter(r => r.init.method === 'PATCH').length, 0);
  click(h, 'split-translation'); await h.settle(); h.stop(); assert.equal(h.timers.size, 0);
});
test('source/swipe/polisher changes and navigation during translation prevent stale PATCH', async t => {
  for (const change of ['source','swipe','polisher','navigation']) {
    const h = await setup(t); let resolve;
    h.fixture.write = () => new Promise(r => resolve = r);
    click(h, 'split-translation'); await h.settle();
    if (change === 'source') h.fixture.messages[0].content = 'new source';
    if (change === 'swipe') h.fixture.messages[0].activeSwipeIndex = 1;
    if (change === 'polisher') h.fixture.messages[0].extra = { translation: 'polished', translationSource: 'original' };
    if (change === 'navigation') h.setState({ activeChatId: 'other' });
    resolve({ ok: true, json: async () => ({ translatedText: 'late translation' }) }); await h.settle();
    assert.equal(writes(h).filter(r => r.init.method === 'PATCH').length, 0, change);
  }
});
test('automatic continuation defaults off, opts in independently, and never loops on its own output', async t => {
  const anchor = '<status code="1">HP 90</status>', source = 'English. '.repeat(200) + anchor + '\nEnglish tail.';
  const h = await setup(t, { fixture: { messages: [message({ content: source, extra: { translation: '첫 문단. ' + anchor, translationSource: source } })] } });
  writer(h); assert.equal(h.ui.querySelector('#autoContinue').checked, false); assert.equal(writes(h).length, 0);
  const input = h.ui.querySelector('#autoContinue'); input.checked = true; input.dispatchEvent(new h.w.Event('change'));
  await h.settle(); await h.settle(); await h.refresh();
  assert.equal(writes(h).filter(r => r.init.method === 'POST').length, 1);
  assert.equal(JSON.parse(h.w.localStorage.getItem('translation_regex_me.settings')).autoContinue, true);
});
test('polisher API output/longSource and DOM changes converge, controls remain untouched, cube follows slider', async t => {
  const h = await setup(t, { settings: { autoApply: true }, fixture: { messages: [message({ extra: {
    translation: '<status>다듬기 결과</status>', translationSource: 'long transformed', translationPolisherLongSource: 'original', translationPolisherOutput: 'stale ignored',
  } })] } });
  assert.equal(h.body.textContent, '다듬기 결과');
  const ui = h.w.document.querySelector('[data-translation-polisher-ui]'), button = ui.lastElementChild;
  const cube = h.w.document.querySelector('button[data-translation-regex-action]');
  assert.equal(ui.nextElementSibling, cube); assert.equal(cube.parentElement.lastElementChild, cube);
  h.original.textContent = '다듬기가 직접 표시한 텍스트'; h.original.classList.add('mtp-overridden'); await h.settle();
  assert.equal(h.body.textContent, '다듬기 결과'); const wrapper = h.wrapper, count = h.requests.length;
  h.original.textContent = '다듬기가 직접 표시한 텍스트'; button.textContent = '변경된 설정'; await h.settle(); await h.settle();
  assert.equal(h.wrapper, wrapper); assert.equal(h.requests.length, count); assert.equal(ui.lastElementChild, button);
  h.fixture.messages[0].extra.translation = '<status>새 다듬기</status>'; h.original.textContent = '새 다듬기'; await h.settle();
  assert.equal(h.body.textContent, '새 다듬기'); h.stop(); assert.equal(button.isConnected, true); assert.equal(h.original.style.display, '');
});
test('tag restoration failure preserves original block and reports fallback, oversized atomic blocks never POST', async t => {
  const h = await setup(t, { fixture: { messages: [message({ content: '<status key="original">English</status>' })] } });
  writer(h, () => 'provider dropped placeholders'); click(h, 'split-translation'); await h.settle();
  assert.equal(h.fixture.messages[0].extra.translation, '<status key="original">English</status>');
  assert.match(h.ui.textContent, /태그 복원 실패 1개 청크는 원문 보존/);
  const count = writes(h).length;
  h.fixture.messages[0].content = '<status>' + 'x'.repeat(6000) + '</status>';
  click(h, 'split-translation'); await h.settle(); assert.equal(writes(h).length, count);
  assert.match(h.ui.textContent, /태그 블록이 공급자 한도/);
});
test('empty or malformed translation response and active generation never overwrite an existing translation', async t => {
  for (const response of [{ translatedText: '' }, { result: 'wrong shape' }]) {
    const h = await setup(t); h.fixture.write = () => ({ ok: true, json: async () => response });
    click(h, 'split-translation'); await h.settle(); assert.equal(writes(h).length, 1);
    assert.equal(h.fixture.messages[0].extra, message().extra);
    h.fixture.status.active = true; click(h, 'split-translation'); await h.settle(); assert.equal(writes(h).length, 1);
  }
});
test('successful save displays new API translation even without regex matches and refreshes the host message query', async t => {
  const h = await setup(t, { fixture: { rules: [] } }); const keys = [];
  h.w.__MARINARA_HOST__.queryClient = { invalidateQueries: arg => keys.push(arg.queryKey) };
  writer(h, () => '새 번역.'); click(h, 'split-translation'); await h.settle(); await h.settle();
  assert.equal(h.body.textContent, '새 번역.'); assert.equal(h.original.textContent, '기존 번역');
  assert.deepEqual(JSON.parse(JSON.stringify(keys)), [['chats', 'messages', 'c']]);
});
test('polisher-owned interactive controls inside a translation are never hidden or replaced', async t => {
  const h = await setup(t, { settings: { autoApply: true }, html: html.replace('기존 번역', '기존 번역<button data-translation-polisher-ui>수정</button>') });
  assert.equal(h.wrapper, null); assert.equal(h.original.style.display, ''); assert.ok(h.original.querySelector('button'));
});
test('late polisher controls and host slider keep their nodes while cube returns to the last child', async t => {
  const h = await setup(t); const row = h.w.document.querySelector('.mari-message-actions');
  const cube = row.lastElementChild, slider = h.w.document.createElement('button'); slider.textContent = '추가 설정';
  row.append(slider); await h.settle(); assert.equal(row.lastElementChild, cube); assert.equal(cube.previousElementSibling, slider);
  cube.remove(); await h.settle(); assert.equal(row.lastElementChild.hasAttribute('data-translation-regex-action'), true);
  assert.equal(slider.isConnected, true);
});
test('uncertain automatic continuation is attempted once without any provider calls', async t => {
  const h = await setup(t, { settings: { autoContinue: true }, fixture: { messages: [message({ content: 'English. '.repeat(200), extra: {
    translation: '끝나지 않은 한국어 번역', translationSource: 'English. '.repeat(200),
  } })] } });
  assert.match(h.ui.textContent, /위치가 불확실/);
  const calls = h.requests.filter(r => r.path === '/api/generate/status/c').length;
  await h.refresh(); await h.refresh();
  assert.equal(h.requests.filter(r => r.path === '/api/generate/status/c').length, calls);
  assert.equal(writes(h).length, 0);
});
