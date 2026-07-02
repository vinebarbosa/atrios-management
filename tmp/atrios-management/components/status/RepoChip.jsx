import React from 'react';

const REPO_HUES = {
  web: 'var(--atr-repo-web)',
  api: 'var(--atr-repo-api)',
  mobile: 'var(--atr-repo-mobile)',
};

/**
 * Átrios RepoChip — a repository tag with a colored dot.
 */
export function RepoChip({ name = 'api', color, style = {} }) {
  const c = color || REPO_HUES[name] || 'var(--atr-text-6)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--atr-font-sans)',
        fontSize: 11,
        color: 'var(--atr-text-5)',
        background: 'var(--atr-fill-1)',
        border: '1px solid var(--atr-border)',
        padding: '2px 7px',
        borderRadius: 'var(--atr-radius-sm)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, flex: '0 0 auto' }} />
      {name}
    </span>
  );
}
