export interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="bg-zinc-50 p-5">
      <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
      <p className="mt-2 font-bold text-zinc-950">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </div>
  );
}
