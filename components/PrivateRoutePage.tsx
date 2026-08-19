import { requireAuthenticatedUser, requireRole } from "@/lib/auth/server";
import type { UserRole } from "@/types/domain";

type PrivateRoutePageProps = {
  title: string;
  description: string;
  allowedRoles?: UserRole[];
  message?: string;
};

export async function PrivateRoutePage({
  title,
  description,
  allowedRoles,
  message,
}: PrivateRoutePageProps) {
  if (allowedRoles?.length) {
    await requireRole(allowedRoles);
  } else {
    await requireAuthenticatedUser();
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-zinc-100 px-5 py-12 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl">
        {message ? (
          <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {message}
          </p>
        ) : null}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-700">
          GymControl
        </p>
        <h1 className="mt-4 text-4xl font-black text-zinc-950">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{description}</p>
      </section>
    </main>
  );
}
