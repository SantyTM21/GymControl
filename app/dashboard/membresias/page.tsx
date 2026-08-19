import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function MembresiasPage() {
  return (
    <PrivateRoutePage
      title="Membresias"
      description="Administracion de membresias activas, pausadas y vencidas."
      allowedRoles={["OWNER"]}
    />
  );
}
