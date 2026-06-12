import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getStoredUser } from '../services/storage';

export function Layout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-blue-700">
            JobApply
          </Link>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">{user.name}</span>}
            <button
              onClick={handleLogout}
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
