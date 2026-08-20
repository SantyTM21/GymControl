import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { RoutineExplorer } from "@/components/RoutineExplorer";
import { listPublishedRoutines } from "@/lib/routines/server";

export const metadata: Metadata = {
  title: "Rutinas | GymControl",
  description: "Explora rutinas por nivel, objetivo y duracion.",
};

export const dynamic = "force-dynamic";

export default async function RoutinesPage() {
  const routines = await listPublishedRoutines();

  return (
    <main className="bg-zinc-100">
      <PageHeader
        eyebrow="Biblioteca de entrenamiento"
        title="Encuentra una rutina para tu siguiente objetivo."
        description="Planes claros para distintos niveles, tiempos disponibles y metas de entrenamiento."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <RoutineExplorer routines={routines} />
      </section>
    </main>
  );
}
