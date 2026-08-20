import "server-only";

import { requireProfile, requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export type Payment = {
  id: string;
  client_id: string;
  membership_id: string;
  amount: number;
  currency: string;
  payment_date: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentWithRelations = Payment & {
  client: {
    full_name: string;
    email: string;
  } | null;
  membership: {
    plan_name: string;
    starts_at: string;
    ends_at: string;
  } | null;
};

export type PaymentMembershipOption = {
  id: string;
  client_id: string;
  plan_name: string;
  starts_at: string;
  ends_at: string;
  price: number;
  client: {
    full_name: string;
    email: string;
  } | null;
};

const paymentColumns =
  "id, client_id, membership_id, amount, currency, payment_date, payment_method, notes, created_at, updated_at";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export async function listPayments() {
  const profile = await requireProfile();
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(paymentColumns)
    .order("payment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (profile.role === "CLIENT") {
    query = query.eq("client_id", profile.id);
  }

  const { data: payments, error } = await query;

  if (error) {
    throw new Error(`No se pudieron listar pagos: ${error.message}`);
  }

  const rows = (payments ?? []) as Payment[];
  const clientIds = unique(rows.map((payment) => payment.client_id));
  const membershipIds = unique(rows.map((payment) => payment.membership_id));

  const { data: clients, error: clientsError } = clientIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", clientIds)
        .eq("role", "CLIENT")
    : { data: [], error: null };

  if (clientsError) {
    throw new Error(`No se pudieron consultar clientes: ${clientsError.message}`);
  }

  const { data: memberships, error: membershipsError } = membershipIds.length
    ? await supabase
        .from("memberships")
        .select("id, plan_name, starts_at, ends_at")
        .in("id", membershipIds)
    : { data: [], error: null };

  if (membershipsError) {
    throw new Error(`No se pudieron consultar membresias: ${membershipsError.message}`);
  }

  const clientsById = new Map((clients ?? []).map((client) => [client.id, client]));
  const membershipsById = new Map(
    (memberships ?? []).map((membership) => [membership.id, membership]),
  );

  return rows.map((payment) => ({
    ...payment,
    client: clientsById.get(payment.client_id) ?? null,
    membership: membershipsById.get(payment.membership_id) ?? null,
  })) as PaymentWithRelations[];
}

export async function listPaymentMembershipOptions() {
  await requireRole(["OWNER"]);

  const supabase = await createClient();
  const { data: memberships, error } = await supabase
    .from("memberships")
    .select("id, client_id, plan_name, starts_at, ends_at, price")
    .order("ends_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron listar membresias: ${error.message}`);
  }

  const rows = (memberships ?? []) as Omit<PaymentMembershipOption, "client">[];
  const clientIds = unique(rows.map((membership) => membership.client_id));
  const { data: clients, error: clientsError } = clientIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", clientIds)
        .eq("role", "CLIENT")
    : { data: [], error: null };

  if (clientsError) {
    throw new Error(`No se pudieron consultar clientes: ${clientsError.message}`);
  }

  const clientsById = new Map((clients ?? []).map((client) => [client.id, client]));

  return rows.map((membership) => ({
    ...membership,
    client: clientsById.get(membership.client_id) ?? null,
  })) as PaymentMembershipOption[];
}
