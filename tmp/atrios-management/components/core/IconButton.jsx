import React from 'react';

/**
 * Átrios IconButton — a square, quiet icon affordance.
 * Used for close (×), copy, add (+), and row actions.
 */
export function IconButton({ children, size = 26, tinted = false, onClick, style = {}, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tinted ? 'var(--atr-fill-2)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--atr-radius-md)',
        color: 'var(--atr-text-5)',
        cursor: 'pointer',
        transition: 'background var(--atr-dur) var(--atr-ease), color var(--atr-dur) var(--atr-ease)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
