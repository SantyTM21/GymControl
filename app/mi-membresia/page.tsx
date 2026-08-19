import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function MiMembresiaPage() {
  return (
    <PrivateRoutePage
      title="Mi membresia"
      description="Consulta del estado de tu membresia en GymControl."
      allowedRoles={["CLIENT"]}
    />
  );
}
