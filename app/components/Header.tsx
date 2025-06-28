'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `text-sm font-medium hover:underline ${
      pathname === path ? 'text-black' : 'text-gray-600'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 mb-10">
      <nav className="max-w-4xl mx-auto flex items-center gap-6">
        <Link href="/events" className={linkClass('/events')}>events</Link>
        <Link href="/venues" className={linkClass('/venues')}>venues</Link>
        <Link href="/exhibitions" className={linkClass('/exhibitions')}>exhibitions</Link>
        <Link href="/galleries" className={linkClass('/galleries')}>galleries</Link>
        <div className="h-4 border-l border-gray-400 mx-2" />
        <Link href="/about" className={linkClass('/galleries')}>about</Link>
      </nav>
    </header>
  );
}
