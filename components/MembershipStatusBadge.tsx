import { getMembershipIndicator, type MembershipIndicator } from "@/lib/memberships/server";
import type { MembershipStatus } from "@/types/domain";

type MembershipStatusBadgeProps = {
  status: MembershipStatus;
  endsAt: string;
};

const indicatorStyles: Record<MembershipIndicator, { label: string; className: string }> = {
  active: {
    label: "Activa",
    className: "bg-lime-100 text-lime-800",
  },
  expiring: {
    label: "Proxima a vencer",
    className: "bg-amber-100 text-amber-800",
  },
  expired: {
    label: "Vencida",
    className: "bg-red-100 text-red-700",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-zinc-200 text-zinc-700",
  },
};

export function MembershipStatusBadge({ status, endsAt }: MembershipStatusBadgeProps) {
  const indicator = getMembershipIndicator({ status, ends_at: endsAt });
  const styles = indicatorStyles[indicator];

  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-bold ${styles.className}`}>
      {styles.label}
    </span>
  );
}
