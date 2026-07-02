import React from 'react';

export interface StatusPillProps {
  children?: React.ReactNode;
  /** Workflow hue. @default 'done' */
  hue?: 'todo' | 'progress' | 'review' | 'test' | 'done' | 'archived';
  /** Washed tinted background + border. @default true */
  tinted?: boolean;
  /** Add a colored glow to the dot. @default false */
  glow?: boolean;
  style?: React.CSSProperties;
}

/**
 * Rounded status chip with a leading colored dot.
 * @startingPoint section="Status" subtitle="Workflow status chip with leading dot" viewport="700x100"
 */
export function StatusPill(props: StatusPillProps): JSX.Element;
