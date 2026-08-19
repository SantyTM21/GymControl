import type { Metadata } from "next";
import { MembershipStatusBadge } from "@/components/MembershipStatusBadge";
import { getClientMemberships, getMembershipIndicator } from "@/lib/memberships/server";

export const metadata: Metadata = {
  title: "Mi membresia | GymControl",
  description: "Consulta privada de membresia para clientes.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
  }).format(value);
}

export default async function MiMembresiaPage() {
  const memberships = await getClientMemberships();
  const current = memberships[0];
  const history = memberships.slice(1);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Cliente / Membresia
          </p>
          <h1 className="mt-4 text-4xl font-black text-zinc-950">Mi membresia</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Consulta el plan, vigencia y estado de tu membresia registrada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {current ? (
          <div className="border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950">{current.plan_name}</h2>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">
                    {formatDate(current.starts_at)} - {formatDate(current.ends_at)}
                  </p>
                </div>
                <MembershipStatusBadge status={current.status} endsAt={current.ends_at} />
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Precio</p>
                <p className="mt-2 font-mono text-2xl font-black text-zinc-950">
                  {formatMoney(current.price, current.currency)}
                </p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Estado base</p>
                <p className="mt-2 font-mono text-2xl font-black text-zinc-950">{current.status}</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Indicador</p>
                <p className="mt-2 font-mono text-2xl font-black text-zinc-950">
                  {getMembershipIndicator(current).toUpperCase()}
                </p>
              </div>
            </div>

            {history.length ? (
              <div className="border-t border-zinc-200 px-5 py-5">
                <h3 className="font-black text-zinc-950">Historial</h3>
                <div className="mt-4 divide-y divide-zinc-100 border border-zinc-200">
                  {history.map((membership) => (
                    <div
                      key={membership.id}
                      className="flex flex-col gap-3 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-bold text-zinc-950">{membership.plan_name}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {formatDate(membership.starts_at)} - {formatDate(membership.ends_at)}
                        </p>
                      </div>
                      <MembershipStatusBadge status={membership.status} endsAt={membership.ends_at} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-white px-5 py-10 text-center">
            <p className="font-bold text-zinc-950">No tienes una membresia registrada.</p>
            <p className="mt-2 text-sm text-zinc-600">
              Contacta al gimnasio para activar tu plan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
