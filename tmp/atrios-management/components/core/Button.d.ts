import React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'dashed';
  /** Control height. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Leading icon node (14–16px SVG). */
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * The primary action control for Átrios.
 * @startingPoint section="Core" subtitle="Primary / secondary / ghost / dashed actions" viewport="700x120"
 */
export function Button(props: ButtonProps): JSX.Element;
