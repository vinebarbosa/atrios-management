import { describe, expect, it } from "vitest";
import { isPublic } from "./proxy";

// O site institucional e a landing precisam ser alcançáveis SEM sessão —
// inclusive as rotas de imagem OG, que o crawler do WhatsApp busca anonimamente.

describe("isPublic", () => {
  it("libera o site institucional e a landing de pré-cadastro", () => {
    expect(isPublic("/")).toBe(true);
    expect(isPublic("/site")).toBe(true);
    expect(isPublic("/diagnostico")).toBe(true);
  });

  it("libera as imagens OG — senão o card do WhatsApp sai sem imagem", () => {
    // Sem ponto no path: o matcher do proxy não as ignora sozinho. Elas moram
    // no segmento da página que ilustram (convention do App Router).
    expect(isPublic("/site/opengraph-image")).toBe(true);
    expect(isPublic("/site/twitter-image")).toBe(true);
    expect(isPublic("/diagnostico/opengraph-image")).toBe(true);
    expect(isPublic("/diagnostico/twitter-image")).toBe(true);
  });

  it("libera as páginas legais linkadas no rodapé", () => {
    expect(isPublic("/privacidade")).toBe(true);
    expect(isPublic("/termos")).toBe(true);
  });

  it("mantém o app autenticado fechado", () => {
    for (const p of ["/produtos", "/cofre", "/time", "/serventias", "/voce"]) {
      expect(isPublic(p), p).toBe(false);
    }
  });

  it("não confunde /diagnosticos (módulo interno) com /diagnostico", () => {
    expect(isPublic("/diagnosticos")).toBe(false);
    expect(isPublic("/diagnosticos/abc")).toBe(false);
  });
});
