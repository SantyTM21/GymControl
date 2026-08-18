const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return {
    url: supabaseUrl,
    key: supabaseKey,
  };
}
