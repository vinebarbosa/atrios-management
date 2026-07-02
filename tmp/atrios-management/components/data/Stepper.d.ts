import React from 'react';

export interface StepperStep {
  name: string;
  /** Date the stage started (shown under done/current steps). */
  date?: string;
  /** Optional per-step accent; defaults to the done-green. */
  color?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Index of the current stage. @default 0 */
  current?: number;
  style?: React.CSSProperties;
}

/**
 * Horizontal product-lifecycle bar — done · current (glowing) · future.
 * @startingPoint section="Data" subtitle="Horizontal product-stage bar with dates" viewport="700x110"
 */
export function Stepper(props: StepperProps): JSX.Element;
