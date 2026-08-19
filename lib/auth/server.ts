import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/domain";

export type AuthProfile = {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAuthenticatedUser(): Promise<User | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(): Promise<AuthProfile | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo obtener el perfil: ${error.message}`);
  }

  return data as AuthProfile | null;
}

export async function getRole(): Promise<UserRole | null> {
  const profile = await getProfile();
  return profile?.role ?? null;
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?error=Debes iniciar sesion para continuar.");
  }

  return user;
}

export async function requireProfile() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login?error=Debes iniciar sesion para continuar.");
  }

  return profile;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const { role } = await requireProfile();

  if (!role || !allowedRoles.includes(role)) {
    redirect("/dashboard?error=No tienes permiso para acceder a esa seccion.");
  }

  return role;
}
