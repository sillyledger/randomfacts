'use client';

import { Toast, useToast } from '@/components/Toast';
import type { Fact } from '@/types/fact';

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ShareButton({ fact, accent }: { fact: Fact; accent: string }) {
  const { toast, showToast } = useToast();

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${fact.title} — ${fact.explain}\n${url}`);
      showToast('Copied');
    } catch {
      showToast("Couldn't copy");
    }
  };

  const share = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const url = `${window.location.origin}/`;

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: fact.title, text: fact.explain, url });
      } catch (error) {
        // Dismissing the share sheet is not a failure; anything else falls back to copying.
        if ((error as DOMException).name !== 'AbortError') await copyToClipboard(url);
      }
      return;
    }

    await copyToClipboard(url);
  };

  return (
    <>
      <button
        type="button"
        onClick={share}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label="Share this fact"
        className="flex h-14 w-14 items-center justify-center rounded-full text-ink transition hover:brightness-95"
        style={{ backgroundColor: `${accent}26` }}
      >
        <ShareIcon />
      </button>
      <Toast message={toast} />
    </>
  );
}
