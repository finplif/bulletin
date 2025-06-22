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

  const matching = events
    .filter(e => e.venue?.name === venue.name)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time_start}`);
      const dateB = new Date(`${b.date} ${b.time_start}`);
      return dateA.getTime() - dateB.getTime();
    });

  const now = new Date();
  const upcoming = matching.filter(e => new Date(`${e.date}T${e.time_start}`) >= now);
  const past = matching.filter(e => new Date(`${e.date}T${e.time_start}`) < now);

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <Link href="/venues" className="text-sm underline text-gray-600 block mb-6">
          ← all venues
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{venue.name}</h1>
        <div className="text-sm text-gray-700 mb-6 space-y-2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div>
            <h3 className="text-xs uppercase text-gray-500 tracking-wide">address</h3>
            <p>{venue.address}</p>
          </div>

          <div className="border-t pt-2">
            <h3 className="text-xs uppercase text-gray-500 tracking-wide">neighborhood</h3>
            <p>{venue.hood}</p>
          </div>

          {venue.working_hours && (
            <div className="border-t pt-2">
              <h3 className="text-xs uppercase text-gray-500 tracking-wide">hours</h3>
              <ul className="space-y-1">
                {venue.working_hours.split('\n').map((line, i) => (
                  <li key={i} className="flex items-start">
                    {i % 2 === 0 ? (
                      <span className="mr-1">•</span>
                    ) : (
                      <span className="mr-1 w-4" />
                    )}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {venue.website && (
            <div className="mt-4">
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4B6E47] underline text-sm"
              >
                website link
              </a>
            </div>
          )}
        </div>

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">upcoming</h2>
            <ul className="space-y-6">
              {upcoming.map((event, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="text-sm text-gray-500 mb-1">
                    🕰 {formatTimeTo12Hour(event.time_start)} – {formatTimeTo12Hour(event.time_end)}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                  {event.types && event.types.length > 0 && (
                    <p>🌞 {event.types.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">{event.descr}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#4B6E47] underline mt-2 block"
                    >
                      more info ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <details>
              <summary className="cursor-pointer text-xl font-semibold mb-4 hover:underline">past</summary>
              <ul className="space-y-4 mt-4">
                {past.map((event, index) => (
                  <li key={index} className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-0.5">
                      {event.date} — {event.title}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
