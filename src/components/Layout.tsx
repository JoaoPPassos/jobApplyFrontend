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
