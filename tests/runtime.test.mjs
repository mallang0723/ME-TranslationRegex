import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harness, rule, message, delay } from './harness.mjs';
async function withHost(t, options = {}) { const h = await harness(options); t.after(() => h.cleanup()); assert.deepEqual(h.errors, []); return h; }
test('DEM source tag survives API and renders sanitized sibling without editing original children', async t => {
  const h = await withHost(t); assert.ok(h.wrapper); assert.equal(h.body.querySelector('.dem strong').textContent, '체력 90');
  assert.equal(h.original.innerHTML, '<p>체력 90</p>'); assert.equal(h.original.nextSibling, h.wrapper);
  assert.equal(h.original.style.display, 'none'); assert.ok(h.wrapper.shadowRoot.querySelector('style').textContent.includes('.translation-content .dem'));
  assert.ok(h.requests.every(r => r.path.startsWith('/api/') && r.init.method === 'GET'));
});
test('Sola sample panel conversion preserves surrounding prose', async t => {
  const h = await withHost(t, { fixture: { messages: [message({ extra: { translation: '안녕\n<sola>맑음|90</sola>\n끝', translationSource: 'original' } })],
    rules: [rule({ findRegex: '<sola>([^|<]*)\\|([^<]*)</sola>', replaceString: '<aside class="sola"><b>$1</b><span>$2</span></aside>' })] } });
  assert.equal(h.body.querySelector('.sola').textContent, '맑음90'); assert.match(h.body.textContent, /^안녕\n.*\n끝$/);
});
test('script/on*/SVG/data attributes removed, style scoped, all remote resources blocked', async t => {
  const h = await withHost(t, { fixture: { rules: [rule({ replaceString: `<style>body{color:red}:host{display:none} .dem{background:u\\72l(https://outside.invalid/a);position:fixed}@import "https://outside.invalid/x";</style>
<section class="dem" onclick="alert(1)" data-secret="x" data-spk="a" style="background:image-set('https://outside.invalid/a' 1x);color:red"><script>alert(1)</script><svg onload="x()"></svg><img src="https://outside.invalid/a" onerror="x()" alt="표지"><a href="javascript:alert(1)">link</a><a href="https://outside.invalid/">외부</a>$1</section>` })] } });
  assert.equal(h.body.querySelector('script,svg,[onclick],[onerror],[data-secret],[src]'), null);
  assert.equal(h.body.querySelector('[data-spk]').getAttribute('data-spk'), 'a');
  assert.equal(h.body.querySelector('a[href]'), null); assert.ok(h.body.textContent.includes('표지'));
  assert.ok(!h.wrapper.shadowRoot.querySelector('style').textContent.includes('outside.invalid'));
  assert.equal(h.w.document.head.querySelector('style:not([data-translation-regex-action])'), null);
  assert.match(h.wrapper.shadowRoot.querySelector('style').textContent, /\.translation-content\{color:red\}/);
});
test('rerender node replacement removes orphan and mounts on new original', async t => {
  const h = await withHost(t); const old = h.original, wrapper = h.wrapper;
  const replacement = h.w.document.createElement('div'); replacement.className = 'translation-text'; replacement.textContent = '체력 90'; old.replaceWith(replacement);
  await h.settle(); assert.equal(wrapper.isConnected, false); assert.equal(old.style.display, '');
  assert.equal(h.original, replacement); assert.ok(h.wrapper); assert.equal(replacement.nextSibling, h.wrapper);
});
test('same original node translation update invalidates cached API data', async t => {
  const h = await withHost(t); h.fixture.messages[0].extra = { translation: '<status>체력 45</status>', translationSource: 'original' };
  h.original.textContent = '체력 45'; await h.settle(); assert.equal(h.body.textContent, '체력 45');
  assert.ok(h.requests.filter(r => r.path.endsWith('/messages')).length >= 2);
});
test('swipe change uses active swipe API extra and discards previous panel', async t => {
  const h = await withHost(t); h.fixture.messages[0] = message({ activeSwipeIndex: 1, content: 'swipe 1', extra: JSON.stringify({ translation: '<status>스와이프 1</status>', translationSource: 'swipe 1' }) });
  h.original.textContent = '스와이프 1'; await h.settle(); assert.equal(h.body.textContent, '스와이프 1');
});
test('streaming restores original synchronously; completion refreshes', async t => {
  const h = await withHost(t); h.setState({ isStreaming: true, streamingChatId: 'c' });
  assert.equal(h.wrapper, null); assert.equal(h.original.style.display, ''); await h.settle(); assert.equal(h.wrapper, null);
  h.setState({ isStreaming: false, streamingChatId: null }); await h.settle(); assert.ok(h.wrapper);
});
test('failed API restores original and next refresh recovers', async t => {
  const h = await withHost(t); h.fixture.fail = true; await h.refresh(); assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
  assert.equal(h.original.textContent, '체력 90'); h.fixture.fail = false; await h.refresh(); assert.ok(h.wrapper);
});
test('initial API failure leaves original untouched', async t => {
  const h = await withHost(t, { fixture: { fail: true } }); assert.equal(h.wrapper, null); assert.equal(h.original.getAttribute('style'), null);
});
test('no matching rule keeps original host formatting', async t => {
  const h = await withHost(t, { fixture: { rules: [rule({ findRegex: 'no-match' })] } }); assert.equal(h.wrapper, null); assert.equal(h.original.innerHTML, '<p>체력 90</p>');
});
test('empty sanitized result never hides original', async t => {
  const h = await withHost(t, { fixture: { rules: [rule({ replaceString: '<script>danger</script>' })] } }); assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
});
test('user messages and stale/hidden translations are not processed', async t => {
  const h = await withHost(t, { fixture: { messages: [message({ role: 'user' })] } }); assert.equal(h.wrapper, null);
  h.fixture.messages = [message({ extra: { translation: '<status>old</status>', translationSource: 'different source' } })]; await h.refresh(); assert.equal(h.wrapper, null);
  h.fixture.messages = [message({ extra: { translation: '<status>old</status>', translationHidden: true } })]; await h.refresh(); assert.equal(h.wrapper, null);
});
test('conversation default off, raw-source opt-in on, rendered-source never double-applied', async t => {
  const h = await withHost(t, { fixture: { chat: { id: 'c', mode: 'conversation', metadata: '{}' } } }); assert.equal(h.wrapper, null);
  const input = h.ui.querySelector('#conversation'); input.checked = true; input.dispatchEvent(new h.w.Event('change')); await h.settle(); assert.ok(h.wrapper);
  h.fixture.messages[0].extra = { translation: '<status>old</status>', translationSource: '<section>rendered source</section>' }; await h.refresh(); assert.equal(h.wrapper, null);
  delete h.fixture.messages[0].extra.translationSource; await h.refresh(); assert.equal(h.wrapper, null);
});
test('settings disable restores display and persists across reload', async t => {
  const h = await withHost(t); const input = h.ui.querySelector('#enabled'); input.checked = false; input.dispatchEvent(new h.w.Event('change')); await h.settle();
  assert.equal(h.wrapper, null); assert.equal(h.original.style.display, ''); assert.equal(JSON.parse(h.w.localStorage.getItem('translation_regex_me.settings')).autoApply, false);
  h.stop(); h.w.eval((await import('node:fs')).readFileSync('dist/extension.js', 'utf8')); await h.settle(); assert.equal(h.wrapper, null);
});
test('cleanup restores preexisting inline display, releases observers/timers/subscriptions and UI', async t => {
  const h = await withHost(t, { html: '<main data-message-id="m"><div class="translation-text" style="display:inline!important;color:red">체력 90</div></main>' });
  h.stop(); assert.equal(h.original.style.display, 'inline'); assert.equal(h.original.style.getPropertyPriority('display'), 'important'); assert.equal(h.original.style.color, 'red');
  assert.equal(h.wrapper, null); assert.equal(h.ui, undefined); assert.equal(h.timers.size, 0); assert.equal(h.intervals.size, 0); assert.equal(h.callbacks.size, 0);
  const count = h.requests.length; h.original.textContent = 'changed'; await h.settle(); assert.equal(h.requests.length, count);
});
test('delayed API response after cleanup cannot insert a panel', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { wait: false, fixture: { hold: () => pending } }); h.stop(); resolve(); await h.settle(); assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
});
test('delayed old-chat response cannot render into next chat', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { wait: false, fixture: { hold: () => pending } });
  h.setState({ activeChatId: null, activeChat: null }); h.fixture.hold = null; resolve(); await h.settle(); assert.equal(h.wrapper, null);
});
test('DOM changes during pending fetch reject stale render and apply latest version', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { wait: false, fixture: { hold: () => pending } });
  h.original.textContent = '새 번역'; h.fixture.messages[0].extra = { translation: '<status>새 번역</status>', translationSource: 'original' };
  await delay(10); h.fixture.hold = null; resolve(); await h.settle(); await h.settle(); assert.equal(h.body.textContent, '새 번역');
});
test('HTTP without host namespace/crypto.randomUUID uses storage and status API', async t => {
  const h = await withHost(t, { store: false }); assert.ok(h.wrapper); assert.equal(h.w.crypto.randomUUID, undefined); assert.ok(h.requests.some(r => r.path === '/api/generate/status/c'));
});
test('fallback detects generation and leaves original visible', async t => {
  const h = await withHost(t, { store: false, fixture: { status: { active: true } } }); assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
});
test('removing sibling during React render is repaired without loops', async t => {
  const h = await withHost(t); h.wrapper.remove(); await h.settle(); assert.ok(h.wrapper); const count = h.requests.length; await h.settle(); assert.equal(h.requests.length, count);
});
test('API macro context uses character/persona and preset choice data', async t => {
  const h = await withHost(t, { fixture: {
    chat: { id: 'c', mode: 'roleplay', characterIds: '["a"]', personaId: 'u', promptPresetId: 'p', metadata: '{"presetChoices":{"mood":"happy"}}' },
    rules: [rule({ replaceString: '<p>{{char}} / {{user}} / {{mood}} / $1</p>' })],
    routes: { '/api/prompts/p/full': { preset: { defaultChoices: '{}' }, choiceBlocks: [{ variableName: 'mood', options: '[{"value":"happy"},{"value":"sad"}]' }] } }
  } }); assert.equal(h.body.textContent, 'Sola / 독자 / happy / 체력 90');
});
test('chat override beats preset scope and actual message character gates exclusive', async t => {
  const h = await withHost(t, { fixture: { chat: { id: 'c', mode: 'roleplay', promptPresetId: 'p', metadata: '{"scopedRegexMode":"disabled"}' },
    presets: [{ id: 'p', scopedRegexMode: 'exclusive' }], rules: [rule({ targetCharacterIds: '["a"]', targetPromptPresetIds: '["p"]' })] } }); assert.equal(h.wrapper, null);
  h.fixture.chat.metadata = '{}'; await h.refresh(); assert.ok(h.wrapper);
  h.fixture.messages[0].characterId = 'b'; await h.refresh(); assert.equal(h.wrapper, null);
  h.fixture.chat.metadata = '{"scopedRegexMode":"chat"}'; await h.refresh(); assert.ok(h.wrapper);
});
test('depth uses chronological API messages, not mounted DOM count', async t => {
  const h = await withHost(t, { fixture: { messages: [message(), message({ id: 'new', role: 'user' })], rules: [rule({ minDepth: 1, maxDepth: 1 })] } }); assert.ok(h.wrapper);
});
test('one messages request is shared across multiple translation nodes', async t => {
  const h = await withHost(t, { html: '<main data-message-id="m"><div class="translation-text">체력 90</div></main><main data-message-id="m2"><div class="translation-text">체력 90</div></main>',
    fixture: { messages: [message(), message({ id: 'm2' })] } });
  assert.equal(h.w.document.querySelectorAll('[data-translation_regex_me]').length, 2);
  assert.equal(h.requests.filter(r => r.path.endsWith('/messages')).length, 1);
});
test('disabled startup never requests API data', async t => {
  const h = await withHost(t, { settings: { enabled: false } }); assert.equal(h.requests.length, 0); assert.equal(h.wrapper, null);
});
test('style restoration keeps React replacement of display property', async t => {
  const h = await withHost(t); h.original.style.setProperty('display', 'flex'); h.stop(); assert.equal(h.original.style.display, 'flex');
});
test('HTTP storage unavailable fails open without UUID or network fallback', async t => {
  const h = await withHost(t, { store: false, wait: false }); h.stop();
  Object.defineProperty(h.w, 'localStorage', { get() { throw Error('Storage disabled'); } });
  h.w.eval((await import('node:fs')).readFileSync('dist/extension.js', 'utf8')); await h.settle(); assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
});
test('same-text swipe mutation is detected by periodic API refresh', async t => {
  const h = await withHost(t); const before = h.wrapper;
  h.fixture.messages[0] = message({ activeSwipeIndex: 1, extra: { translation: '<status>새 스와이프</status>', translationSource: 'original' } });
  await delay(2100); assert.equal(h.body.textContent, '새 스와이프'); assert.equal(before.isConnected, false);
});
test('cleanup clears pending request deadlines even when fetch ignores abort', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { wait: false, fixture: { hold: () => pending } }); h.stop();
  assert.equal(h.timers.size, 0); assert.equal(h.intervals.size, 0); resolve(); await h.settle(); assert.equal(h.wrapper, null);
});
test('display macro context excludes prompt-only card fields', async t => {
  const h = await withHost(t, { fixture: { chat: { id: 'c', mode: 'roleplay', metadata: '{}', characterIds: '["a"]' },
    rules: [rule({ replaceString: '<p>{{systemPrompt}}|{{postHistoryInstructions}}|$1</p>' })],
    routes: { '/api/characters/a': { id: 'a', data: { name: 'Sola', system_prompt: 'PROMPT_SECRET', post_history_instructions: 'HISTORY_SECRET' } } } } });
  assert.ok(h.wrapper); assert.ok(!h.body.textContent.includes('SECRET'));
});
test('quote format fallback reads host persistence when namespace is absent', async t => {
  const h = await withHost(t, { store: false });
  h.w.localStorage.setItem('marinara-engine-ui', JSON.stringify({ version: 74, state: { quoteFormat: 'straight' } }));
  h.w.localStorage.setItem('marinara-engine-ui:host', JSON.stringify({ version: 103, state: { quoteFormat: 'typographic' } }));
  h.fixture.rules = [rule({ replaceString: '<p>"$1"</p>' })]; await h.refresh(); assert.equal(h.body.textContent, '“체력 90”');
});

