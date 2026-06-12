import type { ApplicationStatus } from '../types/application';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-200 text-gray-700',
  no_response: 'bg-gray-100 text-gray-500',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
