import { type CSSProperties, type ReactNode } from 'react';

type Tone = 'danger' | 'success' | 'warning' | 'info';

interface AlertProps {
  tone?: Tone;
  children: ReactNode;
  style?: CSSProperties;
}

const TONES: Record<Tone, { bg: string; fg: string }> = {
  danger:  { bg: 'var(--color-danger-soft)',  fg: 'var(--color-danger-text)' },
  success: { bg: 'var(--color-success-soft)', fg: 'var(--color-success-text)' },
  warning: { bg: 'var(--color-warning-soft)', fg: 'var(--color-warning-text)' },
  info:    { bg: 'var(--color-info-soft)',    fg: 'var(--color-info-text)' },
};

export function Alert({ tone = 'danger', children, style }: AlertProps) {
  const t = TONES[tone];
  return (
    <div
      role="alert"
      style={{
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        background: t.bg,
        color: t.fg,
        font: 'var(--font-body)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
