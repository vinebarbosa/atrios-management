// Motor do diagnóstico — funções puras (sem banco), espelhando a lógica do
// protótipo validado (docs/diagnostico-provimento-213.html, listener de submit).
// Requisitos e prazos chegam como dados (tabelas requisito/parametro_norma).

import type { DiagnosticoEscopo, RespostaValor } from "@/db/schema";

export const VALOR_PONTOS: Record<RespostaValor, number> = {
  sim: 1,
  parcial: 0.5,
  nao: 0,
  nao_sei: 0,
};

export type StatusEtapa = "adequado" | "atencao" | "critico";

/** ≥80% adequado · 40–79% atenção · <40% crítico. */
export function statusPorScore(score: number): StatusEtapa {
  if (score >= 80) return "adequado";
  if (score >= 40) return "atencao";
  return "critico";
}

export function etapasDoEscopo(escopo: DiagnosticoEscopo): number[] {
  return escopo === "inicial" ? [1, 2] : [1, 2, 3, 4, 5];
}

export interface RequisitoPontuavel {
  id: string;
  etapa: number;
  peso: number;
}

export interface Scores {
  porEtapa: Record<number, number>;
  geral: number;
}

/**
 * Score ponderado por peso, por etapa e geral (média simples das etapas),
 * ambos arredondados como no protótipo. Requisito aplicável sem resposta
 * pontua como "não".
 */
export function calcularScores(
  requisitos: RequisitoPontuavel[],
  respostas: ReadonlyMap<string, RespostaValor>,
  etapas: number[],
): Scores {
  const porEtapa: Record<number, number> = {};
  for (const etapa of etapas) {
    const rs = requisitos.filter((r) => r.etapa === etapa);
    const total = rs.reduce((s, r) => s + r.peso, 0);
    const obtido = rs.reduce(
      (s, r) => s + r.peso * VALOR_PONTOS[respostas.get(r.id) ?? "nao"],
      0,
    );
    porEtapa[etapa] = total > 0 ? Math.round((100 * obtido) / total) : 0;
  }
  const geral = Math.round(
    etapas.reduce((s, e) => s + porEtapa[e], 0) / etapas.length,
  );
  return { porEtapa, geral };
}

/** Gaps (tudo que não é "sim" pleno), do maior peso para o menor. */
export function ordenarGaps<T extends RequisitoPontuavel & { ordem: number }>(
  requisitos: T[],
  respostas: ReadonlyMap<string, RespostaValor>,
): T[] {
  return requisitos
    .filter((r) => VALOR_PONTOS[respostas.get(r.id) ?? "nao"] < 1)
    .sort((a, b) => b.peso - a.peso || a.etapa - b.etapa || a.ordem - b.ordem);
}

/* ---- Prazos (art. 20 e art. 23) ----------------------------------------- */

/** Teto legal da prorrogação estadual do art. 21: "por até 90 (noventa) dias". */
export const PRORROGACAO_MAX_DIAS = 90;

export interface ParametrosPrazo {
  vigencia: Date;
  /** art. 20: Etapas 1+2 obrigatórias, em dias */
  prazoArt20Dias: number;
  /** art. 23: todas as etapas, em meses */
  prazoArt23Meses: number;
  /** prorrogação estadual do art. 21 (0 quando a UF não tem) */
  prorrogacaoDias: number;
}

export interface Prazos {
  limiteInicial: Date;
  limiteTotal: Date;
  /** negativos = vencidos há N dias */
  diasRestantesInicial: number;
  diasRestantesTotal: number;
}

export function calcularPrazos(p: ParametrosPrazo, hoje: Date): Prazos {
  const limiteInicial = new Date(p.vigencia);
  limiteInicial.setDate(
    limiteInicial.getDate() + p.prazoArt20Dias + p.prorrogacaoDias,
  );
  const limiteTotal = new Date(p.vigencia);
  limiteTotal.setMonth(limiteTotal.getMonth() + p.prazoArt23Meses);
  const dias = (d: Date) => Math.ceil((d.getTime() - hoje.getTime()) / 864e5);
  return {
    limiteInicial,
    limiteTotal,
    diasRestantesInicial: dias(limiteInicial),
    diasRestantesTotal: dias(limiteTotal),
  };
}

/* ---- Leitura dos parâmetros da norma ------------------------------------ */

export interface ParametroRow {
  chave: string;
  valor: string;
  uf: string | null;
  descricao: string | null;
}

export interface ParametrosTecnicos {
  rpo: string;
  rto: string;
  bkp: string;
  net: string;
  rest: string;
}

export interface ParametrosNorma extends ParametrosPrazo {
  prorrogacaoDescricao: string | null;
  tecnicos: ParametrosTecnicos | null;
}

/**
 * Monta os parâmetros do motor para uma classe/UF a partir das linhas de
 * parametro_norma. Parâmetro de UF (ex.: prorrogação do RN) só se aplica ao
 * diagnóstico daquela UF.
 */
export function parametrosParaClasse(
  rows: ParametroRow[],
  classe: number,
  uf: string,
): ParametrosNorma {
  const nacional = (chave: string) =>
    rows.find((r) => r.chave === chave && r.uf === null)?.valor;
  const vigenciaStr = nacional("vigencia");
  const art20 = nacional(`prazo_art20_dias_classe_${classe}`);
  const art23 = nacional(`prazo_art23_meses_classe_${classe}`);
  if (!vigenciaStr || !art20 || !art23) {
    throw new Error(
      `Parâmetros da norma ausentes para a classe ${classe} — rode npm run db:seed:provimento.`,
    );
  }
  const prorrogacao = rows.find(
    (r) => r.chave === "prorrogacao_art20_dias" && r.uf === uf.toUpperCase(),
  );
  const prorrogacaoDias = prorrogacao ? Number(prorrogacao.valor) : 0;
  // Teto legal do art. 21 ("por até 90 dias"): um valor acima é juridicamente
  // impossível — falha alto em vez de publicar uma afirmação falsa.
  if (prorrogacaoDias > PRORROGACAO_MAX_DIAS) {
    throw new Error(
      `Prorrogação estadual (${uf}) de ${prorrogacaoDias} dias excede o limite legal do art. 21 (${PRORROGACAO_MAX_DIAS} dias).`,
    );
  }
  const tecnicosStr = nacional(`parametros_tecnicos_classe_${classe}`);
  return {
    // meio-dia local evita voltar um dia em fusos negativos
    vigencia: new Date(`${vigenciaStr}T12:00:00`),
    prazoArt20Dias: Number(art20),
    prazoArt23Meses: Number(art23),
    prorrogacaoDias,
    prorrogacaoDescricao: prorrogacao?.descricao ?? null,
    tecnicos: tecnicosStr
      ? (JSON.parse(tecnicosStr) as ParametrosTecnicos)
      : null,
  };
}
