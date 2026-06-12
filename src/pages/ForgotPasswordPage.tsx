import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from '../services/auth.service';
import { getApiErrorMessage } from '../services/api';
import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from '../types/auth';

type Step = 'email' | 'code' | 'password';

const inputClass =
  'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';
const buttonClass =
  'w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
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
    step === 'email'
      ? emailMutation
      : step === 'code'
        ? codeMutation
        : passwordMutation;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setValidationError('');

    if (step === 'email') {
      emailMutation.mutate(email);
    } else if (step === 'code') {
      codeMutation.mutate();
    } else {
      if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
        setValidationError(STRONG_PASSWORD_MESSAGE);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setValidationError('As senhas não conferem.');
        return;
      }
      passwordMutation.mutate();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-xl font-bold text-blue-700">
          Recuperar senha
        </h1>

        {(activeMutation.isError || validationError) && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">
            {validationError || getApiErrorMessage(activeMutation.error)}
          </p>
        )}

        {step === 'email' && (
          <>
            <p className="text-sm text-gray-600">
              Informe seu e-mail. Se ele estiver cadastrado, enviaremos um
              código de 6 dígitos.
            </p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
          </>
        )}

        {step === 'code' && (
          <>
            <p className="text-sm text-gray-600">
              Digite o código de 6 dígitos enviado para{' '}
              <span className="font-medium">{email}</span>.
            </p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Código</span>
              <input
                required
                inputMode="numeric"
                minLength={6}
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputClass} text-center tracking-[0.5em]`}
              />
            </label>
          </>
        )}

        {step === 'password' && (
          <>
            <p className="text-sm text-gray-600">{STRONG_PASSWORD_MESSAGE}</p>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Nova senha
              </span>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Confirmar nova senha
              </span>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={inputClass}
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={activeMutation.isPending}
          className={buttonClass}
        >
          {activeMutation.isPending
            ? 'Enviando…'
            : step === 'email'
              ? 'Enviar código'
              : step === 'code'
                ? 'Verificar código'
                : 'Redefinir senha'}
        </button>

        <p className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </div>
  );
}
