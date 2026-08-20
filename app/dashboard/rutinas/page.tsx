import type { Metadata } from "next";
import {
  createRoutine,
  deleteRoutine,
  publishRoutine,
  updateRoutine,
} from "@/app/dashboard/rutinas/actions";
import {
  routineLevelLabels,
  routineLevels,
  routineObjectiveLabels,
  routineObjectives,
} from "@/lib/routine-options";
import { listOwnerRoutines } from "@/lib/routines/server";

export const metadata: Metadata = {
  title: "Rutinas | GymControl",
  description: "Creacion, edicion y publicacion de rutinas del gimnasio.",
};

type DashboardRutinasPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardRutinasPage({ searchParams }: DashboardRutinasPageProps) {
  const routines = await listOwnerRoutines();
  const published = routines.filter((routine) => routine.publicado).length;
  const drafts = routines.length - published;

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Owner / Rutinas
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Administrar rutinas</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Crea borradores, edita planes y publica solo las rutinas listas para visitantes.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {routines.length}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Total</p>
              </div>
              <div className="border border-lime-200 bg-lime-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-lime-900">
                  {published}
                </p>
                <p className="mt-1 font-semibold text-lime-800">Publicadas</p>
              </div>
              <div className="border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-amber-900">
                  {drafts}
                </p>
                <p className="mt-1 font-semibold text-amber-800">Borradores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Nueva rutina</h2>
            <p className="mt-1 text-sm text-zinc-600">Se guarda con tu usuario como creador.</p>
          </div>

          <form action={createRoutine} className="space-y-4 p-5">
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
              <label htmlFor="name" className="text-sm font-bold text-zinc-800">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
                placeholder="Fuerza total"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-bold text-zinc-800">
                Descripcion
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-2 w-full resize-y border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
                placeholder="Resumen del plan y enfoque de entrenamiento"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="objective" className="text-sm font-bold text-zinc-800">
                  Objetivo
                </label>
                <select
                  id="objective"
                  name="objective"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                >
                  {routineObjectives.map((objective) => (
                    <option key={objective} value={objective}>
                      {routineObjectiveLabels[objective]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="level" className="text-sm font-bold text-zinc-800">
                  Nivel
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                >
                  {routineLevels.map((level) => (
                    <option key={level} value={level}>
                      {routineLevelLabels[level]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <div>
                <label htmlFor="duration" className="text-sm font-bold text-zinc-800">
                  Duracion
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
              <label className="flex min-h-11 items-center gap-2 border border-zinc-300 bg-zinc-50 px-3 text-sm font-bold text-zinc-800">
                <input name="isPublished" type="checkbox" className="h-4 w-4 accent-lime-500" />
                Publicar
              </label>
            </div>

            <button
              type="submit"
              className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
            >
              Crear rutina
            </button>
          </form>
        </aside>

        <div className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Tus rutinas</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Solo puedes modificar rutinas creadas por tu usuario OWNER.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {routines.map((routine) => (
              <details key={routine.id} className="group bg-white open:bg-zinc-50">
                <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 hover:bg-zinc-50 md:grid-cols-[minmax(0,1fr)_140px_120px_120px] [&::-webkit-details-marker]:hidden">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-zinc-950">{routine.nombre}</p>
                      <span
                        className={`px-2.5 py-1 text-xs font-bold ${
                          routine.publicado
                            ? "bg-lime-100 text-lime-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {routine.publicado ? "Publicada" : "Borrador"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {routine.descripcion}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Objetivo
                    </p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {routineObjectiveLabels[routine.objetivo]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Nivel</p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {routineLevelLabels[routine.nivel]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Duracion
                    </p>
                    <p className="mt-1 font-mono font-black tabular-nums text-zinc-950">
                      {routine.duracionMinutos} min
                    </p>
                  </div>
                </summary>

                <div className="grid gap-5 border-t border-zinc-200 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_180px]">
                  <form action={updateRoutine} className="grid gap-4">
                    <input type="hidden" name="routineId" value={routine.id} />
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                      <div>
                        <label className="text-sm font-bold text-zinc-800">Nombre</label>
                        <input
                          name="name"
                          type="text"
                          required
                          minLength={2}
                          defaultValue={routine.nombre}
                          className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-zinc-800">Duracion</label>
                        <input
                          name="duration"
                          type="number"
                          min="1"
                          step="1"
                          required
                          defaultValue={routine.duracionMinutos}
                          className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-zinc-800">Descripcion</label>
                      <textarea
                        name="description"
                        rows={3}
                        required
                        defaultValue={routine.descripcion}
                        className="mt-2 w-full resize-y border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-sm font-bold text-zinc-800">Objetivo</label>
                        <select
                          name="objective"
                          required
                          defaultValue={routine.objetivo}
                          className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                        >
                          {routineObjectives.map((objective) => (
                            <option key={objective} value={objective}>
                              {routineObjectiveLabels[objective]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-zinc-800">Nivel</label>
                        <select
                          name="level"
                          required
                          defaultValue={routine.nivel}
                          className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                        >
                          {routineLevels.map((level) => (
                            <option key={level} value={level}>
                              {routineLevelLabels[level]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="mt-7 flex min-h-11 items-center gap-2 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-800">
                        <input
                          name="isPublished"
                          type="checkbox"
                          defaultChecked={routine.publicado}
                          className="h-4 w-4 accent-lime-500"
                        />
                        Publicada
                      </label>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-semibold text-zinc-500">
                        Creada: {formatDate(routine.createdAt)} / ID creador: {routine.createdBy}
                      </p>
                      <button
                        type="submit"
                        className="min-h-11 bg-zinc-950 px-5 text-sm font-black text-white transition-colors hover:bg-zinc-800"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </form>

                  <div className="grid content-start gap-3">
                    {!routine.publicado ? (
                      <form action={publishRoutine}>
                        <input type="hidden" name="routineId" value={routine.id} />
                        <button
                          type="submit"
                          className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
                        >
                          Publicar
                        </button>
                      </form>
                    ) : null}
                    <form action={deleteRoutine}>
                      <input type="hidden" name="routineId" value={routine.id} />
                      <button
                        type="submit"
                        className="min-h-11 w-full border border-red-200 bg-red-50 px-5 text-sm font-black text-red-700 transition-colors hover:bg-red-100"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {routines.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-bold text-zinc-950">Todavia no tienes rutinas.</p>
              <p className="mt-2 text-sm text-zinc-600">Crea la primera desde el formulario.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
