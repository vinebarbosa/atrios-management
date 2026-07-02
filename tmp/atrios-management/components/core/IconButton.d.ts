import React from 'react';

export interface IconButtonProps {
  /** A single icon node (11–15px SVG). */
  children?: React.ReactNode;
  /** Square size in px. @default 26 */
  size?: number;
  /** Give it a faint filled background (e.g. the copy-branch button). @default false */
  tinted?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** Square, quiet icon affordance — close, copy, add, row actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
