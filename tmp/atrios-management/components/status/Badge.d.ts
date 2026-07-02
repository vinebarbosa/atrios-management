import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** Color language. @default 'primary' */
  tone?: 'primary' | 'neutral' | 'success';
  /** Use the mono font (for id-like badges). @default false */
  mono?: boolean;
  /** Breathing box-shadow pulse (the "auto" indicator). @default false */
  pulse?: boolean;
  /** Leading icon (9–10px). */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Tiny inline label — "novo", "auto", counts, PR refs. */
export function Badge(props: BadgeProps): JSX.Element;
