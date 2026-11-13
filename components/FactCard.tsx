'use client';

import { useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  motion,
  useIsPresent,
  useMotionValue,
  usePresenceData,
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

// How the deck last moved: on to the next fact with the old card flying off left or right, or back one fact.
export type CardMove = 'left' | 'right' | 'back';

const SWIPE_DISTANCE = 50; // px the card must be dragged, either way, to go to the next fact
const FLY_DISTANCE = 360; // px a card travels when flying off; it fades on the way
const STACK_SCALE = 0.94; // a card rising from, or dropping back into, the stack behind
const MAX_ROTATION_DEG = 8; // reached 200px from centre
const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const;

// Next: the old card flies off the way it was dragged and the new one rises from the stack behind it.
// Back: the previous card returns from the left and the current one drops back into the stack.
const cards: Variants = {
  enter: (move: CardMove) => (move === 'back' ? { x: -FLY_DISTANCE, opacity: 0, scale: 1 } : { x: 0, opacity: 0, scale: STACK_SCALE }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (move: CardMove) =>
    move === 'back' ? { opacity: 0, scale: STACK_SCALE } : { x: move === 'left' ? -FLY_DISTANCE : FLY_DISTANCE, opacity: 0 },
};
const cardTransition: Transition = { x: SPRING, scale: SPRING, opacity: { duration: 0.2 } };
const fade: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };
const fadeTransition: Transition = { duration: 0.15 };

// A tap on the share button right after a drag is the end of that drag, not a share.
const CLICK_GUARD_MS = 400;

// Swiping is for touch screens; with a mouse the card stays put and its text can be selected.
const COARSE_POINTER = '(pointer: coarse)';
function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(COARSE_POINTER);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
function useTouchScreen() {
  return useSyncExternalStore(subscribeToPointer, () => window.matchMedia(COARSE_POINTER).matches, () => false);
}

// Render inside <AnimatePresence custom={move}> with a new key per fact, so the old card can leave as the new one
// arrives. The card fills its positioned parent.
export function FactCard({
  fact,
  onSwipe,
}: {
  fact: Fact;
  // Called when the card is dragged more than 50px to either side. Left out when the deck has a single fact.
  onSwipe?: (side: 'left' | 'right') => void;
}) {
  const tokens = categoryTokens[fact.category];
  const reduceMotion = useReducedMotion();
  const touchScreen = useTouchScreen();
  const isPresent = useIsPresent();
  const move: CardMove = usePresenceData();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-MAX_ROTATION_DEG, MAX_ROTATION_DEG]);
  const dragging = useRef(false);
  const dragEndedAt = useRef(-Infinity);

  const handleDragEnd = (_event: unknown, { offset }: PanInfo) => {
    dragging.current = false;
    dragEndedAt.current = performance.now();
    // Not far enough (or a one-fact deck): dragConstraints and dragTransition spring the card back to 0.
    if (!onSwipe || Math.abs(offset.x) <= SWIPE_DISTANCE) return;
    // Cancel that spring-back so the card flies off from where the finger let go.
    x.stop();
    onSwipe(offset.x < 0 ? 'left' : 'right');
  };

  const guardClick = (event: React.MouseEvent) => {
    if (dragging.current || performance.now() - dragEndedAt.current < CLICK_GUARD_MS) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // !touch-none: Framer sets touch-action: pan-y inline for an x drag; the card must own the whole touch so Safari
  // never scrolls the page mid-swipe. A card flying off stays above the one rising behind it and can't be grabbed.
  return (
    <motion.div
      custom={move}
      variants={reduceMotion ? fade : cards}
      initial="enter"
      animate="center"
      exit="exit"
      transition={reduceMotion ? fadeTransition : cardTransition}
      drag={touchScreen && isPresent ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: SPRING.stiffness, bounceDamping: SPRING.damping }}
      onDragStart={() => {
        dragging.current = true;
      }}
      onDragEnd={handleDragEnd}
      onClickCapture={guardClick}
      className={`absolute inset-0 flex !touch-none flex-col rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] [@container(max-height:419px)]:p-5 ${isPresent ? '' : `pointer-events-none ${move === 'back' ? '' : 'z-10'}`}`}
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
