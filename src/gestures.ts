// Pointer gestures own physical activation; detail-zero clicks remain available to
// native keyboard/accessibility activation and button docks calling click().
export function bindGestures(window: any, button: any, options: {
  holdMs: number;
  onTap: () => void;
  onHold: () => void;
  onDrag?: (dx: number, dy: number) => void;
  onStart?: () => void;
  onContextMenu?: () => void;
  moveLimit?: number;
}) {
  const life = new window.AbortController();
  let press: any, timer: any;
  const stop = (e: any) => e.stopPropagation();
  const consume = (e: any) => { e.preventDefault(); stop(e); };
  const listen = (target: any, type: string, fn: any) => target.addEventListener(type, fn, { passive: false, signal: life.signal });
  const clear = () => { window.clearTimeout(timer); timer = undefined; };
  function end() {
    clear(); const previous = press; press = undefined;
    try { if (previous) button.releasePointerCapture(previous.id); } catch {}
  }
  function hold() {
    clear();
    if (!press || press.moved || press.held || !button.isConnected) return;
    press.held = true; options.onHold();
  }
  function move(e: any) {
    if (!press || press.id !== e.pointerId || press.held) return;
    const dx = e.clientX - press.x, dy = e.clientY - press.y;
    if (Math.hypot(dx, dy) >= (options.moveLimit ?? 10)) { press.moved = true; clear(); }
    if (press.moved) options.onDrag?.(dx, dy);
  }
  listen(button, 'pointerdown', (e: any) => {
    stop(e);
    if (press) { end(); return; }
    if (e.button !== 0 || e.isPrimary === false) return;
    press = { id: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY, at: window.performance.now(), moved: false, held: false };
    options.onStart?.();
    try { button.setPointerCapture(e.pointerId); } catch {}
    timer = window.setTimeout(hold, options.holdMs);
  });
  const handlers: Record<string, (e: any) => void> = {
    pointermove(e) { if (press?.id === e.pointerId) { stop(e); move(e); } },
    pointerup(e) {
      stop(e);
      if (press?.id !== e.pointerId) return;
      move(e);
      // A busy main thread can delay the timer beyond pointerup.
      if (window.performance.now() - press.at >= options.holdMs) hold();
      const tap = !press.moved && !press.held && button.isConnected;
      end();
      if (tap) options.onTap();
    },
    pointercancel(e) { if (press?.id === e.pointerId) { stop(e); end(); } },
  };
  for (const [type, handler] of Object.entries(handlers)) {
    listen(button, type, handler);
    // Fallback for a detached target or an unavailable/failed pointer capture.
    listen(window, type, (e: any) => { if (press && !button.contains(e.target)) handler(e); });
  }
  listen(button, 'lostpointercapture', (e: any) => { if (press?.id === e.pointerId) end(); });
  listen(window, 'blur', end);
  listen(button, 'contextmenu', (e: any) => {
    consume(e);
    // Native touch menus may precede the deadline; only the hold timer owns them.
    if (press?.type === 'touch' || e.pointerType === 'touch') return;
    const held = press?.held;
    end();
    if (!held) options.onContextMenu?.();
  });
  listen(button, 'selectstart', consume);
  listen(button, 'mousedown', stop);
  listen(button, 'keydown', (e: any) => { if (e.key === 'Enter' || e.key === ' ') stop(e); });
  listen(button, 'keyup', (e: any) => { if (e.key === 'Enter' || e.key === ' ') stop(e); });
  listen(button, 'click', (e: any) => {
    consume(e);
    if (e.detail === 0 && !e.pointerType && !e.sourceCapabilities?.firesTouchEvents) options.onTap();
  });
  listen(button, 'dblclick', stop);
  return { cancel: end, dispose() { end(); life.abort(); } };
}
