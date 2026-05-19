'use client';

import { useState } from 'react';
import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';
import { requestPasswordReset, type LoginResult } from '../login/actions';

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    const r = await requestPasswordReset(formData);
    setPending(false);
    setResult(r);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
            Reset your password
          </h1>
          <p className="text-stone-600 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {result?.ok ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h2 className="font-serif text-2xl text-stone-900 mb-3">Check your email</h2>
            <p className="text-stone-600 text-sm">
              If an account exists for that address, you&apos;ll receive a reset link
              shortly. The link is valid for one hour.
            </p>
            <Link
              href="/admin/login"
              className="inline-block mt-6 text-sm text-stone-900 underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-stone-200 p-8">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-900 mb-2">
                Email
              </label>
              <input
                id="email" name="email" type="email" required autoComplete="email"
                className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            {result && !result.ok && (
              <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {result.error}
              </p>
            )}
            <button
              type="submit" disabled={pending}
              className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-4 text-base font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pending ? 'Sending…' : 'Send reset link'}
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
