// Configuração compartilhada das páginas públicas (`/` institucional e
// `/diagnostico`). Fonte ÚNICA: as duas páginas leem daqui — nenhuma delas
// pode ler `process.env` ou repetir um contato por conta própria.

/**
 * Logos de parceria (Arpen/RN, Anoreg/RN) só quando a parceria estiver
 * formalizada. Função (e não const de módulo) para ser lida a cada render e
 * testável sem recarregar o módulo. Default: oculto.
 */
export function showPartners(): boolean {
  return process.env.LANDING_SHOW_PARTNERS === "true";
}

export const CONTATO_EMAIL = "contato@atrioss.com";
export const WHATSAPP_NUMERO = "558440420438";
export const WHATSAPP_EXIBICAO = "+55 84 4042-0438";

/** Link do WhatsApp com mensagem pré-preenchida (opcional). */
export function whatsappUrl(texto?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

/**
 * Origem pública do site — base das URLs absolutas de metadata (OG/Twitter),
 * do sitemap e do robots. Em preview da Vercel, VERCEL_URL aponta pro deploy.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://atrioss.com";
}
