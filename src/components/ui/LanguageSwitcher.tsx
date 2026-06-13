import { useEffect, useRef, useState, type CSSProperties } from 'react';

export interface LocaleOption {
  code: string;
  label: string;
  short: string;
}

interface LanguageSwitcherProps {
  value?: string;
  options?: LocaleOption[];
  onChange?: (code: string) => void;
  style?: CSSProperties;
}

const DEFAULT_OPTIONS: LocaleOption[] = [
  { code: 'pt-BR', label: 'Português', short: 'PT' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
];

export function LanguageSwitcher({ value = 'pt-BR', options = DEFAULT_OPTIONS, onChange, style }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          height: 30, padding: '0 10px',
          background: 'transparent', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)', color: 'var(--text-body)',
          font: 'var(--font-body-strong)', cursor: 'pointer',
          transition: 'background var(--duration-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{current.short}</span>
      </button>

      {open && (
        <ul role="listbox" style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 'var(--z-dropdown)',
          minWidth: 168, margin: 0, padding: 'var(--space-1)', listStyle: 'none',
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
        }}>
          {options.map((o) => {
            const active = o.code === value;
            return (
              <li
                key={o.code}
                role="option"
                aria-selected={active}
                onClick={() => { onChange?.(o.code); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 'var(--space-3)', padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                  font: 'var(--font-body)', color: active ? 'var(--text-strong)' : 'var(--text-body)',
                  background: active ? 'var(--color-primary-soft)' : 'transparent', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{o.short}</span>
                  {o.label}
                </span>
                {active && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
