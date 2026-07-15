import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit carrega fontes AFM do próprio pacote em runtime — não bundlar
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
