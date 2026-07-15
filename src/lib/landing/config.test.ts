import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { showPartners } from "./config";

const src = (rel: string) =>
  readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");

/** As duas páginas públicas que precisam falar a mesma língua. */
const PAGINAS = ["app/site/page.tsx", "app/diagnostico/page.tsx"];

afterEach(() => {
  delete process.env.LANDING_SHOW_PARTNERS;
});

describe("showPartners", () => {
  it("é falso por padrão — parceria só aparece quando formalizada", () => {
    expect(showPartners()).toBe(false);
  });

  it("liga só com 'true' exato", () => {
    process.env.LANDING_SHOW_PARTNERS = "true";
    expect(showPartners()).toBe(true);
    process.env.LANDING_SHOW_PARTNERS = "1";
    expect(showPartners()).toBe(false);
  });
});

// Guardas de fonte única. O risco real aqui não é a lógica errada — é alguém
// (ou algum agente) reintroduzir uma segunda cópia da flag ou da data numa das
// páginas, que foi exatamente o bug que já foi a produção.
describe("fonte única", () => {
  it("nenhuma página lê a flag de parceria por conta própria", () => {
    for (const p of PAGINAS) {
      expect(src(p), p).not.toContain("LANDING_SHOW_PARTNERS");
    }
  });

  it("nenhuma página hardcoda vigência, prorrogação ou data-limite", () => {
    // Datas da norma (2026-02-23, 22/08/2026, ...) e a contagem da prorrogação
    // vêm de parametro_norma via carregarNorma(). Nenhuma delas é literal.
    const proibido = [
      /2026-02-23/,
      /\d{2}\/\d{2}\/20\d{2}(?!\))/, // dd/mm/aaaa solto no JSX
      /\b9[03] dias\b/,
    ];
    for (const p of PAGINAS) {
      const conteudo = src(p);
      for (const re of proibido) {
        expect(conteudo, `${p} — ${re}`).not.toMatch(re);
      }
    }
  });
});
