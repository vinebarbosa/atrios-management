import React from 'react';

export interface InputProps {
  value?: string;
  placeholder?: string;
  /** Monospace + code tracking (for ids, branches). @default false */
  mono?: boolean;
  /** Show the primary-colored focus border. @default false */
  focused?: boolean;
  /** Field height. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

/** Dark inset text field. */
export function Input(props: InputProps): JSX.Element;
