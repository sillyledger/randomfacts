import { getFacts } from '@/lib/facts';
import { categoryFromSlug } from '@/lib/categories';
import { FactDeck } from '@/components/FactDeck';
import { PageShell } from '@/components/PageShell';

export default function Home({ searchParams }: { searchParams: { category?: string | string[] } }) {
  const slug = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const category = categoryFromSlug(slug);
  const facts = getFacts().filter((fact) => !category || fact.category === category);

  return (
    <PageShell width="deck">
      <FactDeck key={category ?? 'all'} facts={facts} category={category} />
    </PageShell>
  );
}
