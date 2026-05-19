'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { ArrowUp, ArrowDown, FileText } from 'lucide-react';
import type { PatientForm } from '@/lib/supabase/queries';
import { reorderPatientForm } from './actions';

function formatBytes(n: number | null): string {
  if (!n) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function FormRow({ form, isFirst, isLast }: {
  form: PatientForm;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function move(direction: 'up' | 'down') {
    startTransition(async () => {
      await reorderPatientForm(form.id, direction);
    });
  }

  return (
    <li className="px-5 py-4 flex items-center gap-4">
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => move('up')}
          disabled={pending || isFirst}
          aria-label="Move up"
          className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => move('down')}
          disabled={pending || isLast}
          aria-label="Move down"
          className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <Link
        href={`/admin/patient-forms/${form.id}`}
        className="flex-1 flex items-center gap-3 group min-w-0"
      >
        <FileText className="h-5 w-5 text-stone-400 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
            {form.label}
          </p>
          {form.description && (
            <p className="text-sm text-stone-500 truncate">{form.description}</p>
          )}
          <p className="text-xs text-stone-400 font-mono">
            {formatBytes(form.fileSizeBytes)} · {form.filePath.split('.').pop()?.toUpperCase()}
          </p>
        </div>
      </Link>
      <span className={`shrink-0 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full ${
        form.active ? 'bg-stone-900 text-stone-50' : 'bg-stone-200 text-stone-600'
      }`}>
        {form.active ? 'Live' : 'Hidden'}
      </span>
    </li>
  );
}
