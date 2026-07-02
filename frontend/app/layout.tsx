import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["700", "800"],
});

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
    <html lang="pt-BR" className={`h-full antialiased ${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
