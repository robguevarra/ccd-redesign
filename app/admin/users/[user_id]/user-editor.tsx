'use client';

import { useState } from 'react';
import type { StaffUser } from '@/lib/supabase/queries';
import { updateUser, deactivateUser, type UserActionResult } from '../actions';

export function UserEditor({ user }: { user: StaffUser }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<UserActionResult | null>(null);

  async function handleDeactivate() {
    if (!confirm(`Deactivate ${user.displayName}? They will lose admin access.`)) return;
    setPending(true);
    const r = await deactivateUser(user.userId);
    setPending(false);
    setResult(r);
  }

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setResult(null);
        const r = await updateUser(user.userId, formData);
        setPending(false);
        setResult(r);
      }}
      className="space-y-6"
    >
      <Field label="Display name" id="displayName" required>
        <input
          id="displayName" name="displayName" type="text" required
          defaultValue={user.displayName}
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        />
      </Field>
      <Field label="Role" id="role" required>
        <select
          id="role" name="role" defaultValue={user.role}
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
        >
          <option value="editor">Editor</option>
          <option value="owner">Owner</option>
        </select>
      </Field>
      <Field label="Doctor binding (optional)" id="doctorSlug">
        <input
          id="doctorSlug" name="doctorSlug" type="text"
          defaultValue={user.doctorSlug ?? ''}
          placeholder="dr-angela-huang"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
        />
      </Field>
      <Field label="Active" id="active">
        <input type="hidden" name="active" value="false" />
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="active" value="true" defaultChecked={user.active} className="accent-stone-900" />
          <span className="text-sm">Allow this user to sign in</span>
        </label>
      </Field>

      <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={handleDeactivate}
          disabled={pending || !user.active}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          Deactivate
        </button>
        <button
          type="submit"
          disabled={pending}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {result && (
        <p className={`text-sm rounded-lg px-4 py-3 ${
          result.ok
            ? 'text-green-800 bg-green-50 border border-green-200'
            : 'text-red-700 bg-red-50 border border-red-200'
        }`}>
          {result.ok ? 'Saved.' : result.error}
        </p>
      )}
    </form>
  );
}

function Field({ label, id, required, children }: {
  label: string; id: string; required?: boolean; children: React.ReactNode;
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
