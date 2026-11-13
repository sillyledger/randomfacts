import type { Metadata } from 'next';

// The canonical public address. Shared and copied links always use it, never the host the page happens to be served from.
export const SITE_URL = 'https://www.randomfacts.site';
export const SITE_NAME = 'Random Facts';
export const SITE_DESCRIPTION = 'A daily dose of surprising facts.';

// A nested page's `openGraph` replaces the layout's wholesale, so each page restates the full link preview.
export function pageMetadata(title: string, path: string): Metadata {
  return {
    title,
    openGraph: { type: 'website', title, description: SITE_DESCRIPTION, url: path, siteName: SITE_NAME },
    twitter: { card: 'summary', title, description: SITE_DESCRIPTION },
  };
}
