// @ts-expect-error – Vercel/Next.js injects this
import type { PageProps } from './$types';

import { getEvents } from '../../utils';
import { getVenues } from '../../utils';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  const venues = await getVenues();
  return venues.map(v => ({ slug: v.slug }));
}

export default async function Page({ params }: PageProps) {
  const [venues, events] = await Promise.all([getVenues(), getEvents()]);
  const venue = venues.find(v => v.slug === params.slug);

  if (!venue) return notFound();

  const matching = events.filter(e => e.venue === venue.name);
  const now = new Date();
  const upcoming = matching.filter(e => new Date(e.date) >= now);
  const past = matching.filter(e => new Date(e.date) < now);

return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-3xl mx-auto">
        <Link href="/venues" className="text-sm underline text-gray-600 block mb-6">
          ← all venues
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{venue.name}</h1>
        {venue.address && <p className="text-sm text-gray-600 mb-6">{venue.address}, {venue.hood}</p>}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
          {/* map upcoming */}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Past</h2>
          {/* map past */}
        </section>
      </div>
    </main>
  );
}
