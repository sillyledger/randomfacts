import Image from 'next/image';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';

// lucide "arrow-up-right"
function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-[1100px] px-5">
      <div className="border-t border-[rgba(21,23,26,0.1)] py-8">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Random Facts home" width={24} height={24} className="h-6 w-6" />
          </Link>
          <nav aria-label="Footer" className="flex items-center gap-7">
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
        </div>
        <div className="mt-6 flex flex-col items-start gap-2 text-[13px] text-[#6B6E76] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Random Facts</p>
          <a
            href="https://www.onpointvc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 tracking-wide transition hover:text-[#31333A]"
          >
            An Absurdity Index project by OnPoint VC
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
