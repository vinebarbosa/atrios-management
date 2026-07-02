import React from 'react';
import { Badge } from '../status/Badge.jsx';
import { RepoChip } from '../status/RepoChip.jsx';

/**
 * Átrios TaskCard — a kanban card. Shows id, optional new/auto/PR badges,
 * title, and an optional repo chip. Hover lifts the border + surface.
 */
export function TaskCard({ id, title, repo = null, isNew = false, auto = false, prNum = null, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--atr-surface-card-hover)' : 'var(--atr-surface-card)',
        border: `1px solid ${hover ? 'var(--atr-border-hover)' : 'var(--atr-border)'}`,
        borderRadius: 'var(--atr-radius-lg)',
        padding: '10px 11px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'background var(--atr-dur) var(--atr-ease), border-color var(--atr-dur) var(--atr-ease)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--atr-text-7)', fontFamily: 'var(--atr-font-mono)' }}>{id}</span>
        {isNew && <Badge tone="primary">novo</Badge>}
        {auto && (
          <Badge tone="primary" pulse>auto</Badge>
        )}
        {prNum && (
          <span style={{ marginLeft: 'auto' }}>
            <Badge tone="neutral" mono>#{prNum}</Badge>
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, lineHeight: 'var(--atr-leading-snug)', color: 'var(--atr-text-2)' }}>{title}</div>
      {repo && <div style={{ alignSelf: 'flex-start' }}><RepoChip name={repo} /></div>}
    </div>
  );
}
