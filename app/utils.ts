import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkzzipeqszjtleewsxzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrenppcGVxc3pqdGxlZXdzeHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY4MzQsImV4cCI6MjA2MjU4MjgzNH0.orwVh0bWTiXXOjz4syDwQBcws_VNSe0UJKWnv6XEt_I';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      type,
      descr,
      link,
      slug,
      venues (
        name,
        address,
        hood
      )
    `);

  if (error) {
    console.error('Error fetching events:', error.message);
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
    slug: event.slug || slugify(event.title),
    venue: event.venues?.[0] || { name: '', address: '', hood: '' }, // <- FIXED HERE
  }));
}

export async function getVenues() {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, address, hood');

  if (error) {
    console.error('Error fetching venues:', error.message);
    return [];
  }

  return data;
}
