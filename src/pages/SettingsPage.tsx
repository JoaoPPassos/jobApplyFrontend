import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { saveEmailCredentials } from '../services/users.service';
import { getStoredUser } from '../services/storage';
import { getApiErrorMessage } from '../services/api';
import { Card } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export function SettingsPage() {
  const { t } = useTranslation();
  const user = getStoredUser();
  const [emailPassword, setEmailPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => saveEmailCredentials(emailPassword),
    onSuccess: () => setEmailPassword(''),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 480 }}>
      <h1 style={{ font: 'var(--font-h1)' }}>{t('settings.title')}</h1>

      <Card
        as="form"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <h2 style={{ font: 'var(--font-body-strong)', color: 'var(--text-strong)' }}>
          {t('settings.emailSection')}
        </h2>

        <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>
          {t('settings.emailHint')}
        </p>

        {mutation.isSuccess && (
          <Alert tone="success">{t('settings.saved')}</Alert>
        )}

        {mutation.isError && (
          <Alert tone="danger">{getApiErrorMessage(mutation.error)}</Alert>
        )}

        <Field label={t('settings.accountEmail')} htmlFor="s-email">
          <Input
            id="s-email"
            type="email"
            value={user?.email ?? ''}
            disabled
          />
        </Field>

        <Field label={t('settings.appPassword')} htmlFor="s-pwd">
          <Input
            id="s-pwd"
            type="password"
            required
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
          />
        </Field>

        <Button type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? t('settings.saving') : t('settings.save')}
        </Button>
      </Card>
    </div>
  );
}
