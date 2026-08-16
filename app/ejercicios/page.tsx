import type { Metadata } from "next";
import Link from "next/link";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PageHeader } from "@/components/PageHeader";
import { mockExercises } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Ejercicios | GymControl",
  description: "Explora ejercicios organizados por grupo muscular.",
};

export default function ExercisesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Biblioteca de movimientos"
        title="Conoce los ejercicios. Mejora tu tecnica."
        description="Explora movimientos por grupo muscular y encuentra nuevas opciones para tus entrenamientos."
        variant="lime"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {mockExercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-200 pt-10 sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg font-semibold text-zinc-950">
            Usa estos grupos como punto de partida para elegir una rutina completa.
          </p>
          <Link href="/rutinas" className="bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">
            Explorar rutinas
          </Link>
        </div>
      </section>
    </main>
  );
}
