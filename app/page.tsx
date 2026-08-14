import { RoleCard } from "@/components/RoleCard";
import { roles } from "@/lib/roles";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            GymControl
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">
            Control simple para administrar tu gimnasio.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Plataforma inicial para gestionar operaciones del gimnasio con dos
            roles principales: OWNER y CLIENT.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.role} {...role} />
          ))}
        </div>
      </section>
    </main>
  );
}
