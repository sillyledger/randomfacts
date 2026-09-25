'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const showToast = (message: string) => {
    clearTimeout(timeoutRef.current);
    setToast(message);
    timeoutRef.current = setTimeout(() => setToast(null), 2000);
  };

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
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center transition-opacity duration-200 ${toast ? 'opacity-100' : 'opacity-0'}`}
      >
        {toast && (
          <span className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white shadow-lg">{toast}</span>
        )}
      </div>
    </>
  );
}
