'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';

const links = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <header className="w-full pb-6 pt-8">
      <div ref={containerRef} className="relative mx-auto max-w-[1100px] px-5">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="text-[18px] font-extrabold text-ink">random facts</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-chromeBorder text-chromeText transition hover:bg-black/5 md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </nav>

        {open && (
          <div
            id="site-menu"
            className="absolute inset-x-5 top-full z-20 mt-3 rounded-[20px] bg-white p-2 shadow-[0_12px_32px_rgba(21,23,26,0.14)] md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-ink transition hover:bg-black/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
