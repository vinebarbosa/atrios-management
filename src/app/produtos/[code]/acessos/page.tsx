import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { card } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatStageDate, STAGES } from "@/lib/product-constants";
import { accessRowsForProduct, productOptions } from "../../../cofre/queries";
import { ProductHeader } from "../product-header";
import { AccessTab } from "./access-tab";

export default async function ProductAccessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = await db.query.product.findFirst({
    where: (p, { eq: eqp }) => eqp(p.code, code.toUpperCase()),
    with: {
      repos: true,
      stageEvents: { orderBy: (e, { asc }) => asc(e.enteredAt) },
    },
  });
  if (!product) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "admin";

  const [accesses, products, cardCount] = await Promise.all([
    accessRowsForProduct(product.id),
    productOptions(),
    db.$count(card, eq(card.productId, product.id)),
  ]);

  // Data mais recente em que o produto entrou em cada etapa.
  const stageDates: (string | null)[] = STAGES.map(() => null);
  for (const e of product.stageEvents) {
    if (e.stage >= 0 && e.stage < stageDates.length)
      stageDates[e.stage] = formatStageDate(e.enteredAt);
  }

  return (
    <>
      <ProductHeader
        name={product.name}
        code={product.code}
        stage={product.stage}
        cardCount={cardCount}
        accessCount={accesses.length}
        active="acessos"
        context={{
          id: product.id,
          stage: product.stage,
          description: product.description,
          longDescription: product.longDescription,
          stageDates,
          repos: product.repos.map((r) => ({
            id: r.id,
            label: r.label,
            name: r.name,
          })),
        }}
      />
      <AccessTab
        productId={product.id}
        accesses={accesses}
        products={products}
        isAdmin={isAdmin}
      />
    </>
  );
}
