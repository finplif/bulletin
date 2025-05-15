'use client';

interface EventItem {
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  venue: string;
  address?: string;
  descr?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDateTime(date: string, time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const [y, m, d] = date.split('-').map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(hour)}${pad(minute)}00`;
}

export default function CalendarLinks({ event }: { event: EventItem }) {
  const start = formatDateTime(event.date, event.time_start);
  const end = formatDateTime(event.date, event.time_end);

  const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    event.descr || ''
  )}&location=${encodeURIComponent(event.address || event.venue)}&sf=true&output=xml`;

  const handleDownloadICS = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.descr || ''}`,
      `LOCATION:${event.address || event.venue}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 space-x-4 text-sm">
      <a href={googleLink} target="_blank" rel="noopener noreferrer" className="underline text-[#4B6E47]">
        + add to Google Calendar
      </a>
      <button onClick={handleDownloadICS} className="underline text-[#4B6E47]">
        + Download for Apple/Outlook
      </button>
    </div>
  );
}
