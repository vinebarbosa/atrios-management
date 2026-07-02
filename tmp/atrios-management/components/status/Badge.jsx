import React from 'react';

/**
 * Átrios Badge — a small inline label. `tone` picks the color language:
 * primary (indigo wash, e.g. "novo"/"auto"), neutral (gray wash), mono (id chip).
 */
export function Badge({ children, tone = 'primary', mono = false, pulse = false, icon = null, style = {} }) {
  const tones = {
    primary: { color: 'var(--atr-primary-text)', background: 'var(--atr-primary-wash-strong)', border: '1px solid var(--atr-primary-line)' },
    neutral: { color: 'var(--atr-text-6)', background: 'var(--atr-fill-2)', border: '1px solid transparent' },
    success: { color: 'var(--atr-status-done)', background: 'color-mix(in srgb, var(--atr-status-done) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--atr-status-done) 25%, transparent)' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontFamily: mono ? 'var(--atr-font-mono)' : 'var(--atr-font-sans)',
        fontSize: 10,
        fontWeight: 500,
        padding: '1.5px 6px',
        borderRadius: 'var(--atr-radius-sm)',
        whiteSpace: 'nowrap',
        animation: pulse ? 'atr-autopulse var(--atr-pulse-dur) ease-in-out infinite' : 'none',
        ...tones[tone],
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
