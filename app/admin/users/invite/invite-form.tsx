'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { inviteUser, type UserActionResult } from '../actions';

interface InviteUserFormProps {
  doctors: Array<{ slug: string; name: string }>;
}

type Role = 'editor' | 'front_office' | 'owner';

export function InviteUserForm({ doctors }: InviteUserFormProps) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<UserActionResult | null>(null);
  const [role, setRole] = useState<Role>('editor');

  // Front office staff aren't doctors and shouldn't be bound to one.
  const showDoctorBinding = role !== 'front_office';

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
        Add a teammate
      </h1>
      <p className="text-stone-600 text-sm mb-10">
        Create their account with a password. They can change it after signing in
        via &quot;Forgot your password?&quot; on the login page.
      </p>

      <form
        action={async (formData) => {
          setPending(true);
          setResult(null);
          const r = await inviteUser(formData);
          setPending(false);
          if (r && !r.ok) setResult(r);
        }}
        className="space-y-6"
      >
        <Field label="Email" id="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          />
        </Field>
        <Field label="Password" id="password" required>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            maxLength={72}
            placeholder="Hand them this password directly. No email is sent."
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
          />
          <p className="mt-1 text-xs text-stone-500">
            At least 8 characters. Shown as text so you can confirm typing — copy and share
            with the teammate via a secure channel.
          </p>
        </Field>
        <Field label="Display name" id="displayName" required>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            placeholder="Dr. Angela Huang"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          />
        </Field>
        <Field label="Role" id="role" required>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          >
            <option value="editor">Editor (can edit all content)</option>
            <option value="front_office">Front Office (inquiries only)</option>
            <option value="owner">Owner (can also manage users)</option>
          </select>
        </Field>
        {showDoctorBinding && (
          <Field label="Doctor binding (optional)" id="doctorSlug">
            <select
              id="doctorSlug"
              name="doctorSlug"
              defaultValue=""
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
            >
              <option value="">— None —</option>
              {doctors.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.slug})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-500">
              If this user is one of the doctors, pick them so blog posts they
              create default to their byline.
            </p>
          </Field>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Creating…' : 'Create account'}
        </button>

        {result && !result.ok && (
          <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {result.error}
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label, id, required, children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-2">
        {label}{required && <span className="text-stone-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
