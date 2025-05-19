import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkzzipeqszjtleewsxzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrenppcGVxc3pqdGxlZXdzeHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY4MzQsImV4cCI6MjA2MjU4MjgzNH0.orwVh0bWTiXXOjz4syDwQBcws_VNSe0UJKWnv6XEt_I';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      date,
      time_start,
      time_end,
      hood,
      type,
      descr,
      link,
      slug,
      venue_id,
      venues (
        id,
        name,
        address,
        hood
      )
    `)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getVenues() {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      id,
      name,
      address,
      hood
    `)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
