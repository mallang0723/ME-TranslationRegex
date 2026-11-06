import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { harness, message, rule, delay } from './harness.mjs';

async function moduleOf(entry) {
  const result = await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', write: false });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const regex = await moduleOf('src/regex.ts');
const macros = await moduleOf('src/macros.ts');
const safety = await moduleOf('vendor/upstream/regex-safety.ts');
const bodyHTML = '<main data-message-id="m"><div class="mari-message-content"><p>번역문</p></div></main>';
const inlineChat = { id: 'c', mode: 'roleplay', metadata: { translationDisplayOnly: true } };
async function host(t, options) {
  const h = await harness(options); t.after(() => h.cleanup()); return h;
}

test('2.5.2 source guard accepts legacy separate translations but requires exact source for inline mode', async t => {
  for (const inline of [false, true]) {
    const h = await host(t, inline ? { html: bodyHTML, fixture: { chat: inlineChat } } : {});
    for (const source of [undefined, 'original', 'old swipe', null, 42]) {
      h.fixture.messages[0].extra = { translation: '<status>번역</status>', translationSource: source,
        translationPolisherLongSource: 'original' };
      await h.refresh();
      assert.equal(!!h.wrapper, source === 'original' || (!inline && source === undefined), `${inline}:${source}`);
    }
  }
});

test('2.5.2 new swipe drops the old inline overlay before a delayed API read and never revives stale translation', async t => {
  const h = await host(t, { html: bodyHTML, fixture: { chat: inlineChat } });
  const original = h.w.document.querySelector('.mari-message-content');
  assert.ok(h.wrapper);
  let release; const pending = new Promise(resolve => { release = resolve; });
  h.fixture.hold = () => pending;
  h.fixture.messages[0] = message({ content: 'new swipe', activeSwipeIndex: 1,
    extra: { translation: '<status>old translation</status>', translationSource: 'original', translationPolisherLongSource: 'new swipe' } });
  original.innerHTML = '<p>new swipe</p>';
  await delay(0); // MutationObserver runs before the 60ms debounce/API request.
  assert.equal(h.wrapper, null); assert.equal(original.style.display, '');
  await h.settle(); assert.equal(h.wrapper, null);
  h.fixture.hold = null; release(); await h.settle(); await h.settle();
  assert.equal(h.wrapper, null); assert.equal(original.textContent, 'new swipe');
  h.fixture.messages[0].extra.translationSource = 'new swipe';
  h.fixture.messages[0].extra.translation = '<status>새 번역</status>';
  original.innerHTML = '<p>새 번역</p>'; await h.settle();
  assert.equal(h.body.textContent, '새 번역');
});

test('2.5.2 streaming invalidates an in-flight render and restores only a matching completed translation', async t => {
  let release; const pending = new Promise(resolve => { release = resolve; });
  const h = await host(t, { wait: false, fixture: { hold: () => pending } });
  h.setState({ isStreaming: true, streamingChatId: 'c' });
  h.fixture.hold = null; release(); await h.settle(); await h.settle();
  assert.equal(h.wrapper, null);
  h.fixture.messages[0].content = 'streamed source';
  h.setState({ isStreaming: false, streamingChatId: null }); await h.settle();
  assert.equal(h.wrapper, null);
  h.fixture.messages[0].extra = { translation: '<status>완료</status>', translationSource: 'streamed source' };
  await h.refresh(); assert.equal(h.body.textContent, '완료');
  h.setState({ isStreaming: true, streamingChatId: 'c' });
  assert.equal(h.wrapper, null); assert.equal(h.original.style.display, '');
});

test('2.5.2 inline roll, whisper, illustration and SVG artifact keep host nodes and translation-first order', async t => {
  for (const marker of ['data-roleplay-inline-roll', 'data-roleplay-whisper', 'data-roleplay-inline-illustration', 'data-roleplay-artifact']) {
    const h = await host(t, { html: bodyHTML, fixture: { chat: inlineChat } });
    const original = h.w.document.querySelector('.mari-message-content'), prose = original.firstChild;
    assert.ok(h.wrapper);
    const result = h.w.document.createElement('div'); result.setAttribute(marker, '');
    result.innerHTML = marker === 'data-roleplay-artifact' ? '<svg><circle r="5"/></svg>' : '<span>command result</span>';
    let clicked = 0; result.addEventListener('click', () => clicked++);
    original.append(result); await delay(0);
    assert.equal(h.wrapper, null); assert.equal(original.style.display, '');
    await h.settle(); assert.equal(h.wrapper, null, marker);
    assert.equal(original.firstChild, prose); assert.equal(prose.nextSibling, result);
    result.click(); assert.equal(clicked, 1);
    h.stop(); assert.equal(result.isConnected, true); assert.equal(original.style.display, '');
  }
});

test('2.5.2 separate translation can be processed without hiding command results in the source body', async t => {
  const h = await host(t, { html: bodyHTML.replace('</main>', '<div class="translation-text">번역</div></main>')
    .replace('</p>', '</p><div data-roleplay-inline-roll>17</div>') });
  assert.ok(h.wrapper);
  assert.equal(h.w.document.querySelector('.mari-message-content').style.display, '');
  assert.equal(h.w.document.querySelector('[data-roleplay-inline-roll]').textContent, '17');
});

test('2.5.2 cached sticky regex starts at zero for each message and rejects invalid flags', () => {
  const rows = [regex.parseScript(rule({ findRegex: 'X', flags: 'y', replaceString: 'Y' }))];
  for (let i = 0; i < 3; i++) assert.equal(regex.applyScripts('XX', rows, 'ai_output'), 'YX');
  assert.equal(regex.compileRegexScriptPattern('X', 'bad'), null);
  assert.equal(regex.compileRegexScriptPattern('(a+)+', 'g'), null);
});

test('2.5.2 safety rejects overlapping quantified alternatives with distinct spellings', () => {
  for (const pattern of ['(a|[a-z])+', '(a|\\x61)+', '(a|\\u0061)+', '(ab?|a)+', '(a|A)+'])
    assert.equal(safety.isPatternSafe(pattern), false, pattern);
  for (const pattern of ['(cat|dog)+', '<status>([^<]*)</status>'])
    assert.equal(safety.isPatternSafe(pattern), true, pattern);
});

test('2.5.2 dice macros support omitted count and modifiers with stable seeded output', () => {
  const context = { primaryCharacter: { name: 'Sola' } };
  const a = macros.createMessageMacroResolver(context, { randomSeed: 'm:0' });
  const b = macros.createMessageMacroResolver(context, { randomSeed: 'm:0' });
  assert.equal(a('{{roll:d1}}/{{roll:2d1+3}}/{{roll:d1-2}}'), '1/5/-1');
  const template = '{{roll:d20}}/{{roll:2d6+3}}';
  assert.equal(a(template), b(template)); assert.match(a(template), /^\d+\/\d+$/);
  assert.equal(a('{{roll:1d6+9007199254740991}}'), '{{roll:1d6+9007199254740991}}');
});

test('2.5.2 API macro context keeps all characters, excludes inactive group members and isolates chat variable writes', async t => {
  const metadata = { inactiveCharacterIds: ['b'], macroVariables: { place: 'forest', mood: 'chat', invalid: 7 } };
  const h = await host(t, { fixture: {
    chat: { id: 'c', mode: 'roleplay', characterIds: ['a', 'b'], promptPresetId: 'p', metadata },
    rules: [rule({ replaceString: '<p>{{characters}} / {{group}} / {{place}} / {{mood}} / {{setvar::place::beach}}{{getvar::place}}</p>' })],
    routes: {
      '/api/characters/b': { id: 'b', data: { name: 'Luna' } },
      '/api/prompts/p/full': { preset: { defaultChoices: { mood: 'preset' } }, choiceBlocks: [{ variableName: 'mood', options: '[{"value":"preset"}]' }] },
    },
  } });
  // {{group}} excludes the current speaker too, so only inactive Luna could remain.
  assert.equal(h.body.textContent, 'Sola, Luna /  / forest / preset / beach');
  assert.deepEqual(metadata.macroVariables, { place: 'forest', mood: 'chat', invalid: 7 });
  metadata.inactiveCharacterIds = [];
  await h.refresh(); assert.equal(h.body.textContent, 'Sola, Luna / Luna / forest / preset / beach');
  assert.ok(h.requests.every(r => r.init.method === 'GET'));
});
