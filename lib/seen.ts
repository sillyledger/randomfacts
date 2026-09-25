// Fact ids the visitor has seen, oldest first, stored in a cookie so the server can
// put unseen facts at the front of the deck. Ids are [a-z0-9-] slugs joined with '.'.
export const SEEN_COOKIE = 'seen';
const SEPARATOR = '.';
const MAX_VALUE_LENGTH = 3500;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function parseSeen(value: string | undefined): string[] {
  return value ? value.split(SEPARATOR).filter(Boolean) : [];
}

export function serializeSeen(ids: string[]): string {
  let kept = ids;
  while (kept.length > 0 && kept.join(SEPARATOR).length > MAX_VALUE_LENGTH) {
    kept = kept.slice(1);
  }
  return kept.join(SEPARATOR);
}

// Record `id` as the most recently seen card. Once every fact in scope has been seen,
// clear the scope's ids so the next visit starts a fresh pass (keeping the card on screen).
export function markSeen(seen: string[], id: string, scopeIds: string[]): string[] {
  const updated = [...seen.filter((seenId) => seenId !== id), id];
  const seenSet = new Set(updated);
  if (!scopeIds.every((scopeId) => seenSet.has(scopeId))) return updated;

  const scope = new Set(scopeIds);
  return [...updated.filter((seenId) => !scope.has(seenId)), id];
}

function readSeenCookie(): string[] {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SEEN_COOKIE}=([^;]*)`));
  return parseSeen(match?.[1]);
}

export function recordSeenInCookie(id: string, scopeIds: string[]) {
  const value = serializeSeen(markSeen(readSeenCookie(), id, scopeIds));
  document.cookie = `${SEEN_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}
