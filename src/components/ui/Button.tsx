import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const SIZES: Record<Size, { padding: string; font: string; height: number }> = {
  sm: { padding: '6px 12px', font: 'var(--text-xs)', height: 30 },
  md: { padding: '8px 16px', font: 'var(--text-sm)', height: 38 },
  lg: { padding: '10px 20px', font: 'var(--text-base)', height: 44 },
};

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: { background: 'var(--color-primary)', color: 'var(--text-on-primary)', border: '1px solid transparent' },
  secondary: { background: 'var(--slate-200)', color: 'var(--text-body)', border: '1px solid transparent' },
  outline: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
  ghost: { background: 'transparent', color: 'var(--text-body)', border: '1px solid transparent' },
  danger: { background: 'var(--color-danger)', color: 'var(--text-on-primary)', border: '1px solid transparent' },
};

const HOVER_BG: Record<Variant, string> = {
  primary: 'var(--color-primary-hover)',
  secondary: 'var(--slate-300)',
  outline: 'var(--surface-hover)',
  ghost: 'var(--surface-hover)',
  danger: 'var(--color-danger-hover)',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}: ButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      data-variant={variant}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        width: fullWidth ? '100%' : 'auto',
        minHeight: s.height,
        padding: s.padding,
        font: 'var(--font-body-strong)',
        fontSize: s.font,
        lineHeight: 1,
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.filter = 'brightness(0.95)';
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.filter = 'none';
        onMouseUp?.(e);
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = HOVER_BG[variant];
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = v.background as string;
        e.currentTarget.style.filter = 'none';
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
