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
  address?: string;
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

function generateGoogleCalendarLink(event: EventItem): string {
  const start = `${event.date}T${event.time_start.replace(':', '')}00`;
  const end = `${event.date}T${event.time_end.replace(':', '')}00`;
  const details = encodeURIComponent(event.descr || '');
  const location = encodeURIComponent(event.address || `${event.venue}`);
  const title = encodeURIComponent(event.title);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

function generateICS(event: EventItem) {
  const pad = (n: number) => String(n).padStart(2, '0');

  const formatDateTime = (date: string, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const [y, m, d] = date.split('-').map(Number);
    return `${y}${pad(m)}${pad(d)}T${pad(hour)}${pad(minute)}00`;
  };

  const start = formatDateTime(event.date, event.time_start);
  const end = formatDateTime(event.date, event.time_end);

  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.descr || ''}`,
    `LOCATION:${event.address || event.venue}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new Blob([content], { type: 'text/calendar;charset=utf-8' });
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
          ← all events
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{event.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{formatDate(event.date)}</p>

        <div className="space-y-2 text-sm">
          <p>🕒 {event.time_start} – {event.time_end}</p>
          📍 <Link
  href={`/venues/${slugify(event.venue)}`}
  className="underline hover:text-black"
>
  {event.venue}
</Link>, {event.hood}
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
            more info ↗
          </a>
        )}

        <a
          href={generateGoogleCalendarLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline text-[#4B6E47]"
          >  
          + add to Google Calendar
        </a>
        <button
          onClick={() => {
            const blob = generateICS(event);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          className="text-sm text-[#4B6E47] underline ml-4"
        >
          + Download for Apple/Outlook
        </button>
      </div>
    </main>
  );
};

export default Page;
