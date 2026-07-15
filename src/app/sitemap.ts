import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/landing/config";

// Só as páginas públicas entram: o app autenticado (/produtos, /diagnosticos,
// /cofre, ...) não deve ser indexado — ver robots.ts.
//
// A raiz não entra: ela redireciona para /diagnostico (ver next.config.ts), e
// sitemap não deve listar URL que responde 3xx.

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    {
      url: `${base}/diagnostico`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/site`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/privacidade`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/termos`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
