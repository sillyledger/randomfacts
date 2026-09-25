import type { Metadata } from 'next';
import Image from 'next/image';
import { PageShell } from '@/components/PageShell';
import { categories } from '@/lib/categories';
import { getFacts } from '@/lib/facts';

export const metadata: Metadata = {
  title: 'About · Random Facts',
};

// lucide "info"
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

// lucide "arrow-up-right"
function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-[#F3F4F6] p-4 max-sm:rounded-xl max-sm:p-3 max-[359px]:px-2">
      <div className="text-[28px] font-extrabold leading-none text-ink max-sm:text-[22px]">{value}</div>
      <div className="mt-1.5 text-[13px] font-semibold leading-tight text-muted max-sm:text-[12px] max-[359px]:text-[11px]">{label}</div>
    </div>
  );
}

const buttonClass =
  'flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition';

export default function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
        <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-[359px]:p-5">
          <div className="flex items-start justify-between">
            <Image src="/logo.svg" alt="" width={34} height={34} className="h-[34px] w-[34px]" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
              <InfoIcon />
            </div>
          </div>

          <h1 className="mt-16 text-[32px] font-extrabold leading-tight text-ink">About</h1>
          <p className="mt-3 text-[15.5px] leading-[1.55] text-muted">
            Random Facts is a small collection of true, surprising facts, each with the story behind it. Swipe through,
            learn something, share the ones that surprise you.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-sm:gap-2">
            <Stat value={getFacts().length} label="facts" />
            <Stat value={categories.length} label="categories" />
            <Stat value={0} label="ads or sign-ups" />
          </div>
        </section>

        <section className="rounded-[28px] bg-[#1C1D22] p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-[359px]:p-5">
          <span className="inline-block rounded-full border border-[#3A3C44] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A5B4FF]">
            Part of the Absurdity Index
          </span>
          <h2 className="mt-5 text-[27px] font-extrabold leading-tight">Built by OnPoint VC</h2>
          <p className="mt-3 text-[15.5px] leading-[1.55] text-[#B4B7C0]">
            Random Facts is one of the small, slightly ridiculous web projects in the Absurdity Index, a collection built
            and run by OnPoint VC.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.onpointvc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass} bg-brand text-white hover:bg-brand/90`}
            >
              Visit OnPoint VC
              <ArrowUpRightIcon />
            </a>
            <a
              href="https://www.stupidhit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass} border border-white/20 text-white hover:bg-white/10`}
            >
              Also try Stupid Hit
              <ArrowUpRightIcon />
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
