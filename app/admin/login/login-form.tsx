'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn, type LoginResult } from './actions';

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result: LoginResult | undefined = await signIn(formData);
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
          autoComplete="current-password"
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
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm">
        <Link
          href="/admin/forgot-password"
          className="text-stone-600 hover:text-stone-900 underline underline-offset-4"
        >
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

function Field({
  label, id, children,
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
