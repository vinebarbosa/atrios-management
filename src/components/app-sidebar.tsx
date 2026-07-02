"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchLogo, GridIcon } from "@/components/icons";
import { Avatar, SidebarItem } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CURRENT_USER, PRODUCTS } from "@/lib/mock-data";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-[216px] shrink-0 flex-col border-r border-line bg-surface-2 px-2.5 py-3.5">
      <div className="flex items-center gap-[9px] px-2 pb-3.5 pt-1.5">
        <div className="flex size-[22px] items-center justify-center rounded-nav bg-linear-160 from-primary-grad-a to-primary-grad-b">
          <ArchLogo />
        </div>
        <span className="text-sm font-semibold tracking-[-0.01em] text-fg-1">
          Átrios
        </span>
      </div>
      <Link
        href="/produtos"
        className={cn(
          "flex items-center gap-[9px] rounded-btn px-2 py-[7px] text-[13px] font-medium transition-colors duration-200",
          pathname === "/produtos"
            ? "bg-white/5 text-fg-2"
            : "text-fg-4 hover:bg-white/[0.04] hover:text-fg-2",
        )}
      >
        <GridIcon />
        Produtos
      </Link>
      <div className="px-2 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-fg-9">
        Produtos
      </div>
      {PRODUCTS.map((p) => (
        <Link key={p.code} href={`/produtos/${p.code}`}>
          <SidebarItem
            label={p.name}
            color={p.color}
            active={pathname === `/produtos/${p.code}`}
          />
        </Link>
      ))}
      <div className="mt-auto flex items-center gap-[9px] border-t border-line-subtle p-2">
        <Avatar initials={CURRENT_USER.initials} />
        <div className="flex min-w-0 flex-col">
          <span className="text-[12.5px] font-medium text-fg-2">
            {CURRENT_USER.name}
          </span>
          <span className="text-[11px] text-fg-8">{CURRENT_USER.handle}</span>
        </div>
      </div>
    </aside>
  );
}
