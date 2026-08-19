import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function MiRutinaPage() {
  return (
    <PrivateRoutePage
      title="Mi rutina"
      description="Consulta de rutinas asignadas a tu entrenamiento."
      allowedRoles={["CLIENT"]}
    />
  );
}
