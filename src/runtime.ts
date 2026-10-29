import { applyScripts, parseScript, resolveScopedRegexMode } from './regex';
import { createMessageMacroResolver } from './macros';
import { formatTextQuotes } from '../vendor/upstream/quote-format';
import { createSanitizer } from './sanitize';
import { createData, activeChatId, record, quoteFormat } from './data';
import { createActions } from './actions';
export const KEY = 'translation_regex_me';
const BASE_CSS = `:host{display:block;min-width:0;max-width:100%;contain:layout style paint;isolation:isolate}
.translation-content{position:relative;max-width:100%;overflow:auto;overflow-wrap:anywhere;white-space:pre-wrap}
.translation-content *{box-sizing:border-box;max-width:100%}table{display:block;overflow:auto}img{height:auto}pre{overflow:auto}`;
export function start(api: any, window: any) {
  const document = window.document;
  window[KEY]?.dispose?.();
  const data = createData(api, window), sanitize = createSanitizer(window);
  let disposed = false, epoch = 0, timer: any, interval: any, running = false, rerun = false;
  let currentId = activeChatId(window), store: any, queryCache: any;
  let offStore: any, offQuery: any, lastStore = '';
  const mounted = new Map<any, any>();
  const life = new window.AbortController();
  const choices = new Map<string, boolean>(), intents = new Map<string, boolean>(), requested = new Set<string>();
  const settings = { enabled: false, conversation: false };
  try { const saved = JSON.parse(window.localStorage.getItem(`${KEY}.settings`) || '{}');
    settings.enabled = saved.autoApply === true; settings.conversation = saved.conversation === true;
  } catch {}
  const el = (tag: string, text?: string) => { const n = document.createElement(tag); if (text) n.textContent = text; return n; };
  const ui = el('div'); ui.id = KEY;
  const shadow = ui.attachShadow({ mode: 'open' }), style = el('style');
  // Pattern reused from gacha-minigames-fork/anywhere/src/mount.js: shadow settings + cleanup.
  style.textContent = `:host{position:fixed;right:12px;bottom:12px;z-index:1000;font:14px/1.5 system-ui;color:#eee;max-width:calc(100vw - 24px)}
*{box-sizing:border-box}button{font:inherit;color:inherit;background:#303444;border:1px solid #6c7185;border-radius:8px;padding:8px 12px;cursor:pointer}
section{background:#222633;border:1px solid #6c7185;border-radius:12px;padding:12px;width:300px;max-width:calc(100vw - 24px);max-height:70vh;overflow:auto;margin-bottom:8px;overflow-wrap:anywhere}
[hidden]{display:none!important}label{display:flex;align-items:flex-start;gap:8px;margin:12px 0}input{flex:none;width:18px;height:18px}p{font-size:12px;margin:8px 0}h2{font-size:15px;margin:0 0 10px}`;
  const panel = el('section'); panel.hidden = true; panel.id = 'settings'; panel.setAttribute('aria-label', '번역문 정규식 설정');
  const toggle = el('button', '번역 정규식'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'settings');
  const close = el('button', '닫기'); close.type = 'button';
  const status = el('p', '수동 실행 · 메시지의 점선 큐브 버튼을 누르세요'); status.setAttribute('role', 'status');
  panel.append(el('h2', '번역문 표시 정규식'));
  const inputs: any = {};
  for (const [key, title] of [['enabled', '번역문에 자동 적용 (기본 꺼짐)'], ['conversation', '대화 모드에도 적용 (원문 번역만)']]) {
    const label = el('label'), input = el('input'); input.type = 'checkbox'; input.checked = settings[key]; input.id = key; inputs[key] = input;
    input.addEventListener('change', () => {
      settings[key] = input.checked;
      try { window.localStorage.setItem(`${KEY}.settings`, JSON.stringify({ autoApply: settings.enabled, conversation: settings.conversation })); } catch {}
      choices.clear(); intents.clear(); requested.clear(); invalidate(true);
    }, { signal: life.signal }); label.append(input, el('span', title)); panel.append(label);
  }
  panel.append(el('p', '대화 모드에서 이미 가공한 HTML을 번역한 경우에는 중복 적용을 피하기 위해 원래 번역문을 표시합니다.'));
  const refresh = el('button', '규칙 새로고침'); refresh.type = 'button';
  refresh.addEventListener('click', () => invalidate(true), { signal: life.signal });
  panel.append(refresh, status, close); shadow.append(style, panel, toggle); document.body.append(ui);
  function closePanel() { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; toggle.setAttribute('aria-expanded', String(!panel.hidden)); if (!panel.hidden) inputs.enabled.focus(); }, { signal: life.signal });
  close.addEventListener('click', closePanel, { signal: life.signal });
  panel.addEventListener('keydown', (e: any) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePanel(); } }, { signal: life.signal });

  const actions = createActions(window, (messageId: string) => {
    const wanted = actions.kind(messageId) === 'error' || !requested.has(messageId);
    intents.set(messageId, wanted);
    if (wanted) requested.add(messageId); else requested.delete(messageId);
    invalidate(true);
    actions.state(messageId, wanted ? 'busy' : 'idle', wanted ? '적용 중' : '원래 번역문 표시');
  });
  function observe() { if (!disposed) observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'data-message-id'] }); }
  function quiet(fn: () => void) { observer.disconnect(); try { fn(); } finally { observe(); } }
  function release(node: any) {
    const state = mounted.get(node); if (!state) return;
    state.wrapper.remove();
    // Only undo our own display override, preserving React's newer style if it changed in the meantime.
    if (node.style.getPropertyValue('display') === 'none' && node.style.getPropertyPriority('display') === 'important') {
      if (state.display) node.style.setProperty('display', state.display, state.priority); else node.style.removeProperty('display');
      if (!state.hadStyle && !node.getAttribute('style')) node.removeAttribute('style');
    }
    mounted.delete(node);
  }
  function restoreAll() { quiet(() => { for (const node of mounted.keys()) release(node); }); }
  function schedule() {
    if (disposed) return;
    window.clearTimeout(timer); timer = window.setTimeout(() => { timer = null; void run(); }, 60);
  }
  function invalidate(all = false) {
    if (disposed) return;
    epoch++; data.invalidate(all); restoreAll(); schedule();
  }
  function relevant(m: any) {
    const target = m.target.nodeType === 1 ? m.target : m.target.parentElement;
    if (target?.closest?.(`[data-${KEY}],[data-translation-regex-action],#${KEY}`)) return false;
    if (target?.closest?.('[data-message-id],.translation-text')) return true;
    return [...(m.addedNodes || []), ...(m.removedNodes || [])].some((n: any) => n.nodeType === 1 &&
      (n.matches?.('.translation-text,[data-message-id]') || n.querySelector?.('.translation-text,[data-message-id]')));
  }
  const observer = new window.MutationObserver((records: any[]) => {
    if (records.some(relevant) || [...mounted].some(([n, s]) => !n.isConnected || !s.wrapper.isConnected)) invalidate();
  });
  function connect() {
    const host = window.__MARINARA_HOST__;
    if (host?.stores?.chat !== store) {
      offStore?.(); store = host?.stores?.chat;
      const consume = (s: any) => {
        const signature = JSON.stringify([s.activeChatId, s.activeChat, s.isStreaming, s.streamingChatId]);
        if (lastStore && lastStore !== signature) invalidate(true); lastStore = signature;
      };
      if (store?.subscribe) { offStore = store.subscribe(consume); consume(store.getState()); }
    }
    const next = host?.queryClient?.getQueryCache?.();
    if (next !== queryCache) {
      offQuery?.(); queryCache = next;
      offQuery = next?.subscribe((event: any) => {
        const key = event.query?.queryKey;
        if (event.type === 'updated' && ['success', 'invalidate'].includes(event.action?.type) &&
          ['chats', 'regex-scripts', 'presets', 'characters', 'personas', 'connections'].includes(key?.[0])) invalidate(true);
      });
    }
  }
  const fingerprint = (node: any) => `${node.closest('[data-message-id]')?.getAttribute('data-message-id')}\0${node.className}\0${node.innerHTML}`;
  function current(version: number, id: string) { return !disposed && epoch === version && activeChatId(window) === id; }
  async function run() {
    if (disposed) return;
    if (running) { rerun = true; return; }
    running = true;
    let version = epoch;
    try {
      connect();
      const id = activeChatId(window);
      if (id !== currentId) { currentId = id; choices.clear(); intents.clear(); requested.clear(); epoch++; data.invalidate(true); restoreAll(); }
      quiet(() => {
        for (const [node, state] of mounted) if (!node.isConnected || !state.wrapper.isConnected) release(node);
        actions.sync();
      });
      if (!id) { restoreAll(); status.textContent = '활성 채팅 없음'; return; }
      const roots = [...document.querySelectorAll('[data-message-id]')] as any[];
      if (!roots.length) { restoreAll(); status.textContent = '표시된 메시지 없음'; return; }
      if (!settings.enabled && !requested.size && !intents.size && ![...choices.values()].some(Boolean)) {
        restoreAll();
        for (const mid of actions.ids()) actions.state(mid, 'idle');
        status.textContent = '수동 실행 · 메시지의 점선 큐브 버튼을 누르세요'; return;
      }
      version = epoch;
      const candidates = roots.flatMap(root => [...root.querySelectorAll('.translation-text,.mari-message-content')])
        .filter((node: any) => !node.hasAttribute(`data-${KEY}`));
      const stamps = new Map(candidates.map((node: any) => [node, fingerprint(node)]));
      for (const mid of requested) actions.state(mid, 'busy', '적용 중');
      const state = store?.getState?.();
      if (state?.isStreaming && (!state.streamingChatId || state.streamingChatId === id)) { restoreAll(); for (const mid of actions.ids()) actions.state(mid, 'busy', '생성 중 · 완료 후 확인'); status.textContent = '생성 중 · 원래 번역문 표시'; return; }
      // Without the optional host store, use the same-origin status endpoint used by the precedent extension.
      if (!store) {
        const generation = await data.get(`/api/generate/status/${encodeURIComponent(id)}`, 1000);
        if (typeof generation?.active !== 'boolean') throw Error('Invalid generation status');
        if (!current(version, id)) return;
        if (generation.active || generation.translating) { restoreAll(); for (const mid of actions.ids()) actions.state(mid, 'busy', '생성/번역 중 · 완료 후 확인'); status.textContent = '생성/번역 중 · 원래 번역문 표시'; return; }
      }
      const snapshot = await data.snapshot(id);
      if (!current(version, id)) return;
      const { chat, messages, rules, presets } = snapshot;
      if (chat.mode !== 'roleplay' && !(chat.mode === 'conversation' && settings.conversation)) {
        restoreAll(); for (const mid of actions.ids()) actions.state(mid, 'idle', '이 채팅 모드는 설정에서 허용해야 합니다'); status.textContent = '이 채팅 모드에서는 원래 번역문 표시'; return;
      }
      const scripts = rules.map(parseScript);
      const scopedMode = resolveScopedRegexMode(record(chat.metadata).scopedRegexMode, presets.find((p: any) => p.id === chat.promptPresetId)?.scopedRegexMode);
      let count = 0;
      const validNodes = new Set<any>();
      const details = new Set<string>();
      for (const root of roots) {
        if (!current(version, id)) return;
        const messageId = root.getAttribute('data-message-id');
        const index = messages.findIndex((m: any) => m.id === messageId), message = messages[index];
        const skip = (detail: string) => { details.add(detail); actions.state(messageId, 'idle', detail); };
        if (!message || message.role !== 'assistant') { skip('현재 AI 메시지를 API에서 확인할 수 없음'); continue; }
        const key = `${id}:${message.id}:${message.activeSwipeIndex ?? 0}`;
        if (intents.has(messageId)) { choices.set(key, intents.get(messageId)!); intents.delete(messageId); }
        const wanted = choices.get(key) ?? settings.enabled;
        if (wanted) requested.add(messageId); else requested.delete(messageId);
        if (!wanted) { actions.state(messageId, 'idle'); continue; }
        const swipe = snapshot.bySwipe.get(key);
        const extra = record(swipe.extra), raw = extra.translation;
        if (typeof raw !== 'string' || !raw) { skip('API에 저장된 번역문 없음 · 다음 확인 때 재시도'); continue; }
        if (extra.translationHidden === true) { skip('숨긴 번역문 · 원래 표시 유지'); continue; }
        if (chat.mode === 'roleplay' && typeof extra.translationSource === 'string' && extra.translationSource !== message.content) {
          skip('현재 스와이프와 번역 원문 불일치'); continue;
        }
        // ConversationMessage.tsx:396-405,765 translates renderedContent (already processed).
        if (chat.mode === 'conversation' && extra.translationSource !== message.content) { skip('가공된 HTML 또는 출처 미확인 번역 · 중복 적용 방지'); continue; }
        const separate = [...root.querySelectorAll('.translation-text')].filter((n: any) => n.closest('[data-message-id]') === root);
        // ChatMessage.tsx:3329-3345,3516-3546: translationDisplayOnly replaces prose
        // inside mari-message-content and OMITs translation-text. API must be read BEFORE DOM selection.
        // ConversationMessage.tsx:455-461 also replaces prose; the raw-source guard above still applies.
        const inline = record(chat.metadata).translationDisplayOnly === true && extra.translationSource === message.content;
        const nodes = separate.length ? separate : inline ? [...root.querySelectorAll('.mari-message-content')]
          .filter((n: any) => !n.hasAttribute(`data-${KEY}`) && n.closest('[data-message-id]') === root) : [];
        // A whole API translation must never replace multiple paragraphs/segments or an editor.
        if (nodes.length !== 1 || root.querySelector('textarea,[contenteditable=true]')) { skip('지원하는 번역 표시 영역 없음'); continue; }
        const node: any = nodes[0];
        // ChatMessage.tsx:3338,3541-3546: while retranslation runs the body is ORIGINAL,
        // and the separate border container holds a progress span, even if API still has old translation.
        if (!separate.length && [...node.parentElement.children].some((n: any) =>
          n !== node && !n.hasAttribute(`data-${KEY}`) && n.classList.contains('border-t') &&
          n.querySelector('span') && !n.querySelector('.translation-text'))) {
          skip('번역 진행 중 · 원래 표시 유지'); continue;
        }
        // ChatMessage.tsx:3341-3345 can append interactive command results; never hide those.
        if (!separate.length && node.querySelector('button,input,select,video,audio')) {
          skip('상호작용 본문 · 원래 표시 유지'); continue;
        }
        if (!stamps.has(node)) { skip('화면 변경 중 · 다음 확인 때 재시도'); continue; }
        validNodes.add(node);
        const resolve = /\{\{/.test(raw + rules.map((r: any) => `${r.findRegex}${r.replaceString}${r.trimStrings}`).join(''))
          ? await data.resolver(chat, message)
          : createMessageMacroResolver({ userName: 'You', primaryCharacter: { name: 'Assistant' } }, { randomSeed: `${message.id}:${message.activeSwipeIndex ?? 0}` });
        if (!current(version, id)) return;
        // use-apply-regex.ts:192-199 and ChatMessage.tsx:2739-2750: replacement/trim/pattern, then one final display macro pass.
        // ChatRoleplaySurface.tsx:1942-1943 / ConversationView.tsx:1387: depth counts messages, newest is zero.
        const output = resolve(formatTextQuotes(applyScripts(raw, scripts, 'ai_output', {
          depth: messages.length - 1 - index, resolveMacros: resolve, scopedMode,
          characterId: message.characterId, promptPresetId: chat.promptPresetId,
        }), quoteFormat(window)));
        if (!current(version, id) || !node.isConnected || fingerprint(node) !== stamps.get(node)) continue;
        if (output === raw) { quiet(() => release(node)); skip('적용할 규칙 없음 · 원래 번역문 표시'); continue; }
        const signature = JSON.stringify([id, message.id, message.activeSwipeIndex ?? 0, raw, output, stamps.get(node)]);
        if (mounted.get(node)?.signature === signature && node.nextSibling === mounted.get(node).wrapper) { count++; actions.state(messageId, 'applied', '적용됨 · 다시 누르면 원래 번역문'); continue; }
        const clean = sanitize(output);
        if (!clean.fragment.textContent?.trim() && !clean.fragment.querySelector('img,hr')) { quiet(() => release(node)); skip('변환 결과가 비어 원래 번역문 표시'); continue; }
        const wrapper = el('div'); wrapper.setAttribute(`data-${KEY}`, ''); wrapper.className = node.className.replace(/\btranslation-text\b/g, '').trim();
        const renderedRoot = wrapper.attachShadow({ mode: 'open' }), css = el('style'), body = el('div'); body.className = 'translation-content';
        css.textContent = BASE_CSS + '\n' + clean.css; body.append(clean.fragment); renderedRoot.append(css, body);
        quiet(() => {
          release(node);
          const old = { display: node.style.getPropertyValue('display'), priority: node.style.getPropertyPriority('display'), hadStyle: node.hasAttribute('style') };
          // Commit only after all fallible work succeeds. React-owned children remain untouched.
          node.after(wrapper); mounted.set(node, { ...old, wrapper, signature }); node.style.setProperty('display', 'none', 'important');
        });
        count++; actions.state(messageId, 'applied', '적용됨 · 다시 누르면 원래 번역문');
      }
      quiet(() => { for (const node of mounted.keys()) if (!validNodes.has(node)) release(node); });
      status.textContent = count ? `${count}개 번역문에 표시 정규식 적용` : [...details].join(' / ') || '수동 실행 · 메시지의 점선 큐브 버튼을 누르세요';
    } catch {
      if (!disposed && version === epoch) { restoreAll(); for (const mid of actions.ids()) actions.state(mid, 'error', '적용 실패 · 원래 번역문 표시 · 다시 누르거나 다음 확인 때 재시도'); status.textContent = '적용 실패 · 원래 번역문 표시 (자동 재시도)'; }
    } finally {
      running = false;
      if (rerun && !disposed) { rerun = false; schedule(); }
    }
  }
  function dispose() {
    if (disposed) return;
    disposed = true; epoch++; observer.disconnect();
    window.clearTimeout(timer); window.clearInterval(interval); life.abort(); offStore?.(); offQuery?.(); data.dispose();
    for (const node of mounted.keys()) release(node);
    actions.dispose(); choices.clear(); intents.clear(); requested.clear(); ui.remove(); if (window[KEY]?.dispose === dispose) delete window[KEY];
  }
  const instance = { dispose, refresh: () => invalidate(true) };
  window[KEY] = instance; api.onCleanup(dispose); observe();
  // Poll also sees same-text swipe changes / server updates that produce no DOM mutations.
  interval = window.setInterval(() => { void run(); }, 2000); void run();
  return instance;
}
