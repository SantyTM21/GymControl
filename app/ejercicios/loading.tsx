export default function ExercisesLoading() {
  return (
    <main aria-busy="true" aria-label="Cargando ejercicios">
      <section className="bg-lime-400">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="h-3 w-52 animate-pulse bg-zinc-800/20" />
          <div className="mt-6 h-14 max-w-2xl animate-pulse bg-zinc-800/20" />
          <div className="mt-5 h-6 max-w-xl animate-pulse bg-zinc-800/20" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="bg-white">
              <div className="aspect-[4/3] animate-pulse bg-zinc-200" />
              <div className="p-7 sm:p-8">
                <div className="h-3 w-20 animate-pulse bg-zinc-200" />
                <div className="mt-8 h-7 w-2/3 animate-pulse bg-zinc-200" />
                <div className="mt-4 h-16 animate-pulse bg-zinc-100" />
                <div className="mt-7 h-12 animate-pulse border-t border-zinc-200 bg-zinc-50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
