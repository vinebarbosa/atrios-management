import React from 'react';

const HUES = {
  todo: 'var(--atr-status-todo)',
  progress: 'var(--atr-status-progress)',
  review: 'var(--atr-status-review)',
  test: 'var(--atr-status-test)',
  done: 'var(--atr-status-done)',
  archived: 'var(--atr-status-archived)',
};

/**
 * Átrios StatusPill — a rounded status chip with a leading dot.
 * `tinted` gives it the washed background used on the product header.
 */
export function StatusPill({ children, hue = 'done', tinted = true, glow = false, style = {} }) {
  const color = HUES[hue] || hue;
  const wash = `color-mix(in srgb, ${color} 10%, transparent)`;
  const line = `color-mix(in srgb, ${color} 24%, transparent)`;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--atr-font-sans)',
        fontSize: 12.5,
        fontWeight: 500,
        color,
        background: tinted ? wash : 'transparent',
        border: tinted ? `1px solid ${line}` : 'none',
        padding: tinted ? '3px 10px' : 0,
        borderRadius: 'var(--atr-radius-pill)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: '0 0 auto', boxShadow: glow ? `0 0 12px ${color}` : 'none' }} />
      {children}
    </span>
  );
}
