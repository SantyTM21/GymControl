"use client";

export interface ExercisesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ExercisesError({ reset }: ExercisesErrorProps) {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center bg-zinc-100 px-5 py-16 sm:px-8">
      <section className="mx-auto w-full max-w-2xl border border-zinc-200 bg-white p-8 text-center sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
          Conexion externa
        </p>
        <h1 className="mt-4 text-3xl font-black text-zinc-950 sm:text-4xl">
          No pudimos cargar los ejercicios.
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-zinc-600">
          La API de ejercicios no respondio correctamente. Puedes intentar la consulta nuevamente.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
