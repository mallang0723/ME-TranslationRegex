import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { rule, message } from '../tests/harness.mjs';
const safeError = error => String(error).replaceAll(process.cwd(), '<repo>').replace(/\/(?:home|tmp|usr|opt|var|run)\/[^\s"'<>)]*/g, '<repo>');
let browser;
try { browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-gpu'] }); }
catch (error) {
  writeFileSync('qa/browser-results.json', JSON.stringify({ version: '0.3.1', status: 'blocked', viewport: '360x780', checksCompleted: 0, reason: safeError(error) }, null, 2) + '\n');
  console.error(safeError(error)); process.exit(1);
}
const checks = [], blocked = [], errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', async route => {
    if (route.request().url() === 'http://fixture.invalid/') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>
body{margin:0;padding:12px;background:#eee;color:#123;--marinara-chat-message-action-text:#456;--marinara-chat-message-action-bg-hover:#ddd;--marinara-chat-message-action-text-hover:#123}
.composer{position:fixed;bottom:0;left:0;right:0;height:64px;display:flex;background:white;padding:8px}.composer input{min-width:0;flex:1}.composer button{min-width:44px}
main{max-width:100%;display:flex;flex-direction:column;gap:8px}.host-control{color:rgb(1,2,3)}
/* ChatMessage action utilities + globals.css:6829-6844, with 12 host actions. */
.mari-message-actions{display:flex;width:100%;min-width:0;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px;padding:0 4px;box-sizing:border-box}
.mari-message-actions button{display:inline-flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:var(--marinara-chat-message-action-text);width:36px;height:36px;font-size:16px}
@media(max-width:767px){.mari-message-actions{flex-wrap:nowrap;column-gap:0;padding-inline:0}.mari-message-actions>button,.mari-message-actions>div{flex:1 1 0;min-width:0}.mari-message-actions>div>button{width:100%}.mari-message-actions button{width:28px;height:32px;font-size:14px}}
</style><body><button class="host-control">호스트 UI</button><main class="mari-message-assistant" data-message-id="m"><div class="mari-message-content">체력 90</div><div class="mari-message-actions opacity-100">${Array.from({length:12},(_,i)=>`<button title="호스트 액션 ${i}"><svg width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 4h16v16H4Z" fill="none" stroke="currentColor"/></svg></button>`).join('')}</div></main><form class="composer"><input aria-label="메시지"><button type="button">전송</button></form>` });
    blocked.push(route.request().url()); await route.abort();
  });
  await page.goto('http://fixture.invalid/');
  await page.evaluate(({ rule, message }) => {
    window.fake = { rules: [rule], message, cleanups: [], requests: [], chat: { id: 'c', mode: 'roleplay', metadata: '{"translationDisplayOnly":true}' } };
    localStorage.setItem('marinara-active-chat-id', 'c');
    window.marinara = { onCleanup(fn) { fake.cleanups.push(fn); }, log: { error: console.error }, async fetch(path, init) {
      fake.requests.push(path); if (init.method !== 'GET') throw Error('Only GET');
      const values = { '/api/regex-scripts': fake.rules, '/api/prompts': [], '/api/chats/c': fake.chat,
        '/api/chats/c/messages': [fake.message], '/api/generate/status/c': { active: false, translating: false } };
      if (!(path in values)) throw Error('Unexpected path');
      return { ok: true, async json() { return structuredClone(values[path]); } };
    } };
  }, { rule: rule({ replaceString: `<style>body{background:red}button{color:red}:host{position:fixed;inset:0} .dem{width:900px;padding:12px;background:#eef4ff;border:1px solid #9ab;border-radius:8px} .dem b{color:#456}</style><section class="dem"><b>DEM 상태 패널</b><p>$1</p><img src="https://outside.invalid/track" alt="원격 이미지 생략"></section>` }), message: message() });
  await page.addScriptTag({ content: readFileSync('dist/extension.js', 'utf8') });
  const action = page.locator('button[data-translation-regex-action]');
  await action.waitFor();
  checks.push(['fresh install manual default', await page.evaluate(() => !document.querySelector('[data-translation_regex_me]') && fake.requests.length === 0)]);
  checks.push(['44px launcher at right edge above composer and send unobstructed', await page.evaluate(() => {
    const ui = document.getElementById('translation_regex_me'), send = document.querySelector('.composer button'), r = send.getBoundingClientRect();
    const b = document.getElementById('translation-regex-launcher'), a = b.getBoundingClientRect();
    return ui.hidden && a.width === 44 && a.height === 44 && a.right === innerWidth && a.bottom < document.querySelector('.composer').getBoundingClientRect().top && document.elementFromPoint(r.x+r.width/2, r.y+r.height/2) === send;
  })]);
  const launcher = page.locator('#translation-regex-launcher');
  await launcher.tap(); await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  const launcherBox = await launcher.boundingBox();
  await page.mouse.move(launcherBox.x + 22, launcherBox.y + 22); await page.mouse.down();
  await page.mouse.move(100, 770, { steps: 10 }); await page.mouse.up();
  checks.push(['vertical drag clamps above composer and does not open panel', await page.evaluate(() => {
    const r = document.getElementById('translation-regex-launcher').getBoundingClientRect();
    return r.right === innerWidth && r.bottom <= document.querySelector('.composer').getBoundingClientRect().top - 8 && document.getElementById('translation_regex_me').hidden;
  })]);
  await page.waitForTimeout(550);
  await page.evaluate(() => {
    const b = document.getElementById('translation-regex-launcher');
    b.classList.add('remote-hidden'); b.style.setProperty('display', 'none', 'important'); b.click();
  });
  checks.push(['hidden remote click opens centered settings', await page.evaluate(() => {
    const ui = document.getElementById('translation_regex_me'), r = ui.shadowRoot.querySelector('section').getBoundingClientRect();
    return !ui.hidden && Math.abs((r.left+r.right)/2-innerWidth/2) < 1;
  })]);
  await page.evaluate(() => {
    const b = document.getElementById('translation-regex-launcher'); b.click();
    b.classList.remove('remote-hidden'); b.style.removeProperty('display');
  });
  await action.tap();
  await page.locator('[data-translation_regex_me]').waitFor();
  checks.push(['short touch toggles only', await page.evaluate(() => document.getElementById('translation_regex_me').hidden)]);
  checks.push(['cube is the last child and matches host spacing/size at 360px', await page.evaluate(() => {
    const action = document.querySelector('button[data-translation-regex-action]'), a = action.getBoundingClientRect();
    const controls = [...document.querySelectorAll('.mari-message-actions button')].filter(b => b !== action);
    return action.parentElement.lastElementChild === action && a.height === controls[0].getBoundingClientRect().height && Math.abs(a.width - controls[0].getBoundingClientRect().width) < 1 && a.right <= innerWidth && a.left >= 0 && controls.every(b => {
      const r = b.getBoundingClientRect(); return r.right <= a.left + 1 && Math.abs((r.top+r.bottom)-(a.top+a.bottom)) < 2;
    });
  })]);
  checks.push(['icon size/color matches host', await page.evaluate(() => {
    const a = document.querySelector('button[data-translation-regex-action] svg'), b = document.querySelector('.mari-message-actions svg');
    return a.getBoundingClientRect().width === b.getBoundingClientRect().width && getComputedStyle(a).color === getComputedStyle(b).color;
  })]);
  await page.evaluate(() => { const row = document.querySelector('.mari-message-actions'); row.replaceWith(row.cloneNode(true)); });
  await page.waitForFunction(() => document.querySelectorAll('button[data-translation-regex-action]').length === 1 && document.querySelector('button[data-translation-regex-action]').getAttribute('aria-pressed') === 'true');
  checks.push(['React action row replacement repaired', true]);
  checks.push(['HTTP insecure context', await page.evaluate(() => !isSecureContext)]);
  const client = await page.context().newCDPSession(page);
  const box = await action.boundingBox();
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x+box.width/2, y: box.y+box.height/2 }] });
  await page.waitForTimeout(650);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.getByRole('dialog').waitFor();
  checks.push(['600ms native touch opens settings without toggling', await action.getAttribute('aria-pressed') === 'true']);
  checks.push(['360px settings within viewport', await page.evaluate(() => {
    const s = document.getElementById('translation_regex_me').shadowRoot.querySelector('section').getBoundingClientRect();
    const close = document.getElementById('translation_regex_me').shadowRoot.querySelector('header button').getBoundingClientRect();
    const composer = document.querySelector('.composer').getBoundingClientRect();
    return s.left >= 0 && s.top >= 0 && s.right <= innerWidth && s.bottom <= innerHeight && s.bottom <= composer.top && Math.abs((s.left+s.right)/2-innerWidth/2) < 1 && Math.abs((s.top+s.bottom)/2-innerHeight/2) < 1 && close.width >= 44 && close.height >= 44;
  })]);
  checks.push(['no horizontal page overflow', await page.evaluate(() => document.documentElement.scrollWidth <= 360)]);
  checks.push(['author CSS cannot alter host', await page.evaluate(() => getComputedStyle(document.querySelector('.host-control')).color === 'rgb(1, 2, 3)' && getComputedStyle(document.body).backgroundColor === 'rgb(238, 238, 238)')]);
  checks.push(['panel width contained at 360px', await page.evaluate(() => {
    const r = document.querySelector('[data-translation_regex_me]').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.height > 0;
  })]);
  await page.screenshot({ path: 'qa/mobile-360.png', fullPage: true });
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await action.click({ button: 'right' });
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  checks.push(['right click opens and Escape closes', await page.getByRole('dialog').isHidden()]);
  await action.click({ button: 'right' });
  await page.mouse.click(4, 4);
  checks.push(['outside tap closes', await page.getByRole('dialog').isHidden()]);
  await action.tap();
  await page.waitForFunction(() => !document.querySelector('[data-translation_regex_me]'));
  checks.push(['disable original visible', await page.locator('.mari-message-content').isVisible()]);
  await page.evaluate(() => fake.cleanups.forEach(fn => fn()));
  checks.push(['cleanup UI removed', await page.locator('#translation_regex_me').count() === 0]);
  checks.push(['no external/resource requests', blocked.length === 0]);
  checks.push(['no browser errors', errors.length === 0]);
  for (const [name, ok] of checks) assert.equal(ok, true, name);
  writeFileSync('qa/browser-results.json', JSON.stringify({ version: '0.3.1', status: 'passed', viewport: '360x780', checks, blocked, errors }, null, 2) + '\n');
  console.log(`${checks.length} browser checks passed`);
} finally { await browser.close(); }
