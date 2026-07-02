import React from 'react';

export interface SidebarItemProps {
  label: React.ReactNode;
  /** Leading status/product dot color. */
  color?: string | null;
  /** Selected state — fill + brighter, heavier text. @default false */
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** A sidebar product/navigation row with an optional status dot. */
export function SidebarItem(props: SidebarItemProps): JSX.Element;
