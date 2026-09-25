// Which facts the visitor has seen, stored in a cookie so the server can put unseen facts at
// the front of the deck. The value is "2:" + a base64url bitmap with bit `num` set per seen fact.
// Older cookies hold '.'-joined fact ids; those are still read (see decodeSeen) and replaced
// with the bitmap on the next write.
export const SEEN_COOKIE = 'seen';
const VERSION_PREFIX = '2:';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeSeen(seen: Iterable<number>): string {
  const nums = Array.from(seen).filter((num) => Number.isInteger(num) && num > 0);
  const bytes = new Uint8Array(nums.length ? (Math.max(...nums) >> 3) + 1 : 0);
  for (const num of nums) bytes[num >> 3] |= 1 << (num & 7);
  return VERSION_PREFIX + toBase64Url(bytes);
}

// Never throws: an unreadable value just means nothing has been seen. Legacy id lists are
// translated with `numById` when given (the server has every fact); otherwise they're ignored.
export function decodeSeen(value: string | undefined, numById?: Map<string, number>): Set<number> {
  const seen = new Set<number>();
  if (!value) return seen;

  if (value.startsWith(VERSION_PREFIX)) {
    try {
      fromBase64Url(value.slice(VERSION_PREFIX.length)).forEach((byte, index) => {
        for (let bit = 0; bit < 8; bit++) if (byte & (1 << bit)) seen.add(index * 8 + bit);
      });
    } catch {
      return new Set();
    }
    return seen;
  }

  for (const id of value.split('.')) {
    const num = numById?.get(id);
    if (num !== undefined) seen.add(num);
  }
  return seen;
}

// Record `num` as seen. Once every fact in scope has been seen, clear the scope so the next
// visit starts a fresh pass (keeping the card on screen).
export function markSeen(seen: Set<number>, num: number, scopeNums: number[]): Set<number> {
  const updated = new Set(seen).add(num);
  if (!scopeNums.every((scopeNum) => updated.has(scopeNum))) return updated;

  scopeNums.forEach((scopeNum) => updated.delete(scopeNum));
  return updated.add(num);
}

function readSeenCookie(): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${SEEN_COOKIE}=([^;]*)`))?.[1];
}

// `fallback` is what the server decoded for this page; it's used when the cookie is missing
// its bitmap (e.g. a legacy id list, which the browser can't translate on its own).
export function recordSeenInCookie(num: number, scopeNums: number[], fallback: Set<number>) {
  const raw = readSeenCookie();
  const current = raw?.startsWith(VERSION_PREFIX) ? decodeSeen(raw) : fallback;
  const value = encodeSeen(markSeen(current, num, scopeNums));
  document.cookie = `${SEEN_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}
