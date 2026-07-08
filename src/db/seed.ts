// Seed de desenvolvimento — dados do mockup "Átrios Produtos (standalone)".
// Rode com: npm run db:seed (apaga e recria só as tabelas de produto).

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { encryptSecret } from "../lib/vault-crypto.ts";
import * as schema from "./schema.ts";

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), {
  schema,
});

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const ago = (ms: number) => new Date(now - ms);

interface SeedProduct {
  name: string;
  code: string;
  stage: number;
  desc: string;
  longDesc?: string;
  updatedAgoMs: number;
  repos?: { label: string; name: string }[];
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "Pórtico",
    code: "POR",
    stage: 4,
    desc: "Gateway e checkout de pagamentos",
    longDesc:
      "Gateway e checkout de pagamentos da Átrios. Processa transações via cartão, Pix e boleto, com antifraude integrado e conciliação automática. Base do fluxo de receita de todos os produtos do portfólio.",
    updatedAgoMs: 2 * HOUR,
    repos: [
      { label: "frontend", name: "portico-web" },
      { label: "api", name: "portico-api" },
      { label: "mobile", name: "portico-mobile" },
    ],
  },
  {
    name: "Cortina",
    code: "COR",
    stage: 2,
    desc: "Painel de antifraude",
    updatedAgoMs: 20 * MIN,
  },
  {
    name: "Ábaco",
    code: "ABA",
    stage: 3,
    desc: "Motor de conciliação contábil",
    updatedAgoMs: 5 * HOUR,
  },
  {
    name: "Verso",
    code: "VER",
    stage: 1,
    desc: "Editor de contratos",
    updatedAgoMs: DAY,
  },
  {
    name: "Peristilo",
    code: "PER",
    stage: 0,
    desc: "Marketplace de integrações",
    updatedAgoMs: 3 * DAY,
  },
  {
    name: "Colunata",
    code: "COL",
    stage: 2,
    desc: "SDK de pagamentos",
    updatedAgoMs: 1 * HOUR,
  },
  {
    name: "Frontão",
    code: "FRO",
    stage: 5,
    desc: "Antigo portal de boletos",
    updatedAgoMs: 60 * DAY,
  },
];

// Datas do stepper do mockup (Pórtico): 12 fev … 08 jun do ano corrente.
const PORTICO_STAGE_DATES = [
  "2026-02-12",
  "2026-03-03",
  "2026-03-24",
  "2026-05-19",
  "2026-06-08",
];

interface SeedCard {
  seq: number;
  title: string;
  status: schema.CardStatus;
  repo?: string; // label do repo do Pórtico
  pr?: number;
  auto?: boolean;
  desc?: string;
}

const PORTICO_CARDS: SeedCard[] = [
  {
    seq: 24,
    title: "Ajustar timeout do gateway de pagamento",
    status: "todo",
    repo: "api",
  },
  { seq: 25, title: "Reunião de kickoff — cliente Vega", status: "todo" },
  {
    seq: 26,
    title: "Revisar copy da tela de checkout",
    status: "todo",
    repo: "frontend",
  },
  {
    seq: 19,
    title: "Retry de webhooks do Stripe",
    status: "progress",
    repo: "api",
    pr: 142,
    desc: "Reprocessar webhooks que falham no primeiro envio com backoff exponencial (até 5 tentativas). Guardar o payload bruto e o status de cada tentativa para auditoria. Cobrir os eventos payment_intent.succeeded e charge.refunded.",
  },
  {
    seq: 21,
    title: "Novo fluxo 3DS no checkout",
    status: "progress",
    repo: "frontend",
  },
  {
    seq: 17,
    title: "Refatorar serviço de conciliação",
    status: "review",
    repo: "api",
    pr: 138,
    auto: true,
  },
  {
    seq: 20,
    title: "Tela de histórico de transações",
    status: "review",
    repo: "frontend",
    pr: 140,
  },
  {
    seq: 12,
    title: "Pipeline de CI/CD do serviço api",
    status: "done",
    repo: "api",
  },
  {
    seq: 15,
    title: "Design tokens do app mobile",
    status: "done",
    repo: "mobile",
  },
  { seq: 8, title: "Contrato de dados do webhook", status: "done" },
];

