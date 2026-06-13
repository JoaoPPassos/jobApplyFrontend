import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { login } from '../services/auth.service';
import { saveSession } from '../services/storage';
import { getApiErrorMessage } from '../services/api';
import { Card } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import logoSrc from '../assets/logo.svg';

export function LoginPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveSession(data);
      navigate('/', { replace: true });
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-6)',
      background: 'var(--surface-page)',
      padding: 'var(--space-6)',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }}>
        <LanguageSwitcher
          value={i18n.resolvedLanguage ?? 'pt-BR'}
          onChange={(code) => i18n.changeLanguage(code)}
        />
      </div>

      <img src={logoSrc} alt="Job Hub" height={34} />

      <div style={{ width: '100%', maxWidth: 'var(--container-auth)' }}>
        <Card
          as="form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <h1 style={{ font: 'var(--font-h1)', textAlign: 'center' }}>{t('auth.title')}</h1>

          {loginMutation.isError && (
            <Alert tone="danger">{getApiErrorMessage(loginMutation.error)}</Alert>
          )}

          <Field label={t('auth.email')} htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label={t('auth.password')} htmlFor="login-pwd">
            <Input
              id="login-pwd"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" variant="primary" fullWidth disabled={loginMutation.isPending}>
            {loginMutation.isPending ? t('auth.entering') : t('auth.enter')}
          </Button>

          <p style={{ textAlign: 'center', font: 'var(--font-caption)' }}>
            <Link to="/forgot-password">{t('auth.forgot')}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