test('0.2 regression: translation-only completion exits waiting on the next 2s poll without a translation-text node', async t => {
  const h = await withHost(t, { html: '<main data-message-id="m"><div class="mari-message-content"><p>체력 90</p></div></main>',
    fixture: { chat: { id: 'c', mode: 'roleplay', metadata: '{"translationDisplayOnly":true}' }, messages: [message({ extra: {} })] } });
  assert.equal(h.wrapper, null);
  h.fixture.messages[0] = message();
  await delay(2100);
  assert.ok(h.wrapper, 'completed inline translation must be discovered without .translation-text');
  assert.equal(h.body.textContent, '체력 90');
  assert.doesNotMatch(h.ui.querySelector('[role=status]').textContent, /기다리는 중/);
});

const actionHTML = (content = '<div class="translation-text"><p>체력 90</p></div>') => `<main class="mari-message-assistant" data-message-id="m">${content}<div class="mari-message-actions opacity-100"><button title="복사"><svg></svg></button><button title="번역">번역</button></div></main>`;
const action = h => h.w.document.querySelector('[data-translation-regex-action] button');

test('0.2 fresh install and legacy enabled setting default to manual, one dashed cube is a row sibling', async t => {
  for (const settings of [null, { enabled: true }]) {
    const h = await withHost(t, { settings, html: actionHTML() });
    assert.equal(h.wrapper, null); assert.equal(h.requests.length, 0);
    assert.equal(h.ui.querySelector('#enabled').checked, false);
    const row = h.w.document.querySelector('.mari-message-actions');
    assert.equal(row.children.length, 2); assert.equal(row.nextSibling, action(h).parentElement);
    assert.equal(action(h).title, '번역문에 표시 정규식 적용');
    assert.equal(action(h).querySelector('svg').getAttribute('stroke'), 'currentColor');
    assert.ok(action(h).querySelector('svg').hasAttribute('stroke-dasharray'));
    action(h).click(); await h.settle(); assert.ok(h.wrapper);
    assert.equal(action(h).getAttribute('aria-pressed'), 'true');
    action(h).click(); assert.equal(h.wrapper, null); await h.settle();
    assert.equal(h.original.style.display, ''); assert.equal(action(h).getAttribute('aria-pressed'), 'false');
  }
});
test('0.2 manual inline translation toggles without modifying original children and auto opt-in persists', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML('<div class="mari-message-content"><p>체력 90</p></div>'),
    fixture: { chat: { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } } } });
  const original = h.w.document.querySelector('.mari-message-content'), child = original.firstChild;
  action(h).click(); await h.settle(); assert.ok(h.wrapper); assert.equal(original.style.display, 'none');
  action(h).click(); await h.settle(); assert.equal(h.wrapper, null); assert.equal(original.firstChild, child); assert.equal(original.style.display, '');
  const input = h.ui.querySelector('#enabled'); input.checked = true; input.dispatchEvent(new h.w.Event('change')); await h.settle();
  assert.ok(h.wrapper); assert.equal(JSON.parse(h.w.localStorage.getItem('translation_regex_me.settings')).autoApply, true);
});
test('0.2 inline detection never substitutes raw prose with missing mode/source, hidden/stale translation or an editor', async t => {
  const h = await withHost(t, { html: actionHTML('<div class="mari-message-content">original</div>') });
  assert.equal(h.wrapper, null); assert.match(h.ui.querySelector('[role=status]').textContent, /영역 없음/);
  h.fixture.chat.metadata = { translationDisplayOnly: true };
  for (const extra of [{ translation: '<status>old</status>' }, { translation: '<status>old</status>', translationSource: 'other' },
    { translation: '<status>old</status>', translationSource: 'original', translationHidden: true }]) {
    h.fixture.messages = [message({ extra })]; await h.refresh(); assert.equal(h.wrapper, null);
  }
  h.fixture.messages = [message()]; h.w.document.querySelector('main').append(h.w.document.createElement('textarea'));
  await h.settle(); assert.equal(h.wrapper, null);
});
test('0.2 action reattaches after React row/sibling replacement and cleanup leaves host intact', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML() });
  action(h).click(); await h.settle();
  let row = h.w.document.querySelector('.mari-message-actions'); row.replaceWith(row.cloneNode(true)); await h.settle();
  assert.equal(h.w.document.querySelectorAll('[data-translation-regex-action] button').length, 1);
  assert.equal(action(h).getAttribute('aria-pressed'), 'true');
  action(h).parentElement.remove(); await h.settle(); assert.ok(action(h));
  const count = h.requests.length; await h.settle(); assert.equal(h.requests.length, count);
  row = h.w.document.querySelector('.mari-message-actions'); h.stop();
  assert.equal(row.children.length, 2); assert.equal(row.hasAttribute('data-translation-regex-row'), false);
  assert.equal(h.w.document.querySelector('[data-translation-regex-action]'), null);
});
test('0.2 manual choices belong to each swipe, button survives switching and auto can be toggled off per message', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML() });
  action(h).click(); await h.settle(); assert.ok(h.wrapper);
  h.fixture.messages[0] = message({ activeSwipeIndex: 1 }); await h.refresh();
  assert.equal(h.wrapper, null); assert.ok(action(h)); assert.equal(action(h).getAttribute('aria-pressed'), 'false');
  action(h).click(); await h.settle(); assert.ok(h.wrapper);
  const input = h.ui.querySelector('#enabled'); input.checked = true; input.dispatchEvent(new h.w.Event('change')); await h.settle();
  action(h).click(); await h.settle(); assert.equal(h.wrapper, null);
  await h.refresh(); assert.equal(h.wrapper, null);
});
test('0.2 per-message toggle does not affect another message', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML() + actionHTML().replace('data-message-id="m"', 'data-message-id="m2"'),
    fixture: { messages: [message(), message({ id: 'm2' })] } });
  action(h).click(); await h.settle();
  assert.equal(h.w.document.querySelectorAll('[data-translation_regex_me]').length, 1);
  assert.equal(h.wrapper.closest('[data-message-id]').dataset.messageId, 'm');
});
test('0.2 button exposes progress/failure and recovers on retry without losing translation', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { settings: null, html: actionHTML() });
  h.fixture.hold = () => pending; action(h).click(); await h.settle();
  assert.equal(action(h).getAttribute('aria-busy'), 'true'); assert.match(action(h).title, /적용 중/);
  h.fixture.fail = true; resolve(); await h.settle();
  assert.equal(action(h).dataset.state, 'error'); assert.match(action(h).title, /실패/);
  assert.equal(h.original.style.display, ''); assert.equal(h.original.textContent, '체력 90');
  h.fixture.fail = false; h.fixture.hold = null; action(h).click(); await h.settle(); assert.ok(h.wrapper);
  assert.equal(action(h).getAttribute('aria-busy'), 'false');
});
test('0.2 a second click cancels an in-flight manual apply', async t => {
  let resolve; const pending = new Promise(r => resolve = r);
  const h = await withHost(t, { settings: null, html: actionHTML() });
  h.fixture.hold = () => pending; action(h).click(); await h.settle(); action(h).click();
  h.fixture.hold = null; resolve(); await h.settle(); await h.settle();
  assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
  assert.equal(action(h).getAttribute('aria-pressed'), 'false');
});
test('0.2 unsupported DOM and API-only missing translation report a reason instead of endless waiting', async t => {
  const h = await withHost(t, { html: actionHTML('<article>번역문</article>') });
  assert.match(action(h).title, /영역 없음/); assert.doesNotMatch(h.ui.querySelector('[role=status]').textContent, /기다리는 중/);
  h.fixture.messages[0].extra = {}; await h.refresh(); assert.match(action(h).title, /저장된 번역문 없음/);
});

