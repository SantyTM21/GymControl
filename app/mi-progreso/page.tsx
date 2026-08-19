import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function MiProgresoPage() {
  return (
    <PrivateRoutePage
      title="Mi progreso"
      description="Consulta de entrenamientos registrados y progreso personal."
      allowedRoles={["CLIENT"]}
    />
  );
}
