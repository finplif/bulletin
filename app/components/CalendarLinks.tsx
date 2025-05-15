import React from 'react';

interface CalendarLinksProps {
  title: string;
  date: string; // YYYY-MM-DD
  timeStart: string; // HH:mm
  timeEnd: string; // HH:mm
  description?: string;
  location: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDateTime(date: string, time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const [y, m, d] = date.split('-').map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(hour)}${pad(minute)}00`;
}

function generateICS({ title, date, timeStart, timeEnd, description = '', location }: CalendarLinksProps) {
  const start = formatDateTime(date, timeStart);
  const end = formatDateTime(date, timeEnd);

  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return new Blob([content], { type: 'text/calendar;charset=utf-8' });
}

function generateGoogleCalendarLink({ title, date, timeStart, timeEnd, description = '', location }: CalendarLinksProps) {
  const start = `${date}T${timeStart.replace(':', '')}00`;
  const end = `${date}T${timeEnd.replace(':', '')}00`;
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
}

const CalendarLinks: React.FC<CalendarLinksProps> = ({ title, date, timeStart, timeEnd, description, location }) => {
  return (
    <div className="mt-6 space-x-4">
      <a
        href={generateGoogleCalendarLink({ title, date, timeStart, timeEnd, description, location })}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline text-[#4B6E47]"
      >
        + add to Google Calendar
      </a>
      <button
        onClick={() => {
          const blob = generateICS({ title, date, timeStart, timeEnd, description, location });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${title.replace(/\s+/g, '_')}.ics`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }}
        className="text-sm underline text-[#4B6E47]"
      >
        + Download for Apple/Outlook
      </button>
    </div>
  );
};

export default CalendarLinks;
