import { type CSSProperties, type ElementType, type ReactNode } from 'react';

interface CardProps {
  as?: ElementType;
  padding?: string;
  interactive?: boolean;
  style?: CSSProperties;
  children: ReactNode;
  [key: string]: unknown;
}

export function Card({ as: Tag = 'div', padding = 'var(--space-6)', interactive = false, style, children, ...rest }: CardProps) {
  return (
    <Tag
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding,
        transition: interactive ? 'box-shadow var(--duration-normal) var(--ease-out)' : undefined,
        ...style,
      }}
      onMouseEnter={interactive ? (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } : undefined}
      onMouseLeave={interactive ? (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
