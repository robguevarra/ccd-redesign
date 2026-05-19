'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast, Toast } from '@/components/admin/toast';

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
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { BlogPost } from '@/content/schemas';
import { createPost, updatePost, deletePost, type PostActionResult } from './actions';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { uploadBlogImage } from './actions';

interface PostEditorProps {
  post?: BlogPost;
  doctors: Array<{ slug: string; name: string }>;
}

export function PostEditor({ post, doctors }: PostEditorProps) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PostActionResult | null>(null);
  const { state: toastState, showToast } = useToast();
  const [body, setBody] = useState(post?.bodyMdx ?? '');
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  // When editing an existing post, manual edits to slug are the default.
  // When creating new, slug auto-syncs to title until user manually edits it.
  const [slugDirty, setSlugDirty] = useState(!!post);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    const r: PostActionResult | undefined = post
      ? await updatePost(post.id, formData)
      : await createPost(formData);
    setPending(false);
    if (r && !r.ok) setResult(r);
    else {
      showToast(
        formData.get('status') === 'published'
          ? 'Published. Live within seconds.'
          : 'Saved as draft.',
      );
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
        {post && (
          <Link
            href={
              post.status === 'published'
                ? `/blog/${post.slug}`
                : `/blog/${post.slug}?preview=1`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            {post.status === 'published' ? 'View published →' : 'Preview draft →'}
          </Link>
        )}
      </div>

      <form action={handleSubmit} className="space-y-6">
        <Field label="Title" id="title" required>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugDirty) setSlug(slugify(e.target.value));
            }}
            required
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-lg bg-white focus:border-stone-900 focus:outline-none transition-colors font-serif"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Slug" id="slug" required>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugDirty(true);
              }}
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
            />
            <p className="mt-1 text-xs text-stone-500">
              Auto-filled from the title. The post will live at <span className="font-mono">/blog/{slug || '<slug>'}</span>.
            </p>
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

        <Field label="Body" id="bodyMdx" required>
          <input type="hidden" name="bodyMdx" value={body} />
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Heading, paragraphs, bold and italic, lists, links, images — all here."
            allowImages
            onUploadImage={uploadBlogImage}
            minHeight={420}
          />
          <p className="mt-1 text-xs text-stone-500">
            Use the toolbar for formatting. Markdown is saved automatically.
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

      <Toast state={toastState} />
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
