import Image from "next/image";
import type { ExternalExercise } from "@/types/external-exercise";

export interface ExerciseCardProps {
  exercise: ExternalExercise;
  index?: number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <article className="flex h-full flex-col bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {exercise.imagenUrl ? (
          <Image
            src={exercise.imagenUrl}
            alt={`Demostracion de ${exercise.nombre}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-zinc-400">
            Sin imagen disponible
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-black text-lime-700">
          {typeof index === "number" ? String(index + 1).padStart(2, "0") : exercise.grupoMuscular}
        </p>
        <span className="bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
          {exercise.grupoMuscular}
        </span>
        </div>
        <h2 className="mt-8 text-2xl font-black text-zinc-950">{exercise.nombre}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">{exercise.descripcion}</p>
        <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-5 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase text-zinc-500">Grupo</dt>
            <dd className="mt-1 font-semibold text-zinc-950">{exercise.grupoMuscular}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-zinc-500">Equipo</dt>
            <dd className="mt-1 font-semibold text-zinc-950">{exercise.equipamiento}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
