import type { Metadata } from "next";
import { RoutineCard } from "@/components/RoutineCard";
import { routines } from "@/lib/routines";

export const metadata: Metadata = {
  title: "Rutinas | GymControl",
  description: "Explora rutinas por nivel, objetivo y duracion.",
};

export default function RoutinesPage() {
  return (
    <main className="bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Biblioteca de entrenamiento
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-zinc-950 sm:text-6xl">
            Encuentra una rutina para tu siguiente objetivo.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            Planes claros para distintos niveles, tiempos disponibles y metas de entrenamiento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-zinc-950">Rutinas disponibles</p>
            <p className="mt-1 text-sm text-zinc-500">{routines.length} opciones para explorar</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>
    </main>
  );
}
