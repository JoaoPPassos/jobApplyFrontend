import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  createApplication,
  getApplication,
  updateApplication,
} from '../services/applications.service';
import { getApiErrorMessage } from '../services/api';
import {
  APPLICATION_STATUSES,
  SOURCE_PLATFORMS,
  type ApplicationStatus,
  type SourcePlatform,
} from '../types/application';
import { Card } from '../components/ui/Card';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';

// O backend só permite atualizar current_status, applied_at e notes
export function ApplicationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [jobSourceUrl, setJobSourceUrl] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<SourcePlatform>('linkedin');
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>('applied');
  const [appliedAt, setAppliedAt] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRole, setContactRole] = useState('');

  const applicationQuery = useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplication(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    const application = applicationQuery.data;
    if (!application) return;
    setCurrentStatus(application.current_status);
    setAppliedAt(application.applied_at.slice(0, 10));
    setNotes(application.notes ?? '');
    setJobSourceUrl(application.job?.source_url ?? '');
    setCompany(application.job?.company ?? '');
    setRole(application.job?.title ?? '');
    setContactName(application.contact?.name ?? '');
    setContactEmail(application.contact?.email ?? '');
    setContactRole(application.contact?.role ?? '');
  }, [applicationQuery.data]);

  const contactStarted = Boolean(contactName || contactEmail || contactRole);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (isEditing) {
        return updateApplication(id!, {
          current_status: currentStatus,
          applied_at: appliedAt,
          notes,
        });
      }
      return createApplication({
        job_source_url: jobSourceUrl,
        company,
        role,
        source_platform: sourcePlatform,
        current_status: currentStatus,
        applied_at: appliedAt,
        notes: notes || undefined,
        contact: contactStarted
          ? { name: contactName, email: contactEmail, role: contactRole }
          : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      navigate('/');
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    saveMutation.mutate();
  }

  if (isEditing && applicationQuery.isPending) {
    return <Spinner label={t('loading.application')} />;
  }

  if (isEditing && applicationQuery.isError) {
    return <Alert tone="danger">{getApiErrorMessage(applicationQuery.error)}</Alert>;
  }

  return (
    <Card
      as="form"
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <h1 style={{ font: 'var(--font-h1)' }}>
        {isEditing ? t('form.editTitle') : t('form.newTitle')}
      </h1>

      {saveMutation.isError && (
        <Alert tone="danger">{getApiErrorMessage(saveMutation.error)}</Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <Field label={t('form.company')} required>
          <Input
            required
            disabled={isEditing}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Field>

        <Field label={t('form.role')} required>
          <Input
            required
            disabled={isEditing}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </Field>

        <Field label={t('form.url')} required style={{ gridColumn: '1 / -1' }}>
          <Input
            type="url"
            mono
            required
            disabled={isEditing}
            value={jobSourceUrl}
            onChange={(e) => setJobSourceUrl(e.target.value)}
          />
        </Field>

        <Field label={t('form.platform')}>
          <Select
            disabled={isEditing}
            value={sourcePlatform}
            onChange={(e) => setSourcePlatform(e.target.value as SourcePlatform)}
          >
            {SOURCE_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </Field>

        <Field label={t('form.status')}>
          <Select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as ApplicationStatus)}
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
          </Select>
        </Field>

        <Field label={t('form.date')}>
          <Input
            type="date"
            required
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
          />
        </Field>
      </div>

      <Field label={t('form.notes')}>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      <fieldset style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
        <legend style={{ padding: '0 var(--space-1)', font: 'var(--font-body-strong)', color: 'var(--text-body)' }}>
          {t('form.contact')}
        </legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <Field label={t('form.contactName')}>
            <Input
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </Field>
          <Field label={t('form.contactEmail')}>
            <Input
              type="email"
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </Field>
          <Field label={t('form.contactRole')}>
            <Input
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      {isEditing && (
        <p style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>
          {t('form.lockNote')}
        </p>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button type="submit" variant="primary" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? t('form.saving') : t('form.save')}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/')}>
          {t('form.cancel')}
        </Button>
      </div>
    </Card>
  );
}
