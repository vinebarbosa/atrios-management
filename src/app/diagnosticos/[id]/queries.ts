// Monta os dados do diagnóstico + relatório (página e PDF compartilham).

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import type { RespostaValor } from "@/db/schema";
import * as schema from "@/db/schema";
import {
  calcularPrazos,
  calcularScores,
  etapasDoEscopo,
  ordenarGaps,
  type ParametrosNorma,
  type Prazos,
  parametrosParaClasse,
  statusPorScore,
} from "@/lib/diagnostico/motor";

export type DiagnosticoRow = NonNullable<
  Awaited<ReturnType<typeof getDiagnostico>>
>;

export async function getDiagnostico(id: string) {
  return db.query.diagnostico.findFirst({
    where: eq(schema.diagnostico.id, id),
    with: {
      respostas: { columns: { requisitoId: true, valor: true } },
      respostasIdentidade: { columns: { item: true, valor: true } },
      criadoPor: { columns: { name: true } },
    },
  });
}

export async function getRequisitosAplicaveis(
  classe: number | null,
  etapas: number[],
) {
  // Lead sem classe (pré-cadastro) não tem requisitos aplicáveis ainda.
  if (classe == null) return [];
  const todos = await db.query.requisito.findMany({
    where: eq(schema.requisito.ativo, true),
    orderBy: asc(schema.requisito.ordem),
  });
  return todos.filter(
    (r) => etapas.includes(r.etapa) && r.classes.includes(classe),
  );
}

export type Requisito = Awaited<
  ReturnType<typeof getRequisitosAplicaveis>
>[number];

export interface Alerta {
  tipo: "ok" | "janela" | "vencido";
  titulo: string;
  corpo: string;
  /** referência da prorrogação estadual, quando aplicada */
  fonte: string | null;
}

export interface Gap extends Requisito {
  valor: RespostaValor;
}

export interface Relatorio {
  diagnostico: DiagnosticoRow;
  etapas: number[];
  porEtapa: Record<number, number>;
  geral: number;
  gaps: Gap[];
  prazos: Prazos;
  parametros: ParametrosNorma;
  alerta: Alerta;
  /** oportunidades de identidade digital (itens sem "sim") */
  identidadeOps: { item: schema.IdentidadeItem; valor: RespostaValor }[];
  /** nota de dispensa de pentest (C3 em SaaS/compartilhada) */
  notaModelo: string | null;
}

const fmt = (d: Date) => d.toLocaleDateString("pt-BR");

function montarAlerta(
  diag: DiagnosticoRow,
  porEtapa: Record<number, number>,
  prazos: Prazos,
  parametros: ParametrosNorma,
): Alerta {
  const { limiteInicial, limiteTotal, diasRestantesInicial: dias } = prazos;
  const globalTxt = `Prazo global de adequação (todas as etapas): ${fmt(limiteTotal)}.`;
  const comProrrogacao = parametros.prorrogacaoDias > 0;
  const fonte = comProrrogacao ? parametros.prorrogacaoDescricao : null;

  if ((porEtapa[1] ?? 0) >= 100 && (porEtapa[2] ?? 0) >= 100) {
    return {
      tipo: "ok",
      titulo: "Etapas 1 e 2 concluídas.",
      corpo: `Prazo global de adequação (todas as etapas): ${fmt(limiteTotal)} (${prazos.diasRestantesTotal} dias).`,
      fonte: null,
    };
  }
  if (dias < 0) {
    return {
      tipo: "vencido",
      titulo: comProrrogacao
        ? "⚠️ Prazo vencido — inclusive a prorrogação."
        : "⚠️ Prazo vencido.",
      corpo: comProrrogacao
        ? `O prazo do art. 20 para as Etapas 1 e 2 (Classe ${diag.classe}), já somada a prorrogação de ${parametros.prorrogacaoDias} dias concedida pela CGJ-${diag.uf}, venceu em ${fmt(limiteInicial)} — há ${-dias} dias. Não há nova prorrogação possível (art. 21 admite uma única). A serventia está sujeita a fiscalização e PAD (art. 24). ${globalTxt}`
        : `O prazo do art. 20 para as Etapas 1 e 2 (Classe ${diag.classe}) venceu em ${fmt(limiteInicial)} — há ${-dias} dias. O art. 21 admite uma única prorrogação de até 90 dias, mediante plano formal de adequação. A serventia está sujeita a fiscalização e PAD (art. 24). ${globalTxt}`,
      fonte,
    };
  }
  return {
    tipo: "janela",
    titulo: comProrrogacao ? "⏳ Última janela." : "⏳ Prazo em curso.",
    corpo: comProrrogacao
      ? `Com a prorrogação de ${parametros.prorrogacaoDias} dias concedida pela CGJ-${diag.uf}, as Etapas 1 e 2 devem estar concluídas até ${fmt(limiteInicial)} (${dias} dias restantes). É a única prorrogação que o art. 21 permite — e a decisão exige medidas mitigatórias desde já, com acompanhamento pela Seção de Correição. ${globalTxt}`
      : `As Etapas 1 e 2 (art. 20, Classe ${diag.classe}) devem estar concluídas até ${fmt(limiteInicial)} (${dias} dias restantes). O art. 21 admite prorrogação única de até 90 dias mediante plano formal. ${globalTxt}`,
    fonte,
  };
}

export async function getRelatorio(diag: DiagnosticoRow): Promise<Relatorio> {
  // Só diagnósticos com classe definida geram relatório (leads "novo" usam a
  // LeadNovoView e nunca chegam aqui).
  if (diag.classe == null)
    throw new Error("Diagnóstico sem classe não gera relatório.");
  const classe = diag.classe;
  const etapas = etapasDoEscopo(diag.escopo);
  const [requisitos, parametroRows] = await Promise.all([
    getRequisitosAplicaveis(classe, etapas),
    db.query.parametroNorma.findMany(),
  ]);
  const parametros = parametrosParaClasse(parametroRows, classe, diag.uf);
  const respostas = new Map<string, RespostaValor>(
    diag.respostas.map((r) => [r.requisitoId, r.valor]),
  );

  const { porEtapa, geral } = calcularScores(requisitos, respostas, etapas);
  const gaps = ordenarGaps(requisitos, respostas).map((r) => ({
    ...r,
    valor: respostas.get(r.id) ?? ("nao" as RespostaValor),
  }));
  const prazos = calcularPrazos(parametros, new Date());
  const alerta = montarAlerta(diag, porEtapa, prazos, parametros);

  const identidadeOps = diag.respostasIdentidade.filter(
    (r) => r.valor !== "sim",
  );

  // nota condicionada ao modelo (ex.: dispensa de pentest — vive no requisito)
  const reqComNota = requisitos.find(
    (r) =>
      r.condicoes?.nota &&
      r.condicoes.notaModelos?.includes(diag.modeloSolucao),
  );
  const notaModelo = reqComNota?.condicoes?.nota ?? null;

  return {
    diagnostico: diag,
    etapas,
    porEtapa,
    geral,
    gaps,
    prazos,
    parametros,
    alerta,
    identidadeOps,
    notaModelo,
  };
}

export { statusPorScore };
