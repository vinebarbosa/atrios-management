// Acesso ao banco para as páginas públicas. Fica separado de `norma.ts` para
// que o builder puro continue testável sem abrir um pool do Postgres.

import { db } from "@/db";
import { montarNorma, type Norma } from "./norma";

/** Lê `parametro_norma` e monta os dados da norma para a data de hoje. */
export async function carregarNorma(): Promise<Norma> {
  const rows = await db.query.parametroNorma.findMany();
  return montarNorma(rows, new Date());
}
