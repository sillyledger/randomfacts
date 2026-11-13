'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useDragControls,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
  type Transition,
  type Variants,
} from 'framer-motion';
import type { Fact } from '@/types/fact';
import { categoryTokens } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';
import { ShareButton } from './ShareButton';

// 1 = next: the card leaves to the left and the new one comes in from the right. -1 = back, mirrored.
export type SwipeDirection = 1 | -1;

const SWIPE_DISTANCE = 80; // px of finger travel that completes a swipe
const SWIPE_VELOCITY = 500; // px/s, a flick that completes a swipe
const FLY_DISTANCE = 360; // px a card travels when leaving or arriving; it fades on the way
const MAX_ROTATION_DEG = 8; // reached 200px from centre
const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const;

// The same spring moves the card for swipes, Back, Surprise me and the arrow keys, in both directions.
const slide: Variants = {
  enter: (direction: SwipeDirection) => ({ x: direction * FLY_DISTANCE, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: SwipeDirection) => ({ x: -direction * FLY_DISTANCE, opacity: 0 }),
};
const slideTransition: Transition = { x: SPRING, opacity: { duration: 0.2 } };
const fade: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };
const fadeTransition: Transition = { duration: 0.15 };

// A tap on the share button right after a drag is the end of that drag, not a share.
const CLICK_GUARD_MS = 400;

// Render inside <AnimatePresence custom={direction}> with a new key per fact, so the old card can leave as the new
// one arrives. The card fills its positioned parent.
export function FactCard({
  fact,
  direction,
  onSwipeLeft,
  onSwipeRight,
}: {
  fact: Fact;
  direction: SwipeDirection;
  // A completed swipe always calls its handler, and the card flies off the way the finger went. The handlers are only
  // left out when the deck has a single fact, so there is nothing to move to.
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const tokens = categoryTokens[fact.category];
  const reduceMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-MAX_ROTATION_DEG, MAX_ROTATION_DEG]);
  const dragging = useRef(false);
  const dragEndedAt = useRef(-Infinity);

  const startDrag = (event: React.PointerEvent) => {
    // Swipes are a touch gesture; a mouse drag keeps selecting text as before. A leaving card can't be grabbed.
    if (event.pointerType === 'mouse' || !event.isPrimary || !isPresent) return;
    dragControls.start(event);
  };

  const handleDragEnd = (_event: unknown, { offset, velocity }: PanInfo) => {
    dragging.current = false;
    dragEndedAt.current = performance.now();
    const navigate =
      offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY
        ? onSwipeLeft
        : offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY
          ? onSwipeRight
          : undefined;
    // A short, slow drag (or a one-fact deck): dragConstraints and dragTransition spring the card back to 0.
    if (!navigate) return;
    // Cancel that spring-back so the exit continues from where the finger let go.
    x.stop();
    navigate();
  };

  const guardClick = (event: React.MouseEvent) => {
    if (dragging.current || performance.now() - dragEndedAt.current < CLICK_GUARD_MS) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <motion.div
      custom={direction}
      variants={reduceMotion ? fade : slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={reduceMotion ? fadeTransition : slideTransition}
      drag="x"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: SPRING.stiffness, bounceDamping: SPRING.damping }}
      onPointerDown={startDrag}
      onDragStart={() => {
        dragging.current = true;
      }}
      onDragEnd={handleDragEnd}
      onClickCapture={guardClick}
      className={`absolute inset-0 flex touch-none flex-col rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] [@container(max-height:419px)]:p-5 ${isPresent ? '' : 'pointer-events-none'}`}
      style={{ x, rotate, backgroundColor: tokens.bg }}
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
    </motion.div>
  );
}
