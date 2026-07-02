import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { PRODUCTS } from "@/lib/mock-data";
import { NewProductModal } from "./new-product-modal";

export default function ProductsPage() {
  return (
    <>
      <header className="flex h-[53px] shrink-0 items-center gap-[9px] border-b border-line px-5">
        <span className="text-sm font-semibold text-fg-1">Produtos</span>
        <span className="text-xs text-fg-8">{PRODUCTS.length}</span>
        <div className="ml-auto" />
        <NewProductModal />
      </header>
      <div className="flex-1 overflow-auto">
        {PRODUCTS.map((p) => (
          <Link
            key={p.code}
            href={`/produtos/${p.code}`}
            className="flex items-center gap-3.5 border-b border-line-subtle px-5 py-[13px] transition-colors duration-200 hover:bg-white/[0.022]"
          >
            <span
              className="size-[9px] shrink-0 rounded-full"
              style={{
                background: p.color,
                boxShadow: `0 0 10px ${p.color}66`,
              }}
            />
            <span className="min-w-[88px] shrink-0 text-sm font-medium text-fg-2">
              {p.name}
            </span>
            <span className="shrink-0 rounded-id bg-white/5 px-1.5 py-px font-mono text-[11px] text-fg-5">
              {p.code}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-fg-7">
              {p.desc}
            </span>
            <span className="min-w-[104px] shrink-0 text-right text-xs text-fg-6">
              {p.active > 0 ? `${p.active} em andamento` : "—"}
            </span>
            <span className="min-w-[64px] shrink-0 text-right text-xs text-fg-9">
              {p.updated}
            </span>
            <span className="shrink-0 text-fg-9">
              <ChevronRightIcon size={15} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
