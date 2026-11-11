import { record, activeChatId } from './data';
import { hostMessages, singleWindow } from './message-window';

// Conservatively protect all markup blocks, a superset of display-regex tag blocks.
// Tokenize quoted attributes without treating their '>' as the end of a tag.
const markup = () => /<!--[\s\S]*?-->|<\/?[A-Za-z][\w:.-]*(?:\s+(?:[^<>"']|"[^"]*"|'[^']*')*)?\s*\/?>/g;
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
export function tagRanges(text: string) {
  const ranges: Array<[number, number]> = [], stack: string[] = [];
  let start = 0;
  for (const match of text.matchAll(markup())) {
    const token = match[0], name = /^<\/?([\w:.-]+)/.exec(token)?.[1].toLowerCase();
    const begin = match.index!, end = begin + token.length;
    if (!name || voidTags.has(name) || /\/>$/.test(token)) { if (!stack.length) ranges.push([begin, end]); continue; }
    if (!stack.length) start = begin;
    if (token.startsWith('</')) {
      if (stack.at(-1) === name) stack.pop();
      else if (stack.length) continue; // Malformed nesting: preserve the entire remaining block.
      if (!stack.length) ranges.push([start, end]);
    } else stack.push(name);
  }
  if (stack.length) ranges.push([start, text.length]);
  return ranges;
}
export function splitTranslation(text: string, limit = 3200, protectedLimit = Infinity): string[] {
  if (!Number.isInteger(limit) || limit < 32) throw Error('Invalid chunk limit');
  if (protectedLimit !== Infinity && (!Number.isInteger(protectedLimit) || protectedLimit < 32)) throw Error('Invalid protected limit');
  const ranges = tagRanges(text), chunks: string[] = [];
  const safe = (n: number) => !ranges.some(([a, b]) => a < n && n < b);
  const fits = (part: string) => part.length <= limit && (protectedLimit === Infinity || protectTags(part).text.length <= protectedLimit);
  // The polisher packs whole paragraphs first. Only oversized units descend to
  // lines, sentences, words and finally Unicode-safe size slices.
  const boundaries = [/(?:\r?\n)[ \t]*(?:\r?\n)+/g, /\r?\n/g,
    /[.!?。！？]["'”’»)]*(?:\s+|(?=[^\s]))/g, /[ \t]+/g];
  const units: string[] = [];
  function divide(start: number, end: number, level: number) {
    if (fits(text.slice(start, end))) { units.push(text.slice(start, end)); return; }
    if (level < boundaries.length) {
      let previous = start;
      for (const match of text.slice(start, end).matchAll(boundaries[level])) {
        const at = start + match.index! + match[0].length;
        if (!safe(at)) continue;
        divide(previous, at, level + 1); previous = at;
      }
      if (previous < end) divide(previous, end, level + 1);
      return;
    }
    while (start < end) {
      const cut = (target: number) => {
        let at = target;
        const block = ranges.find(([a, b]) => a < at && at < b);
        if (block) at = block[0] > start ? block[0] : block[1];
        if (at < end && /[\uD800-\uDBFF]/.test(text[at - 1]) && /[\uDC00-\uDFFF]/.test(text[at])) at--;
        return at;
      };
      let at = cut(Math.min(start + limit, end));
      while (!fits(text.slice(start, at))) {
        const smaller = cut(start + Math.floor((at - start) / 2));
        if (smaller <= start || smaller >= at) break; // An atomic tag block cannot be split.
        at = smaller;
      }
      units.push(text.slice(start, at)); start = at;
    }
  }
  divide(0, text.length, 0);
  let current = '';
  for (const part of units) {
    if (current && !fits(current + part)) { chunks.push(current); current = ''; }
    current += part;
  }
  if (current) chunks.push(current);
  return chunks;
}
export function protectTags(source: string) {
  let prefix = 'TRX_TAG_'; while (source.toUpperCase().includes(prefix)) prefix += 'X';
  const tags: string[] = [];
  const token = (i: number) => `[[${prefix}${i}]]`;
  const text = source.replace(new RegExp(`${markup().source}|(?:\\r?\\n)[ \\t\\r\\n]*`, 'g'), tag => { tags.push(tag); return token(tags.length - 1); });
  return { text, restore(output: string) {
    // Require every placeholder exactly once, in order, and no newly invented markup.
    // On failure retain the original chunk, including every original tag block.
    const markers = new RegExp(`\\[\\s*\\[\\s*${prefix}\\s*(\\d+)\\s*\\]\\s*\\]`, 'gi');
    const matches = [...output.matchAll(markers)];
    if (matches.length !== tags.length || matches.some((match, i) => match[1] !== String(i))) return { text: source, fallback: true };
    if (tags.length && [...output.matchAll(markup())].length) return { text: source, fallback: true };
    const restored = output.replace(markers, (_, n) => tags[Number(n)]);
    if (new RegExp(`\\[\\s*\\[\\s*${prefix}`, 'i').test(restored)) return { text: source, fallback: true };
    return { text: restored, fallback: false };
  } };
}
const prose = (s: string) => s.replace(markup(), '').trim();
const terminal = (s: string) => /[.!?。！？…]["'”’»)*\]]*$/.test(s.trim());
export function truncation(source: string, translation: string) {
  const a = prose(source), b = prose(translation);
  // Short labels/status values and languages without punctuation are noisy: advisory only.
  const lowRatio = a.length >= 600 && b.length > 0 && b.length / a.length < 0.45;
  const midSentence = a.length >= 300 && b.length >= 40 && terminal(a) && !terminal(b);
  return { suspected: lowRatio || midSentence, lowRatio, midSentence };
}
export function continuationOffset(source: string, translation: string): number | null {
  const tail = translation.trimEnd();
  if (!tail) return null;
  // Exact prefix is safe even if a same-language translation stops inside a sentence.
  if (source.startsWith(tail) && tail.length < source.length && !tagRanges(source).some(([a,b]) => a < tail.length && tail.length < b)) return tail.length;
  // A unique preserved tag block at the tail provides a source-language-independent anchor.
  const ranges = tagRanges(tail), last = ranges.at(-1);
  if (last && last[1] === tail.length) {
    const anchor = tail.slice(last[0], last[1]), at = source.indexOf(anchor);
    if (anchor.length >= 16 && at >= 0 && source.indexOf(anchor, at + 1) === -1 && at + anchor.length < source.length &&
      !tagRanges(source).some(([a,b]) => a < at + anchor.length && at + anchor.length < b)) return at + anchor.length;
  }
  // Length ratio alone cannot locate a sentence across languages. Refuse uncertain alignment.
  return null;
}
export function sourceMatches(message: any, extra = record(message.extra)) {
  // Host 2.5.2 uses translationSource itself; polisher metadata cannot override it.
  return extra.translationSource === message.content;
}
export function translationConfig(chat: any) {
  // shared/src/utils/translator-defaults.ts:64-99 (including legacy and explicit prompt reset).
  // use-translate.ts:94-104 -> routes/translate.routes.ts:6-7 -> translation.service.ts:29-45.
  const meta = record(chat.metadata);
  const string = (key: string) => typeof meta[key] === 'string' ? meta[key] : undefined;
  const prompt = meta.translationOutputPrompt === undefined ? string('translationPrompt') : string('translationOutputPrompt');
  return { chatId: chat.id, provider: ['ai','google','deepl','deeplx'].includes(meta.translationProvider) ? meta.translationProvider : 'google',
    targetLanguage: string('translationOutputTargetLang')?.trim() || string('translationTargetLang')?.trim() || 'en',
    connectionId: string('translationConnectionId'), systemPrompt: prompt,
    deeplApiKey: string('translationDeeplApiKey'), deeplxUrl: string('translationDeeplxUrl') };
}

export function createTranslationJobs(api: any, window: any, notify: (state: any) => void, saved: (job: any, text: string) => void) {
  let disposed = false, job: any;
  const controllers = new Set<any>();
  const attempted = new Set<string>();
  const signature = (m: any) => JSON.stringify([m.content, m.activeSwipeIndex ?? 0, record(m.extra).translation,
    record(m.extra).translationSource, record(m.extra).translationHidden, record(m.extra).translationPolisherLongSource]);
  const active = (j: any) => !disposed && job === j && activeChatId(window) === j.chatId;
  const check = (j: any) => { if (!active(j) || j.controller.signal.aborted) throw Error('취소됨 · 기존 번역 유지'); };
  async function request(path: string, method: string, body: any, parent: any) {
    if (disposed || !path.startsWith('/api/') || path.includes('://')) throw Error('API unavailable');
    const controller = new window.AbortController(); controllers.add(controller);
    const abort = () => controller.abort(); parent.addEventListener('abort', abort, { once: true });
    const timeout = window.setTimeout(abort, method === 'POST' ? 120000 : 15000);
    controller.signal.addEventListener('abort', () => window.clearTimeout(timeout), { once: true });
    const headers: any = {};
    // client/lib/api-client.ts:284-317; shared/constants/security.ts:1-5.
    if (method !== 'GET') { headers['x-marinara-csrf'] = '1'; headers['Content-Type'] = 'application/json'; }
    try {
      if (parent.aborted) controller.abort();
      try { const secret = window.localStorage.getItem('marinara_admin_secret')?.trim(); if (secret) headers['X-Admin-Secret'] = secret; } catch {}
      if (controller.signal.aborted) throw Error('취소됨');
      const response = await Promise.race([
        api.fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body),
          cache: 'no-store', credentials: 'same-origin', signal: controller.signal }),
        new Promise<never>((_, reject) => controller.signal.addEventListener('abort', () => reject(Error('취소 또는 요청 시간 초과')), { once: true })),
      ]);
      if (controller.signal.aborted || disposed) throw Error('취소 또는 요청 시간 초과');
      if (!response.ok) throw Error(`번역 API 실패 (${response.status ?? 'unknown'}) · 기존 번역 유지`);
      return response.status === 204 ? undefined : await response.json();
    } finally { window.clearTimeout(timeout); parent.removeEventListener('abort', abort); controllers.delete(controller); }
  }
  async function verify(j: any) {
    check(j);
    const messages = await request(j.window, 'GET', undefined, j.controller.signal);
    check(j);
    const current = Array.isArray(messages) && messages.find((m: any) => m.id === j.messageId);
    if (!current || signature(current) !== j.signature) throw Error('원문·스와이프 또는 번역이 변경됨 · 저장하지 않았습니다');
  }
  const resultText = (j: any) => j.prefix + j.parts.join('');
  function emit(j: any, text: string, busy: boolean) {
    if (!disposed && job === j) notify({ messageId: j.messageId, text, busy, partial: !busy && j.parts.length > 0 });
  }
  async function persist(j: any) {
    if (!j.successes) { j.parts = []; emit(j, '번역에 성공한 청크 없음 · 기존 번역 유지', false); return; }
    await verify(j);
    const text = resultText(j);
    // use-translate.ts:105-118 persists these three fields. Explicit swipe query supported
    // by routes/chats.routes.ts:2833-2844,2917-2918 avoids writing to a newly selected swipe.
    await request(`/api/chats/${encodeURIComponent(j.chatId)}/messages/${encodeURIComponent(j.messageId)}/extra?swipeIndex=${j.swipe}`, 'PATCH',
      { translation: text, translationSource: j.source, translationHidden: false }, j.controller.signal);
    if (!active(j)) return;
    attempted.add(`${j.chatId}:${j.messageId}:${JSON.stringify([j.source, j.swipe, text])}`);
    j.parts = []; saved(j, text);
    emit(j, `번역 저장 완료${j.fallbacks ? ` · 번역 실패 ${j.fallbacks}개 청크는 원문 보존` : ''}`, false);
  }
  async function execute(messageId: string, mode: 'continue' | 'split', automatic = false) {
    if (disposed || job?.busy || job?.parts.length) return;
    const chatId = activeChatId(window); if (!chatId) return;
    const j: any = { chatId, messageId, controller: new window.AbortController(), busy: true, parts: [], prefix: '', fallbacks: 0, successes: 0 };
    job = j; emit(j, '번역 준비 중', true);
    try {
      j.window = singleWindow(chatId, messageId, hostMessages(window, chatId));
      const [chat, messages, generation] = await Promise.all([
        request(`/api/chats/${encodeURIComponent(chatId)}`, 'GET', undefined, j.controller.signal),
        request(j.window, 'GET', undefined, j.controller.signal),
        request(`/api/generate/status/${encodeURIComponent(chatId)}`, 'GET', undefined, j.controller.signal),
      ]);
      check(j);
      if (generation?.active !== false || generation.translating) throw Error('생성/번역 중 · 완료 후 다시 시도하세요');
      const message = Array.isArray(messages) && messages.find((m: any) => m.id === messageId);
      if (chat?.id !== chatId || !message || message.role !== 'assistant' || typeof message.content !== 'string' || !message.content.trim()) throw Error('현재 AI 원문을 확인할 수 없음');
      const extra = record(message.extra), raw = typeof extra.translation === 'string' ? extra.translation : '';
      if (automatic && (extra.translationHidden === true || !sourceMatches(message) || !truncation(message.content, raw).suspected)) {
        emit(j, '최신 번역은 자동 이어 번역 대상이 아닙니다', false); return;
      }
      if (!j.window.includes('&before=')) {
        j.window = messages.at(-1)?.id === messageId
          ? `/api/chats/${encodeURIComponent(chatId)}/messages?limit=1`
          : singleWindow(chatId, messageId, messages);
      }
      j.source = message.content; j.swipe = message.activeSwipeIndex ?? 0; j.signature = signature(message);
      const attempt = `${chatId}:${messageId}:${JSON.stringify([j.source, j.swipe, raw])}`;
      if (automatic && attempted.has(attempt)) { emit(j, '이미 자동 확인한 번역입니다', false); return; }
      attempted.add(attempt);
      let offset = 0;
      if (mode === 'continue') {
        if (!sourceMatches(message)) throw Error('현재 원문과 번역 출처 불일치 · 나눠서 다시 번역을 사용하세요');
        const estimated = continuationOffset(j.source, raw);
        if (estimated === null) throw Error('이어질 원문 위치가 불확실합니다 · 나눠서 다시 번역을 사용하세요');
        offset = estimated; j.prefix = raw.trimEnd();
      }
      const config = translationConfig(chat), protectedLimit = config.provider === 'google' ? 4500 : 50000;
      const chunks = splitTranslation(j.source.slice(offset), 3200, protectedLimit);
      for (let i = 0; i < chunks.length; i++) {
        check(j); await verify(j); emit(j, `번역 중 · 청크 ${i + 1}/${chunks.length}`, true);
        const chunk = chunks[i], protectedText = protectTags(chunk);
        if (!chunk.trim()) { j.parts.push(chunk); continue; }
        let translated: string | undefined;
        const withinLimit = protectedText.text.length <= protectedLimit;
        for (let attempt = 0; withinLimit && attempt < (mode === 'split' ? 2 : 1); attempt++) {
          if (attempt) { await verify(j); emit(j, `번역 재시도 · 청크 ${i + 1}/${chunks.length}`, true); }
          try {
            const response = await request('/api/translate', 'POST', { ...config, text: protectedText.text }, j.controller.signal);
            check(j);
            if (typeof response?.translatedText !== 'string' || !response.translatedText.trim()) throw Error('비어 있는 번역 응답');
            const restored = protectedText.restore(response.translatedText);
            if (restored.fallback && mode === 'continue') break;
            if (restored.fallback || !restored.text.trim()) throw Error('태그·문단 복원 실패');
            const leading = /^\s*/.exec(chunk)![0], trailing = /\s*$/.exec(chunk)![0];
            translated = leading + restored.text.trim() + trailing;
            j.successes++;
            break;
          } catch (error) {
            check(j); // Cancellation/navigation must never become a successful fallback.
            if (mode !== 'split') throw error;
          }
        }
        if (translated === undefined) {
          if (!withinLimit && mode !== 'split') throw Error('태그 블록이 공급자 한도를 넘습니다');
          j.fallbacks++; translated = chunk;
          emit(j, `청크 ${i + 1}/${chunks.length} 실패 · 원문 보존`, true);
        }
        j.parts.push(translated);
      }
      await persist(j);
    } catch (error) {
      j.controller.abort();
      if (!j.successes) j.parts = [];
      const detail = error instanceof Error ? error.message : '번역 실패';
      emit(j, `${detail}${j.parts.length ? ' · 완료된 부분 결과를 저장하거나 버릴 수 있습니다'
        : !j.successes && !detail.endsWith('기존 번역 유지') ? ' · 기존 번역 유지' : ''}`, false);
    } finally { j.busy = false; if (active(j)) notify({ busy: false, partial: j.parts.length > 0, messageId }); }
  }
  return { execute,
    get busy() { return !!job?.busy; }, get pending() { return !!job?.busy || !!job?.parts.length; },
    canAuto(chatId: string, m: any) { return !this.pending && !attempted.has(`${chatId}:${m.id}:${JSON.stringify([m.content, m.activeSwipeIndex ?? 0, record(m.extra).translation])}`); },
    cancel() { job?.controller.abort(); },
    discard() { if (job?.busy) return; job = undefined; notify({ busy: false, partial: false, text: '부분 결과 버림 · 기존 번역 유지' }); },
    async savePartial() {
      const j = job; if (!j || j.busy || !j.parts.length || !active(j)) return;
      j.controller = new window.AbortController(); j.busy = true; emit(j, '부분 결과 저장 중', true);
      try { await persist(j); } catch (error) { emit(j, error instanceof Error ? error.message : '저장 실패 · 기존 번역 유지', false); }
      finally { j.busy = false; if (active(j)) notify({ busy: false, partial: j.parts.length > 0, messageId: j.messageId }); }
    },
    navigation() { if (job && activeChatId(window) !== job.chatId) { job.controller.abort(); job = undefined; notify({ busy: false, partial: false, text: '채팅 이동으로 취소 · 기존 번역 유지' }); } },
    dispose() { disposed = true; job?.controller.abort(); for (const c of controllers) c.abort(); job = undefined; attempted.clear(); },
  };
}
