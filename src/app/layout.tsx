import type { Metadata, Viewport } from "next";
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // Sem isso, "Adicionar à Tela de Início" no iOS abre um mini-Safari com
  // barra de endereço e toolbar (era o que aparecia cortando o header).
  // Com capable+manifest, o app instalado abre em tela cheia de verdade.
  appleWebApp: {
    capable: true,
    title: "Átrios",
    statusBarStyle: "black",
  },
  other: {
    // iOS < 17.4 só reconhece o meta prefixado; Next só emite o padrão
    // (mobile-web-app-capable) a partir do campo appleWebApp acima.
    "apple-mobile-web-app-capable": "yes",
  },
};

// Sem viewport-fit=cover: com ele o conteúdo se estende por baixo da status
// bar no iOS e o header das páginas some atrás do chrome do browser/app
// instalado. No modo padrão o conteúdo fica confinado à área segura e os
// paddings env() do tab bar/sheets viram no-ops.
export const viewport: Viewport = {
  themeColor: "#06070a",
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
