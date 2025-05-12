import Events from './EventsClient';
import { getEvents } from '../../utils';

export default async function EventsPage() {
  const allEvents = await getEvents();
  return <Events allEvents={allEvents} />;
}
