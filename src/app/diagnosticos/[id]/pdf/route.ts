// GET /diagnosticos/[id]/pdf — relatório em PDF gerado no servidor (pdfkit),
// com a marca Átrios, pronto para anexar na proposta.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import PDFDocument from "pdfkit";
import { auth } from "@/lib/auth";
import {
  ESCOPO_LABEL,
  ETAPAS,
  IDENTIDADE_PITCH,
  MODELO_LABEL,
  PESO_LABEL,
  SITUACAO_GAP,
  SITUACAO_IDENTIDADE,
  STATUS_ETAPA_LABEL,
} from "@/lib/diagnostico/constants";
import { statusPorScore } from "@/lib/diagnostico/motor";
import { getDiagnostico, getRelatorio, type Relatorio } from "../queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Não autorizado", { status: 401 });

  const { id } = await params;
  const diag = await getDiagnostico(id);
  if (!diag) return new Response("Diagnóstico não encontrado", { status: 404 });

  const relatorio = await getRelatorio(diag);
  const logo = await readFile(
    path.join(process.cwd(), "public", "atrios-logo.png"),
  );
  const pdf = await gerarPdf(relatorio, logo);

  const slug = diag.serventia
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-provimento-213-${slug || "serventia"}.pdf"`,
    },
  });
}

/* ---- Render -------------------------------------------------------------- */

const AZUL = "#1e3a5f";
const CINZA_TXT = "#555555";
const BORDA = "#dde3ea";
const STATUS_COR = {
  adequado: "#2e7d32",
  atencao: "#e65100",
  critico: "#c62828",
} as const;
const PESO_COR: Record<number, string> = {
  3: "#c62828",
  2: "#e65100",
  1: "#8a8f98",
};

/** Fontes padrão (WinAnsi) não têm emoji/≤/≥ — normaliza para o PDF. */
function t(s: string): string {
  return s
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}]/gu, "")
    .replace(/\u{FE0F}/gu, "")
    .trim();
}

