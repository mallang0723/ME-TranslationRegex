export const LAUNCHER_ID = 'translation-regex-launcher';
const COMPOSERS = '.composer,.mari-composer,.mari-chat-composer,[data-testid="composer"],[data-testid="chat-composer"],[data-chat-composer]';
const SIZE = 44, GAP = 8;

// A light-DOM button lets button docks discover it and invoke click() even while hidden.
export function createLauncher(window: any, onToggle: (button: any) => void, shown: boolean) {
  const document = window.document, life = new window.AbortController();
  const button = document.createElement('button'), css = document.createElement('style');
  css.setAttribute('data-translation-regex-launcher-style', '');
  button.id = LAUNCHER_ID; button.dataset.testid = LAUNCHER_ID; button.type = 'button';
  button.setAttribute('aria-label', '번역문 정규식 설정 · 위아래로 이동 · 0.7초 길게 눌러 위치 초기화');
  button.title = button.getAttribute('aria-label'); button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 22 7.5v9L12 22 2 16.5v-9ZM2 7.5 12 13l10-5.5M12 13v9M12 2v11"/></svg>';
  css.textContent = `#${LAUNCHER_ID}{position:fixed;right:0;z-index:999;box-sizing:border-box;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;border:1px solid #6c7185;border-radius:10px 0 0 10px;background:var(--marinara-chat-message-action-bg-hover,#303444);color:var(--marinara-chat-message-action-text,#eee);cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
#${LAUNCHER_ID} svg{display:block;margin:auto;pointer-events:none}
#${LAUNCHER_ID}[data-launcher-disabled],#${LAUNCHER_ID}[data-launcher-no-room]{display:none!important}`;
  document.head.append(css);
  let disposed = false, wantedY: number | undefined, top = 0, press: any, holdTimer: any, clickTimer: any, suppressClick = false;
  const observed = new Set<any>();
  const resize = window.ResizeObserver ? new window.ResizeObserver(() => sync()) : undefined;
  function attr(name: string, value: boolean) { if (button.hasAttribute(name) !== value) button.toggleAttribute(name, value); }
  function sync() {
    if (disposed) return;
    // Reattach the original node: dock classes, inline display and listeners survive host rerenders.
    for (const stale of document.querySelectorAll(`#${LAUNCHER_ID}`)) if (stale !== button) stale.remove();
    if (button.parentNode !== document.body) document.body.append(button);
    const viewport = window.visualViewport;
    const start = viewport?.offsetTop || 0, height = viewport?.height || window.innerHeight;
    const min = start + GAP;
    let bottom = start + height - GAP;
    const composers = new Set<any>(document.querySelectorAll(COMPOSERS));
    // Also support hosts without a named wrapper; ignore message editors and our settings.
    for (const input of document.querySelectorAll('textarea,[contenteditable="true"],[role="textbox"]')) {
      if (!input.closest('[data-message-id],#translation_regex_me')) composers.add(input.closest(COMPOSERS) || input.closest('form') || input);
    }
    for (const old of observed) if (!composers.has(old)) { resize?.unobserve(old); observed.delete(old); }
    for (const composer of composers) {
      if (!observed.has(composer)) { observed.add(composer); resize?.observe(composer); }
      const rect = composer.getBoundingClientRect(), style = window.getComputedStyle(composer);
      if (rect.width > 0 && rect.height > 0 && rect.bottom > start && rect.top < start + height &&
          style.display !== 'none' && style.visibility !== 'hidden') bottom = Math.min(bottom, rect.top - GAP);
    }
    const max = bottom - SIZE;
    attr('data-launcher-disabled', !shown); attr('data-launcher-no-room', max < min);
    top = Math.max(min, Math.min(max, wantedY ?? start + (height - SIZE) / 2));
    if (button.style.top !== `${top}px`) button.style.top = `${top}px`;
    // Keep the right edge inside the visual viewport when the keyboard/pinch zoom changes it.
    const right = Math.max(0, window.innerWidth - ((viewport?.offsetLeft || 0) + (viewport?.width || window.innerWidth)));
    if (button.style.right !== `${right}px`) button.style.right = `${right}px`;
  }
  function clearHold() { window.clearTimeout(holdTimer); holdTimer = undefined; }
  function suppress() {
    suppressClick = true; window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => { suppressClick = false; clickTimer = undefined; }, 500);
  }
  function end() {
    clearHold(); const previous = press; press = undefined;
    if (previous?.dragged || previous?.held) suppress();
    try { if (previous) button.releasePointerCapture(previous.id); } catch {}
  }
  const listen = (target: any, type: string, fn: any) => target.addEventListener(type, fn, { signal: life.signal, passive: false });
  listen(button, 'pointerdown', (e: any) => {
    e.stopPropagation();
    if (press) { end(); suppress(); return; }
    if (e.button !== 0 || e.isPrimary === false) return;
    window.clearTimeout(clickTimer); suppressClick = false;
    press = { id: e.pointerId, y: e.clientY, top, dragged: false, held: false };
    try { button.setPointerCapture(e.pointerId); } catch {}
    holdTimer = window.setTimeout(() => {
      holdTimer = undefined;
      if (!press || press.dragged || !button.isConnected) return;
      press.held = true; wantedY = undefined; sync();
    }, 700);
  });
  listen(window, 'pointermove', (e: any) => {
    if (!press || e.pointerId !== press.id) return;
    const dy = e.clientY - press.y;
    if (Math.abs(dy) > 6) { press.dragged = true; clearHold(); }
    if (press.dragged) { e.preventDefault(); wantedY = press.top + dy; sync(); }
  });
  listen(window, 'pointerup', (e: any) => { if (press?.id === e.pointerId) end(); });
  listen(window, 'pointercancel', (e: any) => { if (press?.id === e.pointerId) { end(); suppress(); } });
  listen(button, 'lostpointercapture', () => { if (press) { end(); suppress(); } });
  listen(window, 'blur', end);
  listen(button, 'click', (e: any) => {
    e.stopPropagation();
    if (suppressClick) { suppressClick = false; window.clearTimeout(clickTimer); e.preventDefault(); return; }
    onToggle(button);
  });
  for (const type of ['contextmenu', 'selectstart']) listen(button, type, (e: any) => { e.preventDefault(); e.stopPropagation(); });
  listen(window, 'resize', sync); listen(window, 'scroll', sync);
  if (window.visualViewport) for (const type of ['resize', 'scroll']) listen(window.visualViewport, type, sync);
  const observer = new window.MutationObserver(() => { if (!button.isConnected) end(); sync(); });
  sync(); observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
  return { button, sync, setShown(value: boolean) { shown = value; sync(); },
    dispose() { disposed = true; end(); window.clearTimeout(clickTimer); life.abort(); observer.disconnect(); resize?.disconnect(); button.remove(); css.remove(); } };
}
