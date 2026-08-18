export const USER_ROLES = ["OWNER", "CLIENT"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type RoutineLevel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";
export type RoutineObjective =
  | "FUERZA"
  | "HIPERTROFIA"
  | "PERDIDA_PESO"
  | "ACONDICIONAMIENTO";
export type MembershipStatus = "Activa" | "Pausada" | "Vencida";
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
