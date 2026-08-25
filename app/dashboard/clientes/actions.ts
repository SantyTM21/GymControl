"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToClients(type: "error" | "success", message: string, clientId?: string) {
  const params = new URLSearchParams({ [type]: message });

  if (clientId) {
    params.set("cliente", clientId);
  }

  redirect(`/dashboard/clientes?${params.toString()}`);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function validAvatarUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateClient(formData: FormData) {
  await requireRole(["OWNER"]);

  const clientId = field(formData, "clientId");
  const fullName = field(formData, "fullName");
  const email = field(formData, "email").toLowerCase();
  const avatarUrl = field(formData, "avatarUrl");

  if (!validId(clientId)) {
    redirectToClients("error", "Cliente invalido.");
  }

  if (fullName.length < 2 || fullName.length > 100) {
    redirectToClients("error", "Ingresa un nombre valido.", clientId);
  }

  if (!validEmail(email)) {
    redirectToClients("error", "Ingresa un correo electronico valido.", clientId);
  }

  if (!validAvatarUrl(avatarUrl)) {
    redirectToClients("error", "El avatar debe ser una URL HTTPS valida.", clientId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId)
    .eq("role", "CLIENT")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToClients("error", "No se pudo actualizar el cliente.", clientId);
  }

  revalidatePath("/dashboard/clientes");
  redirectToClients("success", "Cliente actualizado correctamente.", clientId);
}

export async function deactivateClient(formData: FormData) {
  await requireRole(["OWNER"]);

  const clientId = field(formData, "clientId");

  if (!validId(clientId)) {
    redirectToClients("error", "Cliente invalido.");
  }

  const now = new Date().toISOString();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_active: false,
      deactivated_at: now,
      updated_at: now,
    })
    .eq("id", clientId)
    .eq("role", "CLIENT")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToClients("error", "No se pudo desactivar el cliente.", clientId);
  }

  revalidatePath("/dashboard/clientes");
  redirectToClients("success", "Cliente desactivado correctamente.", clientId);
}

export async function activateClient(formData: FormData) {
  await requireRole(["OWNER"]);

  const clientId = field(formData, "clientId");

  if (!validId(clientId)) {
    redirectToClients("error", "Cliente invalido.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_active: true,
      deactivated_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId)
    .eq("role", "CLIENT")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToClients("error", "No se pudo reactivar el cliente.", clientId);
  }

  revalidatePath("/dashboard/clientes");
  redirectToClients("success", "Cliente reactivado correctamente.", clientId);
}
