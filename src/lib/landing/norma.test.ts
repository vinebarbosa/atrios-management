import { describe, expect, it } from "vitest";
import type { ParametroRow } from "../diagnostico/motor";
import { montarNorma } from "./norma";

// Estas linhas espelham o seed real (src/db/seed-provimento.ts). O ponto do
// arquivo é travar a regra: TODA data exibida em `/` e `/diagnostico` deriva de
// parametro_norma. Já houve bug em produção com a data hardcoded em dois
// lugares (landing exibindo "93 dias" com a CGJ-RN tendo concedido 90).

const linha = (
  chave: string,
  valor: string,
  uf: string | null = null,
): ParametroRow => ({ chave, valor, uf, descricao: null });

const ROWS: ParametroRow[] = [
  linha("vigencia", "2026-02-23"),
  linha("teto_classe_1", "100000"),
  linha("teto_classe_2", "500000"),
  linha("prazo_art20_dias_classe_1", "210"),
  linha("prazo_art20_dias_classe_2", "150"),
  linha("prazo_art20_dias_classe_3", "90"),
  linha("prazo_art23_meses_classe_1", "36"),
  linha("prazo_art23_meses_classe_2", "30"),
  linha("prazo_art23_meses_classe_3", "24"),
  linha("prorrogacao_art20_dias", "90", "RN"),
];

const HOJE = new Date("2026-07-15T12:00:00");

describe("montarNorma", () => {
  it("deriva as datas-limite do RN da vigência + art. 20 + prorrogação", () => {
    const n = montarNorma(ROWS, HOJE);

    expect(n.vigencia).toBe("23/02/2026");
    expect(n.porClasse[3].dataLimite).toBe("22/08/2026");
    expect(n.porClasse[2].dataLimite).toBe("21/10/2026");
    expect(n.porClasse[1].dataLimite).toBe("20/12/2026");
  });

  it("usa a prorrogação de 90 dias do RN, não outro valor", () => {
    expect(montarNorma(ROWS, HOJE).prorrogacaoDias).toBe(90);
  });

  it("recalcula tudo quando a vigência muda no banco (nada hardcoded)", () => {
    const adiada = ROWS.map((r) =>
      r.chave === "vigencia" ? { ...r, valor: "2026-03-23" } : r,
    );
    const n = montarNorma(adiada, HOJE);

    // +28 dias na vigência ⇒ +28 dias em cada data-limite.
    expect(n.vigencia).toBe("23/03/2026");
    expect(n.porClasse[3].dataLimite).toBe("19/09/2026");
    expect(n.porClasse[2].dataLimite).toBe("18/11/2026");
    expect(n.porClasse[1].dataLimite).toBe("17/01/2027");
  });

  it("conta os dias restantes a partir de hoje", () => {
    const n = montarNorma(ROWS, HOJE);
    // 15/07/2026 → 22/08/2026
    expect(n.porClasse[3].diasRestantes).toBe(38);
  });

  it("mostra 0 (e não negativo) quando o prazo já venceu", () => {
    const n = montarNorma(ROWS, new Date("2027-01-01T12:00:00"));
    for (const c of [1, 2, 3]) {
      expect(n.porClasse[c].diasRestantes).toBe(0);
    }
  });

  it("expõe os tetos de classe do art. 16 vindos do banco", () => {
    const n = montarNorma(ROWS, HOJE);
    expect(n.tetoClasse1).toBe(100_000);
    expect(n.tetoClasse2).toBe(500_000);
  });

  it("recusa prorrogação acima do teto legal do art. 21", () => {
    const invalida = ROWS.map((r) =>
      r.chave === "prorrogacao_art20_dias" ? { ...r, valor: "93" } : r,
    );
    // Falha alto em vez de publicar uma afirmação juridicamente impossível.
    expect(() => montarNorma(invalida, HOJE)).toThrow(/art\. 21/);
  });
});
