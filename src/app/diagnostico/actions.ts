"use server";

import { and, count, eq, gte, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  formatarWhatsapp,
  type PreCadastroInput,
  type ProcessarDeps,
  type ProcessarResultado,
  processarPreCadastro,
  truncarIp,
} from "@/lib/diagnostico/pre-cadastro";
import { sendEmail } from "@/lib/email";
import { publish } from "@/lib/realtime/publish";
import { channels } from "@/lib/realtime/types";

const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "contato@atrioss.com";

/** IP do visitante a partir dos headers do proxy/CDN, já truncado (LGPD). */
async function ipTruncado(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const bruto = fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  return truncarIp(bruto);
}

const deps: ProcessarDeps = {
  now: () => new Date(),

  async contarEnviosPorIp(ip, desde) {
    const [row] = await db
      .select({ c: count() })
      .from(schema.preCadastroSubmission)
      .where(
        and(
          eq(schema.preCadastroSubmission.ip, ip),
          gte(schema.preCadastroSubmission.createdAt, desde),
        ),
      );
    return row?.c ?? 0;
  },

  async acharLeadDuplicado(email, whatsappDigitos, desde) {
    const whatsapp = formatarWhatsapp(whatsappDigitos);
    const dup = await db.query.diagnostico.findFirst({
      columns: { id: true },
      where: and(
        eq(schema.diagnostico.origem, "pre-cadastro"),
        gte(schema.diagnostico.createdAt, desde),
        or(
          eq(schema.diagnostico.contatoEmail, email),
          eq(schema.diagnostico.contatoWhatsapp, whatsapp),
        ),
      ),
    });
    return dup ?? null;
  },

  async criarLead(lead, consentimentoEm) {
    const [row] = await db
      .insert(schema.diagnostico)
      .values({
        serventia: lead.serventia,
        municipio: lead.municipio,
        uf: lead.uf,
        atribuicao: lead.atribuicao,
        contatoNome: lead.contatoNome,
        contatoCargo: lead.contatoCargo,
        contatoEmail: lead.email,
        contatoWhatsapp: lead.whatsapp,
        consentimentoEm,
        consentimentoPolitica: lead.politicaVersao,
        // Etapas 1 e 2 são o mínimo obrigatório (art. 20); a equipe ajusta o
        // escopo/classe ao trabalhar o lead.
        escopo: "inicial",
        statusFunil: "novo",
        origem: "pre-cadastro",
      })
      .returning({ id: schema.diagnostico.id });
    return { id: row.id };
  },

  async tocarLead(id) {
    await db
      .update(schema.diagnostico)
      .set({ updatedAt: new Date() })
      .where(eq(schema.diagnostico.id, id));
  },

  async registrarSubmissao(rec) {
    await db.insert(schema.preCadastroSubmission).values({
      ip: rec.ip,
      email: rec.email,
      whatsapp: rec.whatsapp,
      diagnosticoId: rec.diagnosticoId,
      resultado: rec.resultado,
    });
  },

  async notificarEquipe(lead, id) {
    const linhas = [
      `Serventia: ${lead.serventia}`,
      `Município/UF: ${lead.municipio} / ${lead.uf}`,
      `Atribuição: ${lead.atribuicao}`,
      `Contato: ${lead.contatoNome}${lead.contatoCargo ? ` (${lead.contatoCargo})` : ""}`,
      `WhatsApp: ${lead.whatsapp}`,
      `E-mail: ${lead.email}`,
      "",
      "Origem: pré-cadastro (landing pública). Status: Novo.",
    ].join("\n");
    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `Novo pré-cadastro — ${lead.serventia}`,
      text: linhas,
    });
    await publish({ channel: channels.diagnosticos, type: "changed", id });
    revalidatePath("/diagnosticos");
  },
};

/**
 * Envio do formulário público. Toda a decisão (honeypot, validação, rate limit,
 * dedup) vive em `processarPreCadastro`; aqui só ligamos o banco/headers/email.
 */
export async function enviarPreCadastro(
  input: PreCadastroInput,
): Promise<ProcessarResultado> {
  try {
    const ip = await ipTruncado();
    return await processarPreCadastro(input, { ip }, deps);
  } catch (err) {
    console.error("[pre-cadastro] falha ao processar envio", err);
    return {
      ok: false,
      errors: {
        geral:
          "Não foi possível enviar agora. Tente novamente ou fale com contato@atrioss.com.",
      },
    };
  }
}
