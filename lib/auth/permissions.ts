import type { UserRole } from "@/types/domain";

export const ROLE_PERMISSIONS = {
  OWNER: [
    "manage_clients",
    "manage_memberships",
    "register_payments",
    "manage_routines",
    "view_gym_overview",
  ],
  CLIENT: [
    "view_own_membership",
    "view_own_payments",
    "view_routines",
    "record_workout",
    "record_used_weight",
    "view_progress",
  ],
} as const satisfies Record<UserRole, readonly string[]>;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];

export function hasPermission(role: UserRole | null, permission: Permission) {
  const permissions = role ? [...ROLE_PERMISSIONS[role]] : [];
  return permissions.includes(permission);
}
