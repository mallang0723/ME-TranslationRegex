// Stricter personal-extension policy: no CSS resource requests, including same-origin assets.
// chat-message-css.ts calls this only after testing embedded data:image URLs.
export const remoteImageHref = (_value: string) => 'blocked';
