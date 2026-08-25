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

function parsePositiveInt(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeInt(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function parseOptionalWeight(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
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

function readExerciseForm(formData: FormData) {
  const name = field(formData, "nombreEjercicio");
  const muscleGroup = field(formData, "grupoMuscular");
  const equipment = field(formData, "equipamiento");
  const sets = parsePositiveInt(field(formData, "series"));
  const reps = field(formData, "repeticiones");
  const suggestedWeight = parseOptionalWeight(field(formData, "pesoSugerido"));
  const restSeconds = parseNonNegativeInt(field(formData, "descansoSegundos"));
  const position = parsePositiveInt(field(formData, "orden"));

  if (name.length < 2) {
    redirectToRoutines("error", "Ingresa un nombre de ejercicio valido.");
  }

  if (sets === null || !reps || suggestedWeight === undefined || restSeconds === null || position === null) {
    redirectToRoutines("error", "Revisa series, repeticiones, peso, descanso y orden.");
  }

  return {
    name,
    muscle_group: muscleGroup || null,
    equipment: equipment || null,
    sets,
    reps,
    suggested_weight: suggestedWeight,
    rest_seconds: restSeconds,
    position,
  };
}

async function ensureOwnRoutine(routineId: string, ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select("id")
    .eq("id", routineId)
    .eq("created_by", ownerId)
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", "No puedes modificar esa rutina.");
  }
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
    redirectToRoutines("error", "No se pudo crear la rutina.");
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
    redirectToRoutines("error", "No se pudo actualizar esa rutina.");
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
    redirectToRoutines("error", "No se pudo publicar esa rutina.");
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
    redirectToRoutines("error", "No se pudo eliminar esa rutina.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath("/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Rutina eliminada correctamente.");
}

export async function createRoutineExercise(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");
  const exercise = readExerciseForm(formData);

  if (!validId(routineId)) {
    redirectToRoutines("error", "Rutina invalida.");
  }

  await ensureOwnRoutine(routineId, profile.id);

  const supabase = await createClient();
  const { data: lastExercise, error: positionError } = await supabase
    .from("routine_exercises")
    .select("position")
    .eq("routine_id", routineId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    redirectToRoutines("error", "No se pudo calcular el orden del ejercicio.");
  }

  const { position, ...exerciseValues } = exercise;
  const { data: createdExercise, error } = await supabase
    .from("routine_exercises")
    .insert({
    routine_id: routineId,
      ...exerciseValues,
      position: (lastExercise?.position ?? 0) + 1,
    })
    .select("id")
    .single();

  if (error || !createdExercise) {
    redirectToRoutines("error", "No se pudo agregar el ejercicio.");
  }

  const { error: reorderError } = await supabase.rpc("reorder_routine_exercise", {
    target_exercise_id: createdExercise.id,
    target_routine_id: routineId,
    target_position: position,
  });

  if (reorderError) {
    await supabase.from("routine_exercises").delete().eq("id", createdExercise.id);
    redirectToRoutines("error", "No se pudo aplicar el orden del ejercicio.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Ejercicio agregado correctamente.");
}

export async function updateRoutineExercise(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");
  const exerciseId = field(formData, "exerciseId");
  const exercise = readExerciseForm(formData);

  if (!validId(routineId) || !validId(exerciseId)) {
    redirectToRoutines("error", "Rutina o ejercicio invalido.");
  }

  await ensureOwnRoutine(routineId, profile.id);

  const supabase = await createClient();
  const { position, ...exerciseValues } = exercise;
  const { error: reorderError } = await supabase.rpc("reorder_routine_exercise", {
    target_exercise_id: exerciseId,
    target_routine_id: routineId,
    target_position: position,
  });

  if (reorderError) {
    redirectToRoutines("error", "No se pudo cambiar el orden del ejercicio.");
  }

  const { data, error } = await supabase
    .from("routine_exercises")
    .update(exerciseValues)
    .eq("id", exerciseId)
    .eq("routine_id", routineId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", "No se pudo actualizar ese ejercicio.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Ejercicio actualizado correctamente.");
}

export async function deleteRoutineExercise(formData: FormData) {
  const profile = await requireOwnerProfile();
  const routineId = field(formData, "routineId");
  const exerciseId = field(formData, "exerciseId");

  if (!validId(routineId) || !validId(exerciseId)) {
    redirectToRoutines("error", "Rutina o ejercicio invalido.");
  }

  await ensureOwnRoutine(routineId, profile.id);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routine_exercises")
    .delete()
    .eq("id", exerciseId)
    .eq("routine_id", routineId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectToRoutines("error", "No se pudo eliminar ese ejercicio.");
  }

  revalidatePath("/dashboard/rutinas");
  revalidatePath(`/rutinas/${routineId}`);
  redirectToRoutines("success", "Ejercicio eliminado correctamente.");
}
