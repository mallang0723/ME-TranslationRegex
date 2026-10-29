import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
export const rule = (patch = {}) => ({ id: 'r', name: 'DEM sample', enabled: 'true', placement: '["ai_output"]', applyMode: 'display',
  promptOnly: 'false', targetCharacterIds: '[]', targetPromptPresetIds: '[]', trimStrings: '[]', flags: 'g', order: 0,
  findRegex: '<status>([^<]*)</status>', replaceString: '<style>.dem{color:rgb(1,2,3);border:1px solid}</style><section class="dem"><strong>$1</strong></section>',
  minDepth: null, maxDepth: null, ...patch });
export const message = (patch = {}) => ({ id: 'm', chatId: 'c', role: 'assistant', characterId: 'a', activeSwipeIndex: 0, content: 'original',
  extra: JSON.stringify({ translation: '<status>체력 90</status>', translationSource: 'original' }), ...patch });
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function harness(options = {}) {
  const dom = new JSDOM('<!doctype html><body><main data-message-id="m"><div class="translation-text whitespace-pre-wrap"><p>체력 90</p></div></main></body>',
    { url: 'http://fixture.invalid/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window; w.localStorage.setItem('marinara-active-chat-id', 'c');
  // Insecure-context fixture: randomUUID is intentionally unavailable.
  Object.defineProperty(w.crypto, 'randomUUID', { value: undefined });
  const callbacks = new Set(), cleanups = [], requests = [], errors = [], timers = new Set(), intervals = new Set();
  const nativeTimeout = w.setTimeout.bind(w), nativeClear = w.clearTimeout.bind(w);
  w.setTimeout = (fn, ms) => { const id = nativeTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  w.clearTimeout = id => { timers.delete(id); nativeClear(id); };
  const nativeInterval = w.setInterval.bind(w), nativeClearInterval = w.clearInterval.bind(w);
  w.setInterval = (fn, ms) => { const id = nativeInterval(fn, ms); intervals.add(id); return id; };
  w.clearInterval = id => { intervals.delete(id); nativeClearInterval(id); };
  const fixture = { chat: { id: 'c', mode: 'roleplay', metadata: '{}', characterIds: '[]', promptPresetId: null }, messages: [message()], rules: [rule()], presets: [],
    status: { active: false, translating: false }, fail: false, hold: null, ...options.fixture };
  let state = { activeChatId: 'c', activeChat: fixture.chat, isStreaming: false, streamingChatId: null };
  if (options.store !== false) w.__MARINARA_HOST__ = { stores: { chat: { getState: () => state, subscribe(fn) { callbacks.add(fn); return () => callbacks.delete(fn); } } } };
  const fetch = async (path, init) => {
    requests.push({ path, init });
    if (!path.startsWith('/api/') || init.method !== 'GET') throw Error('Forbidden request');
    const respond = () => {
      if (fixture.fail || init.signal?.aborted) throw Error('Fake failure');
      const routes = { '/api/chats/c': fixture.chat, '/api/chats/c/messages': fixture.messages, '/api/regex-scripts': fixture.rules,
        '/api/prompts': fixture.presets, '/api/generate/status/c': fixture.status,
        '/api/characters/a': { id: 'a', data: JSON.stringify({ name: 'Sola', description: '태양' }) },
        '/api/characters/personas/u': { id: 'u', name: '독자' }, ...(fixture.routes || {}) };
      if (!(path in routes)) throw Error(`Unexpected route ${path}`);
      return { ok: true, json: async () => structuredClone(routes[path]) };
    };
    if (fixture.hold) await fixture.hold(path);
    return respond();
  };
  w.marinara = { fetch, onCleanup(fn) { cleanups.push(fn); }, log: { error: msg => errors.push(msg) } };
  // Existing processing tests opt in explicitly; settings:null exercises a fresh install.
  const settings = options.settings === undefined ? { autoApply: true } : options.settings;
  if (settings) w.localStorage.setItem('translation_regex_me.settings', JSON.stringify(settings));
  if (options.html) w.document.body.innerHTML = options.html;
  w.eval(readFileSync('dist/extension.js', 'utf8'));
  async function settle() { await delay(110); }
  if (options.wait !== false) await settle();
  return { w, fixture, requests, errors, callbacks, timers, intervals, settle,
    get original() { return w.document.querySelector('.translation-text'); },
    get wrapper() { return w.document.querySelector('[data-translation_regex_me]'); },
    get body() { return this.wrapper?.shadowRoot.querySelector('.translation-content'); },
    get ui() { return w.document.getElementById('translation_regex_me')?.shadowRoot; },
    setState(patch) { state = { ...state, ...patch }; for (const cb of callbacks) cb(state); },
    async refresh() { w.translation_regex_me.refresh(); await settle(); },
    stop() { for (const fn of cleanups) fn(); },
    cleanup() { for (const fn of cleanups) fn(); dom.window.close(); },
  };
}
