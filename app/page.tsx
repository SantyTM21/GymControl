import Image from "next/image";
import Link from "next/link";
import { homeBenefits } from "@/lib/mock-data";

export default function Home() {
  return (
    <main>
      <section id="inicio" className="relative h-[calc(100svh-5rem)] min-h-[560px] max-h-[820px] overflow-hidden bg-zinc-900">
        <Image
          src="/images/gymcontrol-hero.png"
          alt="Atleta entrenando con poleas en un gimnasio moderno"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-black/55 sm:bg-black/45" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl text-white">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-400 sm:text-sm">
              <span className="h-0.5 w-8 bg-lime-400" />
              Entrena. Registra. Superate.
            </p>
            <h1 className="text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              Tu progreso merece un plan.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg">
              GymControl organiza tus rutinas, ejercicios y avances para que cada entrenamiento tenga un proposito claro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="bg-lime-400 px-6 py-3.5 text-center text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-300"
              >
                Comenzar ahora
              </Link>
              <Link
                href="#beneficios"
                className="border border-white/60 px-6 py-3.5 text-center text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-zinc-950"
              >
                Conocer mas
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 hidden bg-lime-400 px-8 py-5 text-zinc-950 sm:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Tu siguiente nivel</p>
          <p className="mt-1 text-sm font-medium">Empieza con estructura.</p>
        </div>
      </section>

      <section id="rutinas" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">Menos improvisacion</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
              Entrena con claridad, no por inercia.
            </h2>
          </div>
          <div className="border-l-4 border-lime-400 pl-6 sm:pl-8">
            <p className="text-lg leading-8 text-zinc-600">
              GymControl convierte tus objetivos en una experiencia simple: sabes que entrenar, puedes consultar cada ejercicio y mantienes tu progreso organizado desde un mismo lugar.
            </p>
          </div>
        </div>
      </section>

      <section id="beneficios" className="bg-zinc-100 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">Hecho para avanzar</p>
            <h2 className="mt-4 text-3xl font-black text-zinc-950 sm:text-5xl">Todo lo esencial. Sin distracciones.</h2>
          </div>
          <div className="mt-12 grid border-y border-zinc-300 md:grid-cols-3">
            {homeBenefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-b border-zinc-300 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="text-sm font-black text-lime-700">{benefit.number}</p>
                <h3 className="mt-8 text-xl font-bold text-zinc-950">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ejercicios" className="bg-lime-400 py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">Empieza hoy</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
              Cada gran cambio comienza con una repeticion.
            </h2>
          </div>
          <Link
            href="/register"
            className="shrink-0 bg-zinc-950 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>
    </main>
  );
}
