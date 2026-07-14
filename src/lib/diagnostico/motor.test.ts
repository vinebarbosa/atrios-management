import { describe, expect, it } from "vitest";
import type { RespostaValor } from "@/db/schema";
import {
  calcularPrazos,
  calcularScores,
  etapasDoEscopo,
  ordenarGaps,
  PRORROGACAO_MAX_DIAS,
  parametrosParaClasse,
  statusPorScore,
} from "./motor";

// Requisitos das Etapas 1 e 2 aplicáveis à classe 2 (mesmos pesos do seed —
// nas Etapas 1-2 todos os requisitos valem para as três classes).
const PESOS_ETAPA_1 = [2, 2, 1, 3, 3, 3, 3, 2, 2, 1]; // Σ 22
const PESOS_ETAPA_2 = [2, 1, 2, 2, 3, 1, 2, 1, 2, 1]; // Σ 17

const requisitos = [
  ...PESOS_ETAPA_1.map((peso, i) => ({
    id: `e1-${i}`,
    etapa: 1,
    peso,
    ordem: i + 1,
  })),
  ...PESOS_ETAPA_2.map((peso, i) => ({
    id: `e2-${i}`,
    etapa: 2,
    peso,
    ordem: 11 + i,
  })),
];

describe("calcularScores", () => {
  it("classe 2, mix de respostas — score por etapa e geral como no protótipo", () => {
    const respostas = new Map<string, RespostaValor>([
      // Etapa 1: 2 + 1 + 0 + 3 + 1.5 + 0 + 3 + 2 + 1 + 0 = 13.5 → 61%
      ["e1-0", "sim"],
      ["e1-1", "parcial"],
      ["e1-2", "nao"],
      ["e1-3", "sim"],
      ["e1-4", "parcial"],
      ["e1-5", "nao_sei"],
      ["e1-6", "sim"],
      ["e1-7", "sim"],
      ["e1-8", "parcial"],
      ["e1-9", "nao"],
      // Etapa 2: 2 + 1 + 1 + 0 + 3 + 1 + 0 + 0.5 + 2 + 0 = 10.5 → 62%
      ["e2-0", "sim"],
      ["e2-1", "sim"],
      ["e2-2", "parcial"],
      ["e2-3", "nao"],
      ["e2-4", "sim"],
      ["e2-5", "sim"],
      ["e2-6", "nao_sei"],
      ["e2-7", "parcial"],
      ["e2-8", "sim"],
      ["e2-9", "nao"],
    ]);
    const { porEtapa, geral } = calcularScores(
      requisitos,
      respostas,
      etapasDoEscopo("inicial"),
    );
    expect(porEtapa[1]).toBe(61); // round(100 · 13.5/22)
    expect(porEtapa[2]).toBe(62); // round(100 · 10.5/17)
    expect(geral).toBe(62); // round((61+62)/2)
  });

  it("requisito aplicável sem resposta pontua como 'não'", () => {
    const respostas = new Map<string, RespostaValor>(
      requisitos.filter((r) => r.etapa === 1).map((r) => [r.id, "sim"]),
    );
    respostas.delete("e1-3"); // peso 3 sem resposta → 0 pontos
    const { porEtapa } = calcularScores(requisitos, respostas, [1]);
    expect(porEtapa[1]).toBe(Math.round((100 * (22 - 3)) / 22)); // 86
  });

  it("status por faixa: ≥80 adequado, 40–79 atenção, <40 crítico", () => {
    expect(statusPorScore(80)).toBe("adequado");
    expect(statusPorScore(79)).toBe("atencao");
    expect(statusPorScore(40)).toBe("atencao");
    expect(statusPorScore(39)).toBe("critico");
  });

  it("gaps ordenados por peso desc, depois etapa", () => {
    const respostas = new Map<string, RespostaValor>([
      ["e1-0", "parcial"], // peso 2, etapa 1
      ["e2-4", "nao"], // peso 3, etapa 2
      ["e1-3", "nao_sei"], // peso 3, etapa 1
      ["e1-2", "sim"], // não é gap
    ]);
    const gaps = ordenarGaps(
      requisitos.filter((r) => respostas.has(r.id)),
      respostas,
    );
    expect(gaps.map((g) => g.id)).toEqual(["e1-3", "e2-4", "e1-0"]);
  });
});

