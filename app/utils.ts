import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkzzipeqszjtleewsxzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrenppcGVxc3pqdGxlZXdzeHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDY4MzQsImV4cCI6MjA2MjU4MjgzNH0.orwVh0bWTiXXOjz4syDwQBcws_VNSe0UJKWnv6XEt_I';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, date, time_start, time_end, type, descr, link, slug,
      venue:venues (
        name, address, hood
      )
    `)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error loading events:', error);
    return [];
  }

  return data;
}

export async function getVenues() {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching venues:", error);
    return [];
  }

  return data;
}
