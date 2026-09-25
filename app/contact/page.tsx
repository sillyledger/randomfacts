import type { Metadata } from 'next';
import Image from 'next/image';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Contact · Random Facts',
};

const EMAIL = 'jm@onpointvc.com';

// lucide "mail"
function MailIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-[640px] rounded-[28px] bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] max-[359px]:p-5">
        <div className="flex items-start justify-between">
          <Image src="/logo.svg" alt="" width={34} height={34} className="h-[34px] w-[34px]" />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5270F0] text-white">
            <MailIcon className="h-6 w-6" />
          </div>
        </div>

        <h1 className="mt-16 text-[32px] font-extrabold leading-tight text-ink">Contact</h1>
        <p className="mt-3 text-[15.5px] leading-[1.55] text-muted">
          Know a fact we should add, spotted a mistake, or just want to say hi? Send it over.
        </p>

        <div className="mt-10 flex items-center gap-3 max-[359px]:gap-2">
          <a
            href={`mailto:${EMAIL}`}
            className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand/90 max-[359px]:gap-1.5 max-[359px]:px-3"
          >
            <MailIcon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{EMAIL}</span>
          </a>
          <CopyEmailButton email={EMAIL} />
        </div>
      </section>
    </PageShell>
  );
}
