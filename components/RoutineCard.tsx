import Link from "next/link";
import type { Routine } from "@/types/domain";

export interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <article className="flex h-full flex-col border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">
          {routine.nivel}
        </span>
        <span className="text-sm font-semibold text-zinc-500">
          {routine.duracionMinutos} min
        </span>
      </div>

      <h2 className="mt-7 text-2xl font-black text-zinc-950">{routine.nombre}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
        {routine.descripcion}
      </p>

      <div className="mt-7 border-t border-zinc-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          Objetivo
        </p>
        <p className="mt-1 text-sm font-semibold text-zinc-900">
          {routine.objetivo}
        </p>
      </div>

      <Link
        href={`/rutinas/${routine.id}`}
        className="mt-6 bg-zinc-950 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-lime-400 hover:text-zinc-950"
      >
        Ver detalle
      </Link>
    </article>
  );
}
