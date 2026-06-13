import { useState, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export function Textarea({ rows = 3, disabled = false, style, onFocus, onBlur, ...rest }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={{
        width: '100%',
        padding: '8px 12px',
        font: 'var(--font-body)',
        color: 'var(--text-strong)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-sm)',
        outline: 'none',
        resize: 'vertical',
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    />
  );
}
