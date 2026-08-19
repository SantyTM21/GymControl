import { PrivateRoutePage } from "@/components/PrivateRoutePage";

type DashboardPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <PrivateRoutePage
      title="Dashboard"
      description="Resumen privado de GymControl para usuarios autenticados."
      message={searchParams?.error}
    />
  );
}
