import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function ClientesPage() {
  return (
    <PrivateRoutePage
      title="Clientes"
      description="Administracion de clientes del gimnasio."
      allowedRoles={["OWNER"]}
    />
  );
}
