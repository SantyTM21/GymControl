import { PrivateRoutePage } from "@/components/PrivateRoutePage";

export default function PagosPage() {
  return (
    <PrivateRoutePage
      title="Pagos"
      description="Registro y revision de pagos del gimnasio."
      allowedRoles={["OWNER"]}
    />
  );
}
