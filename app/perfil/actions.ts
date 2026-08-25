"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function profileRedirect(type: "error" | "success", message: string): never {
  redirect(`/perfil?${type}=${encodeURIComponent(message)}`);
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

export async function updateOwnProfile(formData: FormData) {
  const profile = await requireProfile();
  const fullName = field(formData, "fullName");
  const avatarUrl = field(formData, "avatarUrl");

  if (fullName.length < 2) {
    profileRedirect("error", "Ingresa un nombre valido.");
  }

  if (!validAvatarUrl(avatarUrl)) {
    profileRedirect("error", "El avatar debe ser una URL HTTPS valida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    profileRedirect("error", "No se pudo actualizar el perfil.");
  }

  revalidatePath("/perfil");
  revalidatePath("/", "layout");
  profileRedirect("success", "Perfil actualizado correctamente.");
}
