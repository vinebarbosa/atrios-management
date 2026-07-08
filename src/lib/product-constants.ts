// Catálogos estáticos do domínio de produtos (etapas, colunas do board,
// cores de repo) + helpers puros. Fonte visual: mockup "Átrios Produtos".

import type { CardStatus } from "@/db/schema";

export type StatusHue =
  | "todo"
  | "progress"
  | "review"
  | "test"
  | "done"
  | "archived";

export interface Stage {
  name: string;
  color: string;
  hue: StatusHue;
}

/** Etapas fixas do ciclo de vida; `product.stage` indexa este array. */
export const STAGES: Stage[] = [
  { name: "Descoberta", color: "#8b95a5", hue: "todo" },
  { name: "Definição", color: "#5e9eff", hue: "review" },
  { name: "Desenvolvimento", color: "#e2b13c", hue: "progress" },
  { name: "Testes", color: "#bb9af7", hue: "test" },
  { name: "Em Produção", color: "#4cb782", hue: "done" },
  { name: "Descontinuado", color: "#6b6f76", hue: "archived" },
];

export interface BoardColumn {
  status: CardStatus;
  title: string;
  color: string;
  hue: StatusHue;
}

/** As 4 colunas fixas do board, na ordem de exibição. */
export const BOARD_COLUMNS: BoardColumn[] = [
  { status: "todo", title: "To Do", color: "#8b8f98", hue: "todo" },
  {
    status: "progress",
    title: "Em Progresso",
    color: "#e2b13c",
    hue: "progress",
  },
  { status: "review", title: "Em Revisão", color: "#5e9eff", hue: "review" },
  { status: "done", title: "Concluído", color: "#4cb782", hue: "done" },
];

/** Cor do dot por rótulo de repositório; rótulos fora do mapa caem no cinza. */
const REPO_LABEL_COLORS: Record<string, string> = {
  web: "#7aa2f7",
  frontend: "#7aa2f7",
  api: "#e0af68",
  backend: "#e0af68",
  mobile: "#bb9af7",
};

export function repoColor(label: string): string {
  return REPO_LABEL_COLORS[label.toLowerCase()] ?? "#8b95a5";
}

export const GITHUB_ORG = "atrios";

export const PRODUCT_CODE_RE = /^[A-Z0-9]{2,4}$/;

/** Id exibido do card: POR-12. */
export function displayCardId(code: string, seq: number): string {
  return `${code}-${seq}`;
}

/** Remove acentos e não-alfanuméricos (nomes de repo, slugs). */
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Código sugerido a partir do nome: 3 letras maiúsculas sem acentos. */
export function suggestCode(name: string): string {
  return slugify(name).replace(/-/g, "").slice(0, 3).toUpperCase();
}

const BRANCH_STOPWORDS = new Set([
  "de",
  "do",
  "da",
  "dos",
  "das",
  "no",
  "na",
  "em",
  "o",
  "a",
  "e",
]);

/** Branch sugerida: {id-minúsculo}-{2 primeiras palavras do título}. */
export function suggestBranch(displayId: string, title: string): string {
  const words = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !BRANCH_STOPWORDS.has(w))
    .slice(0, 2);
  return [displayId.toLowerCase(), ...words].join("-");
}

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

/** Data curta do stepper: "12 fev". */
export function formatStageDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS_PT[d.getMonth()]}`;
}

/** Tempo relativo pt-BR: "agora", "há 20min", "há 2h", "ontem", "há 3 dias", "há 2 meses". */
export function formatRelative(d: Date, now: Date = new Date()): string {
  const ms = now.getTime() - d.getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "há 1 mês" : `há ${months} meses`;
  const years = Math.floor(months / 12);
  return years === 1 ? "há 1 ano" : `há ${years} anos`;
}
