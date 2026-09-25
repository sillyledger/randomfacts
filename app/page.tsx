import { cookies } from 'next/headers';
import { getFacts } from '@/lib/facts';
import { categoryFromSlug } from '@/lib/categories';
import { shuffle } from '@/lib/shuffle';
import { SEEN_COOKIE, decodeSeen, encodeSeen } from '@/lib/seen';
import { FactDeck } from '@/components/FactDeck';
import { PageShell } from '@/components/PageShell';

export default function Home({ searchParams }: { searchParams: { category?: string | string[] } }) {
  const slug = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const category = categoryFromSlug(slug);
  const allFacts = getFacts();
  const inScope = allFacts.filter((fact) => !category || fact.category === category);
  const seen = decodeSeen(cookies().get(SEEN_COOKIE)?.value, new Map(allFacts.map((fact) => [fact.id, fact.num])));
  // Unseen facts first, then ones seen on earlier visits, each group shuffled.
  const facts = [
    ...shuffle(inScope.filter((fact) => !seen.has(fact.num))),
    ...shuffle(inScope.filter((fact) => seen.has(fact.num))),
  ];

  return (
    <PageShell width="deck">
      <FactDeck key={category ?? 'all'} facts={facts} category={category} initialSeen={encodeSeen(seen)} />
    </PageShell>
  );
}
