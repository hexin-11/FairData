'use client'

import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client with SSR cookie support
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
