"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { StatusPill } from "@/components/ui";
import { cn } from "@/lib/cn";
import { STAGES } from "@/lib/product-constants";

export interface ProductHeaderProps {
  name: string;
  code: string;
  stage: number;
  cardCount: number;
  accessCount: number;
  active: "cards" | "acessos";
  /** Slot à direita do cabeçalho (ex.: botão Contexto na aba Cards). */
  actions?: ReactNode;
}

/** Breadcrumb + identidade do produto + abas Cards|Acessos (frames 04 e 13a). */
export function ProductHeader({
  name,
  code,
  stage: stageIndex,
  cardCount,
  accessCount,
  active,
  actions,
}: ProductHeaderProps) {
  const stage = STAGES[stageIndex] ?? STAGES[0];
  const tabs = [
    {
      key: "cards",
      label: "Cards",
      count: cardCount,
      href: `/produtos/${code}`,
    },
    {
      key: "acessos",
      label: "Acessos",
      count: accessCount,
      href: `/produtos/${code}/acessos`,
    },
  ] as const;

  return (
    <>
      {/* breadcrumb */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-line-subtle px-[22px]">
        <Link
          href="/produtos"
          className="text-[12.5px] text-fg-6 transition-colors duration-200 hover:text-fg-3"
        >
          Produtos
        </Link>
        <span className="text-fg-9">
          <ChevronRightIcon />
        </span>
        <span className="text-[12.5px] text-fg-5">{name}</span>
      </div>

      {/* product header + tabs */}
      <div className="shrink-0 border-b border-line-subtle px-[22px] pt-[22px]">
        <div className="flex items-center gap-[13px]">
          <span
            className="size-[11px] shrink-0 rounded-full"
            style={{
              background: stage.color,
              boxShadow: `0 0 12px ${stage.color}88`,
            }}
          />
          <h1 className="text-[25px] font-semibold tracking-[-0.02em] text-fg-hi">
            {name}
          </h1>
          <span className="rounded-nav border border-line-strong bg-white/[0.06] px-[9px] py-0.5 font-mono text-xs font-semibold tracking-[0.04em] text-fg-4">
            {code}
          </span>
          <StatusPill hue={stage.hue}>{stage.name}</StatusPill>
          <div className="ml-auto" />
          {actions}
        </div>
        <div className="mt-4 flex items-end gap-5">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-1.5 border-b-2 px-0.5 pb-2.5 text-[12.5px] transition-colors duration-200",
                tab.key === active
                  ? "border-primary font-semibold text-fg-2"
                  : "border-transparent font-medium text-fg-6 hover:text-fg-3",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[11px]",
                  tab.key === active ? "text-fg-6" : "text-fg-9",
                )}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
