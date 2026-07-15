import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit carrega fontes AFM do próprio pacote em runtime — não bundlar
  serverExternalPackages: ["pdfkit"],

  async redirects() {
    return [
      // /site foi o endereço provisório do institucional, que voltou pra raiz.
      // Sem isto ele não dá 404: o proxy passou a tratá-lo como rota protegida
      // e manda pro /login — um link antigo de WhatsApp pediria senha ao
      // visitante. Redirects rodam antes do proxy, então este vence.
      { source: "/site", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
