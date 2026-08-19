import "server-only";

import { redirect } from "next/navigation";
import { requireProfile, requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { MembershipStatus } from "@/types/domain";

export type Membership = {
  id: string;
  client_id: string;
  plan_name: string;
  status: MembershipStatus;
  starts_at: string;
  ends_at: string;
  price: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type MembershipWithClient = Membership & {
  client: {
    full_name: string;
    email: string;
    is_active: boolean;
  } | null;
};

export type MembershipIndicator = "active" | "expiring" | "expired" | "cancelled";

export const membershipStatuses: MembershipStatus[] = ["ACTIVE", "EXPIRED", "CANCELLED"];

const membershipColumns =
  "id, client_id, plan_name, status, starts_at, ends_at, price, currency, created_at, updated_at";

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function getMembershipIndicator(membership: Pick<Membership, "status" | "ends_at">) {
  const today = dateOnly(new Date().toISOString().slice(0, 10));
  const endsAt = dateOnly(membership.ends_at);
  const daysLeft = Math.ceil((endsAt.getTime() - today.getTime()) / 86400000);

  if (membership.status === "CANCELLED") {
    return "cancelled";
  }

  if (membership.status === "EXPIRED" || daysLeft < 0) {
    return "expired";
  }

  if (daysLeft <= 7) {
    return "expiring";
  }

  return "active";
}

export async function listMemberships() {
  await requireRole(["OWNER"]);

  const supabase = await createClient();
  const { data: memberships, error } = await supabase
    .from("memberships")
    .select(membershipColumns)
    .order("ends_at", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron listar membresias: ${error.message}`);
  }

  const clientIds = Array.from(
    new Set((memberships ?? []).map((membership) => membership.client_id)),
  );
  const { data: clients, error: clientsError } = clientIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, email, is_active")
        .in("id", clientIds)
        .eq("role", "CLIENT")
    : { data: [], error: null };

  if (clientsError) {
    throw new Error(`No se pudieron consultar clientes: ${clientsError.message}`);
  }

  const clientsById = new Map((clients ?? []).map((client) => [client.id, client]));

  return ((memberships ?? []) as Membership[]).map((membership) => ({
    ...membership,
    client: clientsById.get(membership.client_id) ?? null,
  })) as MembershipWithClient[];
}

export async function getClientMemberships() {
  const profile = await requireProfile();

  if (profile.role !== "CLIENT") {
    redirect("/dashboard?error=No tienes permiso para acceder a esa seccion.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select(membershipColumns)
    .eq("client_id", profile.id)
    .order("ends_at", { ascending: false });

  if (error) {
    throw new Error(`No se pudo consultar tu membresia: ${error.message}`);
  }

  return (data ?? []) as Membership[];
}
