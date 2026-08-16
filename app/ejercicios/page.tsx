import type { Metadata } from "next";
import Link from "next/link";

const muscleGroups = [
  { name: "Pecho", description: "Empujes horizontales y control del tren superior." },
  { name: "Espalda", description: "Jalones, remos y estabilidad escapular." },
  { name: "Piernas", description: "Fuerza, estabilidad y potencia del tren inferior." },
  { name: "Hombros", description: "Movilidad y fuerza en distintos planos." },
  { name: "Brazos", description: "Trabajo complementario de biceps y triceps." },
  { name: "Core", description: "Control, postura y transferencia de fuerza." },
];

export const metadata: Metadata = {
  title: "Ejercicios | GymControl",
  description: "Explora ejercicios organizados por grupo muscular.",
};

export default function ExercisesPage() {
  return (
    <main>
      <section className="bg-lime-400">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">
            Biblioteca de movimientos
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-zinc-950 sm:text-6xl">
            Conoce los ejercicios. Mejora tu tecnica.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Explora movimientos por grupo muscular y encuentra nuevas opciones para tus entrenamientos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {muscleGroups.map((group, index) => (
            <article key={group.name} className="bg-white p-7 sm:p-8">
              <p className="text-sm font-black text-lime-700">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-8 text-2xl font-black text-zinc-950">{group.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{group.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-200 pt-10 sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg font-semibold text-zinc-950">
            Usa estos grupos como punto de partida para elegir una rutina completa.
          </p>
          <Link href="/rutinas" className="bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">
            Explorar rutinas
          </Link>
        </div>
      </section>
    </main>
  );
}
