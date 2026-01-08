import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mleboibcchxdaxwtnsut.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZWJvaWJjY2h4ZGF4d3Ruc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzU0OTAsImV4cCI6MjA4MDA1MTQ5MH0.odiPYL7HVWIrWm4cPachGe8hK8Napm73u_fb7JYJSzc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)