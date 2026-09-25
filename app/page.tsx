import { cookies } from 'next/headers';
import { getFacts } from '@/lib/facts';
import { categoryFromSlug } from '@/lib/categories';
import { shuffle } from '@/lib/shuffle';
import { SEEN_COOKIE, parseSeen } from '@/lib/seen';
import { FactDeck } from '@/components/FactDeck';
import { PageShell } from '@/components/PageShell';

export default function Home({ searchParams }: { searchParams: { category?: string | string[] } }) {
  const slug = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const category = categoryFromSlug(slug);
  const inScope = getFacts().filter((fact) => !category || fact.category === category);
  const seen = new Set(parseSeen(cookies().get(SEEN_COOKIE)?.value));
  // Unseen facts first, then ones seen on earlier visits, each group shuffled.
  const facts = [
    ...shuffle(inScope.filter((fact) => !seen.has(fact.id))),
    ...shuffle(inScope.filter((fact) => seen.has(fact.id))),
  ];

  return (
    <PageShell width="deck">
      <FactDeck key={category ?? 'all'} facts={facts} category={category} />
    </PageShell>
  );
}
