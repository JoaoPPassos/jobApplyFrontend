import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

// O backend só permite atualizar current_status, applied_at e notes
// (UpdateApplicationDTO); os demais campos ficam desabilitados na edição.
export function ApplicationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [jobSourceUrl, setJobSourceUrl] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [sourcePlatform, setSourcePlatform] =
    useState<SourcePlatform>('linkedin');
  const [currentStatus, setCurrentStatus] =
    useState<ApplicationStatus>('applied');
  const [appliedAt, setAppliedAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
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

  // Contato é opcional no backend, mas quando enviado o ContactDTO exige os
  // três campos — por isso o tudo-ou-nada
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
    return <p className="text-gray-500">Carregando aplicação…</p>;
  }

  if (isEditing && applicationQuery.isError) {
    return (
      <p className="rounded bg-red-50 p-3 text-sm text-red-700">
        {getApiErrorMessage(applicationQuery.error)}
      </p>
    );
  }

  const inputClass =
    'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h1 className="text-xl font-bold">
        {isEditing ? 'Editar aplicação' : 'Nova aplicação'}
      </h1>

      {saveMutation.isError && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-700">
          {getApiErrorMessage(saveMutation.error)}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Empresa</span>
          <input
            required
            disabled={isEditing}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Cargo</span>
          <input
            required
            disabled={isEditing}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">URL da vaga</span>
          <input
            type="url"
            required
            disabled={isEditing}
            value={jobSourceUrl}
            onChange={(e) => setJobSourceUrl(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Plataforma</span>
          <select
            disabled={isEditing}
            value={sourcePlatform}
            onChange={(e) => setSourcePlatform(e.target.value as SourcePlatform)}
            className={inputClass}
          >
            {SOURCE_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <select
            value={currentStatus}
            onChange={(e) =>
              setCurrentStatus(e.target.value as ApplicationStatus)
            }
            className={inputClass}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Data da aplicação
          </span>
          <input
            type="date"
            required
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Notas</span>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
      </label>

      <fieldset className="space-y-4 rounded border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">
          Contato (opcional)
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Nome</span>
            <input
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">E-mail</span>
            <input
              type="email"
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Cargo</span>
            <input
              required={!isEditing && contactStarted}
              disabled={isEditing}
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Salvando…' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
