import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { RoutineCard } from "@/components/RoutineCard";
import { mockRoutines } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Rutinas | GymControl",
  description: "Explora rutinas por nivel, objetivo y duracion.",
};

export default function RoutinesPage() {
  return (
    <main className="bg-zinc-100">
      <PageHeader
        eyebrow="Biblioteca de entrenamiento"
        title="Encuentra una rutina para tu siguiente objetivo."
        description="Planes claros para distintos niveles, tiempos disponibles y metas de entrenamiento."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-zinc-950">Rutinas disponibles</p>
            <p className="mt-1 text-sm text-zinc-500">{mockRoutines.length} opciones para explorar</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockRoutines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>
    </main>
  );
}
