/**
 * Supabase browser client.
 * This project has no bundler (plain <script type="module"> + CDN scripts,
 * same as three.js/gsap in index.html) — so we import the ESM build from
 * a CDN rather than the bare 'from @supabase/supabase-js' specifier, which
 * only resolves under a bundler.
 *
 * Uses the PUBLIC anon key — safe to ship to the browser, it only grants
 * what your RLS policies allow (see sql/001_profiles_and_auth.sql).
 * NEVER put the service_role key here.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://pgjjreowfxgaaqklrswb.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnampyZW93ZnhnYWFxa2xyc3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODgyMzYsImV4cCI6MjEwMjE2NDIzNn0.7dgxblv7Eber_fkYVauicIZWyIikwN7ENhGX8rkECyU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,    // keeps the session in localStorage for you
    autoRefreshToken: true,
    detectSessionInUrl: true // needed if you ever add magic links / OAuth
  }
});