import React from 'react';

export interface RepoChipProps {
  /** Repo label. Known names (web/api/mobile) auto-color. @default 'api' */
  name?: string;
  /** Override dot color for a custom repo. */
  color?: string;
  style?: React.CSSProperties;
}

/** Small repository tag with a colored dot — shown on task cards and card panels. */
export function RepoChip(props: RepoChipProps): JSX.Element;
