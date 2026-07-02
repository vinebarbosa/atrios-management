import React from 'react';

/**
 * Átrios Button — the primary action control.
 * Variants: primary (indigo fill), secondary (hairline outline),
 * ghost (text only), dashed (dashed outline, for "add" affordances).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const heights = { sm: 28, md: 30, lg: 34 };
  const pads = { sm: '0 12px', md: '0 12px', lg: '0 16px' };
  const fonts = { sm: 12.5, md: 13, lg: 13 };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: heights[size],
    padding: pads[size],
    fontFamily: 'var(--atr-font-sans)',
    fontSize: fonts[size],
    fontWeight: 500,
    borderRadius: 'var(--atr-radius)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--atr-dur) var(--atr-ease), border-color var(--atr-dur) var(--atr-ease)',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    lineHeight: 1,
  };

  const variants = {
    primary: { background: 'var(--atr-primary)', color: '#fff', border: '1px solid transparent' },
    secondary: { background: 'transparent', color: 'var(--atr-text-3)', border: '1px solid var(--atr-border-field-strong)' },
    ghost: { background: 'transparent', color: 'var(--atr-text-5)', border: '1px solid transparent' },
    dashed: { background: 'transparent', color: 'var(--atr-text-5)', border: '1px dashed var(--atr-border-hover)' },
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
