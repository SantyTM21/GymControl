import type { Role } from "@/types/roles";

type RoleCardProps = {
  role: Role;
  title: string;
  description: string;
};

export function RoleCard({ role, title, description }: RoleCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {role}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
