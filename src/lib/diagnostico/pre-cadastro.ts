// Pré-cadastro público (landing /diagnostico): catálogos, validação de servidor
// e o núcleo de processamento do envio. Tudo aqui é puro (sem banco, sem
// next/*) — o banco/headers/email entram por injeção em `processarPreCadastro`,
// o que mantém a regra testável sem infraestrutura.

import { POLITICA_VERSAO } from "../legal";

/** Municípios do RN oferecidos no select (rótulos idênticos ao protótipo). */
export const MUNICIPIOS_RN = [
  "Natal / RN",
  "Mossoró / RN",
  "Parnamirim / RN",
  "São Gonçalo do Amarante / RN",
  "Macaíba / RN",
  "Caicó / RN",
  "Ceará-Mirim / RN",
  "Açu / RN",
  "Currais Novos / RN",
  "Outro município",
] as const;

export const ATRIBUICOES = [
  "Ofício único (misto)",
  "Notas",
  "Registro de Imóveis",
  "Registro Civil (RCPN)",
  "Protesto",
  "Títulos e Documentos / PJ",
  "Não sei informar",
] as const;

export const CARGOS = ["Titular", "Interino", "Escrevente", "Outro"] as const;

export type PreCadastroCampo =
  | "nomeServentia"
  | "municipioUf"
  | "atribuicao"
  | "seuNome"
  | "whatsapp"
  | "email"
  | "consentimento";

/** Dados crus vindos do formulário (mais o honeypot). */
export interface PreCadastroInput {
  nomeServentia: string;
  municipioUf: string;
  atribuicao: string;
  seuNome: string;
  cargo?: string;
  whatsapp: string;
  email: string;
  /** aceite explícito da Política de Privacidade (LGPD art. 8º). */
  consentimento?: boolean;
  /** honeypot — deve chegar vazio; se preenchido, é bot. */
  website?: string;
}

/** Lead normalizado, pronto para virar linha de `diagnostico`. */
export interface LeadNormalizado {
  serventia: string;
  municipio: string;
  uf: string;
  atribuicao: string;
  contatoNome: string;
  contatoCargo: string | null;
  /** dígitos puros do WhatsApp — chave de deduplicação. */
  whatsappDigitos: string;
  /** WhatsApp formatado para exibição/armazenamento. */
  whatsapp: string;
  email: string;
  /** versão da política a que o titular aderiu — prova do consentimento. */
  politicaVersao: string;
}

export type ErrosPorCampo = Partial<Record<PreCadastroCampo, string>>;

const OBRIGATORIO = "Campo obrigatório.";
const EMAIL_INVALIDO = "Informe um e-mail válido.";
const WHATSAPP_INVALIDO = "Informe um número com DDD, ex.: (84) 9 0000-0000.";
const CONSENTIMENTO_FALTANDO =
  "É preciso autorizar o contato para enviar o pré-cadastro.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function soDigitos(v: string): string {
  return v.replace(/\D/g, "");
}

