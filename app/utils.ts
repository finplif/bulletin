import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkzzipeqszjtleewsxzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrenppcGVxc3pqdGxlZXdzeHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY4MzQsImV4cCI6MjA2MjU4MjgzNH0.orwVh0bWTiXXOjz4syDwQBcws_VNSe0UJKWnv6XEt_I';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`*, venue:venue_id (
      id,
      name,
      address,
      hood
      )
    `)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data.map((event) => ({
    ...event,
    venue: event.venues?.name || '',
    address: event.venues?.address || '',
  }));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
