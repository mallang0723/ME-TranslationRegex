import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { harness, delay } from './harness.mjs';

const id = 'translation-regex-launcher';
const html = '<main data-message-id="m" class="mari-message-assistant"><div class="translation-text">번역</div><div class="mari-message-actions"><button>복사</button></div></main><form class="composer"><textarea></textarea><button>전송</button></form>';
async function setup(t, options = {}) {
  const h = await harness({ html, settings: null, ...options }); t.after(() => h.cleanup());
  return h;
}
const launcher = h => h.w.document.getElementById(id);
function pointer(h, type, y, x = 340, pointerId = 1) {
  const e = new h.w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
  Object.defineProperty(e, 'pointerId', { value: pointerId }); launcher(h).dispatchEvent(e);
}
function resize(h) { h.w.dispatchEvent(new h.w.Event('resize')); }

test('launcher has stable unique identity, icon only, and click() toggles a centered settings panel', async t => {
  const h = await setup(t), b = launcher(h);
  assert.equal(b.dataset.testid, id); assert.equal(b.parentElement, h.w.document.body);
  assert.equal(b.textContent, ''); assert.ok(b.querySelector('svg[stroke-dasharray]'));
  assert.equal(h.w.getComputedStyle(b).width, '44px'); assert.equal(h.w.getComputedStyle(b).height, '44px');
  assert.equal(h.ui.querySelector('#showLauncher').checked, true);
  b.click(); assert.equal(h.ui.host.hidden, false); assert.equal(b.getAttribute('aria-expanded'), 'true');
  assert.equal(h.ui.querySelector('#split-translation').parentElement.hidden, true);
  assert.match(h.ui.querySelector('style').textContent, /place-items:center/);
  b.click(); assert.equal(h.ui.host.hidden, true); assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.equal(h.requests.length, 0);
});

test('remote hiding classes/styles survive movement, settings changes, reattachment and hidden click()', async t => {
  const h = await setup(t), b = launcher(h);
  b.classList.add('remote-hidden'); b.style.setProperty('display', 'none', 'important');
  pointer(h, 'pointerdown', 380); pointer(h, 'pointermove', 250); pointer(h, 'pointerup', 250);
  b.click(); assert.equal(h.ui.host.hidden, true, 'drag click consumed');
  b.click(); assert.equal(h.ui.host.hidden, false, 'hidden remote target opens');
  const setting = h.ui.querySelector('#showLauncher');
  for (const value of [false, true]) { setting.checked = value; setting.dispatchEvent(new h.w.Event('change')); }
  b.remove(); await delay(0);
  assert.equal(launcher(h), b); assert.equal(b.classList.contains('remote-hidden'), true);
  assert.equal(b.style.display, 'none'); assert.equal(b.style.getPropertyPriority('display'), 'important');
  h.w.document.body.append(b.cloneNode(true)); await delay(0);
  assert.equal(h.w.document.querySelectorAll(`#${id}`).length, 1);
  assert.equal(launcher(h), b);
  b.click(); assert.equal(h.ui.host.hidden, true);
});

test('launcher preference persists independently and message cube still opens settings', async t => {
  const h = await setup(t), b = launcher(h), box = h.ui.querySelector('#showLauncher');
  b.click(); box.checked = false; box.dispatchEvent(new h.w.Event('change'));
  assert.equal(b.hasAttribute('data-launcher-disabled'), true);
  assert.equal(JSON.parse(h.w.localStorage.getItem('translation_regex_me.settings')).showLauncher, false);
  b.click();
  const cube = h.w.document.querySelector('button[data-translation-regex-action]');
  const touch = new h.w.Event('touchstart', { bubbles: true, cancelable: true });
  Object.defineProperty(touch, 'touches', { value: [{ identifier: 1, clientX: 20, clientY: 20 }] });
  cube.dispatchEvent(touch); await delay(650);
  cube.dispatchEvent(new h.w.Event('touchend', { bubbles: true, cancelable: true }));
  assert.equal(h.ui.host.hidden, false); assert.equal(h.ui.querySelector('#split-translation').parentElement.hidden, false);
  h.w.eval(readFileSync('dist/extension.js', 'utf8')); await h.settle();
  assert.equal(h.w.document.querySelectorAll(`#${id}`).length, 1);
  assert.equal(launcher(h).dataset.testid, id); assert.equal(launcher(h).hasAttribute('data-launcher-disabled'), true);
  launcher(h).click(); assert.equal(h.ui.host.hidden, false);
});

