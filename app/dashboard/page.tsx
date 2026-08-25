import Link from "next/link";
import { requireProfile } from "@/lib/auth/server";

type DashboardPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

const ownerActions = [
  {
    title: "Clientes",
    description: "Consulta y administra perfiles CLIENT activos o desactivados.",
    href: "/dashboard/clientes",
  },
  {
    title: "Membresias",
    description: "Gestiona planes, vigencias, estados y renovaciones.",
    href: "/dashboard/membresias",
  },
  {
    title: "Pagos",
    description: "Registra, edita y consulta pagos asociados a membresias.",
    href: "/dashboard/pagos",
  },
  {
    title: "Rutinas",
    description: "Crea, edita, publica y ordena ejercicios de rutinas.",
    href: "/dashboard/rutinas",
  },
];

const clientActions = [
  {
    title: "Mi rutina",
    description: "Registra tus series, repeticiones y peso utilizado.",
    href: "/mi-rutina",
  },
  {
    title: "Mi progreso",
    description: "Consulta entrenamientos, pesos e historial por ejercicio.",
    href: "/mi-progreso",
  },
  {
    title: "Mi membresia",
    description: "Revisa el estado y vigencia de tus membresias.",
    href: "/mi-membresia",
  },
  {
    title: "Mis pagos",
    description: "Consulta los pagos asociados a tus membresias.",
    href: "/mis-pagos",
  },
  {
    title: "Rutinas publicas",
    description: "Explora rutinas publicadas por el gimnasio.",
    href: "/rutinas",
  },
];

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const profile = await requireProfile();
  const actions = profile.role === "OWNER" ? ownerActions : clientActions;

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        {searchParams?.error ? (
          <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {searchParams.error}
          </p>
        ) : null}
        {searchParams?.success ? (
          <p className="mb-6 border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
            {searchParams.success}
          </p>
        ) : null}

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
          {profile.role === "OWNER" ? "Owner / Dashboard" : "Cliente / Inicio"}
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-zinc-950">
              {profile.role === "OWNER" ? "Panel de administracion" : "Tu espacio de entrenamiento"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              {profile.role === "OWNER"
                ? "Accede a las areas operativas del gimnasio desde un mismo lugar."
                : "Consulta tu informacion y registra el avance de tus entrenamientos."}
            </p>
          </div>
          <div className="border border-zinc-200 bg-white px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Sesion</p>
            <p className="mt-1 text-sm font-black text-zinc-950">{profile.full_name}</p>
            <p className="mt-1 text-xs font-semibold text-zinc-500">{profile.role}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="border border-zinc-200 bg-white p-5 transition-colors hover:border-lime-400 hover:bg-lime-50"
            >
              <h2 className="text-lg font-black text-zinc-950">{action.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
