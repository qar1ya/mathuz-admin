import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cngkzlkreddsdpjqflsb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XBtykx-ZbWc1326el4G5SA_JEgpuDOo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
