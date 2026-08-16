import type { Routine } from "@/types/routine";

export const routines: Routine[] = [
  {
    id: "fuerza-total",
    nombre: "Fuerza total",
    descripcion:
      "Una sesion de cuerpo completo centrada en los movimientos basicos para construir una base solida.",
    nivel: "Intermedio",
    objetivo: "Ganar fuerza",
    duracionMinutos: 55,
  },
  {
    id: "inicio-activo",
    nombre: "Inicio activo",
    descripcion:
      "Un recorrido accesible por los patrones fundamentales para empezar a entrenar con confianza.",
    nivel: "Principiante",
    objetivo: "Acondicionamiento general",
    duracionMinutos: 35,
  },
  {
    id: "potencia-inferior",
    nombre: "Potencia inferior",
    descripcion:
      "Trabajo enfocado en piernas y gluteos para mejorar estabilidad, fuerza y capacidad atletica.",
    nivel: "Intermedio",
    objetivo: "Fortalecer tren inferior",
    duracionMinutos: 50,
  },
  {
    id: "resistencia-360",
    nombre: "Resistencia 360",
    descripcion:
      "Bloques dinamicos de trabajo y recuperacion para sostener el esfuerzo de principio a fin.",
    nivel: "Avanzado",
    objetivo: "Mejorar resistencia",
    duracionMinutos: 45,
  },
  {
    id: "torso-esencial",
    nombre: "Torso esencial",
    descripcion:
      "Empujes y jalones equilibrados para desarrollar pecho, espalda, hombros y brazos.",
    nivel: "Principiante",
    objetivo: "Fortalecer tren superior",
    duracionMinutos: 40,
  },
  {
    id: "movilidad-reset",
    nombre: "Movilidad reset",
    descripcion:
      "Una sesion controlada para recuperar rangos de movimiento y aliviar la carga del entrenamiento.",
    nivel: "Principiante",
    objetivo: "Mejorar movilidad",
    duracionMinutos: 25,
  },
];

export function getRoutineById(id: string): Routine | undefined {
  return routines.find((routine) => routine.id === id);
}
