import type { RoutineLevel, RoutineObjective } from "@/types/domain";

export const routineLevels: RoutineLevel[] = [
  "PRINCIPIANTE",
  "INTERMEDIO",
  "AVANZADO",
];

export const routineObjectives: RoutineObjective[] = [
  "FUERZA",
  "HIPERTROFIA",
  "PERDIDA_PESO",
  "ACONDICIONAMIENTO",
];

export const routineLevelLabels: Record<RoutineLevel, string> = {
  PRINCIPIANTE: "Principiante",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
};

export const routineObjectiveLabels: Record<RoutineObjective, string> = {
  FUERZA: "Fuerza",
  HIPERTROFIA: "Hipertrofia",
  PERDIDA_PESO: "Perdida de peso",
  ACONDICIONAMIENTO: "Acondicionamiento",
};
