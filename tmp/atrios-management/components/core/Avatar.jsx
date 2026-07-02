import React from 'react';

/**
 * Átrios Avatar — user initials on a violet-blue diagonal gradient.
 */
export function Avatar({ initials = 'MA', size = 26, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--atr-avatar-grad-a), var(--atr-avatar-grad-b))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--atr-font-sans)',
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        color: '#fff',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
