import Image from 'next/image';
import type { Fact } from '@/types/fact';
import { categoryTokens } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';
import { ShareButton } from './ShareButton';

export function FactCard({ fact }: { fact: Fact }) {
  const tokens = categoryTokens[fact.category];

  return (
    <div className="relative">
      <div
        className="absolute inset-x-4 -top-4 h-full rounded-[28px] bg-ghostFar"
        aria-hidden
      />
      <div
        className="absolute inset-x-2 -top-2 h-full rounded-[28px] bg-ghostNear"
        aria-hidden
      />

      <div
        className="relative flex h-[460px] flex-col rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
        style={{ backgroundColor: tokens.bg }}
      >
        <div className="flex items-start justify-between">
          <Image src="/logo.svg" alt="Random Facts" width={34} height={34} className="h-[34px] w-[34px]" />
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: tokens.accent }}
          >
            <CategoryIcon category={fact.category} className="h-6 w-6" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3">
          <h2 className="text-[27px] font-extrabold leading-tight text-ink">{fact.title}</h2>
          <p className="text-[15.5px] leading-[1.55] text-muted">{fact.explain}</p>
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

        <div className="absolute bottom-6 right-6">
          <ShareButton fact={fact} accent={tokens.accent} />
        </div>
      </div>
    </div>
  );
}
