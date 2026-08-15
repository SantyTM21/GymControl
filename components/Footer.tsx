import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <span className="flex h-8 w-8 items-center justify-center bg-lime-400 text-sm font-black text-zinc-950">
              GC
            </span>
            <span className="text-lg font-extrabold">GymControl</span>
          </Link>
          <p className="mt-4 text-sm leading-6">
            Entrena con estructura, registra tu avance y manten tus objetivos siempre a la vista.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Explorar</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/" className="hover:text-lime-400">Inicio</Link>
            <Link href="/#rutinas" className="hover:text-lime-400">Rutinas</Link>
            <Link href="/#ejercicios" className="hover:text-lime-400">Ejercicios</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Cuenta</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/#acceso" className="hover:text-lime-400">Iniciar sesion</Link>
            <Link href="/#registro" className="hover:text-lime-400">Registrarse</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>&copy; {new Date().getFullYear()} GymControl. Todos los derechos reservados.</p>
          <p>Hecho para avanzar, una repeticion a la vez.</p>
        </div>
      </div>
    </footer>
  );
}
