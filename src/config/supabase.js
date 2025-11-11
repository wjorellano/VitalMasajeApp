import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fgivtulfabednaqvhqks.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnaXZ0dWxmYWJlZG5hcXZocWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODc5ODcsImV4cCI6MjA3NzI2Mzk4N30.2abpF67kb2-eQZBqDhJ45OOo_QvEfMnrAdnEelIsVgM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
