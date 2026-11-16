import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { pointer, compatibilityClick } from './pointer-events.mjs';

const { outputFiles } = await build({ entryPoints: ['src/gestures.ts'], bundle: true, write: false, format: 'iife', globalName: 'gestures' });
function setup(t, holdMs = 600, drag = false) {
  const dom = new JSDOM('<button>cube</button>', { runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window, button = w.document.querySelector('button');
  const calls = [], timers = new Map(), capture = []; let now = 0, timerId = 0;
  w.setTimeout = (fn, ms) => { timers.set(++timerId, { fn, at: now + ms }); return timerId; };
  w.clearTimeout = id => timers.delete(id);
  w.performance.now = () => now;
  button.setPointerCapture = id => capture.push(['set', id]);
  button.releasePointerCapture = id => capture.push(['release', id]);
  w.eval(outputFiles[0].text);
  const gesture = w.gestures.bindGestures(w, button, {
    holdMs, onTap: () => calls.push('tap'), onHold: () => calls.push('hold'),
    onContextMenu: () => calls.push('context'), moveLimit: drag ? 6 : 10,
    ...(drag ? { onDrag: (dx, dy) => calls.push(['drag', dx, dy]) } : {}),
  });
  t.after(() => gesture.dispose());
  return { w, button, calls, timers, capture, gesture,
    pointer: (type, patch) => pointer(w, button, type, patch),
    touch: type => button.dispatchEvent(new w.Event(type, { bubbles: true, cancelable: true })),
    click: () => compatibilityClick(w, button),
    advance(ms, run = true) {
      now += ms;
      if (run) for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); }
    },
  };
}

for (const holdMs of [600, 700]) {
  const name = holdMs === 600 ? 'cube' : 'launcher';
  for (const [order, sequence] of Object.entries({
    Blink: ['pointerdown', 'touchstart', 'pointerup', 'pointerout', 'pointerleave', 'touchend'],
    // Exercise touchend before the pointer release as well as boundary events
    // before release; correctness must not depend on Touch Events ordering.
    'iOS Safari touchend-first': ['pointerdown', 'touchstart', 'touchend', 'pointerup', 'pointerout', 'pointerleave'],
    'iOS Safari boundary-before-release': ['pointerdown', 'touchstart', 'pointerout', 'pointerleave', 'touchend', 'pointerup'],
  })) test(`${name}: ${order} tap toggles once, with or without compatibility click`, t => {
    const h = setup(t, holdMs, holdMs === 700);
    for (const type of sequence) type.startsWith('touch') ? h.touch(type) : h.pointer(type);
    assert.deepEqual(h.calls, ['tap']); assert.equal(h.timers.size, 0);
    h.click(); assert.deepEqual(h.calls, ['tap']);
    assert.deepEqual(h.capture, [['set', 1], ['release', 1]]);
    for (const type of sequence) type.startsWith('touch') ? h.touch(type) : h.pointer(type);
    assert.deepEqual(h.calls, ['tap', 'tap'], 'another tap works without waiting for a click');
  });
  test(`${name}: hold fires exactly at ${holdMs}ms and never toggles on release`, t => {
    const h = setup(t, holdMs, holdMs === 700);
    h.pointer('pointerdown'); assert.equal(h.timers.size, 1);
    h.advance(holdMs - 1); assert.deepEqual(h.calls, []);
    h.advance(1); assert.deepEqual(h.calls, ['hold']);
    h.pointer('pointerleave'); h.pointer('pointerout'); h.advance(1000);
    h.pointer('pointerup'); h.click(); assert.deepEqual(h.calls, ['hold']);
  });
  test(`${name}: release deadline handles a delayed timer`, t => {
    const h = setup(t, holdMs);
    h.pointer('pointerdown'); h.advance(holdMs, false); h.pointer('pointerup'); h.click();
    assert.deepEqual(h.calls, ['hold']); assert.equal(h.timers.size, 0);
  });
  test(`${name}: mouse tap, mouse hold, Enter, Space and dock click stay usable`, t => {
    const h = setup(t, holdMs);
    h.pointer('pointerdown', { pointerType: 'mouse' }); h.pointer('pointerup', { pointerType: 'mouse' }); h.click();
    assert.deepEqual(h.calls, ['tap']);
    h.pointer('pointerdown', { pointerType: 'mouse' }); h.advance(holdMs); h.pointer('pointerup', { pointerType: 'mouse' }); h.click();
    assert.deepEqual(h.calls, ['tap', 'hold']);
    for (const key of ['Enter', ' ']) {
      const down = new h.w.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      h.button.dispatchEvent(down); assert.equal(down.defaultPrevented, false, 'native button keyboard activation preserved');
      if (key === 'Enter') h.button.click();
      h.button.dispatchEvent(new h.w.KeyboardEvent('keyup', { key, bubbles: true }));
      if (key === ' ') h.button.click();
    }
    h.button.click(); assert.deepEqual(h.calls, ['tap', 'hold', 'tap', 'tap', 'tap']);
  });
  for (const reason of ['pointercancel', 'lostpointercapture', 'blur', 'second finger', 'dispose'])
    test(`${name}: ${reason} cancels timer and release`, t => {
      const h = setup(t, holdMs);
      h.pointer('pointerdown');
      if (reason === 'blur') h.w.dispatchEvent(new h.w.Event('blur'));
      else if (reason === 'second finger') h.pointer('pointerdown', { pointerId: 2, isPrimary: false });
      else if (reason === 'dispose') h.gesture.dispose();
      else h.pointer(reason);
      assert.equal(h.timers.size, 0); h.advance(holdMs + 1); h.pointer('pointerup'); h.click();
      assert.deepEqual(h.calls, []);
    });
}

