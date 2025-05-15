'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 mb-10">
      <nav className="max-w-4xl mx-auto flex items-center gap-6">
        <Link
          href="/events"
          className={`text-sm font-medium hover:underline ${
            pathname === '/events' ? 'text-black' : 'text-gray-600'
          }`}
        >
          Events
        </Link>
        <Link
          href="/venues"
          className={`text-sm font-medium hover:underline ${
            pathname === '/venues' ? 'text-black' : 'text-gray-600'
          }`}
        >
          Venues
        </Link>
      </nav>
    </header>
  );
}
