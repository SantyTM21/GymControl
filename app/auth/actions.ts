"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, type: "error" | "success", message: string) {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

function readableAuthError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "El correo o la contrasena no son correctos.";
  }

  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "Ya existe una cuenta registrada con ese correo.";
  }

  if (lower.includes("password")) {
    return "La contrasena no cumple los requisitos de seguridad.";
  }

  return message;
}

export async function register(formData: FormData) {
  const fullName = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const password = field(formData, "password");

  if (fullName.length < 2) {
    authRedirect("/register", "error", "Ingresa un nombre valido.");
  }

  if (!email || !email.includes("@")) {
    authRedirect("/register", "error", "Ingresa un correo electronico valido.");
  }

  if (password.length < 6) {
    authRedirect("/register", "error", "La contrasena debe tener al menos 6 caracteres.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    authRedirect("/register", "error", readableAuthError(error.message));
  }

  authRedirect(
    "/login",
    "success",
    "Cuenta creada correctamente. Si Supabase requiere confirmacion, revisa tu correo antes de iniciar sesion.",
  );
}

export async function login(formData: FormData) {
  const email = field(formData, "email").toLowerCase();
  const password = field(formData, "password");

  if (!email || !password) {
    authRedirect("/login", "error", "Ingresa tu correo y contrasena.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    authRedirect("/login", "error", readableAuthError(error.message));
  }

  revalidatePath("/", "layout");
  authRedirect("/", "success", "Sesion iniciada correctamente.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  authRedirect("/login", "success", "Sesion cerrada correctamente.");
}
