import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Text carries the hue; dot + tinted wash derive from it via currentColor.
const statusPillVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill text-[12.5px] font-medium",
  {
    variants: {
      hue: {
        todo: "text-status-todo",
        progress: "text-status-progress",
        review: "text-status-review",
        test: "text-status-test",
        done: "text-status-done",
        archived: "text-status-archived",
      },
      tinted: {
        true: "border border-current/25 bg-current/10 px-2.5 py-[3px]",
        false: "",
      },
    },
    defaultVariants: { hue: "done", tinted: true },
  },
);

export interface StatusPillProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  glow?: boolean;
}

export function StatusPill({
  hue,
  tinted,
  glow = false,
  className,
  children,
  ...rest
}: StatusPillProps) {
  return (
    <span
      className={cn(statusPillVariants({ hue, tinted }), className)}
      {...rest}
    >
      <span
        className={cn(
          "size-[7px] shrink-0 rounded-full bg-current",
          glow && "[box-shadow:0_0_12px_currentColor]",
        )}
      />
      {children}
    </span>
  );
}
