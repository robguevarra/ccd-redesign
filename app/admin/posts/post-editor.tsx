'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { BlogPost } from '@/content/schemas';
import { doctors } from '@/content/doctors';
import { createPost, updatePost, deletePost, type PostActionResult } from './actions';

interface PostEditorProps {
  post?: BlogPost;
}

export function PostEditor({ post }: PostEditorProps) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PostActionResult | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    const r: PostActionResult | undefined = post
      ? await updatePost(post.id, formData)
      : await createPost(formData);
    setPending(false);
    if (r && !r.ok) setResult(r);
    else {
      setSavedToast(
        formData.get('status') === 'published'
          ? 'Published. Live within seconds.'
          : 'Saved as draft.',
      );
      setTimeout(() => setSavedToast(null), 3500);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm('Delete this post permanently? This cannot be undone.')) return;
    setPending(true);
    await deletePost(post.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8 py-12">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">
          {post ? 'Edit post' : 'New post'}
        </h1>
        {post && post.status === 'published' && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            View published →
          </Link>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        <Field label="Title" id="title" required>
          <input
            id="title"
            name="title"
            defaultValue={post?.title}
            required
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-lg bg-white focus:border-stone-900 focus:outline-none transition-colors font-serif"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Slug" id="slug" required>
            <input
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
            />
          </Field>
          <Field label="Author" id="authorDoctorSlug">
            <select
              id="authorDoctorSlug"
              name="authorDoctorSlug"
              defaultValue={post?.authorDoctorSlug ?? 'dr-brien-hsu'}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
            >
              {doctors.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Excerpt (1–2 sentences shown on /blog index)" id="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt ?? ''}
            rows={2}
            maxLength={500}
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y"
          />
        </Field>

        <Field label="Body (Markdown)" id="bodyMdx" required>
          <textarea
            id="bodyMdx"
            name="bodyMdx"
            defaultValue={post?.bodyMdx ?? ''}
            required
            rows={18}
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y font-mono leading-relaxed"
            placeholder={`## Heading\n\nBody copy as Markdown. **Bold**, _italic_, [link](https://example.com), lists, and quotes all supported.`}
          />
          <p className="mt-1 text-xs text-stone-500">
            Markdown rendered on the public page. Supports headings, bold, italic,
            links, lists, and blockquotes.
          </p>
        </Field>

        <Field label="Tags (comma-separated)" id="tags">
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(', ') ?? ''}
            placeholder="technology, sleep apnea"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          />
        </Field>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <fieldset className="flex items-center gap-4">
            <legend className="sr-only">Status</legend>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                defaultChecked={post?.status !== 'published'}
                className="accent-stone-900"
              />
              <span className="text-sm">Save as draft</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                defaultChecked={post?.status === 'published'}
                className="accent-stone-900"
              />
              <span className="text-sm font-medium">Publish now</span>
            </label>
          </fieldset>

          <div className="flex items-center gap-3">
            {post && (
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
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Saving…' : post ? 'Save changes' : 'Create post'}
            </button>
          </div>
        </div>

        {result && !result.ok && (
          <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {result.error}
          </p>
        )}
      </form>

      {savedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-50 rounded-full px-6 py-3 text-sm font-medium shadow-lg">
          {savedToast}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-900 mb-2">
        {label}
        {required && <span className="text-stone-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
