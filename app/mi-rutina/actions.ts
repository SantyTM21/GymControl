"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToMiRutina(
  type: "error" | "success",
  message: string,
  resetForm = false,
): never {
  const params = new URLSearchParams({ [type]: message });

  if (resetForm) {
    params.set("reset", Date.now().toString());
  }

  redirect(`/mi-rutina?${params.toString()}`);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseNonNegativeInt(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function parseNonNegativeWeight(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

async function requireClientProfile() {
  const profile = await requireProfile();

  if (profile.role !== "CLIENT") {
    redirectToMiRutina("error", "Solo clientes pueden registrar entrenamientos.");
  }

  return profile;
}

export async function createWorkoutLog(formData: FormData) {
  const profile = await requireClientProfile();
  const exerciseRef = field(formData, "ejercicio");
  const [routineId, exerciseId] = exerciseRef.split(":");
  const fecha = field(formData, "fecha");
  const series = parseNonNegativeInt(field(formData, "seriesRealizadas"));
  const repeticiones = parseNonNegativeInt(field(formData, "repeticiones"));
  const peso = parseNonNegativeWeight(field(formData, "pesoUtilizado"));
  const notes = field(formData, "notes");

  if (!validId(routineId) || !validId(exerciseId)) {
    redirectToMiRutina("error", "Selecciona un ejercicio valido.");
  }

  if (!validDate(fecha)) {
    redirectToMiRutina("error", "Ingresa una fecha valida.");
  }

  if (series === null) {
    redirectToMiRutina("error", "Las series realizadas no pueden ser negativas.");
  }

  if (repeticiones === null) {
    redirectToMiRutina("error", "Las repeticiones no pueden ser negativas.");
  }

  if (peso === null) {
    redirectToMiRutina("error", "El peso utilizado no puede ser negativo.");
  }

  if (notes.length > 1000) {
    redirectToMiRutina("error", "Las notas no pueden superar 1000 caracteres.");
  }

  const supabase = await createClient();
  const { data: exercise, error: exerciseError } = await supabase
    .from("routine_exercises")
    .select("id, routine_id")
    .eq("id", exerciseId)
    .eq("routine_id", routineId)
    .maybeSingle();

  if (exerciseError || !exercise) {
    redirectToMiRutina("error", "El ejercicio no pertenece a una rutina publicada.");
  }

  const { error } = await supabase.from("workout_logs").insert({
    client_id: profile.id,
    routine_id: routineId,
    routine_exercise_id: exerciseId,
    performed_at: new Date(`${fecha}T12:00:00Z`).toISOString(),
    duration_minutes: 1,
    completed: true,
    completed_sets: series,
    completed_reps: repeticiones,
    used_weight: peso,
    notes: notes || null,
  });

  if (error) {
    redirectToMiRutina("error", "No se pudo registrar el entrenamiento.");
  }

  revalidatePath("/mi-rutina");
  redirectToMiRutina("success", "Entrenamiento registrado correctamente.", true);
}
