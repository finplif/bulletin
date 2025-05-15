// @ts-expect-error – Vercel auto-generates this
import type { PageProps } from './$types';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { getEvents } from '../../../utils';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

interface EventItem {
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  hood: string;
  venue: string;
  type: string;
  descr: string;
  link: string;
  slug?: string;
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

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug || slugify(e.title) }));
}

const Page = async ({ params }: PageProps) => {
  const events: EventItem[] = await getEvents();
  const event = events.find((e) => (e.slug || slugify(e.title)) === params.slug);

  if (!event) return notFound();

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <Link href="/events" className="text-sm underline text-gray-600 block mb-6">
          ← Back to all events
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{event.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{formatDate(event.date)}</p>

        <div className="space-y-2 text-sm">
          <p>🕒 {event.time_start} – {event.time_end}</p>
          <p>📍 {event.venue}, {event.hood}</p>
          <p>🎨 {event.type}</p>
        </div>

        <p className="text-gray-800 text-sm mt-6 leading-relaxed whitespace-pre-wrap">{event.descr}</p>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 underline text-[#4B6E47] text-sm"
          >
            More info ↗
          </a>
        )}
      </div>
    </main>
  );
};

export default Page;
