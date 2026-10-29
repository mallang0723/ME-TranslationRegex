import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { rule, message } from '../tests/harness.mjs';
let browser;
try { browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-gpu'] }); }
catch (error) {
  writeFileSync('qa/browser-results.json', JSON.stringify({ version: '0.2.0', status: 'blocked', viewport: '360x780', checksCompleted: 0, reason: String(error) }, null, 2) + '\n');
  throw error;
}
const checks = [], blocked = [], errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', async route => {
    if (route.request().url() === 'http://fixture.invalid/') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>
body{margin:0;padding:12px;background:#eee;color:#123;--marinara-chat-message-action-text:#456;--marinara-chat-message-action-bg-hover:#ddd;--marinara-chat-message-action-text-hover:#123}
main{max-width:100%;display:flex;flex-direction:column;gap:8px}.host-control{color:rgb(1,2,3)}
/* ChatMessage action utilities + globals.css:6829-6844, with 12 host actions. */
.mari-message-actions{display:flex;width:100%;min-width:0;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px;padding:0 4px;box-sizing:border-box}
.mari-message-actions button{display:inline-flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:var(--marinara-chat-message-action-text);width:36px;height:36px;font-size:16px}
@media(max-width:767px){.mari-message-actions{flex-wrap:nowrap;column-gap:0;padding-inline:0}.mari-message-actions>button,.mari-message-actions>div{flex:1 1 0;min-width:0}.mari-message-actions>div>button{width:100%}.mari-message-actions button{width:28px;height:32px;font-size:14px}}
</style><body><button class="host-control">호스트 UI</button><main class="mari-message-assistant" data-message-id="m"><div class="mari-message-content">체력 90</div><div class="mari-message-actions opacity-100">${Array.from({length:12},(_,i)=>`<button title="호스트 액션 ${i}"><svg width="1em" height="1em" viewBox="0 0 24 24"><path d="M4 4h16v16H4Z" fill="none" stroke="currentColor"/></svg></button>`).join('')}</div></main>` });
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
  const action = page.locator('[data-translation-regex-action] button');
  await action.waitFor();
  checks.push(['fresh install manual default', await page.evaluate(() => !document.querySelector('[data-translation_regex_me]') && fake.requests.length === 0)]);
  await action.click();
  await page.locator('[data-translation_regex_me]').waitFor();
  checks.push(['44px cube shares action row without overlap/wrap at 360px', await page.evaluate(() => {
    const action = document.querySelector('[data-translation-regex-action] button'), a = action.getBoundingClientRect();
    const controls = [...document.querySelectorAll('.mari-message-actions button')];
    return a.width === 44 && a.height === 44 && a.right <= innerWidth && a.left >= 0 && controls.every(b => {
      const r = b.getBoundingClientRect(); return r.right <= a.left && Math.abs((r.top+r.bottom)-(a.top+a.bottom)) < 2;
    });
  })]);
  checks.push(['icon size/color matches host', await page.evaluate(() => {
    const a = document.querySelector('[data-translation-regex-action] svg'), b = document.querySelector('.mari-message-actions svg');
    return a.getBoundingClientRect().width === b.getBoundingClientRect().width && getComputedStyle(a).color === getComputedStyle(b).color;
  })]);
  await page.evaluate(() => { const row = document.querySelector('.mari-message-actions'); row.replaceWith(row.cloneNode(true)); });
  await page.waitForFunction(() => document.querySelectorAll('[data-translation-regex-action] button').length === 1 && document.querySelector('[data-translation-regex-action] button').getAttribute('aria-pressed') === 'true');
  checks.push(['React action row replacement repaired', true]);
  checks.push(['HTTP insecure context', await page.evaluate(() => !isSecureContext)]);
  await page.getByRole('button', { name: '번역 정규식', exact: true }).click();
  checks.push(['360px settings within viewport', await page.evaluate(() => {
    const s = document.getElementById('translation_regex_me').shadowRoot.querySelector('section').getBoundingClientRect();
    return s.left >= 0 && s.right <= innerWidth && s.bottom <= innerHeight;
  })]);
  checks.push(['no horizontal page overflow', await page.evaluate(() => document.documentElement.scrollWidth <= 360)]);
  checks.push(['author CSS cannot alter host', await page.evaluate(() => getComputedStyle(document.querySelector('.host-control')).color === 'rgb(1, 2, 3)' && getComputedStyle(document.body).backgroundColor === 'rgb(238, 238, 238)')]);
  checks.push(['panel width contained at 360px', await page.evaluate(() => {
    const r = document.querySelector('[data-translation_regex_me]').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.height > 0;
  })]);
  await page.screenshot({ path: 'qa/mobile-360.png', fullPage: true });
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await action.click();
  await page.waitForFunction(() => !document.querySelector('[data-translation_regex_me]'));
  checks.push(['disable original visible', await page.locator('.mari-message-content').isVisible()]);
  await page.evaluate(() => fake.cleanups.forEach(fn => fn()));
  checks.push(['cleanup UI removed', await page.locator('#translation_regex_me').count() === 0]);
  checks.push(['no external/resource requests', blocked.length === 0]);
  checks.push(['no browser errors', errors.length === 0]);
  for (const [name, ok] of checks) assert.equal(ok, true, name);
  writeFileSync('qa/browser-results.json', JSON.stringify({ version: '0.2.0', status: 'passed', viewport: '360x780', checks, blocked, errors }, null, 2) + '\n');
  console.log(`${checks.length} browser checks passed`);
} finally { await browser.close(); }
