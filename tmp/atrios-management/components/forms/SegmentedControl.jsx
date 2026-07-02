import React from 'react';

/**
 * Átrios SegmentedControl — a compact view switcher (Kanban / Lista).
 * Options: [{ value, label, icon? }]. Controlled via `value` + `onChange`.
 */
export function SegmentedControl({ options = [], value, onChange, style = {} }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--atr-surface-3)',
        border: '1px solid var(--atr-border-strong)',
        borderRadius: 'var(--atr-radius-lg)',
        padding: 2,
        gap: 2,
        ...style,
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange && onChange(o.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 28,
              padding: '0 12px',
              background: active ? 'var(--atr-fill-hover)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--atr-radius-md)',
              color: active ? 'var(--atr-text-1)' : 'var(--atr-text-5)',
              fontFamily: 'var(--atr-font-sans)',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color var(--atr-dur) var(--atr-ease), background var(--atr-dur) var(--atr-ease)',
            }}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