// Acessos do cofre (frames 13–16). `rotatedDays` > 90 exercita o âmbar.
interface SeedAccess {
  product: string; // code
  name: string;
  tipo: schema.AccessTipo;
  ambiente: schema.AccessAmbiente;
  login: string;
  rotatedDays: number;
  totp?: string;
  notes?: string;
}

const ACCESSES: SeedAccess[] = [
  {
    product: "POR",
    name: "Admin Pórtico",
    tipo: "sistema",
    ambiente: "producao",
    login: "admin@portico.atrios.com.br",
    rotatedDays: 12,
  },
  {
    product: "POR",
    name: "AWS · conta da organização",
    tipo: "infra",
    ambiente: "producao",
    login: "atrios-org",
    rotatedDays: 180,
  },
  {
    product: "POR",
    name: "Postgres · principal",
    tipo: "banco",
    ambiente: "producao",
    login: "portico_admin",
    rotatedDays: 30,
  },
  {
    product: "POR",
    name: "Postgres · homologação",
    tipo: "banco",
    ambiente: "homologacao",
    login: "portico_hml",
    rotatedDays: 45,
  },
  {
    product: "POR",
    name: "Admin Pórtico · staging",
    tipo: "sistema",
    ambiente: "homologacao",
    login: "admin@hml.portico.atrios.com.br",
    rotatedDays: 60,
  },
  {
    product: "POR",
    name: "OpenAI · org Átrios",
    tipo: "plataforma",
    ambiente: "geral",
    login: "dev@atrios.com.br",
    rotatedDays: 20,
    totp: "9fk2-p7q1  mt4w-zz8c  h3rn-x6v4",
    notes:
      "Conta usada pelos serviços de IA do checkout. O billing é do cartão corporativo.",
  },
  {
    product: "POR",
    name: "Stripe · dashboard",
    tipo: "plataforma",
    ambiente: "geral",
    login: "financeiro@atrios.com.br",
    rotatedDays: 25,
  },
  {
    product: "POR",
    name: "Zoho Mail · no-reply",
    tipo: "email",
    ambiente: "geral",
    login: "no-reply@atrios.com.br",
    rotatedDays: 40,
  },
  {
    product: "COR",
    name: "Admin Cortina",
    tipo: "sistema",
    ambiente: "producao",
    login: "admin@cortina.atrios.com.br",
    rotatedDays: 15,
  },
  {
    product: "COR",
    name: "Postgres · principal",
    tipo: "banco",
    ambiente: "producao",
    login: "cortina_admin",
    rotatedDays: 35,
  },
  {
    product: "COR",
    name: "Twilio · SMS",
    tipo: "plataforma",
    ambiente: "geral",
    login: "ops@atrios.com.br",
    rotatedDays: 50,
  },
  {
    product: "COR",
    name: "Metabase · BI",
    tipo: "plataforma",
    ambiente: "geral",
    login: "bi@atrios.com.br",
    rotatedDays: 70,
  },
  {
    product: "ABA",
    name: "Admin Ábaco",
    tipo: "sistema",
    ambiente: "producao",
    login: "admin@abaco.atrios.com.br",
    rotatedDays: 22,
  },
  {
    product: "ABA",
    name: "Postgres · principal",
    tipo: "banco",
    ambiente: "homologacao",
    login: "abaco_hml",
    rotatedDays: 150,
  },
  {
    product: "ABA",
    name: "S3 · buckets",
    tipo: "infra",
    ambiente: "geral",
    login: "abaco-storage",
    rotatedDays: 80,
  },
];

