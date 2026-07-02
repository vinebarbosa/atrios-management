"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
}

/** Compact view switcher (Kanban / Lista). Controlled. */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex gap-0.5 rounded-field border border-line-strong bg-surface-3 p-0.5",
        className,
      )}
      {...rest}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange?.(o.value)}
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-nav px-3 text-[12.5px] font-medium transition-colors duration-200",
            o.value === value
              ? "bg-white/[0.09] text-fg-1"
              : "text-fg-5 hover:text-fg-2",
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
