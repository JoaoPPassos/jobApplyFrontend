import { type CSSProperties, type ReactNode } from 'react';

interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function Field({ label, htmlFor, hint, error, required = false, children, style }: FieldProps) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', ...style }}>
      {label && (
        <span style={{ display: 'block', marginBottom: 'var(--space-1)', font: 'var(--font-body-strong)', color: 'var(--text-body)' }}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </span>
      )}
      {children}
      {error ? (
        <span style={{ display: 'block', marginTop: 'var(--space-1)', font: 'var(--font-caption)', color: 'var(--color-danger-text)' }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ display: 'block', marginTop: 'var(--space-1)', font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
