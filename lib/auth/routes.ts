import type { UserRole } from "@/types/domain";

export const PRIVATE_ROUTES = [
  "/dashboard",
  "/perfil",
  "/mi-rutina",
  "/mi-progreso",
  "/mi-membresia",
] as const;

export const ROLE_ROUTES: Record<UserRole, readonly string[]> = {
  OWNER: [
    "/dashboard/clientes",
    "/dashboard/membresias",
    "/dashboard/pagos",
    "/dashboard/rutinas",
  ],
  CLIENT: ["/mi-rutina", "/mi-progreso", "/mi-membresia"],
};

export function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTES.some((route) => matchesRoute(pathname, route));
}

export function requiredRoleForRoute(pathname: string): UserRole | null {
  if (ROLE_ROUTES.OWNER.some((route) => matchesRoute(pathname, route))) {
    return "OWNER";
  }

  if (ROLE_ROUTES.CLIENT.some((route) => matchesRoute(pathname, route))) {
    return "CLIENT";
  }

  return null;
}
