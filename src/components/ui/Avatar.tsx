import { type CSSProperties } from 'react';

interface AvatarProps {
  name?: string;
  size?: number;
  style?: CSSProperties;
}

export function Avatar({ name = '', size = 32, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-info-soft)',
        color: 'var(--color-info-text)',
        font: 'var(--font-body-strong)',
        fontSize: size * 0.4,
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </span>
  );
}
