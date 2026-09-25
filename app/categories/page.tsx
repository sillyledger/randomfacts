import type { Metadata } from 'next';
import Link from 'next/link';
import { getFacts } from '@/lib/facts';
import { categories, categorySlug, categoryTokens } from '@/lib/categories';
import { CategoryIcon } from '@/components/CategoryIcon';
import { PageShell } from '@/components/PageShell';
import type { Category } from '@/types/fact';

export const metadata: Metadata = {
  title: 'Categories · Random Facts',
};

function CategoryTileContent({ category, count }: { category: Category; count: number }) {
  return (
    <>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: categoryTokens[category].accent }}
      >
        <CategoryIcon category={category} className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[16px] font-extrabold leading-tight text-ink">{category}</div>
        <div className="mt-0.5 text-[13px] font-semibold text-muted">
          {count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'fact' : 'facts'}`}
        </div>
      </div>
    </>
  );
}

export default function CategoriesPage() {
  const facts = getFacts();
  const tileClass = 'flex min-h-[132px] flex-col justify-between gap-4 rounded-[20px] p-4';

  return (
    <PageShell>
      <h1 className="mb-5 text-[27px] font-extrabold leading-tight text-ink">Categories</h1>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const count = facts.filter((fact) => fact.category === category).length;
          const style = { backgroundColor: categoryTokens[category].bg };

          return (
            <li key={category}>
              {count === 0 ? (
                <div aria-disabled className={`${tileClass} opacity-60`} style={style}>
                  <CategoryTileContent category={category} count={count} />
                </div>
              ) : (
                <Link
                  href={`/?category=${categorySlug(category)}`}
                  className={`${tileClass} transition hover:brightness-[0.97]`}
                  style={style}
                >
                  <CategoryTileContent category={category} count={count} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
