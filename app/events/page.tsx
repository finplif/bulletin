import Header from '../components/Header';
import EventsClient from './EventsClient';
import { getEvents } from '../utils';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const allEvents = await getEvents();
  return <EventsClient allEvents={allEvents} />;
}
