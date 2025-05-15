import { getEvents } from '../../../utils';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

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
  const events = await getEvents();
  const venues = Array.from(new Set(events.map((e) => e.venue)));
  return venues.map((venue) => ({
    slug: slugify(venue),
  }));
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page(props: any) {
  const { params } = props;
  const events = await getEvents();
  const matching = events.filter(
    (e) => slugify(e.venue) === params.slug
  );

  if (matching.length === 0) return notFound();

  const now = new Date();
  const upcoming = matching.filter((e) => new Date(e.date) >= now);
  const past = matching.filter((e) => new Date(e.date) < now);
  const venueName = matching[0].venue;

  return (
    <main
      className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/events"
          className="text-sm underline text-gray-600 block mb-6"
        >
          ← Back to all events
        </Link>

        <h1 className="text-3xl font-bold mb-6 tracking-tight">{venueName}</h1>

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <ul className="space-y-6">
              {upcoming.map((event, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="text-sm text-gray-500 mb-1">
                    🕒 {event.time_start} – {event.time_end}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    🎨 {event.type}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{event.descr}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#4B6E47] underline mt-2 block"
                    >
                      More info ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Past Events</h2>
            <ul className="space-y-4">
              {past.map((event, index) => (
                <li key={index} className="border-b pb-3">
                  <p className="text-sm text-gray-500 mb-0.5">
                    {formatDate(event.date)} — {event.title}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
