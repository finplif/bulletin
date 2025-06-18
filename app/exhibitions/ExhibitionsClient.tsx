'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export interface ExhibitionItem {
  id: number;
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  types: string[];
  descr: string;
  link: string;
  slug: string;
  gallery: {
    name: string;
    address: string;
    hood: string;
  };
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
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ExhibitionsClient({ allExhibitions }: { allExhibitions: ExhibitionItem[] }) {
  const now = new Date();
  const futureExhibitions = allExhibitions.filter(e => new Date(`${e.date}T23:59:59`) >= now);

  const groupedByDate = futureExhibitions.reduce((acc, exhibition) => {
    const dateKey = exhibition.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(exhibition);
    return acc;
  }, {} as Record<string, ExhibitionItem[]>);

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 text-[#1F1F1F] ${dmSans.className}`}>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Exhibitions</h1>

      <div className="space-y-12">
        {Object.entries(groupedByDate)
          .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([date, group]) => {
            const sortedGroup = group.sort((a, b) => {
              const [aHour, aMinute] = a.time_start.split(':').map(Number);
              const [bHour, bMinute] = b.time_start.split(':').map(Number);
              return aHour * 60 + aMinute - (bHour * 60 + bMinute);
            });

            return (
              <section key={date}>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-1 text-gray-800">{formatDate(date)}</h2>
                <ul className="divide-y divide-gray-300/30">
                  {sortedGroup.map((exhibition, index) => (
                    <li key={index} className="py-5">
                      <div className="text-sm text-gray-500 mb-1">
                        🕰 {formatTimeTo12Hour(exhibition.time_start)} – {formatTimeTo12Hour(exhibition.time_end)}
                      </div>
                      <Link
                        href={`/exhibitions/${exhibition.slug}`}
                        className="text-lg font-medium text-gray-900 mb-0.5 hover:underline"
                      >
                        {exhibition.title}
                      </Link>
                      {exhibition.gallery && (
                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <span>🖼️</span>
                          {exhibition.gallery.name}, {exhibition.gallery.hood}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 italic mb-1">
                        🌞 {exhibition.types?.join(', ')}
                      </div>
                      <p className="text-gray-700 text-sm leading-snug mb-2">{exhibition.descr}</p>
                      {exhibition.link && (
                        <a
                          href={exhibition.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4B6E47] underline text-sm"
                        >
                          more info ↗
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
      </div>
    </main>
  );
}
