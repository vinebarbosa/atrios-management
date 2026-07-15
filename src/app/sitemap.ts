import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/landing/config";

// Só as páginas públicas entram: o app autenticado (/produtos, /diagnosticos,
// /cofre, ...) não deve ser indexado — ver robots.ts.

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/diagnostico`,
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
