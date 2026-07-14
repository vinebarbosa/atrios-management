// Seed da base de prospecção — as serventias extrajudiciais do RN.
// Fonte: src/db/serventias-rn.json (dump da API pública do Justiça Aberta/CNJ,
// extração 10/07/2026).
//
// Rode com: npm run db:seed:serventias
// Idempotente: upsert por CNS — rodar duas vezes mantém a base do tamanho do
// JSON (218), não o dobro. Atualiza sincronizado_em a cada execução.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), {
  schema,
});

// Formato cru de cada item do JSON (API do Justiça Aberta).
type ServentiaJson = {
  cns: string;
  nome: string;
  cidade: string;
  sit: string;
  tipo: string;
  nat: string;
  tel: string;
  email: string;
  end: string;
  resp: string;
  ing: string;
  status: string;
  p1: string;
  v1: number;
  atos1: number;
  v2: number;
};

const UF = "RN";

/** "" / undefined → null; caso contrário, string trimada. */
function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t === "" ? null : t;
}

async function main() {
  const path = join(import.meta.dirname, "serventias-rn.json");
  const registros = JSON.parse(readFileSync(path, "utf8")) as ServentiaJson[];

  // um único carimbo por execução (marca de sincronização)
  const agora = new Date();
  for (const r of registros) {
    const cns = (r.cns ?? "").trim();
    if (!cns) continue;
    const values: typeof schema.serventia.$inferInsert = {
      cns,
      nome: (r.nome ?? "").trim(),
      cidade: (r.cidade ?? "").trim(),
      uf: UF,
      situacao: (r.sit ?? "").trim(),
      tipo: nz(r.tipo),
      natureza: nz(r.nat),
      telefone: nz(r.tel),
      email: nz(r.email),
      endereco: nz(r.end),
      responsavel: nz(r.resp),
      // date aceita "YYYY-MM-DD"; registros sem ingresso ficam null
      ingresso: nz(r.ing),
      arrecPeriodo: nz(r.p1),
      // numeric espera string no driver; v1/v2 sempre presentes, mas guardamos
      arrecAtual: r.v1 != null ? String(r.v1) : null,
      arrecAnterior: r.v2 != null ? String(r.v2) : null,
      atos: r.atos1 ?? null,
      sincronizadoEm: agora,
    };
    await db
      .insert(schema.serventia)
      .values(values)
      .onConflictDoUpdate({ target: schema.serventia.cns, set: values });
  }

  console.log(
    `Seed serventias: ${registros.length} serventias (upsert por CNS).`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
