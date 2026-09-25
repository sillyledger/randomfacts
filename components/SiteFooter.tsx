import Image from 'next/image';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-[1100px] px-5">
      <div className="border-t border-[rgba(21,23,26,0.1)] py-8">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
              <span className="text-[16px] font-extrabold text-ink">random facts</span>
            </Link>
            <p className="mt-2 text-[14px] text-[#4B4E55]">True, surprising facts, one card at a time.</p>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-7">
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>
        </div>
        <p className="mt-6 text-[13px] text-[#6B6E76]">© 2026 Random Facts</p>
      </div>
    </footer>
  );
}
