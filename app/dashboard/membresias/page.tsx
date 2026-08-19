import type { Metadata } from "next";
import { createMembership, renewMembership, updateMembership } from "@/app/dashboard/membresias/actions";
import { MembershipStatusBadge } from "@/components/MembershipStatusBadge";
import { listClients } from "@/lib/clients/server";
import { getMembershipIndicator, listMemberships, membershipStatuses } from "@/lib/memberships/server";

export const metadata: Metadata = {
  title: "Membresias | GymControl",
  description: "Administracion de membresias para owners.",
};

type MembresiasPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function MembresiasPage({ searchParams }: MembresiasPageProps) {
  const [clients, memberships] = await Promise.all([listClients(), listMemberships()]);
  const active = memberships.filter((membership) => getMembershipIndicator(membership) === "active").length;
  const expiring = memberships.filter((membership) => getMembershipIndicator(membership) === "expiring").length;
  const expired = memberships.filter((membership) => getMembershipIndicator(membership) === "expired").length;

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Owner / Membresias
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Control de membresias</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Crea, actualiza y renueva periodos sin tocar usuarios de Supabase Auth.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">{active}</p>
                <p className="mt-1 font-semibold text-zinc-600">Activas</p>
              </div>
              <div className="border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-amber-900">{expiring}</p>
                <p className="mt-1 font-semibold text-amber-800">Por vencer</p>
              </div>
              <div className="border border-red-200 bg-red-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-red-800">{expired}</p>
                <p className="mt-1 font-semibold text-red-700">Vencidas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Nueva membresia</h2>
            <p className="mt-1 text-sm text-zinc-600">Solo para clientes activos.</p>
          </div>

          <form action={createMembership} className="space-y-4 p-5">
            {searchParams?.error ? (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {searchParams.error}
              </p>
            ) : null}
            {searchParams?.success ? (
              <p className="border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                {searchParams.success}
              </p>
            ) : null}

            <div>
              <label htmlFor="clientId" className="text-sm font-bold text-zinc-800">
                Cliente
              </label>
              <select
                id="clientId"
                name="clientId"
                required
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
              >
                <option value="">Seleccionar cliente</option>
                {clients
                  .filter((client) => client.is_active)
                  .map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name} - {client.email}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="planName" className="text-sm font-bold text-zinc-800">
                Tipo de plan
              </label>
              <input
                id="planName"
                name="planName"
                type="text"
                required
                placeholder="Mensual, trimestral, anual"
                className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startsAt" className="text-sm font-bold text-zinc-800">
                  Inicio
                </label>
                <input
                  id="startsAt"
                  name="startsAt"
                  type="date"
                  required
                  defaultValue={today()}
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="endsAt" className="text-sm font-bold text-zinc-800">
                  Fin
                </label>
                <input
                  id="endsAt"
                  name="endsAt"
                  type="date"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="price" className="text-sm font-bold text-zinc-800">
                  Precio
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-bold text-zinc-800">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="ACTIVE"
                  className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                >
                  {membershipStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
            >
              Crear membresia
            </button>
          </form>
        </aside>

        <div className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Membresias registradas</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Expande una fila para actualizar estado o renovar fechas.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {memberships.map((membership) => {
              const renewStart = addDays(membership.ends_at > today() ? membership.ends_at : today(), 1);
              const renewEnd = addDays(renewStart, 30);

              return (
                <details key={membership.id} className="group bg-white open:bg-zinc-50">
                  <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 hover:bg-zinc-50 md:grid-cols-[minmax(0,1fr)_150px_140px_120px] [&::-webkit-details-marker]:hidden">
                    <div>
                      <p className="font-bold text-zinc-950">
                        {membership.client?.full_name ?? "Cliente no disponible"}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">{membership.client?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Plan</p>
                      <p className="mt-1 font-semibold text-zinc-800">{membership.plan_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Vigencia</p>
                      <p className="mt-1 font-semibold text-zinc-800">
                        {formatDate(membership.ends_at)}
                      </p>
                    </div>
                    <div>
                      <MembershipStatusBadge status={membership.status} endsAt={membership.ends_at} />
                    </div>
                  </summary>

                  <div className="grid gap-5 border-t border-zinc-200 px-5 py-5 lg:grid-cols-2">
                    <form action={updateMembership} className="grid gap-4">
                      <input type="hidden" name="membershipId" value={membership.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Plan</label>
                          <input
                            name="planName"
                            type="text"
                            required
                            defaultValue={membership.plan_name}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Estado</label>
                          <select
                            name="status"
                            defaultValue={membership.status}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          >
                            {membershipStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Inicio</label>
                          <input
                            name="startsAt"
                            type="date"
                            required
                            defaultValue={membership.starts_at}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Fin</label>
                          <input
                            name="endsAt"
                            type="date"
                            required
                            defaultValue={membership.ends_at}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Precio</label>
                          <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            defaultValue={membership.price}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="min-h-11 bg-zinc-950 px-5 text-sm font-black text-white transition-colors hover:bg-zinc-800"
                      >
                        Guardar cambios
                      </button>
                    </form>

                    <form action={renewMembership} className="grid content-start gap-4 border border-lime-200 bg-lime-50 p-4">
                      <input type="hidden" name="membershipId" value={membership.id} />
                      <div>
                        <h3 className="font-black text-zinc-950">Renovar membresia</h3>
                        <p className="mt-1 text-sm text-zinc-700">
                          La renovacion deja el estado en ACTIVE.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Nuevo inicio</label>
                          <input
                            name="renewStartsAt"
                            type="date"
                            required
                            defaultValue={renewStart}
                            className="mt-2 min-h-11 w-full border border-lime-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-700"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Nuevo fin</label>
                          <input
                            name="renewEndsAt"
                            type="date"
                            required
                            defaultValue={renewEnd}
                            className="mt-2 min-h-11 w-full border border-lime-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-700"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Precio</label>
                          <input
                            name="renewPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            defaultValue={membership.price}
                            className="mt-2 min-h-11 w-full border border-lime-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-700"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="min-h-11 bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
                      >
                        Renovar
                      </button>
                    </form>
                  </div>
                </details>
              );
            })}
          </div>

          {memberships.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-bold text-zinc-950">Todavia no hay membresias.</p>
              <p className="mt-2 text-sm text-zinc-600">Crea la primera desde el formulario.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
