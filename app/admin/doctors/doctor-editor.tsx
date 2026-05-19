'use client';

import { useState } from 'react';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { PortraitFocalPicker } from '@/app/admin/_components/portrait-focal-picker';
import type { DoctorRow } from '@/lib/supabase/queries';
import { createDoctor, updateDoctor, deleteDoctor, type DoctorActionResult } from './actions';

interface Props {
  doctor?: DoctorRow;
}

export function DoctorEditor({ doctor }: Props) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<DoctorActionResult | null>(null);
  const [bio, setBio] = useState(doctor?.bio ?? '');
  const [name, setName] = useState(doctor?.name ?? '');
  const [slug, setSlug] = useState(doctor?.slug ?? '');
  const [slugDirty, setSlugDirty] = useState(!!doctor);
  const [objectPosition, setObjectPosition] = useState(
    doctor?.portrait.objectPosition ?? 'center center',
  );
  const [previewSrc, setPreviewSrc] = useState<string>(doctor?.portrait.src ?? '');

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewSrc(URL.createObjectURL(file));
  }

  async function handleDelete() {
    if (!doctor) return;
    if (!confirm(`Delete ${doctor.name} permanently?`)) return;
    setPending(true);
    const r = await deleteDoctor(doctor.slug);
    setPending(false);
    if (r && !r.ok) setResult(r);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8 py-12">
      <Link
        href="/admin/doctors"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Doctors
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
        {doctor ? doctor.name : 'New doctor'}
      </h1>

      {doctor && (
        <div className="mb-8">
          <Link
            href={`/doctors/${doctor.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            View public page →
          </Link>
        </div>
      )}

      <form
        action={async (formData) => {
          setPending(true);
          setResult(null);
          const r = doctor
            ? await updateDoctor(doctor.slug, formData)
            : await createDoctor(formData);
          setPending(false);
          if (r && !r.ok) setResult(r);
        }}
        className="space-y-8"
      >
        <input type="hidden" name="bio" value={bio} />
        <input type="hidden" name="portraitObjectPosition" value={objectPosition} />

        <div className="grid md:grid-cols-2 gap-8">
          <Field label="Name" id="name" required>
            <input id="name" name="name" type="text" required maxLength={120}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugDirty) setSlug(slugify(e.target.value));
              }}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-serif" />
          </Field>
          <Field label="Slug" id="slug" required>
            <input id="slug" name="slug" type="text" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugDirty(true);
              }}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono" />
            <p className="mt-1 text-xs text-stone-500">
              Auto-filled from the name. The page will live at <span className="font-mono">/doctors/{slug || '<slug>'}</span>.
            </p>
          </Field>
        </div>

        <Field label="Title (credentials line)" id="title" required>
          <input id="title" name="title" type="text" required maxLength={200}
            defaultValue={doctor?.title}
            placeholder="DMD · Endodontist"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors" />
        </Field>

        <Field label="Short bio (1 paragraph; appears on /doctors index)" id="short" required>
          <textarea id="short" name="short" required rows={3} maxLength={800}
            defaultValue={doctor?.short}
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y" />
        </Field>

        <Field label="Full bio" id="bio-display" required>
          <RichTextEditor
            value={bio}
            onChange={setBio}
            placeholder="Education, training, recognitions, philosophy of care."
            allowImages={false}
            minHeight={400}
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-8">
          <Field label="Specialties (comma-separated)" id="specialties">
            <input id="specialties" name="specialties" type="text"
              defaultValue={doctor?.specialties.join(', ') ?? ''}
              placeholder="Endodontics, Microscopic endodontics"
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors" />
          </Field>
          <Field label="Joined year" id="joinedYear" required>
            <input id="joinedYear" name="joinedYear" type="number" required min="1900" max="2100"
              defaultValue={doctor?.joinedYear}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono" />
          </Field>
        </div>

        <fieldset className="space-y-3 pt-6 border-t border-stone-200">
          <legend className="text-sm font-medium text-stone-900">Portrait</legend>
          <Field label={doctor?.portraitPath ? 'Replace portrait (optional)' : 'Upload portrait'} id="portrait">
            <input id="portrait" name="portrait" type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFilePick}
              className="block w-full text-sm text-stone-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-700" />
            <p className="mt-1 text-xs text-stone-500">JPEG, PNG, or WebP. Max 5 MB. 3:4 portrait orientation looks best.</p>
          </Field>
          <Field label="Portrait alt text" id="portraitAlt">
            <input id="portraitAlt" name="portraitAlt" type="text" maxLength={300}
              defaultValue={doctor?.portrait.alt ?? ''}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors" />
          </Field>
          {previewSrc && (
            <div>
              <p className="text-sm font-medium text-stone-900 mb-2">Focal point</p>
              <PortraitFocalPicker
                imageSrc={previewSrc}
                value={objectPosition}
                onChange={setObjectPosition}
              />
              <p className="mt-1 text-xs text-stone-500">
                Click anywhere on the preview to set where the face should anchor in the thumbnail.
              </p>
            </div>
          )}
        </fieldset>

        <fieldset className="space-y-3 pt-6 border-t border-stone-200">
          <legend className="text-sm font-medium text-stone-900 mb-2">Visibility</legend>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isLead"
              defaultChecked={doctor?.isLead ?? false}
              className="accent-stone-900" />
            <span className="text-sm font-medium">Lead clinician</span>
            <span className="text-xs text-stone-500 ml-2">(at most one across the practice)</span>
          </label>
          <br />
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active"
              defaultChecked={doctor?.active !== false}
              className="accent-stone-900" />
            <span className="text-sm">Visible on site</span>
            <span className="text-xs text-stone-500 ml-2">(uncheck to hide without deleting)</span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
          {doctor && !doctor.isLead && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {pending ? 'Saving…' : doctor ? 'Save changes' : 'Create doctor'}
          </button>
        </div>

        {result && !result.ok && (
          <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {result.error}
          </p>
        )}
      </form>
    </div>
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
