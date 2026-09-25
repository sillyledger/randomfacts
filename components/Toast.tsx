'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Short-lived status message, e.g. "Copied". Render <Toast message={toast} /> once per component.
export function useToast(durationMs = 2000) {
  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const showToast = useCallback(
    (message: string) => {
      clearTimeout(timeoutRef.current);
      setToast(message);
      timeoutRef.current = setTimeout(() => setToast(null), durationMs);
    },
    [durationMs],
  );

  return { toast, showToast };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center transition-opacity duration-200 ${message ? 'opacity-100' : 'opacity-0'}`}
    >
      {message && (
        <span className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white shadow-lg">{message}</span>
      )}
    </div>
  );
}
