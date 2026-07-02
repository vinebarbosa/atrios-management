import React from 'react';

/**
 * Átrios SidebarItem — a product/nav row with a status dot and label.
 * `active` gives it the selected fill + brighter text.
 */
export function SidebarItem({ label, color = null, active = false, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '6px 8px',
        borderRadius: 'var(--atr-radius-md)',
        fontFamily: 'var(--atr-font-sans)',
        fontSize: 13,
        fontWeight: active ? 600 : 450,
        color: active ? 'var(--atr-text-1)' : 'var(--atr-text-4)',
        background: active ? 'var(--atr-fill-2)' : 'transparent',
        cursor: 'default',
        ...style,
      }}
    >
      {color && <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: '0 0 auto' }} />}
      {label}
    </div>
  );
}
