import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { card } from "@/db/schema";
import { auth } from "@/lib/auth";
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
    columns: { id: true, name: true, code: true, stage: true },
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

  return (
    <>
      <ProductHeader
        name={product.name}
        code={product.code}
        stage={product.stage}
        cardCount={cardCount}
        accessCount={accesses.length}
        active="acessos"
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
