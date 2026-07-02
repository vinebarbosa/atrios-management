import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const REPO_DOT: Record<string, string> = {
  web: "bg-repo-web",
  api: "bg-repo-api",
  mobile: "bg-repo-mobile",
};

export interface RepoChipProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  /** Custom dot color for repos outside web/api/mobile. */
  color?: string;
}

/** Repository tag with a colored leading dot. */
export function RepoChip({
  name = "api",
  color,
  className,
  ...rest
}: RepoChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] whitespace-nowrap rounded-chip border border-line bg-white/[0.04] px-[7px] py-0.5 text-[11px] text-fg-5",
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          !color && (REPO_DOT[name] ?? "bg-fg-6"),
        )}
        style={color ? { background: color } : undefined}
      />
      {name}
    </span>
  );
}