async function main() {
  // Limpa só o domínio de produtos (cascade cobre repos, cards, eventos e acessos).
  await db.delete(schema.product);

  const idByCode = new Map<string, string>();

  for (const p of PRODUCTS) {
    const updatedAt = ago(p.updatedAgoMs);
    const [row] = await db
      .insert(schema.product)
      .values({
        name: p.name,
        code: p.code,
        description: p.desc,
        longDescription: p.longDesc,
        stage: p.stage,
        createdAt: ago(150 * DAY),
        updatedAt,
      })
      .returning();
    idByCode.set(p.code, row.id);

    // Um evento por etapa já atingida; Pórtico usa as datas do mockup,
    // os demais espaçam 30 dias até a etapa atual.
    const events = Array.from({ length: p.stage + 1 }, (_, i) => ({
      productId: row.id,
      stage: i,
      enteredAt:
        p.code === "POR" && PORTICO_STAGE_DATES[i]
          ? new Date(`${PORTICO_STAGE_DATES[i]}T12:00:00`)
          : ago((p.stage + 1 - i) * 30 * DAY),
    }));
    await db.insert(schema.productStageEvent).values(events);

    const repoIds = new Map<string, string>();
    for (const r of p.repos ?? []) {
      const [repo] = await db
        .insert(schema.productRepo)
        .values({ productId: row.id, label: r.label, name: r.name })
        .returning();
      repoIds.set(r.label, repo.id);
    }

    if (p.code === "POR") {
      await db.insert(schema.card).values(
        PORTICO_CARDS.map((c, i) => ({
          productId: row.id,
          seq: c.seq,
          title: c.title,
          description: c.desc,
          status: c.status,
          repoId: c.repo ? repoIds.get(c.repo) : undefined,
          prNumber: c.pr,
          prUrl: c.pr
            ? `https://github.com/atrios/portico-api/pull/${c.pr}`
            : undefined,
          auto: c.auto ?? false,
          // seq menor dentro da coluna aparece primeiro (ordem do board é createdAt desc)
          createdAt: ago(c.seq * HOUR),
          updatedAt: ago(2 * HOUR + i * 10 * MIN),
        })),
      );
    }
  }

  // Cofre — atribui criação/rotação ao primeiro usuário existente (se houver).
  const [someone] = await db.select().from(schema.user).limit(1);
  for (const a of ACCESSES) {
    const productId = idByCode.get(a.product);
    if (!productId) continue;
    const [row] = await db
      .insert(schema.access)
      .values({
        productId,
        name: a.name,
        tipo: a.tipo,
        ambiente: a.ambiente,
        login: a.login,
        passwordEnc: encryptSecret("k9#mQ2vLx8wZ4tR"),
        totpCodesEnc: a.totp ? encryptSecret(a.totp) : undefined,
        notes: a.notes,
        createdById: someone?.id,
        rotatedAt: ago(a.rotatedDays * DAY),
        rotatedById: someone?.id,
        createdAt: ago((a.rotatedDays + 30) * DAY),
      })
      .returning();
    const events: (typeof schema.accessEvent.$inferInsert)[] = [
      {
        accessId: row.id,
        userId: someone?.id,
        action: "created",
        createdAt: ago((a.rotatedDays + 30) * DAY),
      },
      {
        accessId: row.id,
        userId: someone?.id,
        action: "rotated",
        createdAt: ago(a.rotatedDays * DAY),
      },
    ];
    if (a.totp) {
      // povoamento do painel de auditoria do frame 15a
      events.push(
        {
          accessId: row.id,
          userId: someone?.id,
          action: "viewed",
          createdAt: ago(DAY),
        },
        {
          accessId: row.id,
          userId: someone?.id,
          action: "copied",
          createdAt: ago(2 * HOUR),
        },
      );
    }
    await db.insert(schema.accessEvent).values(events);
  }

  const count = await db.$count(schema.product);
  const accessCount = await db.$count(schema.access);
  console.log(
    `Seed ok: ${count} produtos, ${PORTICO_CARDS.length} cards no Pórtico, ${accessCount} acessos no cofre.`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
