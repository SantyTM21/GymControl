import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function DashboardRutinasPage() {
  return (
    <PrivateRoutePage
      title="Rutinas"
      description="Creacion y edicion de rutinas del gimnasio."
      allowedRoles={["OWNER"]}
    />
  );
}
