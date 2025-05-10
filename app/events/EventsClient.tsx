'use client';

import { useState } from 'react';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

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

function Events({ allEvents }: { allEvents: EventItem[] }) {
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showHoodFilters, setShowHoodFilters] = useState(false);
  const [showTypeFilters, setShowTypeFilters] = useState(false);

  const hoods = Array.from(new Set(allEvents.map((e) => e.hood))).sort();
  const types = Array.from(new Set(allEvents.map((e) => e.type))).sort();

  const toggleItem = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const filteredEvents = allEvents.filter((e) => {
    const hoodMatch = selectedHoods.length === 0 || selectedHoods.includes(e.hood);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(e.type);
    return hoodMatch && typeMatch;
  });

  const groupedByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = formatDate(event.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Events</h1>

      <div className="space-y-6 mb-10">
        <div>
          <button
            onClick={() => setShowHoodFilters(!showHoodFilters)}
            className="`px-3 py-1.5 rounded-full text-sm border transition"
          >
            {showHoodFilters ? 'Hide' : 'Filter by Hood'}
          </button>
          {showHoodFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              {hoods.map((h) => (
                <button
                  key={h}
                  onClick={() => toggleItem(h, selectedHoods, setSelectedHoods)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    selectedHoods.includes(h)
                      ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowTypeFilters(!showTypeFilters)}
            className="text-sm font-medium underline mb-2"
          >
            {showTypeFilters ? 'Hide' : 'Filter by Type'}
          </button>
          {showTypeFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleItem(t, selectedTypes, setSelectedTypes)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    selectedTypes.includes(t)
                      ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedByDate).map(([date, group]) => (
          <section key={date}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-1 text-gray-800">{date}</h2>
            <ul className="divide-y divide-gray-300/30">
              {group.map((event, index) => (
                <li
                  key={index}
                  className="py-5"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    🕒 {event.time_start} – {event.time_end}
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-0.5">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-0.5">
                    📍 {event.venue}, {event.hood}
                  </div>
                  <div className="text-sm text-gray-500 italic mb-1">🎨 {event.type}</div>
                  <p className="text-gray-700 text-sm leading-snug mb-2">{event.descr}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4B6E47] underline text-sm"
                    >
                      More info ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Events;
