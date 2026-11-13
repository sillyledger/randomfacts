'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import type { Category, Fact } from '@/types/fact';
import { FactCard, type CardMove } from '@/components/FactCard';
import { ProgressRing } from '@/components/ProgressRing';
import { shuffle } from '@/lib/shuffle';
import { decodeSeen, recordSeenInCookie } from '@/lib/seen';

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

// lucide "arrow-left"
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function FilterChip({ category, className = 'mb-6 self-start' }: { category: Category; className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`Clear ${category} filter`}
      className={`${className} inline-flex min-w-0 items-center gap-1.5 rounded-full border border-chromeBorder bg-white/60 py-1.5 pl-3 pr-2.5 text-[13px] font-semibold text-chromeText transition hover:bg-white`}
    >
      <span className="truncate">Showing: {category}</span>
      <span aria-hidden className="text-base leading-none text-chromeText/60">
        ×
      </span>
    </Link>
  );
}

// A fresh order for the next pass, never starting on the card just shown.
function reshuffle(facts: Fact[], lastId: string): Fact[] {
  const order = shuffle(facts);
  if (order.length > 1 && order[0].id === lastId) {
    const swapWith = 1 + Math.floor(Math.random() * (order.length - 1));
    [order[0], order[swapWith]] = [order[swapWith], order[0]];
  }
  return order;
}

// `facts` arrives already shuffled; the position in this order doubles as the history. `step` keys the card, so each
// move swaps in a new card, and `move` tells the cards how to animate it.
type Deck = { order: Fact[]; position: number; step: number; move: CardMove };

function stepBack(deck: Deck): Deck {
  return deck.position > 0 ? { ...deck, position: deck.position - 1, step: deck.step + 1, move: 'back' } : deck;
}

function stepForward(deck: Deck, side: 'left' | 'right'): Deck {
  if (deck.order.length <= 1) return deck;
  const moved = { step: deck.step + 1, move: side };
  if (deck.position < deck.order.length - 1) return { ...deck, ...moved, position: deck.position + 1 };
  return { ...moved, order: reshuffle(deck.order, deck.order[deck.position].id), position: 0 };
}

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input, textarea, select, [contenteditable="true"], #site-menu');
}

export function FactDeck({
  facts,
  category,
  initialSeen,
}: {
  facts: Fact[];
  category?: Category;
  initialSeen: string;
}) {
  const [deck, setDeck] = useState<Deck>(() => ({ order: facts, position: 0, step: 0, move: 'left' }));
  const fact = deck.order[deck.position];
  const total = deck.order.length;
  const canGoBack = deck.position > 0;

  const goBack = useCallback(() => setDeck(stepBack), []);
  const goForward = useCallback(() => setDeck((current) => stepForward(current, 'left')), []);
  // Any swipe goes on to the next fact; the old card flies off the side it was dragged to.
  const swipe = useCallback((side: 'left' | 'right') => setDeck((current) => stepForward(current, side)), []);

  const serverSeen = useMemo(() => decodeSeen(initialSeen), [initialSeen]);
  const factNum = fact?.num;
  useEffect(() => {
    if (factNum !== undefined) recordSeenInCookie(factNum, facts.map((scopeFact) => scopeFact.num), serverSeen);
  }, [factNum, facts, serverSeen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (isTypingTarget(event.target) || document.getElementById('site-menu')) return;

      if (event.key === ' ') {
        // Let Space activate a focused button or link as usual.
        if (event.target instanceof HTMLElement && event.target.closest('button, a, [role="button"]')) return;
        event.preventDefault();
        goForward();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goForward();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goForward, goBack]);

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
      {/* On phones the filter chip shares the progress row, leaving the card more height; desktop stacks them. */}
      <div className="mb-3 flex items-center justify-between gap-3 md:contents">
        <div className={`${category ? 'md:mb-4' : 'md:mb-8'} flex h-10 shrink-0 items-center gap-2`}>
          <ProgressRing progress={(deck.position + 1) / total} />
          <span className="text-sm font-semibold text-chromeText">
            {String(deck.position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {category && <FilterChip category={category} className="md:mb-6 md:self-start" />}
      </div>

      {/* On phones the card takes the height left between the progress row and the buttons. */}
      <div className="mt-2 max-md:relative max-md:max-h-[460px] max-md:min-h-[340px] max-md:flex-1">
        {/* The stage the cards animate on: 460px on desktop, the whole slot on phones. On phones it is also a size
            container, so a short card tightens its padding, icons and type. (It's absolutely positioned because Chrome
            evaluates container queries on a flex-grown container against the wrong size.) */}
        <div className="relative h-[460px] max-md:absolute max-md:inset-0 max-md:h-auto max-md:[container-type:size]">
          <div className="absolute inset-x-4 -top-4 h-full rounded-[28px] bg-ghostFar" aria-hidden />
          <div className="absolute inset-x-2 -top-2 h-full rounded-[28px] bg-ghostNear" aria-hidden />
          <AnimatePresence initial={false} custom={deck.move}>
            <FactCard key={deck.step} fact={fact} onSwipe={total > 1 ? swipe : undefined} />
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex gap-3 max-md:pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:mt-8">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-chromeBorder py-3.5 text-sm font-semibold text-chromeText transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={total <= 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShuffleIcon />
          Surprise me
        </button>
      </div>
    </>
  );
}
