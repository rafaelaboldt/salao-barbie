import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salão Barbie — Sistema de Gestão",
  description: "Sistema completo de gestão para salão de beleza. Agende serviços, gerencie clientes, equipe, estoque e financeiro.",
  keywords: ["salão de beleza", "agendamento", "gestão", "beleza", "estética"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
