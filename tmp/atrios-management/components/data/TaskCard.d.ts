import React from 'react';

export interface TaskCardProps {
  /** Mono task id, e.g. "POR-27". */
  id: string;
  /** Task title. */
  title: string;
  /** Optional repo chip (web/api/mobile). */
  repo?: string | null;
  /** Show the "novo" badge. @default false */
  isNew?: boolean;
  /** Show the pulsing "auto" badge. @default false */
  auto?: boolean;
  /** Show a right-aligned PR reference badge. */
  prNum?: number | string | null;
  style?: React.CSSProperties;
}

/**
 * A kanban task card — id, badges, title, repo chip; hover lifts it.
 * @startingPoint section="Data" subtitle="Kanban task card with id, badges & repo" viewport="380x120"
 */
export function TaskCard(props: TaskCardProps): JSX.Element;
