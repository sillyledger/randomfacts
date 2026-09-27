import type { MetadataRoute } from 'next';
import { getFacts } from '@/lib/facts';
import { SITE_URL, factPath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/categories', '/about', '/contact'].map((path) => ({ url: `${SITE_URL}${path}` }));
  const facts = getFacts().map((fact) => ({ url: `${SITE_URL}${factPath(fact.id)}` }));
  return [...pages, ...facts];
}
