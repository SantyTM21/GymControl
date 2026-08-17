"use client";

import { useState } from "react";
import { RoutineCard } from "@/components/RoutineCard";
import {
  routineLevelLabels,
  routineLevels,
  routineObjectiveLabels,
  routineObjectives,
} from "@/lib/routine-options";
import type { Routine, RoutineLevel, RoutineObjective } from "@/types/domain";

type LevelFilter = RoutineLevel | "TODOS";
type ObjectiveFilter = RoutineObjective | "TODOS";

export interface RoutineExplorerProps {
  routines: Routine[];
}

export function RoutineExplorer({ routines }: RoutineExplorerProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelFilter>("TODOS");
  const [objective, setObjective] = useState<ObjectiveFilter>("TODOS");

  const normalizedSearch = search.trim().toLocaleLowerCase("es");
  const filteredRoutines = routines.filter((routine) => {
    const matchesSearch = routine.nombre
      .toLocaleLowerCase("es")
      .includes(normalizedSearch);
    const matchesLevel = level === "TODOS" || routine.nivel === level;
    const matchesObjective =
      objective === "TODOS" || routine.objetivo === objective;

    return matchesSearch && matchesLevel && matchesObjective;
  });

  const hasActiveFilters =
    normalizedSearch.length > 0 || level !== "TODOS" || objective !== "TODOS";

  function clearFilters() {
    setSearch("");
    setLevel("TODOS");
    setObjective("TODOS");
  }

  return (
    <div>
      <div className="border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <label htmlFor="routine-search" className="text-sm font-bold text-zinc-800">
              Buscar por nombre
            </label>
            <input
              id="routine-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. Fuerza total"
              className="mt-2 h-12 w-full border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600"
            />
          </div>

          <div>
            <label htmlFor="routine-level" className="text-sm font-bold text-zinc-800">
              Nivel
            </label>
            <select
              id="routine-level"
              value={level}
              onChange={(event) => setLevel(event.target.value as LevelFilter)}
              className="mt-2 h-12 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition-colors focus:border-lime-600"
            >
              <option value="TODOS">Todos los niveles</option>
              {routineLevels.map((option) => (
                <option key={option} value={option}>
                  {routineLevelLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="routine-objective" className="text-sm font-bold text-zinc-800">
              Objetivo
            </label>
            <select
              id="routine-objective"
              value={objective}
              onChange={(event) =>
                setObjective(event.target.value as ObjectiveFilter)
              }
              className="mt-2 h-12 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition-colors focus:border-lime-600"
            >
              <option value="TODOS">Todos los objetivos</option>
              {routineObjectives.map((option) => (
                <option key={option} value={option}>
                  {routineObjectiveLabels[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex min-h-9 flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5">
          <p className="text-sm text-zinc-600" aria-live="polite">
            <span className="font-bold text-zinc-950">{filteredRoutines.length}</span>{" "}
            {filteredRoutines.length === 1 ? "rutina encontrada" : "rutinas encontradas"}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-zinc-700 underline decoration-lime-400 decoration-2 underline-offset-4 hover:text-zinc-950"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {filteredRoutines.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-zinc-200 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-black text-zinc-950">No encontramos rutinas.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600">
            Ajusta la busqueda o cambia los filtros para ver otras opciones.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 bg-zinc-950 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800"
          >
            Ver todas las rutinas
          </button>
        </div>
      )}
    </div>
  );
}
