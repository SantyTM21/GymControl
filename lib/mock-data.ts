import type {
  Exercise,
  Membership,
  Payment,
  Routine,
  UserProfile,
  WorkoutLog,
} from "@/types/domain";

export interface HomeBenefit {
  number: string;
  title: string;
  description: string;
}

export const mockUserProfiles: UserProfile[] = [
  {
    id: "user-owner-01",
    nombre: "Andrea Torres",
    email: "andrea@gymcontrol.dev",
    rol: "OWNER",
    avatarUrl: null,
    creadoEn: "2026-01-10T14:00:00.000Z",
  },
  {
    id: "user-client-01",
    nombre: "Mateo Ruiz",
    email: "mateo@gymcontrol.dev",
    rol: "CLIENT",
    avatarUrl: null,
    creadoEn: "2026-02-03T16:30:00.000Z",
  },
];

export const mockRoutines: Routine[] = [
  {
    id: "fuerza-total",
    nombre: "Fuerza total",
    descripcion:
      "Una sesion de cuerpo completo centrada en los movimientos basicos para construir una base solida.",
    nivel: "INTERMEDIO",
    objetivo: "FUERZA",
    duracionMinutos: 55,
  },
  {
    id: "inicio-activo",
    nombre: "Inicio activo",
    descripcion:
      "Un recorrido accesible por los patrones fundamentales para empezar a entrenar con confianza.",
    nivel: "PRINCIPIANTE",
    objetivo: "ACONDICIONAMIENTO",
    duracionMinutos: 35,
  },
  {
    id: "potencia-inferior",
    nombre: "Potencia inferior",
    descripcion:
      "Trabajo enfocado en piernas y gluteos para mejorar estabilidad, fuerza y capacidad atletica.",
    nivel: "INTERMEDIO",
    objetivo: "HIPERTROFIA",
    duracionMinutos: 50,
  },
  {
    id: "resistencia-360",
    nombre: "Resistencia 360",
    descripcion:
      "Bloques dinamicos de trabajo y recuperacion para sostener el esfuerzo de principio a fin.",
    nivel: "AVANZADO",
    objetivo: "PERDIDA_PESO",
    duracionMinutos: 45,
  },
  {
    id: "torso-esencial",
    nombre: "Torso esencial",
    descripcion:
      "Empujes y jalones equilibrados para desarrollar pecho, espalda, hombros y brazos.",
    nivel: "PRINCIPIANTE",
    objetivo: "HIPERTROFIA",
    duracionMinutos: 40,
  },
  {
    id: "movilidad-reset",
    nombre: "Movilidad reset",
    descripcion:
      "Una sesion controlada para recuperar rangos de movimiento y aliviar la carga del entrenamiento.",
    nivel: "PRINCIPIANTE",
    objetivo: "ACONDICIONAMIENTO",
    duracionMinutos: 25,
  },
];

export const mockExercises: Exercise[] = [
  {
    id: "press-banca",
    nombre: "Press de banca",
    descripcion: "Empuje horizontal para desarrollar fuerza y control del tren superior.",
    grupoMuscular: "Pecho",
    equipamiento: "Barra y banco",
    nivel: "INTERMEDIO",
  },
  {
    id: "remo-polea",
    nombre: "Remo en polea",
    descripcion: "Jalon controlado que trabaja la espalda y la estabilidad escapular.",
    grupoMuscular: "Espalda",
    equipamiento: "Polea baja",
    nivel: "PRINCIPIANTE",
  },
  {
    id: "sentadilla-goblet",
    nombre: "Sentadilla goblet",
    descripcion: "Movimiento de fuerza y estabilidad para todo el tren inferior.",
    grupoMuscular: "Piernas",
    equipamiento: "Mancuerna",
    nivel: "PRINCIPIANTE",
  },
  {
    id: "press-militar",
    nombre: "Press militar",
    descripcion: "Empuje vertical para fortalecer hombros y mejorar el control del core.",
    grupoMuscular: "Hombros",
    equipamiento: "Mancuernas",
    nivel: "INTERMEDIO",
  },
  {
    id: "curl-martillo",
    nombre: "Curl martillo",
    descripcion: "Trabajo complementario para biceps, antebrazos y agarre.",
    grupoMuscular: "Brazos",
    equipamiento: "Mancuernas",
    nivel: "PRINCIPIANTE",
  },
  {
    id: "plancha-frontal",
    nombre: "Plancha frontal",
    descripcion: "Ejercicio isometrico para postura y transferencia de fuerza.",
    grupoMuscular: "Core",
    equipamiento: "Peso corporal",
    nivel: "PRINCIPIANTE",
  },
];

export const mockMemberships: Membership[] = [
  {
    id: "membership-01",
    userId: "user-client-01",
    plan: "Mensual",
    estado: "ACTIVE",
    fechaInicio: "2026-08-01",
    fechaFin: "2026-08-31",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "payment-01",
    membershipId: "membership-01",
    userId: "user-client-01",
    monto: 35,
    moneda: "USD",
    estado: "Pagado",
    fechaPago: "2026-08-01T15:20:00.000Z",
  },
];

export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: "workout-01",
    userId: "user-client-01",
    routineId: "fuerza-total",
    fecha: "2026-08-12T18:00:00.000Z",
    duracionMinutos: 52,
    completado: true,
    notas: "Buena tecnica y ritmo constante.",
  },
];

export const homeBenefits: HomeBenefit[] = [
  {
    number: "01",
    title: "Rutinas con direccion",
    description: "Organiza cada sesion por objetivo y sigue un plan que puedas cumplir.",
  },
  {
    number: "02",
    title: "Progreso visible",
    description: "Registra tu rendimiento y reconoce cada avance durante el proceso.",
  },
  {
    number: "03",
    title: "Todo en un lugar",
    description: "Consulta ejercicios, entrenamientos y actividad sin perder el enfoque.",
  },
];

export function getRoutineById(id: string): Routine | undefined {
  return mockRoutines.find((routine) => routine.id === id);
}
