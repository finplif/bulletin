import { getEvents } from '../utils';
import Header from '../components/Header';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export const dynamic = 'force-dynamic';

export default async function VenueDirectory() {
  const events = await getEvents();
  const venues = Array.from(new Set(events.map((e) => e.venue))).sort();

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <Header />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Venues</h1>
        <ul className="space-y-3">
          {venues.map((venue) => (
            <li key={venue}>
              <Link
                href={`/venues/${slugify(venue)}`}
                className="text-lg underline text-[#1F1F1F] hover:text-black"
              >
                {venue}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
