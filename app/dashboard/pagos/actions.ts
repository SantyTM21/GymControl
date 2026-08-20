"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectToPayments(type: "error" | "success", message: string): never {
  redirect(`/dashboard/pagos?${type}=${encodeURIComponent(message)}`);
}

function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

async function getMembershipClientId(membershipId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("client_id")
    .eq("id", membershipId)
    .maybeSingle();

  if (error || !data) {
    redirectToPayments("error", error?.message ?? "Selecciona una membresia valida.");
  }

  return data.client_id as string;
}

export async function createPayment(formData: FormData) {
  await requireRole(["OWNER"]);

  const membershipId = field(formData, "membershipId");
  const amount = parseAmount(field(formData, "amount"));
  const paymentDate = field(formData, "paymentDate");
  const paymentMethod = field(formData, "paymentMethod");
  const notes = field(formData, "notes");

  if (!validId(membershipId)) {
    redirectToPayments("error", "Selecciona una membresia valida.");
  }

  if (amount === null) {
    redirectToPayments("error", "Ingresa un monto valido.");
  }

  if (!validDate(paymentDate)) {
    redirectToPayments("error", "Ingresa una fecha de pago valida.");
  }

  if (!paymentMethod) {
    redirectToPayments("error", "Ingresa el metodo de pago.");
  }

  const clientId = await getMembershipClientId(membershipId);
  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    client_id: clientId,
    membership_id: membershipId,
    amount,
    currency: "USD",
    payment_date: paymentDate,
    payment_method: paymentMethod,
    notes: notes || null,
    status: "PAID",
    paid_at: new Date(`${paymentDate}T12:00:00`).toISOString(),
  });

  if (error) {
    redirectToPayments("error", error.message);
  }

  revalidatePath("/dashboard/pagos");
  redirectToPayments("success", "Pago registrado correctamente.");
}

export async function updatePayment(formData: FormData) {
  await requireRole(["OWNER"]);

  const paymentId = field(formData, "paymentId");
  const membershipId = field(formData, "membershipId");
  const amount = parseAmount(field(formData, "amount"));
  const paymentDate = field(formData, "paymentDate");
  const paymentMethod = field(formData, "paymentMethod");
  const notes = field(formData, "notes");

  if (!validId(paymentId) || !validId(membershipId)) {
    redirectToPayments("error", "Pago o membresia invalida.");
  }

  if (amount === null || !validDate(paymentDate) || !paymentMethod) {
    redirectToPayments("error", "Revisa monto, fecha y metodo de pago.");
  }

  const clientId = await getMembershipClientId(membershipId);
  const now = new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({
      client_id: clientId,
      membership_id: membershipId,
      amount,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      notes: notes || null,
      status: "PAID",
      paid_at: new Date(`${paymentDate}T12:00:00`).toISOString(),
      updated_at: now,
    })
    .eq("id", paymentId);

  if (error) {
    redirectToPayments("error", error.message);
  }

  revalidatePath("/dashboard/pagos");
  redirectToPayments("success", "Pago actualizado correctamente.");
}

export async function deletePayment(formData: FormData) {
  await requireRole(["OWNER"]);

  const paymentId = field(formData, "paymentId");

  if (!validId(paymentId)) {
    redirectToPayments("error", "Pago invalido.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", paymentId);

  if (error) {
    redirectToPayments("error", error.message);
  }

  revalidatePath("/dashboard/pagos");
  redirectToPayments("success", "Pago eliminado correctamente.");
}
