import { getChatCharacterIds, parseCharacterMacroData, createMessageMacroResolver } from './macros';
import { parseChoiceOptions, resolveChoiceVariableValue } from '../vendor/upstream/preset-choices';
import { seededUnitRandom } from '../vendor/upstream/macro-engine';
export const record = (value: any): Record<string, any> => {
  try { const r = typeof value === 'string' ? JSON.parse(value) : value; return r && typeof r === 'object' && !Array.isArray(r) ? r : {}; }
  catch { return {}; }
};
export function activeChatId(window: any) {
  // packages/client/src/stores/chat.store.ts:22,373-380; namespace is optional (marinara-host.ts:5-7).
  const state = window.__MARINARA_HOST__?.stores?.chat?.getState?.();
  if (state && 'activeChatId' in state) return state.activeChatId || null;
  try { return window.localStorage.getItem('marinara-active-chat-id') || null; } catch { return null; }
}
export function quoteFormat(window: any) {
  const live = window.__MARINARA_HOST__?.stores?.ui?.getState?.().quoteFormat;
  if (live) return live;
  // ui-persistence.ts:1,9,12-27; ui.store.ts:2242 defaults to straight.
  try {
    const stored = record(window.localStorage.getItem('marinara-engine-ui'));
    const backup = record(window.localStorage.getItem('marinara-engine-ui:host'));
    const chosen = stored.state && typeof stored.version === 'number' && stored.version < 103 && backup.version === 103 ? backup : stored;
    return chosen.state?.quoteFormat === 'typographic' ? 'typographic' : 'straight';
  } catch { return 'straight'; }
}
export function createData(api: any, window: any) {
  const cache = new Map<string, { time: number, promise: Promise<any> }>();
  const controllers = new Map<AbortController, number>();
  let disposed = false;
  async function get(path: string, ttl = 15000) {
    if (disposed || !path.startsWith('/api/') || path.includes('://')) throw Error('API unavailable');
    const old = cache.get(path);
    if (old && Date.now() - old.time < ttl) return old.promise;
    const controller = new window.AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    controllers.set(controller, timer);
    const entry = { time: Date.now(), promise: Promise.resolve(null) };
    entry.promise = (async () => {
      try {
        // Display data reads use authenticated same-origin GET via the injector API.
        const response = await api.fetch(path, { method: 'GET', cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw Error('API read failed');
        const result = await response.json();
        if (disposed || controller.signal.aborted) throw Error('Disposed');
        return result;
      } catch (error) { if (cache.get(path) === entry) cache.delete(path); throw error; }
      finally { window.clearTimeout(timer); controllers.delete(controller); }
    })();
    cache.set(path, entry);
    return entry.promise;
  }
  function invalidate(all = false) {
    for (const path of cache.keys()) if (all || /\/messages$/.test(path)) cache.delete(path);
    for (const [c, timer] of controllers) { window.clearTimeout(timer); c.abort(); }
    controllers.clear();
  }
  async function snapshot(id: string) {
    // Below the 2s poll interval: request latency must not keep the first completion poll on stale data.
    const [chat, messages, rules, presets] = await Promise.all([
      get(`/api/chats/${encodeURIComponent(id)}`), get(`/api/chats/${encodeURIComponent(id)}/messages`, 1500),
      get('/api/regex-scripts'), get('/api/prompts'),
    ]);
    if (chat?.id !== id || !Array.isArray(messages) || !Array.isArray(rules) || !Array.isArray(presets)) throw Error('Invalid API shape');
    // chats.storage.ts:2230-2242 returns chronological rows; 3533-3542 copies active swipe extra to message.extra.
    const bySwipe = new Map(messages.map((m: any) => [`${id}:${m.id}:${m.activeSwipeIndex ?? 0}`, m]));
    return { chat, messages, rules, presets, bySwipe };
  }
  async function resolver(chat: any, message: any) {
    const seed = `${message.id}:${message.activeSwipeIndex ?? 0}`;
    // ChatMessage.tsx:2650-2740: chat roster plus the current speaker, speaker fallback, selected persona.
    const ids = getChatCharacterIds(chat);
    if (message.characterId && !ids.includes(message.characterId)) ids.push(message.characterId);
    const characters = (await Promise.all(ids.map(id => get(`/api/characters/${encodeURIComponent(id)}`)))).map(parseCharacterMacroData).filter(Boolean)
      .map(({ systemPrompt: _system, postHistoryInstructions: _history, ...display }) => display);
    // ChatArea.tsx:389-419 passes display fields only; prompt-only card fields must not enter display macros.
    const primaryCharacter = characters.find(c => c.id === message.characterId) ?? characters[0] ?? { name: 'Assistant' };
    let persona;
    if (chat.personaCharacterId) persona = parseCharacterMacroData(await get(`/api/characters/${encodeURIComponent(chat.personaCharacterId)}`));
    else if (chat.personaId) persona = await get(`/api/characters/personas/${encodeURIComponent(chat.personaId)}`);
    // use-message-preset-variables.ts:12-45: connection preset supplies variables only, NOT regex target scope.
    const connection = chat.mode === 'roleplay' && chat.connectionId ? await get(`/api/connections/${encodeURIComponent(chat.connectionId)}`) : null;
    const presetId = connection?.promptPresetId || chat.promptPresetId || null;
    const full = presetId ? await get(`/api/prompts/${encodeURIComponent(presetId)}/full`) : null;
    const defaults = record(full?.preset?.defaultChoices);
    const choices = presetId !== chat.promptPresetId ? defaults : { ...defaults, ...record(chat.metadata).presetChoices };
    const variables = Object.fromEntries((full?.choiceBlocks ?? []).map((block: any) => [block.variableName,
      resolveChoiceVariableValue({ selected: choices[block.variableName], options: parseChoiceOptions(block.options),
        multiSelect: block.multiSelect, randomPick: block.randomPick, separator: block.separator,
        random: () => seededUnitRandom(`${seed}:${block.variableName}`) })]));
    // No server prompt context, lorebook expansion, persisted variable writes, or extra macro passes.
    // 2.5.2 display context: string chat variables, preset precedence and active group roster.
    const metadata = record(chat.metadata), storedVariables = metadata.macroVariables;
    const chatVariables = storedVariables && typeof storedVariables === 'object' && !Array.isArray(storedVariables)
      ? Object.fromEntries(Object.entries(storedVariables).filter(([, value]) => typeof value === 'string')) : {};
    const context = { variables, chatVariables,
      inactiveCharacterIds: chat.mode === 'roleplay' ? metadata.inactiveCharacterIds : undefined,
      userName: persona?.name ?? (chat.mode === 'conversation' ? 'User' : 'You'), persona,
      primaryCharacter, characters: characters.length ? characters : [primaryCharacter] };
    // ConversationMessage.tsx:396-399 constructs a resolver per call; RP shares one per display computation.
    return chat.mode === 'conversation'
      ? (value: string) => createMessageMacroResolver(context, { randomSeed: seed })(value)
      : createMessageMacroResolver(context, { randomSeed: seed });
  }
  return { get, snapshot, resolver, invalidate, dispose() { disposed = true; invalidate(true); cache.clear(); }, cache };
}
