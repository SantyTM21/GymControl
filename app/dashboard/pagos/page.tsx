import type { Metadata } from "next";
import { createPayment, deletePayment, updatePayment } from "@/app/dashboard/pagos/actions";
import { requireProfile } from "@/lib/auth/server";
import { listPaymentMembershipOptions, listPayments } from "@/lib/payments/server";

export const metadata: Metadata = {
  title: "Pagos | GymControl",
  description: "Registro y consulta de pagos del gimnasio.",
};

type PagosPageProps = {
  searchParams?: {
    error?: string;
    success?: string;
  };
};

const paymentMethods = ["Efectivo", "Transferencia", "Tarjeta", "Otro"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
  }).format(Number(value));
}

export default async function PagosPage({ searchParams }: PagosPageProps) {
  const profile = await requireProfile();
  const isOwner = profile.role === "OWNER";
  const [payments, memberships] = await Promise.all([
    listPayments(),
    isOwner ? listPaymentMembershipOptions() : Promise.resolve([]),
  ]);
  const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const recentPayments = payments.slice(0, 5);

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
            {isOwner ? "Owner / Pagos" : "Cliente / Pagos"}
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-zinc-950">Control de pagos</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                {isOwner
                  ? "Registra, consulta, edita y elimina pagos vinculados a membresias."
                  : "Consulta los pagos registrados en tus membresias."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {formatMoney(total)}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Total recaudado</p>
              </div>
              <div className="border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="font-mono text-2xl font-black tabular-nums text-zinc-950">
                  {payments.length}
                </p>
                <p className="mt-1 font-semibold text-zinc-600">Cantidad de pagos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="space-y-6">
          {isOwner ? (
            <div className="border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-lg font-black text-zinc-950">Nuevo pago</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  El cliente se toma de la membresia seleccionada.
                </p>
              </div>

              <form action={createPayment} className="space-y-4 p-5">
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
                  <label htmlFor="membershipId" className="text-sm font-bold text-zinc-800">
                    Membresia
                  </label>
                  <select
                    id="membershipId"
                    name="membershipId"
                    required
                    className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                  >
                    <option value="">Seleccionar membresia</option>
                    {memberships.map((membership) => (
                      <option key={membership.id} value={membership.id}>
                        {membership.client?.full_name ?? "Cliente no disponible"} -{" "}
                        {membership.plan_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="amount" className="text-sm font-bold text-zinc-800">
                      Monto
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="paymentDate" className="text-sm font-bold text-zinc-800">
                      Fecha
                    </label>
                    <input
                      id="paymentDate"
                      name="paymentDate"
                      type="date"
                      required
                      defaultValue={today()}
                      className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="text-sm font-bold text-zinc-800">
                    Metodo
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    required
                    className="mt-2 min-h-11 w-full border border-zinc-300 bg-zinc-50 px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600 focus:bg-white"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="text-sm font-bold text-zinc-800">
                    Notas
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="mt-2 w-full resize-y border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600 focus:bg-white"
                    placeholder="Referencia, observacion o comprobante"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-11 w-full bg-lime-400 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-lime-300"
                >
                  Registrar pago
                </button>
              </form>
            </div>
          ) : searchParams?.error || searchParams?.success ? (
            <div className="border border-zinc-200 bg-white p-5">
              {searchParams.error ? (
                <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {searchParams.error}
                </p>
              ) : null}
              {searchParams.success ? (
                <p className="border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                  {searchParams.success}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-lg font-black text-zinc-950">Pagos recientes</h2>
              <p className="mt-1 text-sm text-zinc-600">Ultimos movimientos registrados.</p>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-zinc-950">
                        {payment.client?.full_name ?? "Cliente no disponible"}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {payment.membership?.plan_name ?? "Membresia no disponible"}
                      </p>
                    </div>
                    <p className="font-mono text-sm font-black tabular-nums text-zinc-950">
                      {formatMoney(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {formatDate(payment.payment_date)} / {payment.payment_method}
                  </p>
                </div>
              ))}
            </div>
            {recentPayments.length === 0 ? (
              <div className="px-5 py-8 text-sm font-semibold text-zinc-600">
                No hay pagos recientes.
              </div>
            ) : null}
          </div>
        </aside>

        <div className="border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black text-zinc-950">Historial de pagos</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {isOwner
                ? "Abre una fila para editar o eliminar el registro."
                : "Solo puedes consultar tus propios pagos."}
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <details key={payment.id} className="group bg-white open:bg-zinc-50">
                <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 hover:bg-zinc-50 md:grid-cols-[minmax(0,1fr)_140px_120px_120px] [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="font-bold text-zinc-950">
                      {payment.client?.full_name ?? "Cliente no disponible"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {payment.membership?.plan_name ?? "Membresia no disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Fecha</p>
                    <p className="mt-1 font-semibold text-zinc-800">
                      {formatDate(payment.payment_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Metodo</p>
                    <p className="mt-1 font-semibold text-zinc-800">{payment.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Monto</p>
                    <p className="mt-1 font-mono font-black tabular-nums text-zinc-950">
                      {formatMoney(payment.amount, payment.currency)}
                    </p>
                  </div>
                </summary>

                <div className="border-t border-zinc-200 px-5 py-5">
                  {isOwner ? (
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px]">
                      <form action={updatePayment} className="grid gap-4">
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Membresia</label>
                          <select
                            name="membershipId"
                            required
                            defaultValue={payment.membership_id}
                            className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                          >
                            {memberships.map((membership) => (
                              <option key={membership.id} value={membership.id}>
                                {membership.client?.full_name ?? "Cliente no disponible"} -{" "}
                                {membership.plan_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="text-sm font-bold text-zinc-800">Monto</label>
                            <input
                              name="amount"
                              type="number"
                              min="0"
                              step="0.01"
                              required
                              defaultValue={payment.amount}
                              className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-zinc-800">Fecha</label>
                            <input
                              name="paymentDate"
                              type="date"
                              required
                              defaultValue={payment.payment_date}
                              className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-zinc-800">Metodo</label>
                            <select
                              name="paymentMethod"
                              required
                              defaultValue={payment.payment_method}
                              className="mt-2 min-h-11 w-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus:border-lime-600"
                            >
                              {paymentMethods.map((method) => (
                                <option key={method} value={method}>
                                  {method}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-bold text-zinc-800">Notas</label>
                          <textarea
                            name="notes"
                            rows={3}
                            defaultValue={payment.notes ?? ""}
                            className="mt-2 w-full resize-y border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-lime-600"
                          />
                        </div>
                        <button
                          type="submit"
                          className="min-h-11 bg-zinc-950 px-5 text-sm font-black text-white transition-colors hover:bg-zinc-800"
                        >
                          Guardar cambios
                        </button>
                      </form>

                      <form action={deletePayment} className="content-start">
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <button
                          type="submit"
                          className="min-h-11 w-full border border-red-200 bg-red-50 px-5 text-sm font-black text-red-700 transition-colors hover:bg-red-100"
                        >
                          Eliminar pago
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="font-bold text-zinc-500">Correo</p>
                        <p className="mt-1 font-semibold text-zinc-800">{payment.client?.email}</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-500">Vigencia</p>
                        <p className="mt-1 font-semibold text-zinc-800">
                          {payment.membership
                            ? `${formatDate(payment.membership.starts_at)} - ${formatDate(
                                payment.membership.ends_at,
                              )}`
                            : "No disponible"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="font-bold text-zinc-500">Notas</p>
                        <p className="mt-1 font-semibold text-zinc-800">
                          {payment.notes || "Sin notas"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>

          {payments.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-bold text-zinc-950">Todavia no hay pagos registrados.</p>
              <p className="mt-2 text-sm text-zinc-600">
                {isOwner
                  ? "Registra el primer pago desde el formulario."
                  : "Cuando el gimnasio registre tus pagos apareceran aqui."}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
