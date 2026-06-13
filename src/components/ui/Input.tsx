import { useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mono?: boolean;
}

export function Input({ invalid = false, disabled = false, mono = false, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      disabled={disabled}
      aria-invalid={invalid || undefined}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={{
        width: '100%',
        padding: '8px 12px',
        font: 'var(--font-body)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-strong)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: `1px solid ${invalid ? 'var(--color-danger)' : focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-sm)',
        outline: 'none',
        boxShadow: focused && !invalid ? 'var(--shadow-focus)' : 'none',
        cursor: disabled ? 'not-allowed' : undefined,
        transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    />
  );
}
