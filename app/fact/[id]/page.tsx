import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FactCard } from '@/components/FactCard';
import { PageShell } from '@/components/PageShell';
import { categorySlug, categoryTokens } from '@/lib/categories';
import { getFact, getFacts, getRelatedFacts } from '@/lib/facts';
import { factPath } from '@/lib/site';

// Only the ids in data/facts.json exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getFacts().map((fact) => ({ id: fact.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const fact = getFact(params.id);
  if (!fact) return {};
  const title = `${fact.title.replace(/\.$/, '')} · Random Facts`;

  return {
    title,
    description: fact.explain,
    alternates: { canonical: factPath(fact.id) },
    openGraph: { title, description: fact.explain, url: factPath(fact.id), type: 'article', siteName: 'Random Facts' },
    twitter: { card: 'summary_large_image', title, description: fact.explain },
  };
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M4 7h3.5c1.2 0 2.3.6 3 1.6l.6.9" />
      <path d="M4 17h3.5c1.2 0 2.3-.6 3-1.6l4-5.8c.7-1 1.8-1.6 3-1.6H20" />
      <path d="M17 4l3 3-3 3" />
      <path d="M17 14l3 3-3 3" />
      <path d="M13.1 15.4l.6.9c.7 1 1.8 1.6 3 1.6H20" />
    </svg>
  );
}

// lucide "arrow-up-right"
function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

export default function FactPage({ params }: { params: { id: string } }) {
  const fact = getFact(params.id);
  if (!fact) notFound();

  const tokens = categoryTokens[fact.category];
  const categoryHref = `/?category=${categorySlug(fact.category)}`;
  const categoryCount = getFacts().filter((other) => other.category === fact.category).length;
  const related = getRelatedFacts(fact, 3);

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-chromeText">
        <Link href="/" className="transition hover:text-ink hover:underline">
          All facts
        </Link>
        <span aria-hidden className="text-chromeText/50">
          ›
        </span>
        <Link
          href={categoryHref}
          className="inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-[13px] text-ink transition hover:brightness-[0.97]"
          style={{ backgroundColor: tokens.bg }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: tokens.accent }}>
            <CategoryIcon category={fact.category} className="h-3.5 w-3.5" />
          </span>
          {fact.category}
        </Link>
      </nav>

      <div className="grid items-start gap-10 md:grid-cols-[340px_minmax(0,1fr)] lg:grid-cols-[390px_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col pt-4">
          <FactCard fact={fact} swipeHint={false} titleAs="h1" />
          <Link
            href="/"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90"
          >
            <ShuffleIcon />
            Shuffle a new fact
          </Link>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          {(fact.story || fact.source) && (
            <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.12)] max-[359px]:p-5">
              {fact.story && (
                <>
                  <h2 className="text-[22px] font-extrabold leading-tight text-ink">The longer story</h2>
                  <p className="mt-3 text-[15.5px] leading-[1.65] text-muted">{fact.story}</p>
                </>
              )}
              {fact.source && (
                <div className={fact.story ? 'mt-6 border-t border-chromeBorder pt-5' : ''}>
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Source</h2>
                  <a
                    href={fact.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 text-[15px] font-semibold text-brand hover:underline"
                  >
                    <span className="min-w-0 break-words">{fact.source.name}</span>
                    <ArrowUpRightIcon />
                  </a>
                </div>
              )}
            </section>
          )}

          {related.length > 0 && (
            <section>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-[22px] font-extrabold leading-tight text-ink">More {fact.category} facts</h2>
                <Link href={categoryHref} className="text-sm font-semibold text-brand hover:underline">
                  See all {categoryCount}
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                {related.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={factPath(other.id)}
                      className="flex h-full items-center gap-3 rounded-[20px] p-4 transition hover:brightness-[0.97] sm:min-h-[132px] sm:flex-col sm:items-start sm:gap-4 md:min-h-0 md:flex-row md:items-center md:gap-3 lg:min-h-[132px] lg:flex-col lg:items-start lg:gap-4"
                      style={{ backgroundColor: tokens.bg }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: tokens.accent }}
                      >
                        <CategoryIcon category={other.category} className="h-4 w-4" />
                      </span>
                      <span className="break-words text-[15px] font-extrabold leading-snug text-ink">{other.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </PageShell>
  );
}
