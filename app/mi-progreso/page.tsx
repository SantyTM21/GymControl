import type { Metadata } from "next";
import { ProgressExplorer } from "@/app/mi-progreso/ProgressExplorer";
import { listClientWorkoutLogs } from "@/lib/workouts/server";

export const metadata: Metadata = {
  title: "Mi progreso | GymControl",
  description: "Progreso personal basado en entrenamientos registrados.",
};

function formatWeight(value: number) {
  return `${new Intl.NumberFormat("es-EC", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)} kg`;
}

export default async function MiProgresoPage() {
  const logs = await listClientWorkoutLogs();
  const trainingDays = new Set(logs.map((log) => new Date(log.fecha).toISOString().slice(0, 10)));
  const lastLog = logs[0];
  const maxWeight = logs.reduce((max, log) => Math.max(max, log.pesoUtilizado), 0);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Cliente / Progreso
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Mi progreso</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Evolucion privada construida solo con tus registros de entrenamiento.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {trainingDays.size}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Entrenamientos</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {logs.length}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Registros</p>
              </div>
              <div className="border border-lime-200 bg-lime-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-lime-900">
                  {lastLog ? formatWeight(lastLog.pesoUtilizado) : formatWeight(0)}
                </p>
                <p className="mt-1 font-semibold text-lime-800">Ultimo peso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 grid gap-3 text-sm sm:grid-cols-3">
          <div className="border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Ejercicios distintos
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-zinc-950">
              {new Set(logs.map((log) => log.exerciseId).filter(Boolean)).size}
            </p>
          </div>
          <div className="border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Peso maximo registrado
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-zinc-950">
              {formatWeight(maxWeight)}
            </p>
          </div>
          <div className="border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Series acumuladas
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-zinc-950">
              {logs.reduce((sum, log) => sum + log.seriesRealizadas, 0)}
            </p>
          </div>
        </div>

        <ProgressExplorer logs={logs} />
      </section>
    </main>
  );
}
