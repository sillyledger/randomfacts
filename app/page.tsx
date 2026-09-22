'use client';

import { useState } from 'react';
import { getFacts } from '@/lib/facts';
import { FactCard } from '@/components/FactCard';
import { ProgressRing } from '@/components/ProgressRing';

const facts = getFacts();

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

export default function Home() {
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

  return (
    <main className="flex min-h-screen flex-col items-center bg-pageBg px-6 py-8">
      <div className="flex w-full max-w-[390px] flex-1 flex-col">
        <div className="mb-8 flex items-center justify-between">
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

        <div className="mt-10 flex justify-center pb-4">
          <span className="text-xs font-semibold tracking-wide text-chromeText/40">Random Facts</span>
        </div>
      </div>
    </main>
  );
}
