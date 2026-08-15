import Link from "next/link";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Rutinas", href: "/#rutinas" },
  { label: "Ejercicios", href: "/#ejercicios" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950 text-white">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Navegacion principal"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="GymControl - Inicio">
          <span className="flex h-8 w-8 items-center justify-center bg-lime-400 text-sm font-black text-zinc-950">
            GC
          </span>
          <span className="text-lg font-extrabold">GymControl</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-lime-400"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/#acceso"
            className="px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-lime-400"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/#registro"
            className="bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-300"
          >
            Registrarse
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-zinc-700 text-white [&::-webkit-details-marker]:hidden"
            aria-label="Abrir menu"
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5 group-open:hidden" aria-hidden="true">
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
            </span>
            <span className="hidden text-2xl leading-none group-open:block" aria-hidden="true">
              &times;
            </span>
          </summary>
          <div className="absolute right-0 top-12 w-64 border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
            <div className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-b border-zinc-800 px-3 py-3 text-sm font-medium text-zinc-200 hover:text-lime-400"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/#acceso" className="px-3 py-3 text-sm font-semibold text-white">
                Iniciar sesion
              </Link>
              <Link
                href="/#registro"
                className="mt-2 bg-lime-400 px-3 py-3 text-center text-sm font-bold text-zinc-950"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
