import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Iniciar sesion | GymControl",
  description: "Accede a tu cuenta de GymControl.",
};

type LoginPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="grid min-h-[calc(100svh-4rem)] bg-zinc-100 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center bg-zinc-950 px-5 py-14 text-white sm:px-10 lg:px-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">Bienvenido de vuelta</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">Retoma el control de tu entrenamiento.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">Tus rutinas y objetivos, siempre listos para la siguiente sesion.</p>
        </div>
      </section>

      <section className="flex items-center px-5 py-14 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black text-zinc-950">Iniciar sesion</h2>
          {searchParams?.error ? (
            <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {searchParams.error}
            </p>
          ) : null}
          {searchParams?.success ? (
            <p className="mt-5 border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
              {searchParams.success}
            </p>
          ) : null}
          <form action={login} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-zinc-800">Correo electronico</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required className="mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-zinc-800">Contrasena</label>
              <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Tu contrasena" required className="mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-lime-600" />
            </div>
            <button type="submit" className="w-full bg-lime-400 px-5 py-3.5 text-sm font-bold text-zinc-950 hover:bg-lime-300">
              Ingresar
            </button>
          </form>
          <p className="mt-6 text-sm text-zinc-600">
            Aun no tienes cuenta?{" "}
            <Link href="/register" className="font-bold text-zinc-950 underline decoration-lime-400 decoration-2 underline-offset-4">Registrate</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
