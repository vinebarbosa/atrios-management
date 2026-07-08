// Consultas do cofre — mapeiam linhas do banco para AccessRow SEM os campos
// cifrados (mascaramento por construção; segredo só sai via getSecret).

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { access } from "@/db/schema";
import { STAGES } from "@/lib/product-constants";
import {
  ACCESS_ACTION_LABELS,
  formatDayMonth,
  formatRelative,
  STALE_ROTATION_DAYS,
} from "@/lib/vault-constants";
import type { AccessRow, VaultProductOption } from "./vault-ui";

type AccessWith = Awaited<
  ReturnType<typeof db.query.access.findMany<typeof accessQuery>>
>[number];

function toRow(a: AccessWith): AccessRow {
  const now = Date.now();
  const rotationDays = (now - a.rotatedAt.getTime()) / 86_400_000;
  const stage = STAGES[a.product.stage] ?? STAGES[0];
  return {
    id: a.id,
    name: a.name,
    tipo: a.tipo,
    ambiente: a.ambiente,
    login: a.login,
    hasTotp: a.totpCodesEnc != null,
    notes: a.notes,
    rotatedLabel: `rotacionada ${formatRelative(a.rotatedAt)}`,
    rotatedStale: rotationDays > STALE_ROTATION_DAYS,
    rotationInfo: `${formatRelative(a.rotatedAt)}${
      a.rotatedBy ? ` · ${a.rotatedBy.name}` : ""
    }`,
    createdByName: a.createdBy?.name ?? null,
    createdAtLabel: formatDayMonth(a.createdAt),
    productId: a.productId,
    productName: a.product.name,
    productCode: a.product.code,
    productColor: stage.color,
    events: a.events
      .slice()
      .sort((x, y) => y.createdAt.getTime() - x.createdAt.getTime())
      .map((ev) => ({
        id: ev.id,
        who: ev.user?.name ?? "Alguém",
        action: ACCESS_ACTION_LABELS[ev.action],
        when: formatRelative(ev.createdAt),
      })),
  };
}

/** Colunas explícitas — password_enc/totp_codes_enc só entram como boolean. */
const accessQuery = {
  columns: {
    id: true,
    name: true,
    tipo: true,
    ambiente: true,
    login: true,
    totpCodesEnc: true,
    notes: true,
    productId: true,
    rotatedAt: true,
    createdAt: true,
  },
  with: {
    product: { columns: { name: true, code: true, stage: true } },
    createdBy: { columns: { name: true } },
    rotatedBy: { columns: { name: true } },
    events: {
      columns: { id: true, action: true, createdAt: true },
      with: { user: { columns: { name: true } } },
    },
  },
} as const;

export async function accessRowsForProduct(
  productId: string,
): Promise<AccessRow[]> {
  const rows = await db.query.access.findMany({
    ...accessQuery,
    where: eq(access.productId, productId),
    orderBy: (t, { asc }) => asc(t.name),
  });
  return rows.map(toRow);
}

export async function allAccessRows(): Promise<AccessRow[]> {
  const rows = await db.query.access.findMany({
    ...accessQuery,
    orderBy: (t, { asc }) => asc(t.name),
  });
  return rows.map(toRow);
}

export async function productOptions(): Promise<VaultProductOption[]> {
  const products = await db.query.product.findMany({
    columns: { id: true, name: true, stage: true },
    orderBy: (p, { asc }) => asc(p.name),
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    color: (STAGES[p.stage] ?? STAGES[0]).color,
  }));
}
