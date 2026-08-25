import type { Metadata } from "next";
import { updateOwnProfile } from "@/app/perfil/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { requireProfile } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Perfil | GymControl",
  description: "Informacion privada de la cuenta autenticada.",
};

type PerfilPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

export default async function PerfilPage({ searchParams }: PerfilPageProps) {
  const profile = await requireProfile();

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Cuenta / Perfil
          </p>
          <h1 className="mt-4 text-4xl font-black text-zinc-950">Mi perfil</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Consulta los datos asociados a tu sesion y actualiza tu informacion personal.
          </p>

          <div className="mt-8 border border-zinc-200 bg-white p-5 sm:p-6">
            {searchParams?.error ? (
              <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {searchParams.error}
              </p>
            ) : null}
            {searchParams?.success ? (
              <p className="mb-5 border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                {searchParams.success}
              </p>
            ) : null}

            <form action={updateOwnProfile} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-sm font-bold text-zinc-800">
                  Nombre
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  defaultValue={profile.full_name}
                  autoComplete="name"
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="text-sm font-bold text-zinc-800">
                  Avatar URL
                </label>
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  inputMode="url"
                  defaultValue={profile.avatar_url ?? ""}
                  placeholder="https://..."
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
                />
              </div>
              <SubmitButton
                pendingLabel="Guardando..."
                className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
              >
                Guardar cambios
              </SubmitButton>
            </form>
          </div>
        </div>

        <aside className="h-fit border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-black text-zinc-950">Datos de cuenta</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="border-b border-zinc-100 pb-4">
              <dt className="font-semibold text-zinc-500">Correo</dt>
              <dd className="mt-1 break-all font-bold text-zinc-950">{profile.email}</dd>
            </div>
            <div className="border-b border-zinc-100 pb-4">
              <dt className="font-semibold text-zinc-500">Rol</dt>
              <dd className="mt-1 font-bold text-zinc-950">{profile.role}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Estado</dt>
              <dd className="mt-1 font-bold text-zinc-950">
                {profile.is_active ? "Activo" : "Desactivado"}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
