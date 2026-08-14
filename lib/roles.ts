import type { Role } from "@/types/roles";

export const roles: Array<{
  role: Role;
  title: string;
  description: string;
}> = [
  {
    role: "OWNER",
    title: "Owner",
    description: "Administra miembros, planes, pagos y actividad del gimnasio.",
  },
  {
    role: "CLIENT",
    title: "Client",
    description: "Consulta membresias, entrenamientos y estado de pagos.",
  },
];
