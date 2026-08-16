import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoutineById, routines } from "@/lib/routines";

type RoutineDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return routines.map((routine) => ({ id: routine.id }));
}

export function generateMetadata({ params }: RoutineDetailPageProps): Metadata {
  const routine = getRoutineById(params.id);

  if (!routine) {
    return { title: "Rutina no encontrada | GymControl" };
  }

  return {
    title: `${routine.nombre} | GymControl`,
    description: routine.descripcion,
  };
}

export default function RoutineDetailPage({ params }: RoutineDetailPageProps) {
  const routine = getRoutineById(params.id);

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
              <span className="bg-lime-400 px-3 py-1.5 text-zinc-950">{routine.nivel}</span>
              <span className="border border-zinc-700 px-3 py-1.5 text-zinc-200">
                {routine.duracionMinutos} minutos
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
          <h2 className="mt-4 text-3xl font-black text-zinc-950">{routine.objetivo}</h2>
          <p className="mt-5 max-w-2xl leading-7 text-zinc-600">
            Esta rutina combina un ritmo sostenible con una seleccion equilibrada de ejercicios para trabajar el objetivo de forma consistente durante toda la sesion.
          </p>
          <div className="mt-10 grid gap-px bg-zinc-200 sm:grid-cols-3">
            <div className="bg-zinc-50 p-5">
              <p className="text-xs font-bold uppercase text-zinc-500">Nivel</p>
              <p className="mt-2 font-bold text-zinc-950">{routine.nivel}</p>
            </div>
            <div className="bg-zinc-50 p-5">
              <p className="text-xs font-bold uppercase text-zinc-500">Duracion</p>
              <p className="mt-2 font-bold text-zinc-950">{routine.duracionMinutos} min</p>
            </div>
            <div className="bg-zinc-50 p-5">
              <p className="text-xs font-bold uppercase text-zinc-500">Objetivo</p>
              <p className="mt-2 font-bold text-zinc-950">{routine.objetivo}</p>
            </div>
          </div>
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
