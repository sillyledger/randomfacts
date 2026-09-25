import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'About · Random Facts',
};

export default function AboutPage() {
  return (
    <PageShell>
      <h1 className="mb-4 text-[27px] font-extrabold leading-tight text-ink">About</h1>
      <p className="max-w-[640px] text-[15.5px] leading-[1.55] text-muted">
        Random Facts is a small collection of true, surprising facts, each with the story behind it. Swipe through,
        learn something, share the ones that surprise you.
      </p>
    </PageShell>
  );
}
