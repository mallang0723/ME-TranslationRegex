// Marinara 2.5.2: chats.routes.ts:2672-2693 supports limit + exclusive before,
// not offset or a single-message GET. chats.storage.ts:721-737,2332-2370.
export const messageKey = (id: string) => ['chats', 'messages', id];
export const recentPath = (id: string) => `/api/chats/${encodeURIComponent(id)}/messages?limit=3`;
export function hostMessages(window: any, id: string): any[] {
  const value = window.__MARINARA_HOST__?.queryClient?.getQueryData?.(messageKey(id));
  const rows = Array.isArray(value) ? value : value?.pages?.flat();
  return Array.isArray(rows) ? rows.filter(m => m && typeof m.id === 'string') : [];
}
export function singleWindow(id: string, messageId: string, rows: any[]) {
  const target = rows.find(m => m.id === messageId);
  // Only an adjacent absolute row can locate an older message without downloading history.
  const next = target && Number.isInteger(target.rowid) && rows.find(m => m.rowid === target.rowid + 1);
  if (next && typeof next.createdAt === 'string' && Number.isFinite(Date.parse(next.createdAt))) {
    const cursor = `${next.createdAt}|${encodeURIComponent(next.id)}`;
    return `/api/chats/${encodeURIComponent(id)}/messages?limit=1&before=${encodeURIComponent(cursor)}`;
  }
  return recentPath(id);
}
