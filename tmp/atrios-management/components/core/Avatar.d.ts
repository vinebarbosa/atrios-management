import React from 'react';

export interface AvatarProps {
  /** 1–2 uppercase initials. @default 'MA' */
  initials?: string;
  /** Diameter in px. @default 26 */
  size?: number;
  style?: React.CSSProperties;
}

/** Circular user avatar — initials on a violet-blue diagonal gradient. */
export function Avatar(props: AvatarProps): JSX.Element;
