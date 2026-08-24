import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
          404
        </p>
        <h1 className="mt-4 text-3xl font-black text-zinc-950">
          Pagina no encontrada
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          La ruta no existe o ya no esta disponible.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
