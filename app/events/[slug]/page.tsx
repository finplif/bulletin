import { notFound } from 'next/navigation';
import { getEvents } from '../../utils';

export const dynamic = 'force-dynamic';

type VenueProps = {
  params: { slug: string }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

interface EventParams {
  slug: string;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug || slugify(e.title) }));
}

export default async function Page({ params }: { params: EventParams }) {
  const events = await getEvents();
  const event = events.find((e) => (e.slug || slugify(e.title)) === params.slug);

  if (!event) return notFound();

  return (
    <main>
      <h1>{event.title}</h1>
      <p>{event.date} — {event.time_start} to {event.time_end}</p>
      <p>{event.venue}</p>
      <p>{event.descr}</p>
    </main>
  );
}
