import createDOMPurify from '../vendor/dompurify/purify.es.mjs';
import postcss from 'postcss';
import { CHAT_HTML_ALLOWED_TAGS, CHAT_HTML_ALLOWED_ATTR } from './html-policy';
import { sanitizeChatMessageCss, scopeChatMessageCss } from './host-css';

// Host allowlists are unchanged. Additional resource restrictions implement BRIEF's offline rule.
// Scope rules even inside Shadow DOM: author :host / ::slotted must never style the wrapper.
export function offlineCss(css: string, block = true): string {
  const clean = block ? scopeChatMessageCss(css, '.translation-content', { remoteUrls: false })
    : sanitizeChatMessageCss(css, { remoteUrls: false });
  try {
    const parsed = postcss.parse(block ? clean : `x{${clean}}`);
    parsed.walkAtRules(rule => {
      if (!['media', 'supports', 'container', 'layer', 'keyframes', '-webkit-keyframes'].includes(rule.name.toLowerCase())) rule.remove();
    });
    parsed.walkDecls(decl => {
      // No resource-producing CSS functions, including escaped/comment-obfuscated spellings.
      const value = decl.value.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\\(?:([0-9a-f]{1,6})\s?|([^\n]))/gi,
        (_, hex, char) => hex ? String.fromCodePoint(Math.min(parseInt(hex, 16), 0x10ffff)) : char);
      if (/(?:url|src|image|image-set|paint|expression)\s*\(|(?:javascript|vbscript)\s*:/i.test(value)
        || /^(?:behavior|-moz-binding)$/i.test(decl.prop)) decl.remove();
    });
    return block ? parsed.toString() : (parsed.first?.nodes ?? []).map(node => node.toString()).join(';');
  } catch { return ''; }
}
export function createSanitizer(window: Window) {
  const purify = createDOMPurify(window);
  return (html: string) => {
    // packages/client/src/lib/chat-html.ts:166-179: parse style blocks separately before stripping.
    const styles = purify.sanitize(`<div>${html}</div>`, {
      ALLOWED_TAGS: ['div', 'style'], ALLOWED_ATTR: [], FORBID_CONTENTS: [], RETURN_DOM_FRAGMENT: true,
    });
    const css = offlineCss([...styles.querySelectorAll('style')].map(s => s.textContent ?? '').join('\n'));
    // packages/client/src/lib/chat-html.ts:129-159: same tag/attribute allowlists and DOMPurify options.
    const fragment = purify.sanitize(html, {
      ALLOWED_TAGS: [...CHAT_HTML_ALLOWED_TAGS], ALLOWED_ATTR: [...CHAT_HTML_ALLOWED_ATTR],
      ALLOW_DATA_ATTR: false, ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_TAGS: ['animate', 'embed', 'foreignObject', 'iframe', 'math', 'object', 'script', 'svg', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'srcdoc'], RETURN_DOM_FRAGMENT: true,
    });
    for (const element of fragment.querySelectorAll('[style]')) {
      const style = offlineCss(element.getAttribute('style') ?? '', false);
      if (style) element.setAttribute('style', style); else element.removeAttribute('style');
    }
    for (const anchor of fragment.querySelectorAll('a')) {
      anchor.setAttribute('rel', 'noopener noreferrer');
      // Fragment links are inert outside this message; external navigation is not added by this extension.
      if (!anchor.getAttribute('href')?.startsWith('#')) anchor.removeAttribute('href');
      anchor.removeAttribute('target');
    }
    for (const img of fragment.querySelectorAll('img')) {
      if (!/^data:image\/(?:png|jpeg|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(img.getAttribute('src') ?? '')) {
        // Keep human-readable alt text when a remote image cannot be loaded.
        img.replaceWith(window.document.createTextNode(img.getAttribute('alt') || '[이미지 생략]'));
      } else img.setAttribute('referrerpolicy', 'no-referrer');
    }
    return { fragment, css };
  };
}
