import type { Metadata } from "next";
import { createWorkoutLog } from "@/app/mi-rutina/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { listClientWorkoutLogs, listClientWorkoutRoutines } from "@/lib/workouts/server";

export const metadata: Metadata = {
  title: "Mi rutina | GymControl",
  description: "Registro de entrenamiento para clientes.",
};

type MiRutinaPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(value));
}

function formatWeight(value: number) {
  return `${new Intl.NumberFormat("es-EC", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)} kg`;
}

export default async function MiRutinaPage({ searchParams }: MiRutinaPageProps) {
  const [routines, logs] = await Promise.all([
    listClientWorkoutRoutines(),
    listClientWorkoutLogs(),
  ]);
  const exerciseOptions = routines.flatMap((routine) =>
    routine.ejercicios.map((exercise) => ({
      routineId: routine.id,
      routineName: routine.nombre,
      exercise,
    })),
  );
  const totalSeries = logs.reduce((sum, log) => sum + log.seriesRealizadas, 0);
  const maxWeight = logs.reduce((max, log) => Math.max(max, log.pesoUtilizado), 0);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Cliente / Mi rutina
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Seguimiento de entrenamiento</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Registra series, repeticiones y peso utilizado por ejercicio.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {logs.length}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Registros</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {totalSeries}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Series</p>
              </div>
              <div className="border border-lime-200 bg-lime-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-lime-900">
                  {formatWeight(maxWeight)}
                </p>
                <p className="mt-1 font-semibold text-lime-800">Mayor peso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Nuevo registro</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Solo se guardan registros asociados a tu usuario CLIENT.
            </p>
          </div>

          <form action={createWorkoutLog} className="space-y-4 p-5">
            {searchParams?.error ? (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {searchParams.error}
              </p>
            ) : null}
            {searchParams?.success ? (
              <p className="border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                {searchParams.success}
              </p>
            ) : null}

            <div>
              <label htmlFor="fecha" className="text-sm font-bold text-zinc-800">
                Fecha
              </label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                required
                defaultValue={today()}
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="ejercicio" className="text-sm font-bold text-zinc-800">
                Ejercicio
              </label>
              <select
                id="ejercicio"
                name="ejercicio"
                required
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
              >
                <option value="">Seleccionar ejercicio</option>
                {routines.map((routine) =>
                  routine.ejercicios.length ? (
                    <optgroup key={routine.id} label={routine.nombre}>
                      {routine.ejercicios.map((exercise) => (
                        <option
                          key={exercise.id}
                          value={`${routine.id}:${exercise.id}`}
                        >
                          {exercise.orden}. {exercise.nombreEjercicio}
                        </option>
                      ))}
                    </optgroup>
                  ) : null,
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="seriesRealizadas" className="text-sm font-bold text-zinc-800">
                  Series realizadas
                </label>
                <input
                  id="seriesRealizadas"
                  name="seriesRealizadas"
                  type="number"
                  min="0"
                  step="1"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="repeticiones" className="text-sm font-bold text-zinc-800">
                  Repeticiones
                </label>
                <input
                  id="repeticiones"
                  name="repeticiones"
                  type="number"
                  min="0"
                  step="1"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pesoUtilizado" className="text-sm font-bold text-zinc-800">
                Peso utilizado
              </label>
              <input
                id="pesoUtilizado"
                name="pesoUtilizado"
                type="number"
                min="0"
                step="0.01"
                required
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
              />
            </div>

            <SubmitButton
              pendingLabel="Registrando..."
              disabled={exerciseOptions.length === 0}
              className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
            >
              Registrar entrenamiento
            </SubmitButton>
          </form>
        </aside>

        <div className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Mis registros</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Historial privado de entrenamientos registrados por tu cuenta.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {logs.map((log) => (
              <article
                key={log.id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_120px_120px_120px_120px]"
              >
                <div>
                  <p className="font-bold text-zinc-950">{log.exerciseName}</p>
                  <p className="mt-1 text-sm text-zinc-500">{log.routineName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Fecha</p>
                  <p className="mt-1 font-semibold text-zinc-800">{formatDate(log.fecha)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Series</p>
                  <p className="mt-1 font-mono font-black tabular-nums text-zinc-950">
                    {log.seriesRealizadas}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Reps</p>
                  <p className="mt-1 font-mono font-black tabular-nums text-zinc-950">
                    {log.repeticiones}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Peso</p>
                  <p className="mt-1 font-mono font-black tabular-nums text-zinc-950">
                    {formatWeight(log.pesoUtilizado)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {logs.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-bold text-zinc-950">Todavia no tienes registros.</p>
              <p className="mt-2 text-sm text-zinc-600">
                Registra tu primer ejercicio desde el formulario.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
