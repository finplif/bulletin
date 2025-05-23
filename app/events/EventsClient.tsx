'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { getEvents } from '../utils';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  types: string[];
  descr: string;
  link: string;
  slug: string;
  venue: {
    name: string;
    address: string;
    hood: string;
  };
}

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
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getWeekday(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getTimeBucket(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute;
  if (totalMinutes < 600) return 'Morning';
  if (totalMinutes < 840) return 'Midday';
  if (totalMinutes < 1080) return 'Afternoon';
  return 'Evening';
}

export default function EventsClient({ allEvents }: { allEvents: EventItem[] }) {
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');

  const hoods = Array.from(new Set(allEvents.map(e => e.venue?.hood ?? ''))).sort();
  const types = Array.from(new Set(allEvents.flatMap(e => e.types ?? []))).sort();
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeRanges = ['Morning', 'Midday', 'Afternoon', 'Evening'];

  const toggleItem = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const clearFilters = () => {
    setSelectedHoods([]);
    setSelectedTypes([]);
    setSelectedWeekdays([]);
    setSelectedTimes([]);
    setStartDate('');
  };

  const now = new Date();
  const futureEvents = allEvents.filter(e => new Date(`${e.date}T23:59:59`) >= now);

  const filteredEvents = futureEvents.filter(e => {
    const hoodMatch = selectedHoods.length === 0 || selectedHoods.includes(e.venue?.hood ?? '');
    const typeMatch = selectedTypes.length === 0 || e.types?.some(type => selectedTypes.includes(type));
    const weekdayMatch = selectedWeekdays.length === 0 || selectedWeekdays.includes(getWeekday(e.date));
    const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(getTimeBucket(e.time_start));
    const dateMatch = !startDate || new Date(e.date).toISOString().split('T')[0] === startDate;
    return hoodMatch && typeMatch && weekdayMatch && timeMatch && dateMatch;
  });

  const groupedByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = event.date; // use ISO for sorting
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  const renderDropdown = (label: string, options: string[], selected: string[], setSelected: (v: string[]) => void) => (
    <div className="relative">
      <button
        className={`px-3 py-1.5 rounded-full text-sm border transition ${
          openDropdown === label ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'
        }`}
        onClick={() => setOpenDropdown(openDropdown === label ? null : label)}
      >
        {label}
      </button>
      {openDropdown === label && (
        <div className="absolute left-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleItem(opt, selected, setSelected)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selected.includes(opt) ? 'bg-gray-100 font-medium' : 'text-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 text-[#1F1F1F] ${dmSans.className}`}>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Events</h1>

      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium">Filter by:</span>
          {renderDropdown('area', hoods, selectedHoods, setSelectedHoods)}
          {renderDropdown('types', types, selectedTypes, setSelectedTypes)}
          {renderDropdown('day', weekdays, selectedWeekdays, setSelectedWeekdays)}
          {renderDropdown('time', timeRanges, selectedTimes, setSelectedTimes)}
          <label htmlFor="start-date" className="text-sm text-gray-700">date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-800"
          />
         {(selectedHoods.length > 0 || selectedTypes.length > 0 || selectedWeekdays.length > 0 || selectedTimes.length > 0 || startDate !== '') && (
            <button
              onClick={clearFilters}
              className="ml-auto px-3 py-1.5 rounded-full text-sm bg-black text-white hover:bg-gray-800 transition"
            >
              clear filters
            </button>
          )}
        </div>
      </div>

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
                  {sortedGroup.map((event, index) => (
                    <li key={index} className="py-5">
                      <div className="text-sm text-gray-500 mb-1">
                        🕰 {formatTimeTo12Hour(event.time_start)} – {formatTimeTo12Hour(event.time_end)}
                      </div>
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-lg font-medium text-gray-900 mb-0.5 hover:underline"
                      >
                        {event.title}
                      </Link>
                      {event.venue && (
                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          <span>☂️</span>
                          {event.venue.name}, {event.venue.hood}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 italic mb-1">
                        🌞 {event.types?.join(', ')}
                      </div>
                      <p className="text-gray-700 text-sm leading-snug mb-2">{event.descr}</p>
                      {event.link && (
                        <a
                          href={event.link}
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
