import React from 'react';

/**
 * Átrios Stepper — a horizontal product-stage bar. Steps before the
 * current index render filled + connected; the current step glows;
 * future steps are hollow. Started steps show a date underneath.
 */
export function Stepper({ steps = [], current = 0, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', ...style }}>
      {steps.map((s, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        const color = s.color || 'var(--atr-status-done)';

        let dot, nameColor, nameWeight, showDate, dateColor;
        if (isDone) {
          dot = { width: 15, height: 15, borderRadius: '50%', background: color, flex: '0 0 auto', boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 12%, transparent)` };
          nameColor = 'var(--atr-text-6)'; nameWeight = 500; showDate = !!s.date; dateColor = 'var(--atr-text-6)';
        } else if (isCurrent) {
          dot = { width: 19, height: 19, borderRadius: '50%', background: color, flex: '0 0 auto', boxShadow: `0 0 0 5px color-mix(in srgb, ${color} 17%, transparent), 0 0 16px color-mix(in srgb, ${color} 47%, transparent)` };
          nameColor = 'var(--atr-text-1)'; nameWeight = 600; showDate = !!s.date; dateColor = color;
        } else {
          dot = { width: 13, height: 13, borderRadius: '50%', border: '1.5px solid var(--atr-border-hover)', background: 'var(--atr-surface-3)', flex: '0 0 auto' };
          nameColor = 'var(--atr-text-8)'; nameWeight = 500; showDate = false; dateColor = 'var(--atr-text-8)';
        }

        const lineLeft = i === 0 ? 'transparent' : (i <= current ? 'color-mix(in srgb, var(--atr-status-done) 33%, transparent)' : 'var(--atr-border-strong)');
        const lineRight = i === steps.length - 1 ? 'transparent' : (i < current ? 'color-mix(in srgb, var(--atr-status-done) 33%, transparent)' : 'var(--atr-border-strong)');

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 20 }}>
              <div style={{ flex: 1, height: 2, background: lineLeft }} />
              <div style={dot} />
              <div style={{ flex: 1, height: 2, background: lineRight }} />
            </div>
            <div style={{ fontFamily: 'var(--atr-font-sans)', fontSize: 12, fontWeight: nameWeight, color: nameColor, textAlign: 'center', whiteSpace: 'nowrap', padding: '0 6px' }}>{s.name}</div>
            {showDate && <div style={{ fontFamily: 'var(--atr-font-sans)', fontSize: 11, fontWeight: 500, color: dateColor }}>{s.date}</div>}
          </div>
        );
      })}
    </div>
  );
}
