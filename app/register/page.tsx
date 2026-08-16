import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crear cuenta | GymControl",
  description: "Crea tu cuenta de GymControl.",
};

export default function RegisterPage() {
  return (
    <main className="grid min-h-[calc(100svh-4rem)] bg-zinc-100 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center bg-lime-400 px-5 py-14 sm:px-10 lg:px-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">Empieza tu recorrido</p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-zinc-950 sm:text-6xl">Convierte tus objetivos en un plan.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-700">Crea tu espacio y prepara el camino para entrenar con constancia.</p>
        </div>
      </section>

      <section className="flex items-center px-5 py-14 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black text-zinc-950">Crear cuenta</h2>
          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-bold text-zinc-800">Nombre</label>
              <input id="name" name="name" type="text" autoComplete="name" placeholder="Tu nombre" className="mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold text-zinc-800">Correo electronico</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" className="mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-zinc-800">Contrasena</label>
              <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Crea una contrasena" className="mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600" />
            </div>
            <button type="button" className="w-full bg-zinc-950 px-5 py-3.5 text-sm font-bold text-white hover:bg-zinc-800">
              Registrarme
            </button>
          </form>
          <p className="mt-6 text-sm text-zinc-600">
            Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-bold text-zinc-950 underline decoration-lime-400 decoration-2 underline-offset-4">Inicia sesion</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
