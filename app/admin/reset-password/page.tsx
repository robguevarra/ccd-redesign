'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { practiceInfo } from '@/content/practice-info';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm') ?? '');
    if (password.length < 6) {
      setPending(false);
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setPending(false);
      setError('Passwords do not match.');
      return;
    }
    const supabase = createClient();
    const { error: e } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (e) {
      setError(e.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/admin/dashboard'), 1500);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
            Set a new password
          </h1>
        </div>

        {success ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h2 className="font-serif text-2xl text-stone-900 mb-3">Password updated.</h2>
            <p className="text-stone-600 text-sm">Redirecting you to the dashboard…</p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-stone-200 p-8">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-900 mb-2">
                New password
              </label>
              <input
                id="password" name="password" type="password" required
                autoComplete="new-password" minLength={6}
                className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-stone-900 mb-2">
                Confirm new password
              </label>
              <input
                id="confirm" name="confirm" type="password" required
                autoComplete="new-password" minLength={6}
                className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            {error && (
              <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit" disabled={pending}
              className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-4 text-base font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Updating…' : 'Update password'}
            </button>
            <p className="text-center text-sm">
              <Link href="/admin/login" className="text-stone-600 hover:text-stone-900 underline underline-offset-4">
                Back to sign in
              </Link>
            </p>
          </form>
        )}

        <p className="text-center text-xs text-stone-400 mt-8">
          {practiceInfo.brandName} · Admin
        </p>
      </div>
    </div>
  );
}
