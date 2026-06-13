import { type CSSProperties } from 'react';

interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}

export function Tabs({ tabs, value, onChange, style }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        borderBottom: '1px solid var(--border-default)',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(tab.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '8px 2px',
              marginBottom: -1,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}`,
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              font: 'var(--font-body-strong)',
              cursor: 'pointer',
              transition: 'color var(--duration-fast) var(--ease-out)',
            }}
          >
            {tab.label}
            {tab.count != null && (
              <span style={{
                font: 'var(--font-mono-sm)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                background: active ? 'var(--color-info-soft)' : 'var(--slate-100)',
                color: active ? 'var(--color-info-text)' : 'var(--text-muted)',
              }}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
