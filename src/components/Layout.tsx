import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clearSession, getStoredUser } from '../services/storage';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import logoSrc from '../assets/logo.svg';

export function Layout() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const { t, i18n } = useTranslation();

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>
      <header style={{
        background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)' as unknown as number,
      }}>
        <div style={{
          maxWidth: 'var(--container-app)',
          margin: '0 auto',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-4)',
        }}>
          <Link to="/" style={{ display: 'flex' }}>
            <img src={logoSrc} alt="Job Hub" height={28} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <LanguageSwitcher
              value={i18n.resolvedLanguage ?? 'pt-BR'}
              onChange={(code) => i18n.changeLanguage(code)}
            />
            {user && <Avatar name={user.name} size={30} />}
            {user && (
              <span style={{ font: 'var(--font-body)', color: 'var(--text-body)' }}>{user.name}</span>
            )}
            <Link
              to="/settings"
              title={t('header.settings')}
              style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {t('header.logout')}
            </Button>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 'var(--container-app)', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        <Outlet />
      </main>
    </div>
  );
}
