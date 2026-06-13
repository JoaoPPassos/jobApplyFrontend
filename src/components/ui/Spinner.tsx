import { type CSSProperties } from 'react';

interface SpinnerProps {
  size?: number;
  label?: string;
  style?: CSSProperties;
}

export function Spinner({ size = 18, label, style }: SpinnerProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', ...style }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
        style={{ animation: 'jh-spin 0.7s linear infinite' }}>
        <circle cx="12" cy="12" r="9" stroke="var(--slate-200)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span style={{ font: 'var(--font-body)' }}>{label}</span>}
      <style>{`@keyframes jh-spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}
