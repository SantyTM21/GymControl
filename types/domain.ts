export const USER_ROLES = ["OWNER", "CLIENT"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type RoutineLevel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";
export type RoutineObjective =
  | "FUERZA"
  | "HIPERTROFIA"
  | "PERDIDA_PESO"
  | "ACONDICIONAMIENTO";
export const MEMBERSHIP_STATUSES = ["ACTIVE", "EXPIRED", "CANCELLED"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];
export type PaymentStatus = "Pagado" | "Pendiente" | "Fallido";

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatarUrl: string | null;
  creadoEn: string;
}

export interface Routine {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: RoutineLevel;
  objetivo: RoutineObjective;
  duracionMinutos: number;
  createdBy: string;
  createdAt: string;
  publicado: boolean;
}

export interface RoutineExercise {
  id: string;
  routineId: string;
  nombreEjercicio: string;
  series: number;
  repeticiones: string;
  pesoSugerido: number | null;
  descansoSegundos: number;
  orden: number;
}

export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  grupoMuscular: string;
  equipamiento: string;
  nivel: RoutineLevel;
}

export interface Membership {
  id: string;
  userId: string;
  plan: string;
  estado: MembershipStatus;
  fechaInicio: string;
  fechaFin: string;
}

export interface Payment {
  id: string;
  membershipId: string;
  userId: string;
  monto: number;
  moneda: "USD";
  estado: PaymentStatus;
  fechaPago: string | null;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId: string;
  fecha: string;
  duracionMinutos: number;
  completado: boolean;
  notas: string | null;
}