function gerarPdf(relatorio: Relatorio, logo: Buffer): Promise<Buffer> {
  const {
    diagnostico: d,
    etapas,
    porEtapa,
    geral,
    gaps,
    parametros,
    alerta,
    identidadeOps,
    notaModelo,
  } = relatorio;

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const M = 48;
  const W = doc.page.width - 2 * M; // largura útil
  const bottom = () => doc.page.height - M - 24;
  const ensure = (h: number) => {
    if (doc.y + h > bottom()) doc.addPage();
  };

  /* Cabeçalho com a marca */
  doc.rect(0, 0, doc.page.width, 108).fill(AZUL);
  doc.image(logo, M, 22, { height: 34 });
  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Diagnóstico de Adequação", M, 64)
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#d8e0ea")
    .text("Provimento CNJ n. 213/2026 e LGPD · Uso interno", M, 84);
  const geradoEm = new Date().toLocaleDateString("pt-BR");
  doc.text(`Gerado em ${geradoEm}`, M, 84, { width: W, align: "right" });

  /* Capa / identificação */
  doc.y = 130;
  doc.x = M;
  doc
    .fillColor(AZUL)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(t(d.serventia), { width: W });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(9.5).fillColor(CINZA_TXT);
  const linhaCapa = [
    `Classe ${d.classe}${d.subclasse ?? ""}`,
    d.municipio ? `${d.municipio}/${d.uf}` : d.uf,
    d.cns ? `CNS ${d.cns}` : null,
    MODELO_LABEL[d.modeloSolucao],
  ]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(t(linhaCapa), { width: W });
  const contato = [d.contatoNome, d.contatoEmail, d.contatoWhatsapp]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(t(`Contato: ${contato}`), { width: W });
  doc.text(t(ESCOPO_LABEL[d.escopo]), { width: W });
  if (parametros.tecnicos) {
    const p = parametros.tecnicos;
    doc.moveDown(0.3);
    doc.text(
      t(
        `Parâmetros mínimos da classe: backup completo a cada ${p.bkp} · RPO ${p.rpo} · RTO ${p.rto} · teste de restauração ${p.rest} · internet de referência ${p.net}`,
      ),
      { width: W },
    );
  }
  doc.moveDown(0.8);

  /* Alerta de prazo */
  const alertaCor = alerta.tipo === "ok" ? "#2e7d32" : "#c62828";
  const alertaBg = alerta.tipo === "ok" ? "#eaf5ea" : "#fdecea";
  const alertaTxt = `${t(alerta.titulo)} ${t(alerta.corpo)}${alerta.fonte ? `\n${t(alerta.fonte)}` : ""}`;
  doc.font("Helvetica").fontSize(9.5);
  const alertaH =
    doc.heightOfString(alertaTxt, { width: W - 24, lineGap: 1.5 }) + 20;
  ensure(alertaH + 8);
  const ay = doc.y;
  doc.rect(M, ay, W, alertaH).fill(alertaBg);
  doc.rect(M, ay, 4, alertaH).fill(alertaCor);
  doc
    .fillColor("#333333")
    .text(alertaTxt, M + 14, ay + 10, { width: W - 24, lineGap: 1.5 });
  doc.y = ay + alertaH + 16;
  doc.x = M;

  /* Score geral + por etapa */
  const statusGeral = statusPorScore(geral);
  ensure(70);
  doc
    .fillColor(STATUS_COR[statusGeral])
    .font("Helvetica-Bold")
    .fontSize(30)
    .text(`${geral}%`, M, doc.y, { width: W, align: "center" });
  doc
    .fillColor(CINZA_TXT)
    .font("Helvetica")
    .fontSize(9)
    .text(
      t(
        `conformidade nas etapas avaliadas (${etapas.length === 2 ? "Etapas 1 e 2 — implementação inicial obrigatória" : "Etapas 1 a 5"}) — ${STATUS_ETAPA_LABEL[statusGeral]}`,
      ),
      { width: W, align: "center" },
    );
  doc.moveDown(0.8);

  for (const e of etapas) {
    const score = porEtapa[e];
    const st = statusPorScore(score);
    ensure(34);
    const y = doc.y;
    doc
      .fillColor("#333333")
      .font("Helvetica")
      .fontSize(9)
      .text(t(ETAPAS[e]), M, y, { width: W - 110 });
    doc
      .fillColor(STATUS_COR[st])
      .font("Helvetica-Bold")
      .text(`${STATUS_ETAPA_LABEL[st]}  ${score}%`, M + W - 105, y, {
        width: 105,
        align: "right",
      });
    const by = y + 14;
    doc.roundedRect(M, by, W, 8, 4).fill("#e9edf2");
    if (score > 0)
      doc
        .roundedRect(M, by, Math.max(8, (W * score) / 100), 8, 4)
        .fill(STATUS_COR[st]);
    doc.y = by + 16;
    doc.x = M;
  }
  if (notaModelo) {
    ensure(30);
    doc
      .fillColor(CINZA_TXT)
      .font("Helvetica-Oblique")
      .fontSize(8.5)
      .text(t(notaModelo), M, doc.y, { width: W });
    doc.moveDown(0.5);
  }
  doc.moveDown(0.6);

  /* Gaps priorizados */
  ensure(40);
  doc
    .fillColor(AZUL)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Pontos de adequação identificados (${gaps.length})`, M, doc.y, {
      width: W,
    });
  doc.moveDown(0.5);
  if (gaps.length === 0) {
    doc
      .fillColor(CINZA_TXT)
      .font("Helvetica")
      .fontSize(9.5)
      .text(
        "Nenhum gap identificado nos requisitos avaliados. Recomenda-se validação técnica das evidências.",
        { width: W },
      );
  }
  for (const g of gaps) {
    const titulo = `${PESO_LABEL[g.peso]} · ${t(g.perguntaTecnica)}`;
    const meta = t(
      `Etapa ${g.etapa} · Anexo IV, ${g.refNormativa} · situação: ${SITUACAO_GAP[g.valor]}`,
    );
    doc.font("Helvetica-Bold").fontSize(9);
    const h1 = doc.heightOfString(titulo, { width: W - 22 });
    doc.font("Helvetica").fontSize(8);
    const h2 = doc.heightOfString(meta, { width: W - 22 });
    const boxH = h1 + h2 + 16;
    ensure(boxH + 6);
    const y = doc.y;
    doc.rect(M, y, W, boxH).strokeColor(BORDA).lineWidth(0.8).stroke();
    doc.rect(M, y, 3.5, boxH).fill(PESO_COR[g.peso]);
    doc
      .fillColor("#222222")
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(titulo, M + 12, y + 7, { width: W - 22 });
    doc
      .fillColor("#777777")
      .font("Helvetica")
      .fontSize(8)
      .text(meta, M + 12, y + 9 + h1, { width: W - 22 });
    doc.y = y + boxH + 6;
    doc.x = M;
  }
  doc.moveDown(0.6);

  /* Identidade digital */
  if (identidadeOps.length > 0) {
    ensure(46);
    doc
      .fillColor(AZUL)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "Recomendações de suporte à conformidade — Identidade digital",
        M,
        doc.y,
        { width: W },
      );
    doc
      .fillColor("#777777")
      .font("Helvetica")
      .fontSize(8.5)
      .text(
        "Itens não pontuados no Provimento, porém vinculados aos deveres de rastreabilidade, controle de dados e atendimento aos titulares.",
        { width: W },
      );
    doc.moveDown(0.5);
    for (const op of identidadeOps) {
      const pitch = IDENTIDADE_PITCH[op.item];
      const titulo = `OFERTA · ${t(pitch.titulo)}`;
      const corpo = t(pitch.descricao);
      const arg = t(pitch.argumento);
      const situacao = `situação declarada: ${SITUACAO_IDENTIDADE[op.valor]}`;
      doc.font("Helvetica-Bold").fontSize(9);
      const h1 = doc.heightOfString(titulo, { width: W - 22 });
      doc.font("Helvetica").fontSize(8.5);
      const h2 = doc.heightOfString(corpo, { width: W - 22, lineGap: 1 });
      doc.font("Helvetica-Oblique").fontSize(8);
      const h3 = doc.heightOfString(arg, { width: W - 22 });
      const h4 = 10;
      const boxH = h1 + h2 + h3 + h4 + 22;
      ensure(boxH + 6);
      const y = doc.y;
      doc.rect(M, y, W, boxH).strokeColor(BORDA).lineWidth(0.8).stroke();
      doc.rect(M, y, 3.5, boxH).fill("#e65100");
      doc
        .fillColor("#222222")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(titulo, M + 12, y + 7, { width: W - 22 });
      doc
        .fillColor("#444444")
        .font("Helvetica")
        .fontSize(8.5)
        .text(corpo, M + 12, y + 9 + h1, { width: W - 22, lineGap: 1 });
      doc
        .fillColor("#555555")
        .font("Helvetica-Oblique")
        .fontSize(8)
        .text(arg, M + 12, y + 11 + h1 + h2, { width: W - 22 });
      doc
        .fillColor("#888888")
        .font("Helvetica")
        .fontSize(7.5)
        .text(situacao, M + 12, y + 13 + h1 + h2 + h3, { width: W - 22 });
      doc.y = y + boxH + 6;
      doc.x = M;
    }
  }

  /* Rodapé */
  ensure(30);
  doc.moveDown(0.8);
  doc
    .fillColor("#888888")
    .font("Helvetica")
    .fontSize(8)
    .text(
      t(
        `Átrios · Diagnóstico baseado em informações declaradas na entrevista; a validação técnica ocorre na visita/levantamento.${d.criadoPor?.name ? ` Conduzido por ${d.criadoPor.name}.` : ""} Gerado em ${geradoEm}.`,
      ),
      M,
      doc.y,
      { width: W, align: "center" },
    );

  doc.end();
  return done;
}
