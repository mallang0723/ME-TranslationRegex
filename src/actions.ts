const TITLE = '번역문에 표시 정규식 적용';
const ROW = 'data-translation-regex-row';
const OWN = 'data-translation-regex-action';
export function createActions(window: any, onToggle: (id: string) => void) {
  const document = window.document, entries = new Map<any, any>();
  const css = document.createElement('style'); css.setAttribute(OWN, '');
  // ChatMessage.tsx:4262-4287,4723; ConversationMessageActions.tsx:131-157 share this row.
  // A sibling reserves the last 44px via padding, without inserting into React-owned action children.
  // globals.css:6829-6844 already distributes mobile actions on a single line. Keep that behavior.
  css.textContent = `
.mari-message-actions[${ROW}]{box-sizing:border-box;min-height:44px;padding-inline-end:48px!important;flex-wrap:nowrap!important}
[${OWN}].translation-regex-action{position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;margin-block-start:-44px;margin-inline-start:auto;opacity:0;transition:opacity .15s}
.mari-message-actions.opacity-100 + [${OWN}],.mari-message-actions:focus-within + [${OWN}],[data-message-id]:hover [${OWN}],[${OWN}]:focus-within{opacity:1}
[${OWN}] button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;position:relative;width:44px;height:44px;min-width:44px;padding:0;border:0;border-radius:6px;background:transparent;font:inherit;font-size:16px;color:var(--marinara-chat-message-action-text,currentColor);cursor:pointer;touch-action:manipulation}
@media(max-width:767px){[${OWN}] button{font-size:14px}}
@media(pointer:fine){[${OWN}] button:hover{background:var(--marinara-chat-message-action-bg-hover);color:var(--marinara-chat-message-action-text-hover)}}
[${OWN}] button:active{background:var(--marinara-chat-message-action-bg-hover)}
[${OWN}] button:focus-visible{outline:2px solid var(--marinara-chat-chrome-focus-ring,currentColor);outline-offset:-2px}
[${OWN}] button[aria-pressed=true]::after,[${OWN}] button[aria-busy=true]::after,[${OWN}] button[data-state=error]::after{content:'';position:absolute;right:5px;top:5px;width:5px;height:5px;border-radius:50%;background:currentColor}
[${OWN}] button[data-state=error]::after{background:#e86868}
[${OWN}] button[aria-busy=true]::after{animation:translation-regex-pulse .8s infinite alternate}
@keyframes translation-regex-pulse{to{opacity:.25}}`;
  document.head.append(css);
  function remove(row: any, entry: any) { entry.host.remove(); row.removeAttribute(ROW); entries.delete(row); }
  function align(row: any, host: any) {
    const parent = window.getComputedStyle(row.parentElement);
    const gap = (parent.display === 'flex' && parent.flexDirection === 'column') || parent.display === 'grid'
      ? parseFloat(parent.rowGap) || 0 : 0;
    host.style.marginBlockStart = `${-44 - gap}px`;
    host.style.flexShrink = '0';
  }
  function sync() {
    for (const [row, entry] of entries) if (!row.isConnected || !entry.host.isConnected || row.nextSibling !== entry.host ||
      row.closest('[data-message-id]')?.getAttribute('data-message-id') !== entry.id) remove(row, entry);
    const seen = new Set<string>();
    for (const row of document.querySelectorAll('.mari-message-actions')) {
      const root = row.closest('[data-message-id]'), id = root?.getAttribute('data-message-id');
      if (!id || root.matches('.mari-message-user,[data-message-role=user]') || seen.has(id)) continue;
      seen.add(id);
      if (entries.has(row)) { align(row, entries.get(row).host); continue; }
      const host = document.createElement('div'); host.setAttribute(OWN, ''); host.className = 'translation-regex-action';
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'mari-chat-style-control mari-chat-message-action';
      button.title = TITLE; button.setAttribute('aria-label', TITLE); button.setAttribute('aria-pressed', 'false');
      // MessageActionButton.tsx:4,42-44 uses 1em icons and the same theme color/hover variables.
      button.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 22 7.5v9L12 22 2 16.5v-9ZM2 7.5 12 13l10-5.5M12 13v9M12 2v11"/></svg>';
      button.addEventListener('click', (event: any) => { event.stopPropagation(); onToggle(id); });
      button.addEventListener('dblclick', (event: any) => event.stopPropagation());
      host.append(button); align(row, host); row.setAttribute(ROW, ''); row.after(host); entries.set(row, { host, button, id });
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
