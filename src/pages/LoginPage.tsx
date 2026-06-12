import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/auth.service';
import { saveSession } from '../services/storage';
import { getApiErrorMessage } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-xl font-bold text-blue-700">
          JobApply — Login
        </h1>

        {loginMutation.isError && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">
            {getApiErrorMessage(loginMutation.error)}
          </p>
        )}

        <label className="block">
          <span className="text-sm font-medium text-gray-700">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Senha</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </p>
      </form>
    </div>
  );
}
