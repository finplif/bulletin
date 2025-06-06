// @ts-expect-error
import type { PageProps } from './$types';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { getEvents } from '../../utils';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function formatTimeTo12Hour(time: string | undefined): string {
  if (!time || !time.includes(':')) return ''; // handle invalid or missing time

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return ''; // ensure numbers

  const isPM = hour >= 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute === 0 ? '' : `:${minuteStr}`;
  const suffix = isPM ? 'PM' : 'AM';

  return `${formattedHour}${formattedMinute}${suffix}`;
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(e => ({
    slug: e.slug || slugify(e.title || '')
  }));
}

const Page = async ({ params }: PageProps) => {
  const events = await getEvents();
  const event = events.find(e => e.slug === params.slug);

  if (!event) return notFound();

  const venue = Array.isArray(event.venue) ? event.venue[0] : event.venue;

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <Link href="/events" className="text-sm underline text-gray-600 block mb-6">
          ← all events
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{event.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{formatDate(event.date)}</p>

        <div className="text-sm text-gray-500 mb-1">
          🕰 {formatTimeTo12Hour(event.time_start)} – {formatTimeTo12Hour(event.time_end)}
        </div>
        
        {venue && (
          <>
            <p>
              ☂️ <Link
                href={`/venues/${venue.slug}`}
                className="underline hover:text-black"
              >
                {venue.name}
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              🔖 {venue.address}, {venue.hood}
            </p>
          </>
        )}
        
        {event.types && event.types.length > 0 && (
          <p>🌞 {event.types.join(', ')}</p>
        )}

        <p className="text-gray-800 text-sm mt-6 leading-relaxed whitespace-pre-wrap">{event.descr}</p>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 underline text-[#4B6E47] text-sm"
          >
            more info ↗
          </a>
        )}
      </div>
    </main>
  );
};

export default Page;
