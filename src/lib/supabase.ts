import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante");
  return createClient(supabaseUrl, serviceRoleKey);
}

// Le projet Supabase (plan gratuit) répond parfois "Gateway Timeout" sur la
// première requête après une période d'inactivité, puis passe tout de suite
// après. On réessaie jusqu'à trois fois avant d'abandonner.
export async function withRetry<T>(run: () => PromiseLike<{ data: T; error: { message: string } | null }>, attempts = 3): Promise<T> {
  let lastError = "";
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await run();
    if (!error) return data;
    lastError = error.message;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  throw new Error(lastError);
}
