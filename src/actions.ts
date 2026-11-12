import { bindGestures } from './gestures';

const TITLE = '번역문에 표시 정규식 적용 · 길게 눌러 설정 (우클릭 가능)';
const OWN = 'data-translation-regex-action';
export function createActions(window: any, onToggle: (id: string) => void, onSettings: (button: any) => void) {
  const document = window.document, entries = new Map<any, any>();
  const css = document.createElement('style'); css.setAttribute(OWN, '');
  // MessageActionButton.tsx:4,42-44: direct button, 1em icon, h-9/w-9 and
  // max-md:h-8/w-7. Inherit row gap/mobile flex distribution (globals.css:6829-6844).
  css.textContent = `
button[${OWN}]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
button[${OWN}][aria-pressed=true]::after,button[${OWN}][aria-busy=true]::after,button[${OWN}][data-state=error]::after{content:'';position:absolute;right:3px;top:3px;width:4px;height:4px;border-radius:50%;background:currentColor}
button[${OWN}][data-state=error]::after{background:#e86868}
button[${OWN}][aria-busy=true]::after{animation:translation-regex-pulse .8s infinite alternate}
@keyframes translation-regex-pulse{to{opacity:.25}}`;
  document.head.append(css);
  function remove(row: any, entry: any) { entry.cleanup(); entry.host.remove(); entries.delete(row); }
  function gestures(button: any, id: string) {
    const gesture = bindGestures(window, button, {
      holdMs: 600, onTap: () => onToggle(id), onHold: () => onSettings(button),
      onContextMenu: () => onSettings(button),
    });
    return () => gesture.dispose();
  }

  function sync() {
    for (const [row, entry] of entries) if (!row.isConnected || !entry.host.isConnected || entry.host.parentElement !== row ||
      row.closest('[data-message-id]')?.getAttribute('data-message-id') !== entry.id) remove(row, entry);
    const seen = new Set<string>();
    for (const row of document.querySelectorAll('.mari-message-actions')) {
      const root = row.closest('[data-message-id]'), id = root?.getAttribute('data-message-id');
      if (!id || root.matches('.mari-message-user,[data-message-role=user]') || seen.has(id)) continue;
      seen.add(id);
      if (entries.has(row)) { const { button } = entries.get(row); if (row.lastElementChild !== button) row.append(button); continue; }
      // React may clone our DOM without listeners; replace only our own stale buttons.
      for (const stale of row.querySelectorAll(`button[${OWN}]`)) stale.remove();
      const button = document.createElement('button'); button.type = 'button';
      button.setAttribute(OWN, '');
      button.className = 'mari-chat-style-control mari-chat-message-action [-webkit-tap-highlight-color:transparent] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md p-0 text-base leading-none transition-colors md:transition-all md:active:scale-90 max-md:h-8 max-md:w-7 max-md:max-w-full max-md:text-sm max-md:active:bg-[var(--marinara-chat-message-action-bg-hover)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30 text-[var(--marinara-chat-message-action-text)] [@media(pointer:fine)]:hover:bg-[var(--marinara-chat-message-action-bg-hover)] [@media(pointer:fine)]:hover:text-[var(--marinara-chat-message-action-text-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marinara-chat-chrome-focus-ring)]';
      button.title = TITLE; button.setAttribute('aria-label', TITLE); button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-haspopup', 'dialog');
      // MessageActionButton.tsx:4,42-44 uses 1em icons and the same theme color/hover variables.
      button.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 22 7.5v9L12 22 2 16.5v-9ZM2 7.5 12 13l10-5.5M12 13v9M12 2v11"/></svg>';
      const cleanup = gestures(button, id);
      row.append(button); entries.set(row, { host: button, button, id, cleanup });
    }
  }
  function state(id: string, kind: string, detail = '') {
    for (const entry of entries.values()) if (entry.id === id) {
      entry.button.dataset.state = kind;
      entry.button.setAttribute('aria-pressed', String(kind === 'applied'));
      entry.button.setAttribute('aria-busy', String(kind === 'busy'));
      entry.button.title = detail ? `${TITLE} · ${detail}` : TITLE;
    }
  }
  return { sync, state, kind: (id: string) => [...entries.values()].find(e => e.id === id)?.button.dataset.state, ids: () => [...entries.values()].map(e => e.id),
    dispose() { for (const [row, entry] of entries) remove(row, entry); css.remove(); } };
}
