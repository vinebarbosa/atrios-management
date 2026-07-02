import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Variable font — covers the 400/450/500/600/700 range used by the system.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Átrios Management",
  description: "Gestão dos produtos de software da Átrios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
