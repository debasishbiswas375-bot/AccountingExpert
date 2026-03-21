import { createClient } from '@supabase/supabase-js'

// ⚠️ using YOUR existing env names
const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
