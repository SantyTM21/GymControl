import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymControl",
  description: "Administracion de gimnasio para owners y clientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
