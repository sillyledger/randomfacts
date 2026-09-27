// The one place the public domain lives. Set NEXT_PUBLIC_SITE_URL when the domain changes.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://randomfacts-lovat.vercel.app').replace(/\/+$/, '');

export function factPath(id: string): string {
  return `/fact/${id}`;
}
