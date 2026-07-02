import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-[3px] whitespace-nowrap rounded-chip border px-1.5 py-px text-[10px] font-medium",
  {
    variants: {
      tone: {
        primary: "border-primary/30 bg-primary/15 text-primary-fg",
        neutral: "border-transparent bg-white/5 text-fg-6",
        success: "border-status-done/25 bg-status-done/10 text-status-done",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  mono?: boolean;
  /** Breathing indigo ring — the "auto" automation indicator. */
  pulse?: boolean;
  icon?: ReactNode;
}

export function Badge({
  tone,
  mono = false,
  pulse = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ tone }),
        mono && "font-mono",
        pulse && "animate-autopulse",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
