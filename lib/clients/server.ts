import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";

export type ClientProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  deactivated_at: string | null;
  created_at: string;
  updated_at: string;
};

const clientColumns =
  "id, full_name, email, avatar_url, is_active, deactivated_at, created_at, updated_at";

function searchTerm(value: string | undefined) {
  return value?.trim().replace(/[^a-zA-Z0-9@._ -]/g, "") ?? "";
}

export async function listClients(search?: string) {
  await requireRole(["OWNER"]);

  const supabase = await createClient();
  const term = searchTerm(search);
  let query = supabase
    .from("profiles")
    .select(clientColumns)
    .eq("role", "CLIENT")
    .order("created_at", { ascending: false });

  if (term) {
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`No se pudieron listar clientes: ${error.message}`);
  }

  return (data ?? []) as ClientProfile[];
}

export async function getClient(clientId?: string) {
  await requireRole(["OWNER"]);

  if (!clientId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(clientColumns)
    .eq("id", clientId)
    .eq("role", "CLIENT")
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo consultar el cliente: ${error.message}`);
  }

  return data as ClientProfile | null;
}
