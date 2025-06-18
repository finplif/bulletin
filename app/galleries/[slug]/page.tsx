// @ts-expect-error – Vercel/Next.js injects this
import type { PageProps } from './$types';

import { getExhibitions, getGalleries } from '../../utils';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

function formatTimeTo12Hour(time: string | undefined): string {
  if (!time || !time.includes(':')) return '';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return '';
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
  const galleries = await getGalleries();
  return galleries.map(g => ({ slug: g.slug }));
}

export default async function Page({ params }: PageProps) {
  const [galleries, exhibitions] = await Promise.all([getGalleries(), getExhibitions()]);
  const gallery = galleries.find(g => g.slug === params.slug);

  if (!gallery) return notFound();

  const matching = exhibitions
    .filter(e => e.gallery?.name === gallery.name)
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
        <Link href="/galleries" className="text-sm underline text-gray-600 block mb-6">
          ← all galleries
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{gallery.name}</h1>
        <div className="text-sm text-gray-700 mb-6 space-y-2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div>
            <h3 className="text-xs uppercase text-gray-500 tracking-wide">address</h3>
            <p>{gallery.address}</p>
          </div>

          <div className="border-t pt-2">
            <h3 className="text-xs uppercase text-gray-500 tracking-wide">neighborhood</h3>
            <p>{gallery.hood}</p>
          </div>

          {gallery.working_hours && (
            <div className="border-t pt-2">
              <h3 className="text-xs uppercase text-gray-500 tracking-wide">hours</h3>
              <ul className="space-y-1">
                {gallery.working_hours.split('\n').map((line, i) => (
                  <li key={i} className="flex items-start">
                    {i % 2 === 0 ? <span className="mr-1">•</span> : <span className="mr-1 w-4" />}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">upcoming</h2>
            <ul className="space-y-6">
              {upcoming.map((exh, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="text-sm text-gray-500 mb-1">
                    🕰 {formatTimeTo12Hour(exh.time_start)} – {formatTimeTo12Hour(exh.time_end)}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{exh.title}</h3>
                  <p className="text-sm text-gray-600">{formatDate(exh.date)}</p>
                  {exh.types && exh.types.length > 0 && (
                    <p>🌞 {exh.types.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">{exh.descr}</p>
                  {exh.link && (
                    <a
                      href={exh.link}
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
                {past.map((exh, index) => (
                  <li key={index} className="border-b pb-3">
                    <p className="text-sm text-gray-500 mb-0.5">
                      {exh.date} — {exh.title}
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
