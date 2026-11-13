'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Fact } from '@/types/fact';
import { categoryTokens } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';
import { ShareButton } from './ShareButton';

export type CardEntrance = 'forward' | 'back';

const entranceClass: Record<CardEntrance, string> = {
  forward: 'animate-card-in-forward motion-reduce:animate-card-fade',
  back: 'animate-card-in-back motion-reduce:animate-card-fade',
};

// Swipe tuning. Distances in px, velocity in px/ms.
const DRAG_SLOP = 10;
const SWIPE_DISTANCE = 80;
const FLICK_VELOCITY = 0.5;
const FLICK_MIN_DISTANCE = 24;
const VELOCITY_WINDOW_MS = 100;
const MAX_ROTATION_DEG = 8;
const EXIT_MS = 180;
const SNAP_BACK = 'transform 200ms ease-out';

type Gesture = {
  pointerId: number;
  startX: number;
  startY: number;
  horizontal: boolean;
  samples: { x: number; t: number }[];
};

export function FactCard({
  fact,
  entrance,
  onSwipeLeft,
  onSwipeRight,
}: {
  fact: Fact;
  entrance?: CardEntrance | null;
  // Omit a handler to disable that direction; the card then only rubber-bands.
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const tokens = categoryTokens[fact.category];
  const cardRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const leaving = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();
  // A drag must not end in a click on whatever is under the finger (e.g. the share button).
  const suppressClicksUntil = useRef(0);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  const moveCard = (offset: number, transition = 'none') => {
    const card = cardRef.current;
    if (!card) return;
    const rotation = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, offset * 0.04));
    card.style.transition = transition;
    card.style.transform = offset ? `translateX(${offset}px) rotate(${rotation}deg)` : '';
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Swipes are a touch gesture; a mouse drag keeps selecting text as before.
    if (event.pointerType === 'mouse' || !event.isPrimary || leaving.current) return;
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      horizontal: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;

    if (!current.horizontal) {
      if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return;
      // Mostly vertical: leave it to page scrolling (touch-action: pan-y).
      if (Math.abs(dx) <= Math.abs(dy)) {
        gesture.current = null;
        return;
      }
      current.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      // Grabbing the card mid-entrance: jump to its resting place so the drag starts from there.
      event.currentTarget.getAnimations().forEach((animation) => animation.finish());
    }

    current.samples.push({ x: event.clientX, t: event.timeStamp });
    while (current.samples.length > 2 && event.timeStamp - current.samples[0].t > VELOCITY_WINDOW_MS) {
      current.samples.shift();
    }

    const allowed = dx < 0 ? onSwipeLeft : onSwipeRight;
    moveCard(allowed ? dx : dx * 0.25);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (!current.horizontal) return;

    suppressClicksUntil.current = event.timeStamp + 400;
    const dx = event.clientX - current.startX;
    const oldest = current.samples[0];
    const velocity = (event.clientX - oldest.x) / Math.max(1, event.timeStamp - oldest.t);
    const flick =
      Math.abs(velocity) >= FLICK_VELOCITY && Math.abs(dx) >= FLICK_MIN_DISTANCE && Math.sign(velocity) === Math.sign(dx);
    const complete = dx < 0 ? onSwipeLeft : onSwipeRight;

    if (!complete || (Math.abs(dx) < SWIPE_DISTANCE && !flick)) {
      moveCard(0, SNAP_BACK);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      complete();
      return;
    }
    leaving.current = true;
    moveCard(Math.sign(dx) * window.innerWidth, `transform ${EXIT_MS}ms ease-in`);
    exitTimer.current = setTimeout(complete, EXIT_MS);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (current.horizontal) moveCard(0, SNAP_BACK);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.timeStamp < suppressClicksUntil.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // On phones the card fills the slot the deck leaves it (340 to 460px tall) and is a size container, so a short card
  // tightens its padding, icons and type. It's absolutely positioned because Chrome evaluates container queries on a
  // flex-grown container against the wrong size. Desktop has no container, so the @container rules never apply there.
  return (
    <div className="relative max-md:absolute max-md:inset-0 max-md:[container-type:size]">
      <div
        className="absolute inset-x-4 -top-4 h-full rounded-[28px] bg-ghostFar"
        aria-hidden
      />
      <div
        className="absolute inset-x-2 -top-2 h-full rounded-[28px] bg-ghostNear"
        aria-hidden
      />

      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
        className={`relative flex h-[460px] touch-pan-y flex-col rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-md:h-full [@container(max-height:419px)]:p-5 ${entrance ? entranceClass[entrance] : ''}`}
        style={{ backgroundColor: tokens.bg }}
      >
        <div className="flex items-start justify-between">
          <Image src="/logo.svg" alt="Random Facts" width={34} height={34} className="h-[34px] w-[34px]" />
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full [@container(max-height:419px)]:h-12 [@container(max-height:419px)]:w-12"
            style={{ backgroundColor: tokens.accent }}
          >
            <CategoryIcon category={fact.category} className="h-6 w-6" />
          </div>
        </div>

        {/* Text is centred between the header and the bottom; on phones the bottom spacer never gets shorter than the
            share button plus 8px, so long facts move up rather than run under the button. */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1" aria-hidden />
          <div className="flex flex-col gap-3">
            {/* Muted ink rather than the accent: several accents (Animals, Earth, Language) are too faint on their own card colour. */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] font-semibold uppercase leading-none tracking-[0.14em] text-muted">{fact.category}</p>
              <h2 className="text-[27px] font-extrabold max-[359px]:text-[23px] [@container(min-height:380px)_and_(max-height:419px)]:text-[23px] [@container(max-height:379px)]:text-[22px] leading-tight text-ink break-words">
                {fact.title}
              </h2>
            </div>
            <p className="text-[15.5px] leading-[1.55] text-muted break-words [@container(max-height:379px)]:text-[14.5px]">{fact.explain}</p>
          </div>
          <div className="flex-1 max-md:min-h-16 [@container(max-height:419px)]:min-h-14" aria-hidden />
        </div>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 text-black/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" />
        </svg>

        <div className="absolute bottom-6 right-6 [@container(max-height:419px)]:bottom-5 [@container(max-height:419px)]:right-5">
          <ShareButton fact={fact} accent={tokens.accent} className="h-14 w-14 [@container(max-height:419px)]:h-12 [@container(max-height:419px)]:w-12" />
        </div>
      </div>
    </div>
  );
}