test('0.2 switching inline/separate DOM and replacing inline nodes restores originals and preserves toggle', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML(), fixture: { chat: { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } } } });
  action(h).click(); await h.settle();
  const old = h.original, replacement = h.w.document.createElement('div'); replacement.className = 'mari-message-content'; replacement.textContent = '체력 90';
  old.replaceWith(replacement); await h.settle(); assert.equal(old.style.display, ''); assert.equal(replacement.nextSibling, h.wrapper);
  const next = replacement.cloneNode(true); next.removeAttribute('style'); replacement.replaceWith(next); await h.settle();
  assert.equal(next.nextSibling, h.wrapper); assert.equal(action(h).getAttribute('aria-pressed'), 'true');
  h.fixture.messages[0].extra = { translation: '<status>체력 90</status>', translationSource: 'original', translationHidden: true };
  await h.refresh(); assert.equal(h.wrapper, null); assert.equal(next.style.display, ''); assert.match(action(h).title, /숨긴 번역문/);
});
test('0.2 returning to a manually enabled swipe restores its choice', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML() });
  action(h).click(); await h.settle();
  h.fixture.messages[0].activeSwipeIndex = 1; await h.refresh(); assert.equal(h.wrapper, null);
  h.fixture.messages[0].activeSwipeIndex = 0; await h.refresh(); assert.ok(h.wrapper);
});
test('0.2 inline translation preserves interactive host command results', async t => {
  const h = await withHost(t, { html: actionHTML('<div class="mari-message-content">체력 90<button>주사위 결과</button></div>'),
    fixture: { chat: { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } } } });
  assert.equal(h.wrapper, null); assert.match(action(h).title, /상호작용/);
  assert.equal(h.w.document.querySelector('.mari-message-content').style.display, '');
});
test('0.2 manual mode recovers from a missing API translation on periodic polling without DOM mutations', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML('<div class="mari-message-content">체력 90</div>'),
    fixture: { chat: { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } }, messages: [message({ extra: {} })] } });
  action(h).click(); await h.settle(); assert.match(action(h).title, /저장된 번역문 없음/);
  h.fixture.messages[0] = message(); await delay(2100);
  assert.ok(h.wrapper); assert.equal(action(h).getAttribute('aria-pressed'), 'true');
});
test('0.2 action CSS reserves a 44px sibling slot and matches host theme (layout verification is separate)', async t => {
  const h = await withHost(t, { settings: null, html: actionHTML() });
  const css = h.w.document.querySelector('style[data-translation-regex-action]').textContent;
  assert.match(css, /padding-inline-end:48px!important;flex-wrap:nowrap!important/);
  assert.match(css, /width:44px;height:44px;min-width:44px/);
  assert.match(css, /--marinara-chat-message-action-bg-hover/);
  assert.match(css, /--marinara-chat-message-action-text-hover/);
});
test('0.2 inline retranslation progress does not mistake original prose for the cached translation', async t => {
  const h = await withHost(t, { html: actionHTML('<div class="mari-message-content">original</div><div class="mt-2 border-t pt-2"><span>번역 중</span></div>'),
    fixture: { chat: { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } } } });
  assert.equal(h.wrapper, null); assert.match(action(h).title, /번역 진행 중/);
  h.w.document.querySelector('.border-t').remove(); h.w.document.querySelector('.mari-message-content').textContent = '체력 90';
  await h.settle(); assert.ok(h.wrapper); assert.equal(h.body.textContent, '체력 90');
});
