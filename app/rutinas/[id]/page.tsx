import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import { getPublishedRoutine } from "@/lib/routines/server";
import {
  routineLevelLabels,
  routineObjectiveLabels,
} from "@/lib/routine-options";

interface RoutineDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(value));
}

export async function generateMetadata({ params }: RoutineDetailPageProps): Promise<Metadata> {
  const routine = await getPublishedRoutine(params.id);

  if (!routine) {
    return { title: "Rutina no encontrada | GymControl" };
  }

  return {
    title: `${routine.nombre} | GymControl`,
    description: routine.descripcion,
  };
}

export default async function RoutineDetailPage({ params }: RoutineDetailPageProps) {
  const routine = await getPublishedRoutine(params.id);

  if (!routine) {
    notFound();
  }

  return (
    <main className="bg-zinc-100">
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <Link
            href="/rutinas"
            className="text-sm font-semibold text-lime-400 hover:text-lime-300"
          >
            Volver a rutinas
          </Link>
          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="bg-lime-400 px-3 py-1.5 text-zinc-950">
                {routineLevelLabels[routine.nivel]}
              </span>
              <span className="border border-zinc-700 px-3 py-1.5 text-zinc-200">
                {routine.duracionMinutos} minutos
              </span>
              <span className="border border-zinc-700 px-3 py-1.5 text-zinc-200">
                Publicada {formatDate(routine.createdAt)}
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
              {routine.nombre}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              {routine.descripcion}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.4fr_0.6fr] lg:px-10">
        <div className="bg-white p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Enfoque de la rutina
          </p>
          <h2 className="mt-4 text-3xl font-black text-zinc-950">
            {routineObjectiveLabels[routine.objetivo]}
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-zinc-600">
            Esta rutina combina un ritmo sostenible con una seleccion equilibrada de ejercicios para trabajar el objetivo de forma consistente durante toda la sesion.
          </p>
          <div className="mt-10 grid gap-px bg-zinc-200 sm:grid-cols-3">
            <StatCard label="Nivel" value={routineLevelLabels[routine.nivel]} />
            <StatCard label="Duracion" value={`${routine.duracionMinutos} min`} />
            <StatCard
              label="Objetivo"
              value={routineObjectiveLabels[routine.objetivo]}
            />
          </div>

          <section className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
                  Secuencia
                </p>
                <h3 className="mt-3 text-2xl font-black text-zinc-950">Ejercicios</h3>
              </div>
              <p className="font-mono text-sm font-black text-zinc-950">
                {routine.ejercicios.length} movimientos
              </p>
            </div>

            {routine.ejercicios.length > 0 ? (
              <div className="mt-5 divide-y divide-zinc-100 border border-zinc-200">
                {routine.ejercicios.map((exercise) => (
                  <article
                    key={exercise.id}
                    className="grid gap-4 bg-white px-4 py-4 md:grid-cols-[56px_minmax(0,1fr)_repeat(4,110px)]"
                  >
                    <div className="font-mono text-2xl font-black tabular-nums text-lime-700">
                      {String(exercise.orden).padStart(2, "0")}
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-950">{exercise.nombreEjercicio}</h4>
                      <p className="mt-1 text-sm font-semibold text-zinc-500">
                        {exercise.series} series / {exercise.repeticiones} reps
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                        Peso
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {exercise.pesoSugerido === null ? "Libre" : `${exercise.pesoSugerido} kg`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                        Descanso
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {exercise.descansoSegundos}s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                        Series
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">{exercise.series}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                        Reps
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {exercise.repeticiones}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 border border-zinc-200 bg-zinc-50 px-5 py-8 text-center">
                <p className="font-bold text-zinc-950">Esta rutina aun no tiene ejercicios.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="bg-lime-400 p-7 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">Tu siguiente paso</p>
          <h2 className="mt-4 text-2xl font-black text-zinc-950">Guarda tu progreso.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Crea una cuenta para preparar tu espacio de entrenamiento en GymControl.
          </p>
          <Link
            href="/register"
            className="mt-7 block bg-zinc-950 px-5 py-3 text-center text-sm font-bold text-white hover:bg-zinc-800"
          >
            Registrarme
          </Link>
        </aside>
      </section>
    </main>
  );
}
