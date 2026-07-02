import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials?: string;
  /** Diameter in px — dynamic, so applied inline (font scales ~0.42×). */
  size?: number;
}

/** User initials on the violet-blue diagonal gradient. */
export function Avatar({
  initials = "MA",
  size = 26,
  className,
  style,
  ...rest
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-linear-135 from-avatar-a to-avatar-b font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        ...style,
      }}
      {...rest}
    >
      {initials}
    </div>
  );
}
