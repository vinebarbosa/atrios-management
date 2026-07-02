// Mock data ported verbatim from the Claude Design standalone doc.

export type StatusHue =
  | "todo"
  | "progress"
  | "review"
  | "test"
  | "done"
  | "archived";

export type RepoKey = "web" | "api" | "mobile";

export const REPO_COLORS: Record<RepoKey, string> = {
  web: "#7aa2f7",
  api: "#e0af68",
  mobile: "#bb9af7",
};

export interface Stage {
  name: string;
  color: string;
  hue: StatusHue;
  date?: string;
}

export const STAGES: Stage[] = [
  { name: "Descoberta", color: "#8b95a5", hue: "todo", date: "12 fev" },
  { name: "Definição", color: "#5e9eff", hue: "review", date: "03 mar" },
  {
    name: "Desenvolvimento",
    color: "#e2b13c",
    hue: "progress",
    date: "24 mar",
  },
  { name: "Testes", color: "#bb9af7", hue: "test", date: "19 mai" },
  { name: "Em Produção", color: "#4cb782", hue: "done", date: "08 jun" },
  { name: "Descontinuado", color: "#6b6f76", hue: "archived" },
];

export interface Repo {
  label: string;
  name: string;
  color: string;
}

export interface Product {
  name: string;
  code: string;
  color: string;
  stageIndex: number;
  active: number;
  updated: string;
  desc: string;
  longDesc?: string;
  repos: Repo[];
}

export const PRODUCTS: Product[] = [
  {
    name: "Pórtico",
    code: "POR",
    color: "#4cb782",
    stageIndex: 4,
    active: 4,
    updated: "há 2h",
    desc: "Gateway e checkout de pagamentos",
    longDesc:
      "Gateway e checkout de pagamentos da Átrios. Processa transações via cartão, Pix e boleto, com antifraude integrado e conciliação automática. Base do fluxo de receita de todos os produtos do portfólio.",
    repos: [
      { label: "frontend", name: "portico-web", color: REPO_COLORS.web },
      { label: "api", name: "portico-api", color: REPO_COLORS.api },
      { label: "mobile", name: "portico-mobile", color: REPO_COLORS.mobile },
    ],
  },
  {
    name: "Cortina",
    code: "COR",
    color: "#e2b13c",
    stageIndex: 2,
    active: 7,
    updated: "há 20min",
    desc: "Painel de antifraude",
    repos: [],
  },
  {
    name: "Ábaco",
    code: "ABA",
    color: "#bb9af7",
    stageIndex: 3,
    active: 3,
    updated: "há 5h",
    desc: "Motor de conciliação contábil",
    repos: [],
  },
  {
    name: "Verso",
    code: "VER",
    color: "#5e9eff",
    stageIndex: 1,
    active: 2,
    updated: "ontem",
    desc: "Editor de contratos",
    repos: [],
  },
  {
    name: "Peristilo",
    code: "PER",
    color: "#8b95a5",
    stageIndex: 0,
    active: 1,
    updated: "há 3 dias",
    desc: "Marketplace de integrações",
    repos: [],
  },
  {
    name: "Colunata",
    code: "COL",
    color: "#e2b13c",
    stageIndex: 2,
    active: 5,
    updated: "há 1h",
    desc: "SDK de pagamentos",
    repos: [],
  },
  {
    name: "Frontão",
    code: "FRO",
    color: "#6b6f76",
    stageIndex: 5,
    active: 0,
    updated: "há 2 meses",
    desc: "Antigo portal de boletos",
    repos: [],
  },
];

export function productByCode(code: string): Product | undefined {
  return PRODUCTS.find((p) => p.code === code.toUpperCase());
}

export interface Card {
  id: string;
  title: string;
  repo?: RepoKey;
  pr?: number;
  auto?: boolean;
  desc?: string;
  isNew?: boolean;
}

export interface Column {
  key: string;
  title: string;
  color: string;
  hue: StatusHue;
  /** Real total when the column shows only a sample of cards. */
  total?: number;
  cards: Card[];
}

const PORTICO_BOARD: Column[] = [
  {
    key: "todo",
    title: "To Do",
    color: "#8b8f98",
    hue: "todo",
    cards: [
      {
        id: "POR-24",
        title: "Ajustar timeout do gateway de pagamento",
        repo: "api",
      },
      { id: "POR-25", title: "Reunião de kickoff — cliente Vega" },
      { id: "POR-26", title: "Revisar copy da tela de checkout", repo: "web" },
    ],
  },
  {
    key: "prog",
    title: "Em Progresso",
    color: "#e2b13c",
    hue: "progress",
    cards: [
      {
        id: "POR-19",
        title: "Retry de webhooks do Stripe",
        repo: "api",
        pr: 142,
        desc: "Reprocessar webhooks que falham no primeiro envio com backoff exponencial (até 5 tentativas). Guardar o payload bruto e o status de cada tentativa para auditoria. Cobrir os eventos payment_intent.succeeded e charge.refunded.",
      },
      { id: "POR-21", title: "Novo fluxo 3DS no checkout", repo: "web" },
    ],
  },
  {
    key: "review",
    title: "Em Revisão",
    color: "#5e9eff",
    hue: "review",
    cards: [
      {
        id: "POR-17",
        title: "Refatorar serviço de conciliação",
        repo: "api",
        pr: 138,
        auto: true,
      },
      {
        id: "POR-20",
        title: "Tela de histórico de transações",
        repo: "web",
        pr: 140,
      },
    ],
  },
  {
    key: "done",
    title: "Concluído",
    color: "#4cb782",
    hue: "done",
    total: 24,
    cards: [
      { id: "POR-12", title: "Pipeline de CI/CD do serviço api", repo: "api" },
      { id: "POR-15", title: "Design tokens do app mobile", repo: "mobile" },
      { id: "POR-08", title: "Contrato de dados do webhook" },
    ],
  },
];

export function boardFor(code: string): Column[] {
  if (code.toUpperCase() === "POR") return PORTICO_BOARD;
  return PORTICO_BOARD.map((c) => ({ ...c, total: undefined, cards: [] }));
}

export const CURRENT_USER = {
  name: "Marina Alcântara",
  handle: "@marina-atrios",
  initials: "MA",
};
