import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/landing/config";

// Indexa só o que é público (`/` e `/diagnostico` + páginas legais). O resto é
// o app autenticado: já é barrado pelo proxy, mas fica fora do índice também
// para não vazar estrutura interna nos resultados de busca.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/produtos",
        "/diagnosticos",
        "/serventias",
        "/cofre",
        "/time",
        "/voce",
        "/design-system",
        "/login",
        "/convite",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
