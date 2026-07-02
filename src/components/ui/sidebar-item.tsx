import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Leading status dot color (CSS color). Omit for no dot. */
  color?: string;
  active?: boolean;
}

/** Product/nav row with a status dot and label. */
export function SidebarItem({
  label,
  color,
  active = false,
  className,
  ...rest
}: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-[9px] rounded-nav px-2 py-1.5 text-[13px] transition-colors duration-200",
        active
          ? "bg-white/5 font-semibold text-fg-1"
          : "font-book text-fg-4 hover:text-fg-2",
        className,
      )}
      {...rest}
    >
      {color && (
        <span
          className="size-[7px] shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </div>
  );
}
