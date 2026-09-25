'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`text-[15px] font-semibold transition hover:text-brand ${active ? 'text-brand' : 'text-chromeText'}`}
    >
      {children}
    </Link>
  );
}
