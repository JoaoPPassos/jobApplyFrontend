import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { signUp } from '../services/auth.service';
import { getApiErrorMessage } from '../services/api';
import { STRONG_PASSWORD_REGEX } from '../types/auth';
import { Card } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import logoSrc from '../assets/logo.svg';

export function RegisterPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const registerMutation = useMutation({ mutationFn: signUp });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setValidationError('');

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      setValidationError(t('register.pwdHint'));
      return;
    }
    if (password !== confirmPassword) {
      setValidationError(t('register.pwdMismatch'));
      return;
    }

    registerMutation.mutate({ name, email, password, confirm_password: confirmPassword });
  }

  if (registerMutation.isSuccess) {
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
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'center' }}>
            <h1 style={{ font: 'var(--font-h1)' }}>{t('register.successTitle')}</h1>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>
              {t('register.successHint', { email })}
            </p>
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              {t('register.login')}
            </Button>
          </Card>
        </div>
      </div>
    );
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
          <h1 style={{ font: 'var(--font-h1)', textAlign: 'center' }}>{t('register.title')}</h1>

          {(registerMutation.isError || validationError) && (
            <Alert tone="danger">
              {validationError || getApiErrorMessage(registerMutation.error)}
            </Alert>
          )}

          <Field label={t('register.name')} htmlFor="reg-name">
            <Input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label={t('auth.email')} htmlFor="reg-email">
            <Input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label={t('auth.password')} htmlFor="reg-pwd">
            <Input
              id="reg-pwd"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field label={t('register.confirmPwd')} htmlFor="reg-confirm">
            <Input
              id="reg-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" variant="primary" fullWidth disabled={registerMutation.isPending}>
            {registerMutation.isPending ? t('register.submitting') : t('register.submit')}
          </Button>

          <p style={{ textAlign: 'center', font: 'var(--font-caption)' }}>
            {t('register.haveAccount')} <Link to="/login">{t('register.login')}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
