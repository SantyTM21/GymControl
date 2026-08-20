"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { routineLevels, routineObjectives } from "@/lib/routine-options";
import { routineLevelToDb, routineObjectiveToDb } from "@/lib/routines/server";
import type { RoutineLevel, RoutineObjective } from "@/types/domain";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToRoutines(type: "error" | "success", message: string): never {
  redirect(`/dashboard/rutinas?${type}=${encodeURIComponent(message)}`);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validLevel(value: string): value is RoutineLevel {
  return routineLevels.includes(value as RoutineLevel);
}

function validObjective(value: string): value is RoutineObjective {
  return routineObjectives.includes(value as RoutineObjective);
}

function parseDuration(value: string) {
  const duration = Number(value);
  return Number.isInteger(duration) && duration > 0 ? duration : null;
}

async function requireOwnerProfile() {
  const profile = await requireProfile();

  if (profile.role !== "OWNER") {
    redirectToRoutines("error", "No tienes permiso para administrar rutinas.");
  }

  return profile;
}

function readRoutineForm(formData: FormData) {
  const name = field(formData, "name");
  const description = field(formData, "description");
  const level = field(formData, "level");
  const objective = field(formData, "objective");
  const duration = parseDuration(field(formData, "duration"));
  const isPublished = formData.get("isPublished") === "on";

  if (name.length < 2) {
    redirectToRoutines("error", "Ingresa un nombre valido.");
  }

  if (!description) {
    redirectToRoutines("error", "Ingresa una descripcion.");
  }

  if (!validLevel(level) || !validObjective(objective) || duration === null) {
    redirectToRoutines("error", "Revisa objetivo, nivel y duracion.");
  }

  return {
    name,
    description,
    level: routineLevelToDb(level),
    objective: routineObjectiveToDb(objective),
    duration_minutes: duration,
    is_published: isPublished,
  };
}

export async function createRoutine(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routine = readRoutineForm(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("routines").insert({
    ...routine,
    owner_id: profile.id,
    created_by: profile.id,
  });

  if (error) {
    redirectToRoutines("error", error.message);
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath("/rutinas");
  redirectToRoutines("success", "Rutina creada correctamente.");
}

export async function updateRoutine(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");
  const routine = readRoutineForm(formData);

  if (!validId(routineId)) {
    redirectToRoutines("error", "Rutina invalida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .update({
      ...routine,
      owner_id: profile.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", routineId)
    .eq("created_by", profile.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", error?.message ?? "No se pudo actualizar esa rutina.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath("/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Rutina actualizada correctamente.");
}

export async function publishRoutine(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");

  if (!validId(routineId)) {
    redirectToRoutines("error", "Rutina invalida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .update({
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", routineId)
    .eq("created_by", profile.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", error?.message ?? "No se pudo publicar esa rutina.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath("/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Rutina publicada correctamente.");
}

export async function deleteRoutine(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");

  if (!validId(routineId)) {
    redirectToRoutines("error", "Rutina invalida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .delete()
    .eq("id", routineId)
    .eq("created_by", profile.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", error?.message ?? "No se pudo eliminar esa rutina.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath("/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Rutina eliminada correctamente.");
}
