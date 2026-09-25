'use client';

import { Toast, useToast } from '@/components/Toast';

// lucide "copy"
function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function CopyEmailButton({ email }: { email: string }) {
  const { toast, showToast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Copied');
    } catch {
      showToast("Couldn't copy");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-chromeBorder text-chromeText transition hover:bg-black/5"
      >
        <CopyIcon />
      </button>
      <Toast message={toast} />
    </>
  );
}
