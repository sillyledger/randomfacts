'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category, Fact } from '@/types/fact';
import { FactCard } from '@/components/FactCard';
import { ProgressRing } from '@/components/ProgressRing';

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 7h3.5c1.2 0 2.3.6 3 1.6l.6.9" />
      <path d="M4 17h3.5c1.2 0 2.3-.6 3-1.6l4-5.8c.7-1 1.8-1.6 3-1.6H20" />
      <path d="M17 4l3 3-3 3" />
      <path d="M17 14l3 3-3 3" />
      <path d="M13.1 15.4l.6.9c.7 1 1.8 1.6 3 1.6H20" />
    </svg>
  );
}

function FilterChip({ category }: { category: Category }) {
  return (
    <Link
      href="/"
      aria-label={`Clear ${category} filter`}
      className="mb-6 inline-flex items-center gap-1.5 self-start rounded-full border border-chromeBorder bg-white/60 py-1.5 pl-3 pr-2.5 text-[13px] font-semibold text-chromeText transition hover:bg-white"
    >
      Showing: {category}
      <span aria-hidden className="text-base leading-none text-chromeText/60">
        ×
      </span>
    </Link>
  );
}

export function FactDeck({ facts, category }: { facts: Fact[]; category?: Category }) {
  const [index, setIndex] = useState(0);
  const fact = facts[index];
  const total = facts.length;

  const goToPrevious = () => setIndex((current) => (current - 1 + total) % total);
  const goToNext = () => setIndex((current) => (current + 1) % total);
  const shuffle = () => {
    if (total <= 1) return;
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * total);
    }
    setIndex(next);
  };

  if (!fact) {
    return (
      <>
        {category && <FilterChip category={category} />}
        <div className="rounded-[28px] bg-white/60 p-6 text-center text-[15.5px] font-semibold text-chromeText">
          No facts here yet — check back soon.
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`${category ? 'mb-4' : 'mb-8'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <ProgressRing progress={(index + 1) / total} />
          <span className="text-sm font-semibold text-chromeText">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <button
          type="button"
          onClick={shuffle}
          aria-label="Shuffle fact"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-chromeBorder text-chromeText transition hover:bg-black/5"
        >
          <ShuffleIcon />
        </button>
      </div>

      {category && <FilterChip category={category} />}

      <div className="mt-2">
        <FactCard fact={fact} />
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={goToPrevious}
          className="flex-1 rounded-full border border-chromeBorder py-3.5 text-sm font-semibold text-chromeText transition hover:bg-black/5"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="flex-1 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Share ↗
        </button>
      </div>
    </>
  );
}
