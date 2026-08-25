import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/server";
import { listPayments } from "@/lib/payments/server";

export const metadata: Metadata = {
  title: "Mis pagos | GymControl",
  description: "Historial privado de pagos del cliente autenticado.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
  }).format(value);
}

export default async function MisPagosPage() {
  await requireRole(["CLIENT"]);
  const payments = await listPayments();
  const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            Cliente / Pagos
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Mis pagos</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Historial privado de pagos asociados a tus membresias.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black text-zinc-950">{payments.length}</p>
                <p className="mt-1 font-semibold text-zinc-600">Pagos</p>
              </div>
              <div className="border border-lime-200 bg-lime-50 px-4 py-3">
                <p className="font-mono text-2xl font-black text-lime-900">
                  {formatMoney(total, "USD")}
                </p>
                <p className="mt-1 font-semibold text-lime-800">Total</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {payments.length ? (
          <div className="divide-y divide-zinc-100 border border-zinc-200 bg-white">
            {payments.map((payment) => (
              <article
                key={payment.id}
                className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_160px_150px] sm:items-center"
              >
                <div>
                  <h2 className="font-black text-zinc-950">
                    {payment.membership?.plan_name ?? "Membresia no disponible"}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {payment.payment_method} / {payment.notes || "Sin notas"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-zinc-700">
                  {formatDate(payment.payment_date)}
                </p>
                <p className="font-mono text-xl font-black tabular-nums text-zinc-950 sm:text-right">
                  {formatMoney(payment.amount, payment.currency)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-white px-5 py-10 text-center">
            <p className="font-bold text-zinc-950">Todavia no tienes pagos registrados.</p>
            <p className="mt-2 text-sm text-zinc-600">
              Los pagos asociados a tus membresias apareceran aqui.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
