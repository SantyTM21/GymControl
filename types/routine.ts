export type RoutineLevel = "Principiante" | "Intermedio" | "Avanzado";

export type Routine = {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: RoutineLevel;
  objetivo: string;
  duracionMinutos: number;
};
