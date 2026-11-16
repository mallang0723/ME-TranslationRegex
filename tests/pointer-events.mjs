export function pointer(w, button, type, patch = {}) {
  const e = new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: 20, clientY: 20, button: 0, ...patch });
  for (const [name, value] of Object.entries({ pointerId: 1, pointerType: 'touch', isPrimary: true, ...patch }))
    if (['pointerId', 'pointerType', 'isPrimary'].includes(name)) Object.defineProperty(e, name, { value });
  button.dispatchEvent(e); return e;
}
export function compatibilityClick(w, button, patch = {}) {
  button.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, ...patch }));
}
