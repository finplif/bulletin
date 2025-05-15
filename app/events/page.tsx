import Header from '../components/Header';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const allEvents = await getEvents();

  return (
    <>
      <Header />
      <EventsClient allEvents={allEvents} />
    </>
  );
}
