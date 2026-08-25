'server-only'

import { requireProfile } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import { getPublishedRoutine } from '@/lib/routines/server'
import type { RoutineWithExercises } from '@/lib/routines/server'

type WorkoutLogRow = {
  id: string
  client_id: string
  routine_id: string
  routine_exercise_id: string | null
  performed_at: string
  completed_sets: number
  completed_reps: number
  used_weight: number
  notes: string | null
  created_at: string
}

export type ClientWorkoutLog = {
  id: string
  fecha: string
  routineId: string
  routineName: string
  exerciseId: string | null
  exerciseName: string
  seriesRealizadas: number
  repeticiones: number
  pesoUtilizado: number
  notas: string | null
  createdAt: string
}

async function requireClientProfile() {
  const profile = await requireProfile()

  if (profile.role !== 'CLIENT') {
    throw new Error('Solo clientes pueden consultar seguimiento de entrenamiento.')
  }

  return profile
}

export async function listClientWorkoutRoutines() {
  await requireClientProfile()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('routines')
    .select('id')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`No se pudieron listar rutinas: ${error.message}`)
  }

  const routines = await Promise.all((data ?? []).map((routine) => getPublishedRoutine(routine.id)))

  return routines.filter((routine): routine is RoutineWithExercises => Boolean(routine))
}

export async function listClientWorkoutLogs() {
  const profile = await requireClientProfile()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select(
      'id, client_id, routine_id, routine_exercise_id, performed_at, completed_sets, completed_reps, used_weight, notes, created_at'
    )
    .eq('client_id', profile.id)
    .order('performed_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`No se pudieron listar tus registros: ${error.message}`)
  }

  const rows = (data ?? []) as WorkoutLogRow[]
  const routineIds = Array.from(new Set(rows.map((row) => row.routine_id)))
  const exerciseIds = Array.from(
    new Set(rows.map((row) => row.routine_exercise_id).filter((id): id is string => Boolean(id)))
  )

  const { data: routines, error: routinesError } = routineIds.length
    ? await supabase.from('routines').select('id, name').in('id', routineIds)
    : { data: [], error: null }

  if (routinesError) {
    throw new Error(`No se pudieron consultar rutinas: ${routinesError.message}`)
  }

  const { data: exercises, error: exercisesError } = exerciseIds.length
    ? await supabase.from('routine_exercises').select('id, name').in('id', exerciseIds)
    : { data: [], error: null }

  if (exercisesError) {
    throw new Error(`No se pudieron consultar ejercicios: ${exercisesError.message}`)
  }

  const routinesById = new Map((routines ?? []).map((routine) => [routine.id, routine.name]))
  const exercisesById = new Map((exercises ?? []).map((exercise) => [exercise.id, exercise.name]))

  return rows.map((row) => ({
    id: row.id,
    fecha: row.performed_at,
    routineId: row.routine_id,
    routineName: routinesById.get(row.routine_id) ?? 'Rutina no disponible',
    exerciseId: row.routine_exercise_id,
    exerciseName: row.routine_exercise_id
      ? (exercisesById.get(row.routine_exercise_id) ?? 'Ejercicio no disponible')
      : 'Ejercicio no disponible',
    seriesRealizadas: row.completed_sets,
    repeticiones: row.completed_reps,
    pesoUtilizado: Number(row.used_weight),
    notas: row.notes,
    createdAt: row.created_at
  })) satisfies ClientWorkoutLog[]
}