test('cube: large movement cancels hold and tap even after returning to origin', t => {
  const h = setup(t);
  h.pointer('pointerdown'); h.pointer('pointermove', { clientX: 30 });
  h.pointer('pointermove'); h.advance(1000); h.pointer('pointerup'); h.click();
  assert.deepEqual(h.calls, []); assert.equal(h.timers.size, 0);
});
test('cube: small movement permits a tap, release displacement alone cancels', t => {
  const h = setup(t);
  h.pointer('pointerdown'); h.pointer('pointermove', { clientX: 25 }); h.pointer('pointerup', { clientX: 25 });
  assert.deepEqual(h.calls, ['tap']);
  h.pointer('pointerdown'); h.pointer('pointerup', { clientY: 40 }); h.click();
  assert.deepEqual(h.calls, ['tap']);
});
test('launcher: vertical and horizontal drag cancel reset and tap', t => {
  const h = setup(t, 700, true);
  h.pointer('pointerdown'); h.pointer('pointermove', { clientY: 70 }); h.advance(1000); h.pointer('pointerup', { clientY: 70 }); h.click();
  assert.ok(h.calls.length > 0); assert.ok(h.calls.every(call => call[0] === 'drag'));
  h.calls.length = 0;
  h.pointer('pointerdown'); h.pointer('pointermove', { clientX: 70 }); h.advance(1000); h.pointer('pointerup', { clientX: 70 }); h.click();
  assert.ok(h.calls.every(call => call[0] === 'drag' && call[2] === 0));
});
test('context menu: right click opens once; early and late touch menus do not duplicate hold', t => {
  const h = setup(t);
  h.pointer('pointerdown', { button: 2, pointerType: 'mouse' });
  assert.equal(h.timers.size, 0);
  const menu = () => h.button.dispatchEvent(new h.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
  assert.equal(menu(), false); assert.deepEqual(h.calls, ['context']);
  h.pointer('pointerup', { button: 2, pointerType: 'mouse' }); h.click();
  h.pointer('pointerdown'); menu(); assert.deepEqual(h.calls, ['context']);
  h.advance(600); menu(); h.pointer('pointerup'); h.click();
  pointer(h.w, h.button, 'contextmenu');
  assert.deepEqual(h.calls, ['context', 'hold']);
});
test('unrelated pointers cannot finish a press; capture failure still handles release outside', t => {
  const h = setup(t);
  h.button.setPointerCapture = () => { throw Error('unavailable'); };
  h.pointer('pointerdown'); h.pointer('pointerup', { pointerId: 2 }); assert.deepEqual(h.calls, []);
  pointer(h.w, h.w.document.body, 'pointerup'); assert.deepEqual(h.calls, ['tap']);
});
