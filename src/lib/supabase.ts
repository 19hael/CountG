import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://atdmuohwxiquirkpxpys.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZG11b2h3eGlxdWlya3B4cHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDQwOTcsImV4cCI6MjA3OTQ4MDA5N30.Arlbwo-iFNoZrOm9cmWXhPD4bM2CKmV1MK8Shr4ka6w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
