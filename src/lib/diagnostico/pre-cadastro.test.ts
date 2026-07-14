import { describe, expect, it } from "vitest";
import {
  formatarWhatsapp,
  type LeadNormalizado,
  type PreCadastroInput,
  type ProcessarDeps,
  processarPreCadastro,
  RATE_LIMIT_POR_HORA,
  truncarIp,
  validarPreCadastro,
} from "./pre-cadastro";

const valido: PreCadastroInput = {
  nomeServentia: "Cartório do 1º Ofício de Notas",
  municipioUf: "Natal / RN",
  atribuicao: "Notas",
  seuNome: "Maria das Graças Dantas",
  cargo: "Titular",
  whatsapp: "(84) 9 9999-8888",
  email: "maria@cartorio.com.br",
};

describe("validarPreCadastro", () => {
  it("normaliza um envio válido", () => {
    const { data, errors } = validarPreCadastro(valido);
    expect(errors).toEqual({});
    expect(data).toMatchObject({
      serventia: "Cartório do 1º Ofício de Notas",
      municipio: "Natal",
      uf: "RN",
      atribuicao: "Notas",
      contatoNome: "Maria das Graças Dantas",
      contatoCargo: "Titular",
      whatsappDigitos: "84999998888",
      email: "maria@cartorio.com.br",
    });
  });

  it("rejeita e-mail inválido", () => {
    const { data, errors } = validarPreCadastro({
      ...valido,
      email: "maria@cartorio",
    });
    expect(data).toBeNull();
    expect(errors.email).toBe("Informe um e-mail válido.");
  });

  it("rejeita obrigatórios vazios e whatsapp incompleto", () => {
    const { data, errors } = validarPreCadastro({
      nomeServentia: "  ",
      municipioUf: "",
      atribuicao: "",
      seuNome: "",
      whatsapp: "(84) 4042",
      email: "",
    });
    expect(data).toBeNull();
    expect(errors.nomeServentia).toBe("Campo obrigatório.");
    expect(errors.municipioUf).toBe("Campo obrigatório.");
    expect(errors.atribuicao).toBe("Campo obrigatório.");
    expect(errors.seuNome).toBe("Campo obrigatório.");
    expect(errors.email).toBe("Campo obrigatório.");
    expect(errors.whatsapp).toBe(
      "Informe um número com DDD, ex.: (84) 9 0000-0000.",
    );
  });
});

describe("formatarWhatsapp / truncarIp", () => {
  it("aplica a máscara de celular", () => {
    expect(formatarWhatsapp("84999998888")).toBe("(84) 9 9999-8888");
    expect(formatarWhatsapp("8440420438")).toBe("(84) 4042-0438");
  });

  it("trunca o IP preservando privacidade", () => {
    expect(truncarIp("189.6.24.55")).toBe("189.6.24.0");
    expect(truncarIp("2804:14d:5cff:8a00:1:2:3:4")).toBe(
      "2804:14d:5cff:8a00::",
    );
  });
});

/** Deps em memória para exercitar o fluxo sem banco. */
function fakeDeps(over: Partial<ProcessarDeps> = {}) {
  const criados: LeadNormalizado[] = [];
  const submissoes: string[] = [];
  const tocados: string[] = [];
  const deps: ProcessarDeps = {
    now: () => new Date("2026-07-14T12:00:00Z"),
    contarEnviosPorIp: async () => 0,
    acharLeadDuplicado: async () => null,
    criarLead: async (lead) => {
      criados.push(lead);
      return { id: `lead-${criados.length}` };
    },
    tocarLead: async (id) => {
      tocados.push(id);
    },
    registrarSubmissao: async (rec) => {
      submissoes.push(rec.resultado);
    },
    notificarEquipe: async () => {},
    ...over,
  };
  return { deps, criados, submissoes, tocados };
}

describe("processarPreCadastro", () => {
  it("cria o lead e notifica com dados válidos", async () => {
    const { deps, criados, submissoes } = fakeDeps();
    const res = await processarPreCadastro(valido, { ip: "189.6.24.0" }, deps);
    expect(res.ok).toBe(true);
    expect(criados).toHaveLength(1);
    expect(submissoes).toContain("created");
  });

  it("não cria nada quando o e-mail é inválido", async () => {
    const { deps, criados, submissoes } = fakeDeps();
    const res = await processarPreCadastro(
      { ...valido, email: "invalido" },
      { ip: "189.6.24.0" },
      deps,
    );
    expect(res.ok).toBe(false);
    expect(res.errors?.email).toBeDefined();
    expect(criados).toHaveLength(0);
    expect(submissoes).toContain("rejected");
  });

  it("honeypot preenchido não cria nada (sucesso silencioso)", async () => {
    const { deps, criados, submissoes } = fakeDeps();
    const res = await processarPreCadastro(
      { ...valido, website: "http://spam.example" },
      { ip: "189.6.24.0" },
      deps,
    );
    expect(res.ok).toBe(true);
    expect(criados).toHaveLength(0);
    expect(submissoes).toEqual(["honeypot"]);
  });

  it("duplicado em < 24h atualiza o existente, não cria segundo", async () => {
    const { deps, criados, tocados, submissoes } = fakeDeps({
      acharLeadDuplicado: async () => ({ id: "lead-existente" }),
    });
    const res = await processarPreCadastro(valido, { ip: "189.6.24.0" }, deps);
    expect(res.ok).toBe(true);
    expect(criados).toHaveLength(0);
    expect(tocados).toEqual(["lead-existente"]);
    expect(submissoes).toContain("updated");
  });

  it("bloqueia acima do limite por IP", async () => {
    const { deps, criados } = fakeDeps({
      contarEnviosPorIp: async () => RATE_LIMIT_POR_HORA,
    });
    const res = await processarPreCadastro(valido, { ip: "189.6.24.0" }, deps);
    expect(res.ok).toBe(false);
    expect(res.errors?.geral).toBeDefined();
    expect(criados).toHaveLength(0);
  });
});
