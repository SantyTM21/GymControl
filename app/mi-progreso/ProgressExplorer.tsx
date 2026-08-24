"use client";

import { useMemo, useState } from "react";
import type { ClientWorkoutLog } from "@/lib/workouts/server";

type ProgressExplorerProps = {
  logs: ClientWorkoutLog[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(value));
}

function formatWeight(value: number) {
  return `${new Intl.NumberFormat("es-EC", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)} kg`;
}

function byDateAscending(a: ClientWorkoutLog, b: ClientWorkoutLog) {
  return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
}

export function ProgressExplorer({ logs }: ProgressExplorerProps) {
  const exerciseStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        exerciseId: string;
        exerciseName: string;
        count: number;
        lastDate: string;
        lastWeight: number;
      }
    >();

    for (const log of logs) {
      if (!log.exerciseId) {
        continue;
      }

      const current = stats.get(log.exerciseId);
      const isNewer = !current || new Date(log.fecha) > new Date(current.lastDate);

      stats.set(log.exerciseId, {
        exerciseId: log.exerciseId,
        exerciseName: log.exerciseName,
        count: (current?.count ?? 0) + 1,
        lastDate: isNewer ? log.fecha : current.lastDate,
        lastWeight: isNewer ? log.pesoUtilizado : current.lastWeight,
      });
    }

    return Array.from(stats.values()).sort(
      (a, b) => b.count - a.count || a.exerciseName.localeCompare(b.exerciseName),
    );
  }, [logs]);

  const [selectedExerciseId, setSelectedExerciseId] = useState(exerciseStats[0]?.exerciseId ?? "");
  const selectedExercise = exerciseStats.find((exercise) => exercise.exerciseId === selectedExerciseId);
  const selectedLogs = logs
    .filter((log) => log.exerciseId === selectedExerciseId)
    .sort(byDateAscending);
  const maxWeight = Math.max(...selectedLogs.map((log) => log.pesoUtilizado), 0);
  const minWeight = Math.min(...selectedLogs.map((log) => log.pesoUtilizado), 0);
  const range = Math.max(maxWeight - minWeight, 1);
  const points = selectedLogs.map((log, index) => {
    const x = selectedLogs.length === 1 ? 50 : (index / (selectedLogs.length - 1)) * 100;
    const y = 90 - ((log.pesoUtilizado - minWeight) / range) * 70;
    return { ...log, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-black text-zinc-950">Evolucion del peso</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Selecciona un ejercicio para consultar su historial.
          </p>
        </div>

        <div className="p-5">
          <label htmlFor="exerciseId" className="text-sm font-bold text-zinc-800">
            Ejercicio
          </label>
          <select
            id="exerciseId"
            value={selectedExerciseId}
            onChange={(event) => setSelectedExerciseId(event.target.value)}
            className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
          >
            {exerciseStats.length ? (
              exerciseStats.map((exercise) => (
                <option key={exercise.exerciseId} value={exercise.exerciseId}>
                  {exercise.exerciseName}
                </option>
              ))
            ) : (
              <option value="">Sin ejercicios registrados</option>
            )}
          </select>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
              <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                {selectedLogs.length}
              </p>
              <p className="mt-1 font-semibold text-zinc-600">Registros</p>
            </div>
            <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
              <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                {selectedExercise ? formatWeight(selectedExercise.lastWeight) : "0 kg"}
              </p>
              <p className="mt-1 font-semibold text-zinc-600">Ultimo peso</p>
            </div>
            <div className="border border-lime-200 bg-lime-50 px-4 py-3">
              <p className="font-mono text-2xl font-black tabular-nums text-lime-900">
                {formatWeight(maxWeight)}
              </p>
              <p className="mt-1 font-semibold text-lime-800">Peso maximo</p>
            </div>
          </div>

          <div className="mt-6 border border-zinc-200 bg-zinc-50 p-4">
            {points.length ? (
              <svg viewBox="0 0 100 100" className="h-64 w-full" role="img" aria-label="Evolucion del peso utilizado">
                <line x1="0" y1="90" x2="100" y2="90" className="stroke-zinc-300" strokeWidth="0.8" />
                <line x1="0" y1="20" x2="100" y2="20" className="stroke-zinc-200" strokeWidth="0.5" />
                {points.length > 1 ? (
                  <polyline
                    points={polyline}
                    fill="none"
                    className="stroke-lime-600"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                {points.map((point) => (
                  <g key={point.id}>
                    <circle cx={point.x} cy={point.y} r="2.8" className="fill-zinc-950" />
                    <text
                      x={point.x}
                      y={Math.max(point.y - 6, 8)}
                      textAnchor="middle"
                      className="fill-zinc-700 text-[4px] font-bold"
                    >
                      {point.pesoUtilizado}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm font-semibold text-zinc-600">
                Registra entrenamientos para ver la evolucion.
              </div>
            )}
          </div>

          <div className="mt-4 divide-y divide-zinc-100 border border-zinc-200">
            {selectedLogs.map((log) => (
              <div
                key={log.id}
                className="grid gap-3 bg-white px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_90px_90px_110px]"
              >
                <p className="font-bold text-zinc-950">{formatDate(log.fecha)}</p>
                <p className="font-semibold text-zinc-700">{log.seriesRealizadas} series</p>
                <p className="font-semibold text-zinc-700">{log.repeticiones} reps</p>
                <p className="font-mono font-black tabular-nums text-zinc-950">
                  {formatWeight(log.pesoUtilizado)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-black text-zinc-950">Ejercicios mas utilizados</h2>
          <p className="mt-1 text-sm text-zinc-600">Ordenados por cantidad de registros.</p>
        </div>
        <div className="divide-y divide-zinc-100">
          {exerciseStats.slice(0, 8).map((exercise, index) => (
            <button
              key={exercise.exerciseId}
              type="button"
              onClick={() => setSelectedExerciseId(exercise.exerciseId)}
              className={`grid w-full grid-cols-[40px_minmax(0,1fr)_70px] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-zinc-50 ${
                exercise.exerciseId === selectedExerciseId ? "bg-lime-50" : "bg-white"
              }`}
            >
              <span className="font-mono text-lg font-black text-zinc-950">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-bold text-zinc-950">{exercise.exerciseName}</span>
                <span className="mt-1 block text-xs font-semibold text-zinc-500">
                  Ultimo: {formatWeight(exercise.lastWeight)}
                </span>
              </span>
              <span className="font-mono text-xl font-black tabular-nums text-zinc-950">
                {exercise.count}
              </span>
            </button>
          ))}
        </div>
        {exerciseStats.length === 0 ? (
          <div className="px-5 py-8 text-sm font-semibold text-zinc-600">
            Todavia no hay ejercicios registrados.
          </div>
        ) : null}
      </aside>
    </div>
  );
}
