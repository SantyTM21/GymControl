export default function Loading() {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
          GymControl
        </p>
        <div className="mt-5 h-10 max-w-md animate-pulse bg-zinc-200" />
        <div className="mt-4 h-5 max-w-2xl animate-pulse bg-zinc-200" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse border border-zinc-200 bg-white" />
          <div className="h-28 animate-pulse border border-zinc-200 bg-white" />
          <div className="h-28 animate-pulse border border-zinc-200 bg-white" />
        </div>
      </section>
    </main>
  );
}
