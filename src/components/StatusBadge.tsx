import { type CSSProperties } from 'react';
import type { ApplicationStatus } from '../types/application';

interface StatusBadgeProps {
  status: ApplicationStatus;
  label?: string;
  style?: CSSProperties;
}

export function StatusBadge({ status, label, style }: StatusBadgeProps) {
  const known: ApplicationStatus = status in KNOWN_STATUSES ? status : 'no_response';
  return (
    <span
      data-status={known}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        background: `var(--status-${known}-soft)`,
        color: `var(--status-${known}-text)`,
        font: label != null ? 'var(--font-caption)' : 'var(--font-mono-sm)',
        fontWeight: 'var(--weight-medium)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: 0.7, flexShrink: 0 }} />
      {label ?? known}
    </span>
  );
}

const KNOWN_STATUSES: Record<ApplicationStatus, true> = {
  applied: true,
  in_review: true,
  interview: true,
  offer: true,
  rejected: true,
  withdrawn: true,
  no_response: true,
};
