import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from '../services/auth.service';
import { getApiErrorMessage } from '../services/api';
import { STRONG_PASSWORD_REGEX } from '../types/auth';
import { Card } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import logoSrc from '../assets/logo.svg';

type Step = 'email' | 'code' | 'password';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const emailMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setStep('code'),
  });

  const codeMutation = useMutation({
    mutationFn: () => verifyResetCode(email, code),
    onSuccess: (token) => {
      setResetToken(token);
      setStep('password');
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      resetPassword({
        reset_token: resetToken,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      }),
    onSuccess: () => navigate('/login', { replace: true }),
  });

  const activeMutation =
    step === 'email' ? emailMutation : step === 'code' ? codeMutation : passwordMutation;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setValidationError('');

    if (step === 'email') {
      emailMutation.mutate(email);
    } else if (step === 'code') {
      codeMutation.mutate();
    } else {
      if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
        setValidationError(t('recover.pwdHint'));
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setValidationError('As senhas não conferem.');
        return;
      }
      passwordMutation.mutate();
    }
  }

  const submitLabel =
    step === 'email' ? t('recover.sendCode') :
    step === 'code' ? t('recover.verifyCode') :
    t('recover.resetPwd');

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
          <h1 style={{ font: 'var(--font-h1)', textAlign: 'center' }}>{t('recover.title')}</h1>

          {(activeMutation.isError || validationError) && (
            <Alert tone="danger">
              {validationError || getApiErrorMessage(activeMutation.error)}
            </Alert>
          )}

          {step === 'email' && (
            <>
              <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>
                {t('recover.emailHint')}
              </p>
              <Field label={t('auth.email')} htmlFor="fp-email">
                <Input
                  id="fp-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </>
          )}

          {step === 'code' && (
            <>
              <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>
                {t('recover.codeHint')} <strong>{email}</strong>.
              </p>
              <Field label={t('recover.code')} htmlFor="fp-code">
                <Input
                  id="fp-code"
                  mono
                  inputMode="numeric"
                  minLength={6}
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '0.5em' }}
                />
              </Field>
            </>
          )}

          {step === 'password' && (
            <>
              <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>
                {t('recover.pwdHint')}
              </p>
              <Field label={t('recover.newPwd')} htmlFor="fp-new">
                <Input
                  id="fp-new"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>
              <Field label={t('recover.confirmPwd')} htmlFor="fp-conf">
                <Input
                  id="fp-conf"
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </Field>
            </>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={activeMutation.isPending}>
            {activeMutation.isPending ? t('recover.sending') : submitLabel}
          </Button>

          <p style={{ textAlign: 'center', font: 'var(--font-caption)' }}>
            <Link to="/login">{t('recover.back')}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
