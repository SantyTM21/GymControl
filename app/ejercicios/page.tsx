import type { Metadata } from "next";
import Link from "next/link";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PageHeader } from "@/components/PageHeader";
import { getExternalExercises } from "@/lib/external-exercises";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ejercicios | GymControl",
  description: "Explora ejercicios organizados por grupo muscular.",
};

export default async function ExercisesPage() {
  const exercises = await getExternalExercises();

  return (
    <main>
      <PageHeader
        eyebrow="Biblioteca de movimientos"
        title="Conoce los ejercicios. Mejora tu tecnica."
        description="Explora movimientos por grupo muscular y encuentra nuevas opciones para tus entrenamientos."
        variant="lime"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        {exercises.length > 0 ? (
          <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-zinc-50 px-6 py-16 text-center">
            <h2 className="text-2xl font-black text-zinc-950">No hay ejercicios disponibles.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
              La fuente externa no devolvio resultados en este momento.
            </p>
          </div>
        )}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-200 pt-10 sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg font-semibold text-zinc-950">
            Usa estos grupos como punto de partida para elegir una rutina completa.
          </p>
          <Link href="/rutinas" className="bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">
            Explorar rutinas
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          Datos de ejercicios proporcionados por{" "}
          <a
            href="https://wger.de/en/software/api"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-4 hover:text-zinc-950"
          >
            wger API
          </a>
          .
        </p>
      </section>
    </main>
  );
}