describe("calcularPrazos", () => {
  const vigencia = new Date("2026-02-20T12:00:00");
  const base = { vigencia, prazoArt20Dias: 150, prazoArt23Meses: 30 };

  it("classe 2 sem prorrogação estadual", () => {
    const hoje = new Date("2026-07-10T12:00:00");
    const p = calcularPrazos({ ...base, prorrogacaoDias: 0 }, hoje);
    expect(p.limiteInicial.toISOString().slice(0, 10)).toBe("2026-07-20");
    expect(p.diasRestantesInicial).toBe(10);
    expect(p.limiteTotal.toISOString().slice(0, 10)).toBe("2028-08-20");
  });

  it("classe 2 com prorrogação de 90 dias (RN)", () => {
    const hoje = new Date("2026-07-10T12:00:00");
    const p = calcularPrazos({ ...base, prorrogacaoDias: 90 }, hoje);
    expect(p.limiteInicial.toISOString().slice(0, 10)).toBe("2026-10-18");
    expect(p.diasRestantesInicial).toBe(100);
  });

  it("prazo vencido retorna dias negativos", () => {
    const hoje = new Date("2026-08-01T12:00:00");
    const p = calcularPrazos({ ...base, prorrogacaoDias: 0 }, hoje);
    expect(p.diasRestantesInicial).toBe(-12);
  });
});

describe("parametrosParaClasse", () => {
  const rows = [
    { chave: "vigencia", valor: "2026-02-20", uf: null, descricao: null },
    {
      chave: "prazo_art20_dias_classe_2",
      valor: "150",
      uf: null,
      descricao: null,
    },
    {
      chave: "prazo_art23_meses_classe_2",
      valor: "30",
      uf: null,
      descricao: null,
    },
    {
      chave: "prorrogacao_art20_dias",
      valor: "90",
      uf: "RN",
      descricao: "Decisão CGJ-RN de 02/07/2026",
    },
  ];

  it("aplica prorrogação apenas para a UF que a possui", () => {
    const rn = parametrosParaClasse(rows, 2, "RN");
    expect(rn.prorrogacaoDias).toBe(90);
    expect(rn.prorrogacaoDescricao).toContain("CGJ-RN");
    const sp = parametrosParaClasse(rows, 2, "SP");
    expect(sp.prorrogacaoDias).toBe(0);
    expect(sp.prorrogacaoDescricao).toBeNull();
  });

  it("falha explícita quando o seed não rodou", () => {
    expect(() => parametrosParaClasse(rows, 3, "SP")).toThrow(/classe 3/);
  });

  it("aceita prorrogação no teto legal de 90 dias", () => {
    expect(PRORROGACAO_MAX_DIAS).toBe(90);
    const noTeto = rows.map((r) =>
      r.chave === "prorrogacao_art20_dias"
        ? { ...r, valor: String(PRORROGACAO_MAX_DIAS) }
        : r,
    );
    expect(parametrosParaClasse(noTeto, 2, "RN").prorrogacaoDias).toBe(90);
  });

  it("rejeita prorrogação acima do teto legal do art. 21 (> 90 dias)", () => {
    // valor juridicamente impossível — art. 21 admite "por até 90 dias".
    const acimaDoTeto = rows.map((r) =>
      r.chave === "prorrogacao_art20_dias" ? { ...r, valor: "93" } : r,
    );
    expect(() => parametrosParaClasse(acimaDoTeto, 2, "RN")).toThrow(
      /art\. 21/,
    );
  });
});