test('vertical-only drag clamps above composer and viewport, then consumes just the next click', async t => {
  const h = await setup(t), b = launcher(h), composer = h.w.document.querySelector('.composer');
  Object.defineProperty(h.w, 'innerHeight', { value: 780, configurable: true });
  composer.getBoundingClientRect = () => ({ top: 650, bottom: 780, width: 360, height: 130 }); resize(h);
  assert.equal(b.style.top, '368px');
  pointer(h, 'pointerdown', 390); pointer(h, 'pointermove', 900, 40); pointer(h, 'pointerup', 900, 40);
  assert.equal(b.style.top, '598px'); assert.equal(b.style.right, '0px');
  b.click(); assert.equal(h.ui.host.hidden, true); b.click(); assert.equal(h.ui.host.hidden, false); b.click();
  pointer(h, 'pointerdown', 600); pointer(h, 'pointermove', -500); pointer(h, 'pointerup', -500);
  assert.equal(b.style.top, '8px'); b.click();
  // Horizontal movement never changes the anchored edge or the vertical position.
  pointer(h, 'pointerdown', 20); pointer(h, 'pointermove', 20, 20); pointer(h, 'pointerup', 20, 20);
  assert.equal(b.style.top, '8px'); assert.equal(b.style.right, '0px');
});

test('700ms hold resets position without opening settings; cancellation and cleanup clear timers', async t => {
  const h = await setup(t), b = launcher(h);
  pointer(h, 'pointerdown', 380); pointer(h, 'pointermove', 140); pointer(h, 'pointerup', 140); b.click();
  const native = h.w.setTimeout; let fire;
  h.w.setTimeout = (fn, ms) => {
    if (ms !== 700) return native(fn, ms);
    const timer = native(() => {}, 10000); fire = () => { h.w.clearTimeout(timer); fn(); }; return timer;
  };
  pointer(h, 'pointerdown', 140); assert.equal(typeof fire, 'function'); fire();
  assert.equal(b.style.top, `${(h.w.innerHeight - 44) / 2}px`);
  pointer(h, 'pointerup', 140); b.click(); assert.equal(h.ui.host.hidden, true);
  pointer(h, 'pointerdown', 380); pointer(h, 'pointercancel', 380); b.click(); assert.equal(h.ui.host.hidden, true);
  pointer(h, 'pointerdown', 380); h.stop();
  assert.equal(h.timers.size, 0); assert.equal(h.intervals.size, 0); assert.equal(launcher(h), null);
});

test('composer growth, fallback editors and visual viewport changes keep launcher out of input area', async t => {
  const h = await setup(t), b = launcher(h), composer = h.w.document.querySelector('.composer');
  let top = 700;
  composer.getBoundingClientRect = () => ({ top, bottom: 780, width: 360, height: 780 - top });
  pointer(h, 'pointerdown', 380); pointer(h, 'pointermove', 1000); pointer(h, 'pointerup', 1000); b.click();
  top = 400; composer.style.height = '380px'; await delay(0); assert.equal(b.style.top, '348px');
  composer.classList.remove('composer'); resize(h); assert.equal(b.style.top, '348px', 'textarea form fallback');
  const viewport = new h.w.EventTarget(); Object.assign(viewport, { offsetTop: 10, height: 320, offsetLeft: 0, width: 360 });
  h.w.visualViewport = viewport;
  h.w.eval(readFileSync('dist/extension.js', 'utf8')); await h.settle();
  assert.equal(launcher(h).style.top, '148px');
  viewport.height = 200; viewport.dispatchEvent(new h.w.Event('resize')); assert.equal(launcher(h).style.top, '88px');
  top = 40; viewport.dispatchEvent(new h.w.Event('scroll'));
  assert.equal(launcher(h).hasAttribute('data-launcher-no-room'), true);
});
