import "server-only";

import { requireProfile } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { Routine, RoutineLevel, RoutineObjective } from "@/types/domain";

type DbRoutineLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type DbRoutineObjective = "STRENGTH" | "HYPERTROPHY" | "WEIGHT_LOSS" | "CONDITIONING";

type DbRoutine = {
  id: string;
  owner_id: string;
  created_by: string;
  name: string;
  description: string | null;
  level: DbRoutineLevel;
  objective: DbRoutineObjective;
  duration_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const routineColumns =
  "id, owner_id, created_by, name, description, level, objective, duration_minutes, is_published, created_at, updated_at";

const dbLevelToApp: Record<DbRoutineLevel, RoutineLevel> = {
  BEGINNER: "PRINCIPIANTE",
  INTERMEDIATE: "INTERMEDIO",
  ADVANCED: "AVANZADO",
};

const appLevelToDb: Record<RoutineLevel, DbRoutineLevel> = {
  PRINCIPIANTE: "BEGINNER",
  INTERMEDIO: "INTERMEDIATE",
  AVANZADO: "ADVANCED",
};

const dbObjectiveToApp: Record<DbRoutineObjective, RoutineObjective> = {
  STRENGTH: "FUERZA",
  HYPERTROPHY: "HIPERTROFIA",
  WEIGHT_LOSS: "PERDIDA_PESO",
  CONDITIONING: "ACONDICIONAMIENTO",
};

const appObjectiveToDb: Record<RoutineObjective, DbRoutineObjective> = {
  FUERZA: "STRENGTH",
  HIPERTROFIA: "HYPERTROPHY",
  PERDIDA_PESO: "WEIGHT_LOSS",
  ACONDICIONAMIENTO: "CONDITIONING",
};

export function routineLevelToDb(level: RoutineLevel) {
  return appLevelToDb[level];
}

export function routineObjectiveToDb(objective: RoutineObjective) {
  return appObjectiveToDb[objective];
}

function toRoutine(routine: DbRoutine): Routine {
  return {
    id: routine.id,
    nombre: routine.name,
    descripcion: routine.description ?? "",
    nivel: dbLevelToApp[routine.level],
    objetivo: dbObjectiveToApp[routine.objective],
    duracionMinutos: routine.duration_minutes,
    createdBy: routine.created_by,
    createdAt: routine.created_at,
    publicado: routine.is_published,
  };
}

export async function listPublishedRoutines() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select(routineColumns)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron listar rutinas: ${error.message}`);
  }

  return ((data ?? []) as DbRoutine[]).map(toRoutine);
}

export async function getPublishedRoutine(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select(routineColumns)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo consultar la rutina: ${error.message}`);
  }

  return data ? toRoutine(data as DbRoutine) : null;
}

export async function listOwnerRoutines() {
  const profile = await requireProfile();

  if (profile.role !== "OWNER") {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routines")
    .select(routineColumns)
    .eq("created_by", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron listar tus rutinas: ${error.message}`);
  }

  return ((data ?? []) as DbRoutine[]).map(toRoutine);
}