export function emailValido(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

/** BR com DDD: 10 (fixo) ou 11 (móvel) dígitos, DDD entre 11 e 99. */
export function telefoneValido(v: string): boolean {
  const d = soDigitos(v);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  return ddd >= 11 && ddd <= 99;
}

/** Máscara progressiva para o input (client): (84) 9 0000-0000. */
export function formatarWhatsapp(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length === 0) return "";
  const ddd = d.slice(0, 2);
  if (d.length <= 2) return `(${ddd}`;
  const rest = d.slice(2);
  const head = `(${ddd}) `;
  if (d.length <= 10) {
    if (rest.length <= 4) return head + rest;
    return `${head}${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  // 11 dígitos (móvel): 9 + 4 + 4
  return `${head}${rest.slice(0, 1)} ${rest.slice(1, 5)}-${rest.slice(5)}`;
}

/**
 * Valida no servidor (não confia no client). Retorna o lead normalizado quando
 * tudo passa, ou um mapa de erros por campo no formato que o front espera.
 */
export function validarPreCadastro(input: PreCadastroInput): {
  data: LeadNormalizado | null;
  errors: ErrosPorCampo;
} {
  const errors: ErrosPorCampo = {};

  const serventia = input.nomeServentia?.trim() ?? "";
  if (!serventia) errors.nomeServentia = OBRIGATORIO;

  const municipioUf = input.municipioUf?.trim() ?? "";
  if (!municipioUf || !MUNICIPIOS_RN.includes(municipioUf as never))
    errors.municipioUf = OBRIGATORIO;

  const atribuicao = input.atribuicao?.trim() ?? "";
  if (!atribuicao || !ATRIBUICOES.includes(atribuicao as never))
    errors.atribuicao = OBRIGATORIO;

  const contatoNome = input.seuNome?.trim() ?? "";
  if (!contatoNome) errors.seuNome = OBRIGATORIO;

  const whatsappRaw = input.whatsapp?.trim() ?? "";
  if (!whatsappRaw) errors.whatsapp = OBRIGATORIO;
  else if (!telefoneValido(whatsappRaw)) errors.whatsapp = WHATSAPP_INVALIDO;

  const emailRaw = input.email?.trim() ?? "";
  if (!emailRaw) errors.email = OBRIGATORIO;
  else if (!emailValido(emailRaw)) errors.email = EMAIL_INVALIDO;

  // LGPD art. 8º: o aceite tem de ser inequívoco e vir do titular — nunca
  // presumido. Sem checkbox marcada, não há base legal para tratar o lead.
  if (input.consentimento !== true)
    errors.consentimento = CONSENTIMENTO_FALTANDO;

  if (Object.keys(errors).length > 0) return { data: null, errors };

  // "Natal / RN" → município "Natal", uf "RN". "Outro município" → uf "RN"
  // (a landing é exclusiva do RN).
  const [municipioParte, ufParte] = municipioUf.split(" / ");
  const cargo = input.cargo?.trim();

  return {
    data: {
      serventia,
      municipio: municipioParte.trim(),
      uf: (ufParte ?? "RN").trim().toUpperCase(),
      atribuicao,
      contatoNome,
      contatoCargo: cargo && CARGOS.includes(cargo as never) ? cargo : null,
      whatsappDigitos: soDigitos(whatsappRaw),
      whatsapp: formatarWhatsapp(whatsappRaw),
      email: emailRaw.toLowerCase(),
      politicaVersao: POLITICA_VERSAO,
    },
    errors: {},
  };
}

/* ---- Núcleo de processamento (injeção de dependências) ------------------ */

/** Nº de envios por IP/hora antes de bloquear. */
export const RATE_LIMIT_POR_HORA = 5;
export const DEDUP_JANELA_MS = 24 * 60 * 60 * 1000;
export const RATE_JANELA_MS = 60 * 60 * 1000;

const MUITAS_TENTATIVAS =
  "Recebemos muitos envios deste local. Tente novamente em alguns minutos ou fale com contato@atrioss.com.";

export interface ProcessarDeps {
  now: () => Date;
  /** envios (qualquer resultado) do IP desde `desde`. */
  contarEnviosPorIp: (ip: string, desde: Date) => Promise<number>;
  /** lead de pré-cadastro com mesmo e-mail OU whatsapp desde `desde`. */
  acharLeadDuplicado: (
    email: string,
    whatsappDigitos: string,
    desde: Date,
  ) => Promise<{ id: string } | null>;
  criarLead: (
    lead: LeadNormalizado,
    consentimentoEm: Date,
  ) => Promise<{ id: string }>;
  /** marca atividade no lead duplicado (sobe na listagem do funil). */
  tocarLead: (id: string) => Promise<void>;
  registrarSubmissao: (rec: {
    ip: string;
    email: string | null;
    whatsapp: string | null;
    diagnosticoId: string | null;
    resultado: "created" | "updated" | "rejected" | "honeypot" | "rate_limited";
  }) => Promise<void>;
  notificarEquipe: (lead: LeadNormalizado, id: string) => Promise<void>;
}

export interface ProcessarResultado {
  ok: boolean;
  errors?: ErrosPorCampo & { geral?: string };
}

/**
 * Fluxo do envio público: honeypot → validação → rate limit → deduplicação →
 * criação (ou "toque" no duplicado) → notificação. Sempre registra a tentativa
 * para auditoria/rate limit. Ao visitante, honeypot e duplicado retornam
 * sucesso normal (não revelam a mecânica anti-spam).
 */
export async function processarPreCadastro(
  input: PreCadastroInput,
  ctx: { ip: string },
  deps: ProcessarDeps,
): Promise<ProcessarResultado> {
  // 1. honeypot: bot preencheu o campo oculto → finge sucesso, não cria nada.
  if (input.website?.trim()) {
    await deps.registrarSubmissao({
      ip: ctx.ip,
      email: null,
      whatsapp: null,
      diagnosticoId: null,
      resultado: "honeypot",
    });
    return { ok: true };
  }

  // 2. validação de servidor
  const { data, errors } = validarPreCadastro(input);
  if (!data) {
    await deps.registrarSubmissao({
      ip: ctx.ip,
      email: input.email?.trim().toLowerCase() || null,
      whatsapp: soDigitos(input.whatsapp ?? "") || null,
      diagnosticoId: null,
      resultado: "rejected",
    });
    return { ok: false, errors };
  }

  const agora = deps.now();

  // 3. rate limit por IP
  const enviosRecentes = await deps.contarEnviosPorIp(
    ctx.ip,
    new Date(agora.getTime() - RATE_JANELA_MS),
  );
  if (enviosRecentes >= RATE_LIMIT_POR_HORA) {
    await deps.registrarSubmissao({
      ip: ctx.ip,
      email: data.email,
      whatsapp: data.whatsappDigitos,
      diagnosticoId: null,
      resultado: "rate_limited",
    });
    return { ok: false, errors: { geral: MUITAS_TENTATIVAS } };
  }

  // 4. deduplicação branda (< 24h): atualiza o existente, não cria segundo.
  const duplicado = await deps.acharLeadDuplicado(
    data.email,
    data.whatsappDigitos,
    new Date(agora.getTime() - DEDUP_JANELA_MS),
  );
  if (duplicado) {
    await deps.tocarLead(duplicado.id);
    await deps.registrarSubmissao({
      ip: ctx.ip,
      email: data.email,
      whatsapp: data.whatsappDigitos,
      diagnosticoId: duplicado.id,
      resultado: "updated",
    });
    return { ok: true };
  }

  // 5. cria o lead + notifica a equipe
  const { id } = await deps.criarLead(data, agora);
  await deps.registrarSubmissao({
    ip: ctx.ip,
    email: data.email,
    whatsapp: data.whatsappDigitos,
    diagnosticoId: id,
    resultado: "created",
  });
  await deps.notificarEquipe(data, id);
  return { ok: true };
}

/** Trunca o IP para auditoria (LGPD): IPv4 → /24; IPv6 → 4 primeiros grupos. */
export function truncarIp(ip: string): string {
  const limpo = ip.trim();
  if (limpo.includes(".")) {
    const p = limpo.split(".");
    if (p.length === 4) return `${p[0]}.${p[1]}.${p[2]}.0`;
  }
  if (limpo.includes(":")) {
    return `${limpo.split(":").slice(0, 4).join(":")}::`;
  }
  return limpo || "desconhecido";
}
