import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igqykgtfmxuzrvoxjqfb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nZQWLXCGMOLZROg7wM3D3w_ZGNYEI_C';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey && supabaseKey.length > 10);
};

export const supabase = createClient(supabaseUrl, supabaseKey);
