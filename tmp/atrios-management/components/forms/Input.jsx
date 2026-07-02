import React from 'react';

/**
 * Átrios Input — a dark inset field. `mono` for codes/branches.
 * `focused` draws the primary border used on the active state.
 */
export function Input({ value = '', placeholder = '', mono = false, focused = false, size = 'md', onChange, style = {}, ...rest }) {
  const heights = { sm: 34, md: 36, lg: 38 };
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{
        height: heights[size],
        width: '100%',
        padding: '0 12px',
        background: 'var(--atr-surface-1)',
        border: `1px solid ${focused ? 'color-mix(in srgb, var(--atr-primary) 40%, transparent)' : 'var(--atr-border-field)'}`,
        borderRadius: 'var(--atr-radius-lg)',
        fontFamily: mono ? 'var(--atr-font-mono)' : 'var(--atr-font-sans)',
        fontSize: 14,
        letterSpacing: mono ? 'var(--atr-tracking-mono)' : 'normal',
        color: 'var(--atr-text-2)',
        outline: 'none',
        transition: 'border-color var(--atr-dur) var(--atr-ease)',
        ...style,
      }}
      {...rest}
    />
  );
}
