// Catálogos estáticos do cofre de senhas (frames 13–16 do mockup "Átrios Cofre").

import type { AccessAction, AccessAmbiente, AccessTipo } from "@/db/schema";
import { formatRelative } from "@/lib/product-constants";

export type { AccessAction, AccessAmbiente, AccessTipo };
export { formatRelative };

const MONTHS_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** Data curta "14 abr" (metadados de criação). */
export function formatDayMonth(d: Date): string {
  return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
}

export const ACCESS_TIPOS: Record<
  AccessTipo,
  { label: string; color: string }
> = {
  sistema: { label: "Sistema", color: "#5e9eff" },
  infra: { label: "Infra", color: "#e2b13c" },
  banco: { label: "Banco de dados", color: "#bb9af7" },
  plataforma: { label: "Plataforma", color: "#4cb782" },
  email: { label: "E-mail", color: "#8b95a5" },
};

export const ACCESS_AMBIENTES: Record<
  AccessAmbiente,
  { label: string; color: string }
> = {
  producao: { label: "Produção", color: "#4cb782" },
  homologacao: { label: "Homologação", color: "#e2b13c" },
  geral: { label: "Geral", color: "#8b95a5" },
};

/** Ordem de exibição dos grupos na aba do produto. */
export const AMBIENTE_ORDER: AccessAmbiente[] = [
  "producao",
  "homologacao",
  "geral",
];

/** Rotação mais velha que isso aparece em âmbar na lista. */
export const STALE_ROTATION_DAYS = 90;

export const ACCESS_ACTION_LABELS: Record<AccessAction, string> = {
  created: "criou o acesso",
  viewed: "visualizou a senha",
  copied: "copiou a senha",
  rotated: "rotacionou a senha",
};

/** Máscaras literais de UI — o valor real nunca chega junto da página. */
export const PASSWORD_MASK = "••••••••••";
export const TOTP_MASK = "••••-••••  ••••-••••";
