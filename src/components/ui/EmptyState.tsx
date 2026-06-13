import { type CSSProperties, type ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState({ title, description, action, icon, style }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-12) var(--space-6)',
      ...style,
    }}>
      {icon && <div style={{ color: 'var(--text-subtle)', marginBottom: 'var(--space-2)' }}>{icon}</div>}
      {title && <p style={{ font: 'var(--font-h2)', color: 'var(--text-strong)' }}>{title}</p>}
      {description && <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', maxWidth: 360 }}>{description}</p>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  );
}
