"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { membershipStatuses } from "@/lib/memberships/server";
import type { MembershipStatus } from "@/types/domain";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToMemberships(type: "error" | "success", message: string) {
  redirect(`/dashboard/membresias?${type}=${encodeURIComponent(message)}`);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validStatus(status: string): status is MembershipStatus {
  return membershipStatuses.includes(status as MembershipStatus);
}

function parsePrice(value: string) {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

function validateDates(startsAt: string, endsAt: string) {
  return Boolean(startsAt && endsAt && endsAt >= startsAt);
}

async function ensureClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", clientId)
    .eq("role", "CLIENT")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    redirectToMemberships("error", "Selecciona un cliente activo con rol CLIENT.");
  }
}

export async function createMembership(formData: FormData) {
  await requireRole(["OWNER"]);

  const clientId = field(formData, "clientId");
  const planName = field(formData, "planName");
  const startsAt = field(formData, "startsAt");
  const endsAt = field(formData, "endsAt");
  const status = field(formData, "status");
  const price = parsePrice(field(formData, "price"));

  if (!validId(clientId)) {
    redirectToMemberships("error", "Selecciona un cliente valido.");
  }

  if (!planName) {
    redirectToMemberships("error", "Ingresa el tipo de plan.");
  }

  if (!validateDates(startsAt, endsAt)) {
    redirectToMemberships("error", "La fecha fin debe ser igual o posterior a la fecha inicio.");
  }

  if (!validStatus(status)) {
    redirectToMemberships("error", "Selecciona un estado valido.");
  }

  if (price === null) {
    redirectToMemberships("error", "Ingresa un precio valido.");
  }

  await ensureClient(clientId);

  const supabase = await createClient();
  const { error } = await supabase.from("memberships").insert({
    client_id: clientId,
    plan_name: planName,
    starts_at: startsAt,
    ends_at: endsAt,
    status,
    price,
    currency: "USD",
  });

  if (error) {
    redirectToMemberships("error", error.message);
  }

  revalidatePath("/dashboard/membresias");
  redirectToMemberships("success", "Membresia creada correctamente.");
}

export async function updateMembership(formData: FormData) {
  await requireRole(["OWNER"]);

  const membershipId = field(formData, "membershipId");
  const planName = field(formData, "planName");
  const startsAt = field(formData, "startsAt");
  const endsAt = field(formData, "endsAt");
  const status = field(formData, "status");
  const price = parsePrice(field(formData, "price"));

  if (!validId(membershipId)) {
    redirectToMemberships("error", "Membresia invalida.");
  }

  if (!planName || !validateDates(startsAt, endsAt) || !validStatus(status) || price === null) {
    redirectToMemberships("error", "Revisa plan, fechas, precio y estado.");
  }

  const now = new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase
    .from("memberships")
    .update({
      plan_name: planName,
      starts_at: startsAt,
      ends_at: endsAt,
      status,
      price,
      updated_at: now,
    })
    .eq("id", membershipId);

  if (error) {
    redirectToMemberships("error", error.message);
  }

  revalidatePath("/dashboard/membresias");
  redirectToMemberships("success", "Membresia actualizada correctamente.");
}

export async function renewMembership(formData: FormData) {
  await requireRole(["OWNER"]);

  const membershipId = field(formData, "membershipId");
  const startsAt = field(formData, "renewStartsAt");
  const endsAt = field(formData, "renewEndsAt");
  const price = parsePrice(field(formData, "renewPrice"));

  if (!validId(membershipId)) {
    redirectToMemberships("error", "Membresia invalida.");
  }

  if (!validateDates(startsAt, endsAt) || price === null) {
    redirectToMemberships("error", "Revisa las fechas y precio de renovacion.");
  }

  const now = new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase
    .from("memberships")
    .update({
      starts_at: startsAt,
      ends_at: endsAt,
      price,
      status: "ACTIVE",
      updated_at: now,
    })
    .eq("id", membershipId);

  if (error) {
    redirectToMemberships("error", error.message);
  }

  revalidatePath("/dashboard/membresias");
  redirectToMemberships("success", "Membresia renovada correctamente.");
}
