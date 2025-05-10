import Events from './EventsClient';
import { getEvents } from './utils'; // use the helper instead of repeating it

export default async function EventsPage() {
  const allEvents = await getEvents();
  return <Events allEvents={allEvents} />;
}