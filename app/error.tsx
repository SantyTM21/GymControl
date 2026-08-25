"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl border border-red-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
          Error
        </p>
        <h1 className="mt-4 text-3xl font-black text-zinc-950">
          No se pudo cargar esta pantalla.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Ocurrio un problema inesperado. Intenta nuevamente.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
