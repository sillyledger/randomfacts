'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Category, Fact } from '@/types/fact';
import { FactCard } from '@/components/FactCard';
import { ProgressRing } from '@/components/ProgressRing';

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
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

function pickRandom(facts: Fact[], excludeId?: string): Fact | undefined {
  const candidates = facts.filter((fact) => fact.id !== excludeId);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input, textarea, select, [contenteditable="true"], #site-menu');
}

export function FactDeck({ facts, category }: { facts: Fact[]; category?: Category }) {
  // Card ids seen this session; `position` points at the one on screen.
  const [history, setHistory] = useState(() => ({ ids: facts[0] ? [facts[0].id] : [], position: 0 }));
  const factsById = useMemo(() => new Map(facts.map((fact) => [fact.id, fact])), [facts]);
  const fact = factsById.get(history.ids[history.position]);
  const total = facts.length;
  const index = fact ? facts.indexOf(fact) : 0;
  const canGoBack = history.position > 0;

  const goBack = useCallback(() => {
    setHistory((current) => (current.position > 0 ? { ...current, position: current.position - 1 } : current));
  }, []);

  const shuffle = useCallback(() => {
    const next = pickRandom(facts, fact?.id);
    if (!next) return;
    // Moving forward after going back drops the cards ahead of this one, like browser history.
    setHistory({ ids: [...history.ids.slice(0, history.position + 1), next.id], position: history.position + 1 });
  }, [facts, fact, history]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (isTypingTarget(event.target) || document.getElementById('site-menu')) return;

      if (event.key === ' ') {
        // Let Space activate a focused button or link as usual.
        if (event.target instanceof HTMLElement && event.target.closest('button, a, [role="button"]')) return;
        event.preventDefault();
        shuffle();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        shuffle();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shuffle, goBack]);

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
      <div className={`${category ? 'mb-4' : 'mb-8'} flex h-10 items-center gap-2`}>
        <ProgressRing progress={(index + 1) / total} />
        <span className="text-sm font-semibold text-chromeText">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {category && <FilterChip category={category} />}

      <div className="mt-2">
        <FactCard fact={fact} />
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className="flex-1 rounded-full border border-chromeBorder py-3.5 text-sm font-semibold text-chromeText transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={shuffle}
          disabled={total <= 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShuffleIcon />
          Shuffle
        </button>
      </div>
    </>
  );
}
