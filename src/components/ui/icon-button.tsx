import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Side length in px — dynamic, so applied inline. */
  size?: number;
  tinted?: boolean;
}

/** Square, quiet icon affordance — close (×), copy, add (+), row actions. */
export function IconButton({
  size = 26,
  tinted = false,
  className,
  style,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-nav text-fg-5 transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg-2",
        tinted && "bg-white/5",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
