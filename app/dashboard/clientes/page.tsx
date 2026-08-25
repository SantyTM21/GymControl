import type { Metadata } from "next";
import Link from "next/link";
import {
  activateClient,
  deactivateClient,
  updateClient,
} from "@/app/dashboard/clientes/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { getClient, listClients } from "@/lib/clients/server";

export const metadata: Metadata = {
  title: "Clientes | GymControl",
  description: "Administracion de clientes para owners.",
};

type ClientesPageProps = {
  searchParams?: {
    q?: string;
    cliente?: string;
    error?: string;
    success?: string;
  };
};

function formatDate(value: string | null) {
  if (!value) {
    return "No registrado";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function clientsHref(clientId: string, search?: string) {
  const params = new URLSearchParams({ cliente: clientId });

  if (search?.trim()) {
    params.set("q", search.trim());
  }

  return `/dashboard/clientes?${params.toString()}`;
}

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const search = searchParams?.q?.trim() ?? "";
  const clients = await listClients(search);
  const selectedClientId = searchParams?.cliente ?? clients[0]?.id;
  const selectedClient = await getClient(selectedClientId);
  const activeCount = clients.filter((client) => client.is_active).length;

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Owner / Clientes
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Administrar clientes</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Gestiona perfiles CLIENT sin eliminar usuarios de Supabase Auth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {clients.length}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Resultados</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {activeCount}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Activos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:px-10">
        <div className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-4 sm:p-5">
            {searchParams?.error ? (
              <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {searchParams.error}
              </p>
            ) : null}
            {searchParams?.success ? (
              <p className="mb-4 border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                {searchParams.success}
              </p>
            ) : null}
            <form className="flex flex-col gap-3 sm:flex-row" action="/dashboard/clientes">
              <label className="sr-only" htmlFor="q">
                Buscar cliente
              </label>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={search}
                placeholder="Buscar por nombre o correo"
                className="min-h-11 flex-1 border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
              />
              <button
                type="submit"
                className="min-h-11 bg-zinc-950 px-5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Cliente</th>
                  <th className="px-5 py-3 font-bold">Estado</th>
                  <th className="px-5 py-3 font-bold">Alta</th>
                  <th className="px-5 py-3 font-bold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clients.map((client) => {
                  const selected = client.id === selectedClient?.id;

                  return (
                    <tr key={client.id} className={selected ? "bg-lime-50" : "bg-white"}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-zinc-950">{client.full_name}</p>
                        <p className="mt-1 text-zinc-500">{client.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-bold ${
                            client.is_active
                              ? "bg-lime-100 text-lime-800"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {client.is_active ? "Activo" : "Desactivado"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-zinc-600">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={clientsHref(client.id, search)}
                          className="font-bold text-zinc-950 underline decoration-lime-400 decoration-2 underline-offset-4"
                        >
                          Consultar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {clients.length === 0 ? (
            <div className="border-t border-zinc-200 px-5 py-10 text-center">
              <p className="font-bold text-zinc-950">No hay clientes para mostrar.</p>
              <p className="mt-2 text-sm text-zinc-600">
                Ajusta la busqueda o registra usuarios CLIENT desde el flujo publico.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Detalle del cliente</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Solo se editan campos permitidos del perfil.
            </p>
          </div>

          {selectedClient ? (
            <div className="space-y-6 p-5">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                  <span className="font-semibold text-zinc-500">Rol</span>
                  <span className="font-bold text-zinc-950">CLIENT</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                  <span className="font-semibold text-zinc-500">Estado</span>
                  <span className="font-bold text-zinc-950">
                    {selectedClient.is_active ? "Activo" : "Desactivado"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                  <span className="font-semibold text-zinc-500">Ultima actualizacion</span>
                  <span className="text-right font-medium text-zinc-700">
                    {formatDate(selectedClient.updated_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-zinc-500">Desactivado</span>
                  <span className="text-right font-medium text-zinc-700">
                    {formatDate(selectedClient.deactivated_at)}
                  </span>
                </div>
              </div>

              <form action={updateClient} className="space-y-4">
                <input type="hidden" name="clientId" value={selectedClient.id} />
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
                    defaultValue={selectedClient.full_name}
                    className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-bold text-zinc-800">
                    Correo de perfil
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={selectedClient.email}
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
                    defaultValue={selectedClient.avatar_url ?? ""}
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

              <form action={selectedClient.is_active ? deactivateClient : activateClient}>
                <input type="hidden" name="clientId" value={selectedClient.id} />
                <SubmitButton
                  pendingLabel={selectedClient.is_active ? "Desactivando..." : "Reactivando..."}
                  confirmMessage={
                    selectedClient.is_active
                      ? `Seguro que quieres desactivar a ${selectedClient.full_name}?`
                      : undefined
                  }
                  className={`min-h-11 w-full px-5 text-sm font-black transition-colors ${
                    selectedClient.is_active
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-lime-400 text-zinc-950 hover:bg-lime-300"
                  }`}
                >
                  {selectedClient.is_active ? "Desactivar cliente" : "Reactivar cliente"}
                </SubmitButton>
              </form>
            </div>
          ) : (
            <div className="p-5">
              <p className="text-sm font-semibold text-zinc-600">
                Selecciona un cliente para consultar su detalle.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
