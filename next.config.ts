import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit carrega fontes AFM do próprio pacote em runtime — não bundlar
  serverExternalPackages: ["pdfkit"],

  async redirects() {
    return [
      // A raiz cai direto no formulário. 307 (permanent: false) de propósito:
      // um 308 fica cacheado no browser do visitante e não há como reverter
      // pelo servidor. O site institucional segue em /site.
      { source: "/", destination: "/diagnostico", permanent: false },
    ];
  },
};

export default nextConfig;
