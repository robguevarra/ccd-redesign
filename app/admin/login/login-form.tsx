'use client';

import { useState } from 'react';
import { signIn, signUp, type LoginResult } from './actions';

type Mode = 'sign-in' | 'sign-up';

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const action = mode === 'sign-in' ? signIn : signUp;
    const result: LoginResult | undefined = await action(formData);
    setPending(false);
    if (result && !result.ok && result.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Field label="Email" id="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        />
      </Field>

      <Field label="Password" id="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          minLength={6}
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        />
      </Field>

      {error && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-4 text-base font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending
          ? 'Working…'
          : mode === 'sign-in'
            ? 'Sign in'
            : 'Create account'}
      </button>

      <p className="text-center text-sm text-stone-600">
        {mode === 'sign-in' ? (
          <>
            First time?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('sign-up');
                setError(null);
              }}
              className="text-stone-900 font-medium underline underline-offset-4"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('sign-in');
                setError(null);
              }}
              className="text-stone-900 font-medium underline underline-offset-4"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
