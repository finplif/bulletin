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
  working_hours?: string;
  website: string;
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
      types,
      descr,
      link,
      slug,
      venue_id,
      venue (
        name,
        address,
        hood,
        slug,
        working_hours,
        website
      )
    `);

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
    types: event.types ?? [],
    descr: event.descr,
    link: event.link,
    slug: event.slug,
    venue: event.venue && event.venue.name
      ? event.venue
      : { name: '', address: '', hood: '', slug: '', working_hours: '', website: '' }
  }));
}

export async function getExhibitions() {
  const { data, error } = await supabase
    .from('exhibitions')
    .select(`
      id,
      title,
      date,
      time_start,
      time_end,
      types,
      descr,
      link,
      slug,
      gallery_id,
      gallery (
        name,
        address,
        hood,
        slug,
        working_hours
      )
    `);

  if (error) {
    console.error('Error fetching exhibitions:', error);
    return [];
  }

  return data.map((exhibition: any) => ({
    id: exhibition.id,
    title: exhibition.title,
    date: exhibition.date,
    time_start: exhibition.time_start,
    time_end: exhibition.time_end,
    types: exhibition.types ?? [],
    descr: exhibition.descr,
    link: exhibition.link,
    slug: exhibition.slug,
    gallery: exhibition.gallery && exhibition.gallery.name
      ? exhibition.gallery
      : { name: '', address: '', hood: '', slug: '', working_hours: '' }
  }));
}

export async function getVenues(): Promise<VenueItem[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, address, hood, slug, working_hours, website');

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
    working_hours: v.working_hours || '',
    website: v.website || '',
  }));
}

export async function getGalleries(): Promise<VenueItem[]> {
  const { data, error } = await supabase
    .from('galleries')
    .select('id, name, address, hood, slug, working_hours');

  if (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }

  return data.map(g => ({
    id: g.id,
    name: g.name,
    address: g.address,
    hood: g.hood,
    slug: g.slug,
    working_hours: g.working_hours || '',
  }));
}
