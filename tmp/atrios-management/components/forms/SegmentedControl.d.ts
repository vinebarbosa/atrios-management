import React from 'react';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  /** Currently selected value. */
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** Compact view switcher (e.g. Kanban / Lista). */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
