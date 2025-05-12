'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { getEvents } from '../../utils';

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
  slug?: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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

function getWeekday(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}

function getTimeBucket(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute;
  if (totalMinutes < 600) return 'Morning';
  if (totalMinutes < 840) return 'Midday';
  if (totalMinutes < 1080) return 'Afternoon';
  return 'Evening';
}

function EventsClient() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getEvents().then(setAllEvents);
  }, []);

  const hoods = Array.from(new Set(allEvents.map((e) => e.hood))).sort();
  const types = Array.from(new Set(allEvents.map((e) => e.type))).sort();
  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const timeRanges = ['Morning','Midday','Afternoon','Evening'];

  const toggleItem = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const clearFilters = () => {
    setSelectedHoods([]);
    setSelectedTypes([]);
    setSelectedWeekdays([]);
    setSelectedTimes([]);
  };

  const filteredEvents = allEvents.filter((e) => {
    const hoodMatch = selectedHoods.length === 0 || selectedHoods.includes(e.hood);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(e.type);
    const weekdayMatch = selectedWeekdays.length === 0 || selectedWeekdays.includes(getWeekday(e.date));
    const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(getTimeBucket(e.time_start));
    return hoodMatch && typeMatch && weekdayMatch && timeMatch;
  });

  const groupedByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = formatDate(event.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  const FilterSection = ({ label, options, selected, setSelected }: { label: string; options: string[]; selected: string[]; setSelected: (v: string[]) => void }) => (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggleItem(opt, selected, setSelected)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              selected.includes(opt)
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Events</h1>

      <div className="space-y-6 mb-10">
        <div className="flex items-center gap-4">
          {showFilters ? (
            <button
              onClick={() => setShowFilters(false)}
              className="text-sm font-medium underline"
            >
              Hide Filters
            </button>
          ) : (
            <button
              onClick={() => setShowFilters(true)}
              className="px-3 py-1.5 rounded-full text-sm border bg-white text-gray-800 border-gray-300"
            >
              Filter by
            </button>
          )}

          {(selectedHoods.length > 0 || selectedTypes.length > 0 || selectedWeekdays.length > 0 || selectedTimes.length > 0) && (
            <button
              onClick={clearFilters}
              className="ml-auto px-3 py-1.5 rounded-full text-sm bg-[#1F1F1F] text-white hover:bg-gray-800 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <>
            <FilterSection label="Hood" options={hoods} selected={selectedHoods} setSelected={setSelectedHoods} />
            <FilterSection label="Type" options={types} selected={selectedTypes} setSelected={setSelectedTypes} />
            <FilterSection label="Day" options={weekdays} selected={selectedWeekdays} setSelected={setSelectedWeekdays} />
            <FilterSection label="Time" options={timeRanges} selected={selectedTimes} setSelected={setSelectedTimes} />
          </>
        )}
      </div>

      <div className="space-y-12">
        {Object.entries(groupedByDate).map(([date, group]) => (
          <section key={date}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-1 text-gray-800">{date}</h2>
            <ul className="divide-y divide-gray-300/30">
              {group.map((event, index) => (
                <li key={index} className="py-5">
                  <div className="text-sm text-gray-500 mb-1">
                    🕒 {event.time_start} – {event.time_end}
                  </div>
                  <Link
                    href={`/events/${event.slug || slugify(event.title)}`}
                    className="text-lg font-medium text-gray-900 mb-0.5 hover:underline"
                  >
                    {event.title}
                  </Link>
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

export default EventsClient;