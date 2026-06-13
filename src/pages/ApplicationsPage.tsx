import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  deleteApplication,
  listApplications,
} from '../services/applications.service';
import { getStoredUser } from '../services/storage';
import { getApiErrorMessage } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import type { ApplicationStatus } from '../types/application';

const STATUS_FILTER_TABS: ApplicationStatus[] = ['in_review', 'interview', 'offer'];

export function ApplicationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getStoredUser();
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'all' | ApplicationStatus>('all');

  const applicationsQuery = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => listApplications(user ? { user_id: user.id } : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  function handleDelete(id: string) {
    if (window.confirm(t('list.remove') + '?')) {
      deleteMutation.mutate(id);
    }
  }

  if (applicationsQuery.isPending) {
    return <Spinner label={t('loading.applications')} />;
  }

  if (applicationsQuery.isError) {
    return <Alert tone="danger">{getApiErrorMessage(applicationsQuery.error)}</Alert>;
  }

  const applications = applicationsQuery.data;

  const counts = STATUS_FILTER_TABS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = applications.filter((a) => a.current_status === s).length;
    return acc;
  }, {});

  const tabs = [
    { value: 'all', label: t('list.all'), count: applications.length },
    ...STATUS_FILTER_TABS.map((s) => ({ value: s, label: t(`status.${s}`), count: counts[s] })),
  ];

  const filtered = tab === 'all' ? applications : applications.filter((a) => a.current_status === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ font: 'var(--font-h1)' }}>{t('list.title')}</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/applications/new')}
          leadingIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          {t('list.new')}
        </Button>
      </div>

      <Tabs value={tab} onChange={(v) => setTab(v as typeof tab)} tabs={tabs} />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title={t('list.emptyTitle')}
            description={t('list.emptyDesc')}
            action={
              <Button variant="primary" onClick={() => navigate('/applications/new')}>
                {t('list.new')}
              </Button>
            }
          />
        </Card>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', margin: 0, padding: 0 }}>
          {filtered.map((application) => (
            <Card
              key={application.id}
              as="li"
              padding="var(--space-4)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                listStyle: 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ font: 'var(--font-body-strong)', color: 'var(--text-strong)' }}>
                  {application.job?.title ?? 'Vaga sem título'}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    {' '}— {application.job?.company ?? 'empresa desconhecida'}
                  </span>
                </p>
                <p style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {application.job?.source_platform} · {t('list.appliedOn')}{' '}
                  {new Date(application.applied_at).toLocaleDateString(i18n.resolvedLanguage ?? 'pt-BR')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
                <StatusBadge status={application.current_status} label={t(`status.${application.current_status}`)} />
                <Link
                  to={`/applications/${application.id}/edit`}
                  style={{ font: 'var(--font-caption)', color: 'var(--text-link)' }}
                >
                  {t('list.edit')}
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(application.id)}
                  disabled={deleteMutation.isPending}
                  style={{
                    font: 'var(--font-caption)',
                    color: 'var(--color-danger)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    opacity: deleteMutation.isPending ? 0.5 : 1,
                  }}
                >
                  {t('list.remove')}
                </button>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
