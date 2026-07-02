import { notFound } from "next/navigation";
import { productByCode } from "@/lib/mock-data";
import { ProductBoard } from "./product-board";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = productByCode(code);
  if (!product) notFound();
  return <ProductBoard product={product} />;
}
