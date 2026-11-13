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

// Swipe tuning. Distances in px, velocity in px/ms, durations in ms.
const TAP_SLOP = 8; // total movement below this is a tap, not a drag
const SWIPE_DISTANCE = 80;
const FLICK_VELOCITY = 0.5;
const FLICK_MIN_DISTANCE = 24;
const VELOCITY_WINDOW_MS = 100;
const MAX_ROTATION_DEG = 8;
const RESISTANCE = 0.25; // how far the card follows toward a fact that doesn't exist (e.g. back from the first)
const EXIT_MIN_MS = 120;
const EXIT_MAX_MS = 220;
const SPRING_MS = 320;
const SPRING_BACK = `transform ${SPRING_MS}ms cubic-bezier(0.3, 1.35, 0.5, 1)`;
const SPRING_BACK_REDUCED = 'transform 150ms ease-out';

type Gesture = {
  pointerId: number;
  // Where the finger started, for telling taps from drags and horizontal from vertical.
  originX: number;
  originY: number;
  // Finger x at which the card would sit at offset 0; differs from originX when grabbing a card mid-animation.
  zeroX: number;
  offset: number;
  dragging: boolean;
  samples: { x: number; t: number }[];
};

const cardTransform = (offset: number) => {
  const rotation = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, offset * 0.04));
  return `translate3d(${offset}px, 0, 0) rotate(${rotation}deg)`;
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const frame = useRef<number | null>(null);
  const leaving = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();
  const settleTimer = useRef<ReturnType<typeof setTimeout>>();
  // A drag must not end in a click on whatever is under the finger (e.g. the share button).
  const suppressClicksUntil = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    // touch-action: none already stops Safari scrolling from the card; this covers browsers that only honour
    // a cancelled touchmove. Registered natively because React's touch listeners are passive.
    const preventScroll = (event: TouchEvent) => {
      if (gesture.current?.dragging) event.preventDefault();
    };
    card?.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      card?.removeEventListener('touchmove', preventScroll);
      clearTimeout(exitTimer.current);
      clearTimeout(settleTimer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  // Offset for a finger at `dx` from zero: 1:1 toward a fact that exists, resisted toward one that doesn't.
  const follow = (dx: number) => ((dx < 0 ? onSwipeLeft : onSwipeRight) ? dx : dx * RESISTANCE);

  const render = () => {
    frame.current = null;
    const card = cardRef.current;
    if (card && gesture.current) card.style.transform = cardTransform(gesture.current.offset);
  };

  const stopFrame = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  const springBack = (card: HTMLDivElement) => {
    card.style.transition = prefersReducedMotion() ? SPRING_BACK_REDUCED : SPRING_BACK;
    card.style.transform = '';
    settleTimer.current = setTimeout(() => {
      card.style.transition = '';
      card.style.willChange = '';
    }, SPRING_MS);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Swipes are a touch gesture; a mouse drag keeps selecting text as before.
    if (event.pointerType === 'mouse' || !event.isPrimary || leaving.current || gesture.current) return;
    const card = event.currentTarget;

    // Pick the card up where it is, even mid-entrance or mid-spring, so it never jumps under the finger.
    const shownOffset = new DOMMatrixReadOnly(getComputedStyle(card).transform).m41;
    card.getAnimations().forEach((animation) => animation.finish());
    clearTimeout(settleTimer.current);
    const shownFingerOffset = follow(shownOffset) === shownOffset ? shownOffset : shownOffset / RESISTANCE;

    gesture.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      zeroX: event.clientX - shownFingerOffset,
      offset: shownOffset,
      dragging: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
    card.style.transition = 'none';
    card.style.willChange = 'transform';
    card.style.transform = shownOffset ? cardTransform(shownOffset) : '';
    // Capturing now would send a tap's click to the card instead of the share button, so a touch that starts on a
    // control is captured once it turns into a drag.
    if (!(event.target instanceof Element && event.target.closest('button, a'))) card.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;

    if (!current.dragging && Math.hypot(event.clientX - current.originX, event.clientY - current.originY) >= TAP_SLOP) {
      current.dragging = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    }

    current.samples.push({ x: event.clientX, t: event.timeStamp });
    while (current.samples.length > 2 && event.timeStamp - current.samples[0].t > VELOCITY_WINDOW_MS) {
      current.samples.shift();
    }

    // The card follows from the first pixel; the frame callback writes the latest position once per frame.
    current.offset = follow(event.clientX - current.zeroX);
    if (frame.current === null) frame.current = requestAnimationFrame(render);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    stopFrame();
    const card = event.currentTarget;
    if (current.dragging) suppressClicksUntil.current = event.timeStamp + 400;

    const dx = event.clientX - current.zeroX;
    const dy = event.clientY - current.originY;
    const oldest = current.samples[0];
    const velocity = (event.clientX - oldest.x) / Math.max(1, event.timeStamp - oldest.t);
    const flick =
      Math.abs(velocity) >= FLICK_VELOCITY &&
      Math.abs(dx) >= FLICK_MIN_DISTANCE &&
      Math.abs(dx) > Math.abs(dy) &&
      Math.sign(velocity) === Math.sign(dx);
    const complete = dx < 0 ? onSwipeLeft : onSwipeRight;

    if (!current.dragging || !complete || (Math.abs(dx) < SWIPE_DISTANCE && !flick)) {
      springBack(card);
      return;
    }

    if (prefersReducedMotion()) {
      complete();
      return;
    }
    // Fling off screen at roughly the finger's speed, then the deck brings in the next card.
    leaving.current = true;
    const target = Math.sign(dx) * (window.innerWidth + card.offsetWidth / 2);
    const duration = Math.round(
      Math.max(EXIT_MIN_MS, Math.min(EXIT_MAX_MS, Math.abs(target - dx) / Math.max(Math.abs(velocity), 1.5))),
    );
    card.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.7, 0.4, 1)`;
    card.style.transform = cardTransform(target);
    exitTimer.current = setTimeout(complete, duration);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    stopFrame();
    springBack(event.currentTarget);
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
        className={`relative flex h-[460px] touch-none flex-col rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-md:h-full [@container(max-height:419px)]:p-5 ${entrance ? entranceClass[entrance] : ''}`}
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
