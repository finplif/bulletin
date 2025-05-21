import { createClient } from '@supabase/supabase-js';
import type { EventItem } from './events/EventsClient';

const supabaseUrl = 'https://bkzzipeqszjtleewsxzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrenppcGVxc3pqdGxlZXdzeHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY4MzQsImV4cCI6MjA2MjU4MjgzNH0.orwVh0bWTiXXOjz4syDwQBcws_VNSe0UJKWnv6XEt_I';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface VenueItem {
  id: number;
  name: string;
  address: string;
  hood: string;
  slug: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function getEvents() {
const { data, error } = await supabase
  .from('events')
  .select(`
    id,
    title,
    date,
    time_start,
    time_end,
    type: event.type || [],
    descr,
    link,
    slug,
    venue_id,
    venue (
      name,
      address,
      hood,
      slug
    )
  `)

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data.map((event: any) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time_start: event.time_start,
    time_end: event.time_end,
    type: event.type,
    descr: event.descr,
    link: event.link,
    slug: event.slug,
    venue: event.venue && event.venue.name
  ? event.venue
  : { name: '', address: '', hood: '', slug: '' }
  }));
}

export async function getVenues(): Promise<VenueItem[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, address, hood, slug');

  if (error) {
    console.error('Error fetching venues:', error);
    return [];
  }

  return data.map(v => ({
    id: v.id,
    name: v.name,
    address: v.address,
    hood: v.hood,
    slug: v.slug,
  }));
}
