import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { RepoChip } from "./repo-chip";

export interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  title: string;
  repo?: string;
  isNew?: boolean;
  auto?: boolean;
  prNum?: number;
}

/**
 * Kanban card — mono id, optional novo/auto/PR badges, title, repo chip.
 * Hover lifts the surface + border (pure CSS, stays server-renderable).
 */
export function TaskCard({
  id,
  title,
  repo,
  isNew = false,
  auto = false,
  prNum,
  className,
  ...rest
}: TaskCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-field border border-line bg-surface-card px-[11px] py-2.5 transition-colors duration-200 hover:border-line-hover hover:bg-surface-card-hover",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] font-medium text-fg-7">
          {id}
        </span>
        {isNew && <Badge tone="primary">novo</Badge>}
        {auto && (
          <Badge tone="primary" pulse>
            auto
          </Badge>
        )}
        {prNum && (
          <span className="ml-auto">
            <Badge tone="neutral" mono>
              #{prNum}
            </Badge>
          </span>
        )}
      </div>
      <div className="text-[13px] leading-[1.35] text-fg-2">{title}</div>
      {repo && (
        <div className="self-start">
          <RepoChip name={repo} />
        </div>
      )}
    </div>
  );
}
