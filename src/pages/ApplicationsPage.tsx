import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteApplication,
  listApplications,
} from '../services/applications.service';
import { getStoredUser } from '../services/storage';
import { getApiErrorMessage } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export function ApplicationsPage() {
  const queryClient = useQueryClient();
  const user = getStoredUser();

  const applicationsQuery = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => listApplications(user ? { user_id: user.id } : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  function handleDelete(id: string) {
    if (window.confirm('Remover esta aplicação?')) {
      deleteMutation.mutate(id);
    }
  }

  if (applicationsQuery.isPending) {
    return <p className="text-gray-500">Carregando aplicações…</p>;
  }

  if (applicationsQuery.isError) {
    return (
      <p className="rounded bg-red-50 p-3 text-sm text-red-700">
        {getApiErrorMessage(applicationsQuery.error)}
      </p>
    );
  }

  const applications = applicationsQuery.data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Minhas aplicações</h1>
        <Link
          to="/applications/new"
          className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nova aplicação
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="rounded bg-white p-6 text-center text-gray-500 shadow">
          Nenhuma aplicação encontrada.
        </p>
      ) : (
        <ul className="space-y-3">
          {applications.map((application) => (
            <li
              key={application.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
            >
              <div>
                <p className="font-medium">
                  {application.job?.title ?? 'Vaga sem título'}
                  <span className="text-gray-500">
                    {' '}
                    — {application.job?.company ?? 'empresa desconhecida'}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Aplicado em{' '}
                  {new Date(application.applied_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={application.current_status} />
                <Link
                  to={`/applications/${application.id}/edit`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(application.id)}
                  disabled={deleteMutation.isPending}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
