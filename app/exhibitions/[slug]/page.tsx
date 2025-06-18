// @ts-expect-error
import type { PageProps } from './$types';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { getExhibitions } from '@/app/utils';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

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
  const exhibitions = await getExhibitions();
  return exhibitions.map(e => ({
    slug: e.slug || slugify(e.title || ''),
  }));
}

const Page = async ({ params }: PageProps) => {
  const exhibitions = await getExhibitions();
  const exhibition = exhibitions.find(e => e.slug === params.slug);

  if (!exhibition) return notFound();

  const gallery = Array.isArray(exhibition.gallery) ? exhibition.gallery[0] : exhibition.gallery;

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <Link href="/exhibitions" className="text-sm underline text-gray-600 block mb-6">
          ← all exhibitions
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{exhibition.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{formatDate(exhibition.date)}</p>

        <div className="text-sm text-gray-500 mb-1">
          🕰 {formatTimeTo12Hour(exhibition.time_start)} – {formatTimeTo12Hour(exhibition.time_end)}
        </div>

        {gallery && (
          <>
            <p>
              🖼️ <Link
                href={`/galleries/${gallery.slug}`}
                className="underline hover:text-black"
              >
                {gallery.name}
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              📍 {gallery.address}, {gallery.hood}
            </p>
          </>
        )}

        {exhibition.types && exhibition.types.length > 0 && (
          <p>🌞 {exhibition.types.join(', ')}</p>
        )}

        <p className="text-gray-800 text-sm mt-6 leading-relaxed whitespace-pre-wrap">{exhibition.descr}</p>

        {exhibition.link && (
          <a
            href={exhibition.link}
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
