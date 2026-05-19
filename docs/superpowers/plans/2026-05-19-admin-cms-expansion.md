# Admin CMS Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the admin/CMS surface from "blog only" to cover patient forms, an inquiry inbox, doctor pages, multi-user staff auth, and a WYSIWYG editor — without disrupting the existing pitch-ready public site.

**Architecture:** Six independently shippable stages, each a candidate PR. Stage 1 lays shared foundation (migrations, Storage buckets, the Tiptap editor component, the admin nav, the storage helper, the service-role client, seed scripts, restored auth gate). Stages 2–6 build on Stage 1 in any order. All work uses the existing Next.js 16 App Router + Supabase + Server Actions + ISR pattern that the blog editor already ships.

**Tech Stack:** Next.js 16, TypeScript strict, Tailwind v4, Supabase (Postgres + Auth + Storage), `@supabase/ssr`, `@supabase/supabase-js`, Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `tiptap-markdown`), `react-markdown` (existing), Vitest (existing), zod (existing).

**Spec:** [docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md](../specs/2026-05-19-admin-cms-expansion-design.md)

**Worktree:** This plan is executed inside the git worktree at `/Users/robguevarra/Documents/Coding Projects/ccd2/thirsty-chatelet-b97848` on branch `claude/thirsty-chatelet-b97848`.

**Test conventions (anchored to existing repo):** Vitest tests live in `content/__tests__/` and `lib/__tests__/`. Existing patterns assert content invariants and pure-function behavior — no tests on Server Actions, no tests on React components. This plan follows that pattern: TDD applies only to query-layer helpers and pure data validators. Routes and components are verified by manually clicking through `pnpm dev` with the dev server already running (`http://localhost:59159`).

---

## File structure (delta)

```
app/admin/
├── _components/
│   ├── admin-nav.tsx                       NEW   shared horizontal sub-nav
│   └── portrait-focal-picker.tsx           NEW   click-to-set focal-point control (Stage 6)
├── inquiries/                              NEW   Stage 4
│   ├── page.tsx                            list + filter
│   ├── actions.ts                          updateInquiryStatus, updateInquiryNotes
│   ├── inquiry-row.tsx                     client component; status toggle
│   ├── export/route.ts                     CSV streaming Route Handler
│   └── [id]/page.tsx
├── doctors/                                NEW   Stage 6
│   ├── page.tsx                            list + reorder + lead toggle
│   ├── actions.ts                          create/update/delete/reorder/setLead/uploadPortrait
│   ├── doctor-editor.tsx                   shared form (new + edit), client
│   ├── new/page.tsx
│   └── [slug]/page.tsx                     edit
├── patient-forms/                          NEW   Stage 5
│   ├── page.tsx                            list with up/down reorder + upload
│   ├── actions.ts                          create/update/delete/reorder/uploadFile
│   ├── form-editor.tsx                     shared form
│   └── [id]/page.tsx
├── users/                                  NEW   Stage 2 (owner-only)
│   ├── page.tsx
│   ├── actions.ts                          inviteUser, updateUser, deactivateUser
│   ├── invite/page.tsx
│   └── [user_id]/page.tsx
└── access-denied/page.tsx                  NEW   Stage 2 — shown when authenticated but no staff_users row

app/(marketing)/
├── patient-forms/page.tsx                  NEW   Stage 5 — public download list
└── contact/page.tsx                        MODIFY Stage 5 — add patient-forms card

components/
└── admin/
    └── rich-text-editor.tsx                NEW   Stage 1 — Tiptap component (shared blog + doctor bio)

lib/supabase/
├── queries.ts                              MODIFY add doctor / patient-form / inquiry / staff queries
├── storage.ts                              NEW   Stage 1 — upload + signed-URL helpers
└── service-role.ts                         NEW   Stage 1 — server-only admin client (invitations)

lib/__tests__/
└── getDoctor.test.ts                       NEW   Stage 6 smoke test

scripts/
├── seed-doctors.ts                         NEW   Stage 1
└── seed-owner.ts                           NEW   Stage 1

supabase/migrations/                        NEW   Stage 1
├── 2026-05-19_create_doctors.sql
├── 2026-05-19_create_patient_forms.sql
├── 2026-05-19_create_staff_users.sql
├── 2026-05-19_alter_appointment_requests_add_internal_notes.sql
├── 2026-05-19_create_storage_buckets.sql
└── 2026-05-19_create_blog_posts_doctor_fkey.sql

proxy.ts                                    MODIFY Stage 1 (restore gate) + Stage 2 (membership check)
app/admin/layout.tsx                        MODIFY Stage 1 (mount AdminNav)
app/admin/posts/post-editor.tsx             MODIFY Stage 3 (Tiptap swap)
app/admin/dashboard/page.tsx                MODIFY Stage 4 (link "View all inquiries")
app/(marketing)/doctors/page.tsx            MODIFY Stage 6 (async data + revalidate)
app/(marketing)/doctors/[slug]/page.tsx     MODIFY Stage 6 (async data + ReactMarkdown bio)
app/(marketing)/page.tsx                    MODIFY Stage 6 (async doctor strip)
app/(marketing)/request-appointment/appointment-form.tsx   MODIFY Stage 5 (success-state link)
components/site-header.tsx                  MODIFY Stage 5 (mobile drawer Patient Forms link)
components/site-footer.tsx                  MODIFY Stage 5 (Patient Forms link)
content/redirects.ts                        MODIFY Stage 5 (drop /patient-forms 301)
content/doctors.ts                          KEEP-AS-SEED Stage 6 (TS file stays; seed inserts into DB)
content/__tests__/redirects.test.ts         MODIFY Stage 5 (remove forms entry from inverse-check)
.env.example                                MODIFY Stage 1 (add new env vars)
```

---

## Stage 0 — Pre-flight

### Task 0.1: Verify the worktree state

**Files:**
- Read-only verification

- [ ] **Step 1: Confirm the right branch and clean working tree**

Run: `git status && git branch --show-current`

Expected: branch is `claude/thirsty-chatelet-b97848`. Working tree clean (or only this plan file pending).

- [ ] **Step 2: Confirm dependencies are installed**

Run: `ls node_modules >/dev/null 2>&1 && echo OK || pnpm install`

Expected: `OK` printed. If not, the install completes.

- [ ] **Step 3: Confirm Supabase env vars present**

Run: `grep -c NEXT_PUBLIC_SUPABASE_URL .env.local`

Expected: `1`. If 0, copy from the primary worktree at `/Users/robguevarra/Documents/Coding Projects/ccd/ccd2/.env.local`.

- [ ] **Step 4: Confirm Vitest green at baseline**

Run: `pnpm test`

Expected: all existing tests pass (current baseline is 37 tests across `content/__tests__/` and `lib/__tests__/`).

### Task 0.2: Document the dev URL

The preview server is already running at `http://localhost:59159`. Throughout this plan, "open the preview server" means visit a path there. If the server stops, restart with `pnpm dev`.

---

## Stage 1 — Foundation

**Ship checkpoint:** at the end of Stage 1, `/admin/dashboard` still renders, the auth gate is **restored** and gating non-authenticated users, a new admin nav is visible, and seed scripts + Tiptap component are ready for downstream stages.

### Task 1.1: Add new env vars to `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append the two new env vars**

```
# Supabase service-role key — server-only. Required for /admin/users invite flow.
# Never prefix with NEXT_PUBLIC. Imported only from files starting with 'server-only'.
SUPABASE_SERVICE_ROLE_KEY=

# One-time bootstrap: email of the first owner inserted into staff_users.
# Used only by scripts/seed-owner.ts.
SEED_OWNER_EMAIL=
```

- [ ] **Step 2: Mirror values into local `.env.local`**

Get the real service-role key from the Supabase dashboard: project `qxicorwwknphfzvyjngz` → Settings → API → `service_role` (secret) → copy. Paste into `.env.local`. Set `SEED_OWNER_EMAIL=robneil@gmail.com` (engagement owner).

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore(env): document SUPABASE_SERVICE_ROLE_KEY + SEED_OWNER_EMAIL"
```

### Task 1.2: Create the `doctors` migration

**Files:**
- Create: `supabase/migrations/2026-05-19_create_doctors.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-19 — doctors table (CMS-managed)
-- See: docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md §4.1

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  title text not null,
  portrait_path text,
  portrait_alt text not null default '',
  portrait_object_position text not null default 'center center',
  short text not null,
  bio text not null,
  specialties text[] not null default '{}',
  joined_year int not null,
  is_lead boolean not null default false,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists doctors_one_lead
  on public.doctors (is_lead) where is_lead = true;

create index if not exists doctors_display_order
  on public.doctors (display_order, slug);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();

-- RLS
alter table public.doctors enable row level security;

drop policy if exists "doctors_anon_read_active" on public.doctors;
create policy "doctors_anon_read_active" on public.doctors
  for select to anon using (active = true);

drop policy if exists "doctors_auth_read_all" on public.doctors;
create policy "doctors_auth_read_all" on public.doctors
  for select to authenticated using (true);

drop policy if exists "doctors_auth_write" on public.doctors;
create policy "doctors_auth_write" on public.doctors
  for all to authenticated using (true) with check (true);
```

- [ ] **Step 2: Apply via Supabase MCP**

Use the Supabase MCP `apply_migration` tool with `project_id=qxicorwwknphfzvyjngz`, `name=2026-05-19_create_doctors`, and the SQL above. (If MCP is unavailable, run via SQL editor in the Supabase dashboard.)

- [ ] **Step 3: Verify via MCP**

Run `list_tables(project_id, schemas=['public'])` and confirm `doctors` is present. Or in SQL editor: `select count(*) from public.doctors;` → expect `0`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/2026-05-19_create_doctors.sql
git commit -m "feat(db): doctors table + RLS + lead-uniqueness index"
```

### Task 1.3: Create the `patient_forms` migration

**Files:**
- Create: `supabase/migrations/2026-05-19_create_patient_forms.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-19 — patient_forms table (admin-managed PDF library)
-- See: docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md §4.2

create table if not exists public.patient_forms (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  file_path text not null,
  file_size_bytes int,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patient_forms_display_order
  on public.patient_forms (display_order, id);

drop trigger if exists patient_forms_set_updated_at on public.patient_forms;
create trigger patient_forms_set_updated_at before update on public.patient_forms
  for each row execute function public.set_updated_at();

alter table public.patient_forms enable row level security;

drop policy if exists "patient_forms_anon_read_active" on public.patient_forms;
create policy "patient_forms_anon_read_active" on public.patient_forms
  for select to anon using (active = true);

drop policy if exists "patient_forms_auth_read_all" on public.patient_forms;
create policy "patient_forms_auth_read_all" on public.patient_forms
  for select to authenticated using (true);

drop policy if exists "patient_forms_auth_write" on public.patient_forms;
create policy "patient_forms_auth_write" on public.patient_forms
  for all to authenticated using (true) with check (true);
```

- [ ] **Step 2: Apply via Supabase MCP**

Same procedure as Task 1.2 — name `2026-05-19_create_patient_forms`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-05-19_create_patient_forms.sql
git commit -m "feat(db): patient_forms table + RLS"
```

### Task 1.4: Create the `staff_users` migration

**Files:**
- Create: `supabase/migrations/2026-05-19_create_staff_users.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-19 — staff_users allowlist (multi-user staff auth)
-- See: docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md §4.3

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  role text not null check (role in ('owner', 'editor')),
  doctor_slug text references public.doctors(slug) on delete set null on update cascade,
  active boolean not null default true,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists staff_users_email on public.staff_users (email);
create index if not exists staff_users_role on public.staff_users (role);

alter table public.staff_users enable row level security;

-- Authenticated user can read only their own staff_users row.
-- All writes go through server actions using the service-role key,
-- which bypasses RLS — application-level authorization is the gate.
drop policy if exists "staff_users_read_own" on public.staff_users;
create policy "staff_users_read_own" on public.staff_users
  for select to authenticated using (user_id = auth.uid());
```

- [ ] **Step 2: Apply via Supabase MCP**

Name: `2026-05-19_create_staff_users`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-05-19_create_staff_users.sql
git commit -m "feat(db): staff_users allowlist with role + doctor binding"
```

### Task 1.5: Alter `appointment_requests` to add internal notes

**Files:**
- Create: `supabase/migrations/2026-05-19_alter_appointment_requests_add_internal_notes.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-19 — appointment_requests: add internal_notes
-- See: docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md §4.4

alter table public.appointment_requests
  add column if not exists internal_notes text;
```

- [ ] **Step 2: Apply via Supabase MCP**

Name: `2026-05-19_alter_appointment_requests_add_internal_notes`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/2026-05-19_alter_appointment_requests_add_internal_notes.sql
git commit -m "feat(db): appointment_requests.internal_notes column"
```

### Task 1.6: Create Supabase Storage buckets

**Files:**
- Create: `supabase/migrations/2026-05-19_create_storage_buckets.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-19 — storage buckets for admin uploads
-- See: docs/superpowers/specs/2026-05-19-admin-cms-expansion-design.md §4.5

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('doctor-portraits', 'doctor-portraits', true, 5 * 1024 * 1024,
   array['image/jpeg', 'image/png', 'image/webp']),
  ('patient-forms', 'patient-forms', true, 10 * 1024 * 1024,
   array['application/pdf']),
  ('blog-images', 'blog-images', true, 8 * 1024 * 1024,
   array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Public read for all three buckets.
drop policy if exists "Public read doctor-portraits" on storage.objects;
create policy "Public read doctor-portraits" on storage.objects
  for select using (bucket_id = 'doctor-portraits');

drop policy if exists "Public read patient-forms" on storage.objects;
create policy "Public read patient-forms" on storage.objects
  for select using (bucket_id = 'patient-forms');

drop policy if exists "Public read blog-images" on storage.objects;
create policy "Public read blog-images" on storage.objects
  for select using (bucket_id = 'blog-images');

-- Authenticated write for all three.
drop policy if exists "Authenticated write doctor-portraits" on storage.objects;
create policy "Authenticated write doctor-portraits" on storage.objects
  for insert to authenticated with check (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated update doctor-portraits" on storage.objects;
create policy "Authenticated update doctor-portraits" on storage.objects
  for update to authenticated using (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated delete doctor-portraits" on storage.objects;
create policy "Authenticated delete doctor-portraits" on storage.objects
  for delete to authenticated using (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated write patient-forms" on storage.objects;
create policy "Authenticated write patient-forms" on storage.objects
  for insert to authenticated with check (bucket_id = 'patient-forms');

drop policy if exists "Authenticated update patient-forms" on storage.objects;
create policy "Authenticated update patient-forms" on storage.objects
  for update to authenticated using (bucket_id = 'patient-forms');

drop policy if exists "Authenticated delete patient-forms" on storage.objects;
create policy "Authenticated delete patient-forms" on storage.objects
  for delete to authenticated using (bucket_id = 'patient-forms');

drop policy if exists "Authenticated write blog-images" on storage.objects;
create policy "Authenticated write blog-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated update blog-images" on storage.objects;
create policy "Authenticated update blog-images" on storage.objects
  for update to authenticated using (bucket_id = 'blog-images');

drop policy if exists "Authenticated delete blog-images" on storage.objects;
create policy "Authenticated delete blog-images" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-images');
```

- [ ] **Step 2: Apply via Supabase MCP**

Name: `2026-05-19_create_storage_buckets`.

- [ ] **Step 3: Verify via dashboard**

Visit https://supabase.com/dashboard/project/qxicorwwknphfzvyjngz/storage/buckets. Confirm three new buckets visible: `doctor-portraits`, `patient-forms`, `blog-images`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/2026-05-19_create_storage_buckets.sql
git commit -m "feat(storage): doctor-portraits, patient-forms, blog-images buckets"
```

### Task 1.7: Create the server-only service-role client

**Files:**
- Create: `lib/supabase/service-role.ts`

- [ ] **Step 1: Write the file**

```ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client that bypasses RLS. Use ONLY for operations that
 * must run with elevated privileges — currently:
 *   - inviteUserByEmail in the staff_users invite flow
 *   - writing to staff_users (since RLS only allows users to read their own row)
 *
 * NEVER import this from a client component. The 'server-only' import
 * forces a build error if any client bundle pulls this file in.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY missing — required for admin operations.',
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/service-role.ts
git commit -m "feat(supabase): server-only service-role client"
```

### Task 1.8: Create the upload helper

**Files:**
- Create: `lib/supabase/storage.ts`

- [ ] **Step 1: Write the file**

```ts
import 'server-only';
import { createClient } from './server';

export type UploadBucket = 'doctor-portraits' | 'patient-forms' | 'blog-images';

export interface UploadResult {
  ok: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

const ALLOWED_MIME: Record<UploadBucket, string[]> = {
  'doctor-portraits': ['image/jpeg', 'image/png', 'image/webp'],
  'patient-forms': ['application/pdf'],
  'blog-images': ['image/jpeg', 'image/png', 'image/webp'],
};

const MAX_BYTES: Record<UploadBucket, number> = {
  'doctor-portraits': 5 * 1024 * 1024,
  'patient-forms': 10 * 1024 * 1024,
  'blog-images': 8 * 1024 * 1024,
};

/**
 * Upload a File to a Supabase Storage bucket. Validates MIME + size
 * before contacting Storage. Returns the storage path and the
 * publicly-resolvable URL.
 *
 * `keyPrefix` is optional — defaults to a uuid filename. Pass a stable
 * value (like the doctor slug) when you want overwriting to replace
 * the previous asset rather than accumulate.
 */
export async function uploadToBucket(
  bucket: UploadBucket,
  file: File,
  keyPrefix?: string,
): Promise<UploadResult> {
  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    return { ok: false, error: `File type ${file.type} not allowed in ${bucket}.` };
  }
  if (file.size > MAX_BYTES[bucket]) {
    return {
      ok: false,
      error: `File exceeds ${(MAX_BYTES[bucket] / 1024 / 1024).toFixed(0)}MB limit.`,
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const stem = keyPrefix ?? crypto.randomUUID();
  const path = `${stem}.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, path, publicUrl: data.publicUrl };
}

/**
 * Delete an object from a bucket. Tolerant of missing objects.
 */
export async function deleteFromBucket(
  bucket: UploadBucket,
  path: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Resolve a stored bucket path to its public URL. Cheap; no network call.
 */
export async function publicUrlFor(
  bucket: UploadBucket,
  path: string,
): Promise<string> {
  const supabase = await createClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/storage.ts
git commit -m "feat(supabase): bucket upload + delete helpers with MIME/size validation"
```

### Task 1.9: Install Tiptap dependencies

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install**

Run: `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit tiptap-markdown`

Expected: 4 packages added; no peer-dep warnings (React 19 is supported).

- [ ] **Step 2: Sanity check the build**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add Tiptap + tiptap-markdown for WYSIWYG editor"
```

### Task 1.10: Build the RichTextEditor component

**Files:**
- Create: `components/admin/rich-text-editor.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useState } from 'react';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, ImagePlus,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  allowImages?: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  allowImages = false,
  onUploadImage,
  minHeight = 320,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // tiptap-markdown extends editor.storage with .markdown
      const md = (editor.storage as { markdown?: { getMarkdown(): string } })
        .markdown?.getMarkdown() ?? '';
      onChange(md);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-stone max-w-none focus:outline-none px-4 py-3',
          'prose-headings:font-serif prose-headings:tracking-tight',
          'prose-h2:text-2xl prose-h2:mt-6 prose-h3:text-xl prose-h3:mt-5',
          'prose-p:my-3 prose-li:my-1',
        ),
      },
    },
  });

  // Re-sync when `value` changes externally (e.g. parent reset after save).
  useEffect(() => {
    if (!editor) return;
    const current = (editor.storage as { markdown?: { getMarkdown(): string } })
      .markdown?.getMarkdown() ?? '';
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      className="rounded-lg border-2 border-stone-300 bg-white focus-within:border-stone-900 transition-colors"
      style={{ minHeight }}
    >
      <Toolbar
        editor={editor}
        allowImages={allowImages}
        onUploadImage={onUploadImage}
      />
      <EditorContent editor={editor} />
      {placeholder && editor.isEmpty && (
        <div className="px-4 -mt-[1px] pointer-events-none text-stone-400 text-base">
          {placeholder}
        </div>
      )}
    </div>
  );
}

function Toolbar({
  editor,
  allowImages,
  onUploadImage,
}: {
  editor: ReturnType<typeof useEditor>;
  allowImages: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
}) {
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const Btn = ({
    onClick, active, label, children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded hover:bg-stone-100',
        active && 'bg-stone-900 text-stone-50 hover:bg-stone-700',
      )}
    >
      {children}
    </button>
  );

  async function handleImagePick() {
    if (!onUploadImage) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const url = await onUploadImage(file);
      setUploading(false);
      if (url) {
        const alt = file.name.replace(/\.[^.]+$/, '');
        editor.chain().focus().insertContent(`![${alt}](${url})`).run();
      }
    };
    input.click();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-stone-200 bg-stone-50">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()}
           active={editor.isActive('bold')} label="Bold">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()}
           active={editor.isActive('italic')} label="Italic">
        <Italic className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
           active={editor.isActive('heading', { level: 2 })} label="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
           active={editor.isActive('heading', { level: 3 })} label="Heading 3">
        <Heading3 className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}
           active={editor.isActive('bulletList')} label="Bullet list">
        <List className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()}
           active={editor.isActive('orderedList')} label="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}
           active={editor.isActive('blockquote')} label="Blockquote">
        <Quote className="h-4 w-4" />
      </Btn>
      <div className="w-px h-5 bg-stone-300 mx-1" aria-hidden="true" />
      <Btn
        onClick={() => {
          const prev = editor.getAttributes('link').href ?? '';
          const url = window.prompt('URL', prev);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().unsetMark('link').run();
          } else {
            editor.chain().focus().setMark('link', { href: url }).run();
          }
        }}
        active={editor.isActive('link')}
        label="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>
      {allowImages && onUploadImage && (
        <Btn
          onClick={handleImagePick}
          label={uploading ? 'Uploading…' : 'Insert image'}
        >
          <ImagePlus className={cn('h-4 w-4', uploading && 'animate-pulse')} />
        </Btn>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in preview**

Open `http://localhost:59159/admin/posts/new` — no change yet (Stage 3 swaps the textarea). For now: just verify `pnpm typecheck` passes.

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/admin/rich-text-editor.tsx
git commit -m "feat(admin): shared Tiptap WYSIWYG editor with markdown round-trip"
```

### Task 1.11: Build the AdminNav component

**Files:**
- Create: `app/admin/_components/admin-nav.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface AdminNavProps {
  /** Pass through from server layout. When 'owner', the Users tab renders. */
  role?: 'owner' | 'editor' | null;
}

const BASE_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/patient-forms', label: 'Patient Forms' },
  { href: '/admin/inquiries', label: 'Inquiries' },
];

export function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();
  const items = role === 'owner'
    ? [...BASE_ITEMS, { href: '/admin/users', label: 'Users' }]
    : BASE_ITEMS;

  return (
    <nav
      aria-label="Admin sections"
      className="border-b border-stone-200 bg-white"
    >
      <ul className="mx-auto max-w-7xl px-5 md:px-8 flex flex-wrap gap-1 -mb-px">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center px-3 py-2.5 text-sm border-b-2',
                  active
                    ? 'border-stone-900 text-stone-900 font-medium'
                    : 'border-transparent text-stone-600 hover:text-stone-900',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add app/admin/_components/admin-nav.tsx
git commit -m "feat(admin): horizontal sub-nav (Dashboard · Posts · Doctors · Forms · Inquiries · Users)"
```

### Task 1.12: Mount AdminNav in the admin layout

**Files:**
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Edit the layout**

Replace the existing `app/admin/layout.tsx` body with:

```tsx
import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';
import { AdminNav } from './_components/admin-nav';

export const metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // role wiring: Stage 2 (multi-user auth) replaces `null` here with a
  // resolved staff_users.role lookup. For Stage 1 the Users tab is hidden.
  const role: 'owner' | 'editor' | null = null;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-serif text-xl tracking-tight">
            {practiceInfo.brandName}
            <span className="text-stone-400 font-sans text-sm font-normal ml-2">
              · admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            View site →
          </Link>
        </div>
      </header>
      <AdminNav role={role} />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify in preview**

Open `http://localhost:59159/admin/dashboard`. The new sub-nav row appears below the brand header with Dashboard / Posts / Doctors / Patient Forms / Inquiries. Dashboard is highlighted as active.

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(admin): mount AdminNav in admin layout (role=null until Stage 2)"
```

### Task 1.13: Write the seed-doctors script

**Files:**
- Create: `scripts/seed-doctors.ts`

- [ ] **Step 1: Write the script**

```ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { doctors as seedDoctors } from '../content/doctors';

/**
 * One-shot: insert the 5 seed doctors into Supabase if the table is empty.
 * Idempotent — re-running after the table is populated is a no-op.
 *
 * Run AFTER the doctors table migration but BEFORE the blog_posts → doctors
 * FK migration (see plan stage 6).
 *
 * Usage:
 *   pnpm tsx scripts/seed-doctors.ts
 */
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count, error: countErr } = await supabase
    .from('doctors').select('*', { count: 'exact', head: true });
  if (countErr) throw countErr;
  if ((count ?? 0) > 0) {
    console.log(`doctors table not empty (${count} rows). Skipping seed.`);
    return;
  }

  const rows = seedDoctors.map((d, i) => ({
    slug: d.slug,
    name: d.name,
    title: d.title,
    portrait_path: null, // public/images/doctors/* remains the source; admin uploads can replace later
    portrait_alt: d.portrait.alt,
    portrait_object_position: d.portrait.objectPosition ?? 'center center',
    short: d.short,
    bio: d.bio,
    specialties: d.specialties,
    joined_year: d.joinedYear,
    is_lead: d.isLead,
    display_order: i,
    active: true,
  }));

  const { error } = await supabase.from('doctors').insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} doctors.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit (do NOT run the script yet — Stage 6 sequences this with the FK migration)**

```bash
git add scripts/seed-doctors.ts
git commit -m "feat(scripts): seed-doctors one-shot (run during Stage 6)"
```

### Task 1.14: Write the seed-owner script

**Files:**
- Create: `scripts/seed-owner.ts`

- [ ] **Step 1: Write the script**

```ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * One-shot: bootstrap the first staff_users row as 'owner' if the table
 * is empty. Reads SEED_OWNER_EMAIL from env. Looks up the auth.users row
 * by email; if no auth user exists yet, sends a magic-link invite first.
 *
 * Run BEFORE Stage 2 (multi-user auth) lands, so the owner can log in.
 *
 * Usage:
 *   pnpm tsx scripts/seed-owner.ts
 */
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SEED_OWNER_EMAIL;
  if (!url || !key || !email) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_EMAIL all required.',
    );
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count } = await supabase
    .from('staff_users').select('*', { count: 'exact', head: true });
  if ((count ?? 0) > 0) {
    console.log(`staff_users not empty (${count} rows). Skipping seed.`);
    return;
  }

  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) throw listErr;
  let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data: invited, error: invErr } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: { display_name: 'Owner', role: 'owner' },
      });
    if (invErr) throw invErr;
    user = invited.user;
    console.log(`Sent invite to ${email}; auth.users row created.`);
  }

  if (!user) throw new Error('Failed to resolve auth user.');

  const { error: insErr } = await supabase.from('staff_users').insert({
    user_id: user.id,
    email,
    display_name: 'Owner',
    role: 'owner',
    active: true,
  });
  if (insErr) throw insErr;

  console.log(`Seeded owner: ${email} (auth.users.id=${user.id}).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit (do NOT run yet — Stage 2 sequences this)**

```bash
git add scripts/seed-owner.ts
git commit -m "feat(scripts): seed-owner one-shot (run at Stage 2 start)"
```

### Task 1.15: Restore the auth gate in `proxy.ts`

**Files:**
- Modify: `proxy.ts`

- [ ] **Step 1: Reinstate the gate**

Replace the body of `proxy.ts` (after `await supabase.auth.getUser()`) with:

```ts
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate /admin/* (except /admin/login) behind authentication.
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /admin/login to dashboard.
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
```

Replace the `await supabase.auth.getUser();` (without destructuring) with the destructured version above. Drop the TEMP comment block.

- [ ] **Step 2: Verify the redirect**

Open in private/incognito: `http://localhost:59159/admin/dashboard` → expect redirect to `/admin/login?next=/admin/dashboard`.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "chore(admin): restore auth gate (foundation for Stage 2 membership check)"
```

### Task 1.16: Run full test + typecheck pass

- [ ] **Step 1: Tests**

Run: `pnpm test`

Expected: 37/37 pass (no regression).

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: clean.

- [ ] **Step 3: Build**

Run: `pnpm build`

Expected: clean build with no new warnings.

**Stage 1 ship checkpoint reached.** Foundation in place: 5 migrations applied, 3 storage buckets live, service-role + storage helpers + Tiptap editor + AdminNav + seed scripts shipped, auth gate restored. The dentist's current single-account login still works exactly as before. Subsequent stages can land in any order.

---

## Stage 2 — Multi-user staff auth

**Ship checkpoint:** at the end of Stage 2, only users with an `active=true` row in `staff_users` can access `/admin/*`; the owner can invite/edit/deactivate other staff via `/admin/users`; the AdminNav surfaces the Users tab only for owners.

### Task 2.1: Run seed-owner

- [ ] **Step 1: Confirm `SEED_OWNER_EMAIL` is set in `.env.local`**

Run: `grep SEED_OWNER_EMAIL .env.local`

Expected: prints `SEED_OWNER_EMAIL=robneil@gmail.com` (or the engagement owner's email).

- [ ] **Step 2: Run the script**

Run: `pnpm tsx scripts/seed-owner.ts`

Expected: prints `Seeded owner: <email> (auth.users.id=<uuid>).` If the email already exists in `auth.users`, no invite is sent. Otherwise an invite email is sent.

- [ ] **Step 3: Verify**

Use Supabase MCP `execute_sql` with `select user_id, email, role, active from staff_users;` → expect one row, role `owner`, active `true`.

- [ ] **Step 4: Sign in**

If you weren't already signed in, sign in at `http://localhost:59159/admin/login` with the owner's email. (If invited fresh, follow the magic link from email.)

No commit — script execution only.

### Task 2.2: Add staff-user query helpers

**Files:**
- Modify: `lib/supabase/queries.ts`

- [ ] **Step 1: Append the helpers**

Append to `lib/supabase/queries.ts`:

```ts
/* ---- staff_users (auth allowlist) ----------------------------------- */

export type StaffRole = 'owner' | 'editor';

export interface StaffUser {
  userId: string;
  email: string;
  displayName: string;
  role: StaffRole;
  doctorSlug: string | null;
  active: boolean;
  invitedBy: string | null;
  createdAt: string;
}

function rowToStaff(row: any): StaffUser {
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    doctorSlug: row.doctor_slug,
    active: row.active,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
  };
}

/** Returns the staff_users row for the currently-signed-in user, or null. */
export async function getCurrentStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToStaff(data);
}

/** Lists all staff_users joined with auth.users.last_sign_in_at. */
export async function listStaffUsers(): Promise<
  Array<StaffUser & { lastSignInAt: string | null }>
> {
  const { createServiceRoleClient } = await import('./service-role');
  const admin = createServiceRoleClient();
  const { data: staff } = await admin
    .from('staff_users').select('*').order('created_at', { ascending: false });
  const { data: authList } = await admin.auth.admin.listUsers();
  const byId = new Map(
    (authList?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null]),
  );
  return (staff ?? []).map((row) => ({
    ...rowToStaff(row),
    lastSignInAt: byId.get(row.user_id) ?? null,
  }));
}

export async function getStaffUserById(userId: string): Promise<StaffUser | null> {
  const { createServiceRoleClient } = await import('./service-role');
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from('staff_users').select('*').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return rowToStaff(data);
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/queries.ts
git commit -m "feat(supabase): staff_users query helpers (getCurrentStaffUser, list, byId)"
```

### Task 2.3: Layer the membership check into `proxy.ts`

**Files:**
- Modify: `proxy.ts`

- [ ] **Step 1: Insert the staff-membership lookup**

Replace the auth-gate block (the `if (request.nextUrl.pathname.startsWith('/admin') ... && !user)` block) with:

```ts
  // Gate /admin/* (except /admin/login + /admin/access-denied) behind
  // both authentication AND active staff_users membership.
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isExempt =
    request.nextUrl.pathname.startsWith('/admin/login') ||
    request.nextUrl.pathname.startsWith('/admin/access-denied');

  if (isAdminPath && !isExempt) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    // Membership check.
    const { data: staff } = await supabase
      .from('staff_users')
      .select('role, active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!staff || !staff.active) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/access-denied';
      return NextResponse.redirect(url);
    }
    // Owner-only path guard.
    if (
      request.nextUrl.pathname.startsWith('/admin/users') &&
      staff.role !== 'owner'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }
```

Keep the "Redirect authenticated users away from /admin/login" block below it unchanged.

- [ ] **Step 2: Verify the new gate**

Sign in as the owner — `/admin/dashboard` still works. Then in the Supabase dashboard, toggle `staff_users.active=false` for the owner row, refresh → expect redirect to `/admin/access-denied`. Toggle back to `true`.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat(auth): proxy.ts gates /admin on staff_users membership + active flag"
```

### Task 2.4: Create the access-denied page

**Files:**
- Create: `app/admin/access-denied/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import Link from 'next/link';
import { signOut } from '../login/actions';

export const metadata = {
  title: 'Access denied',
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 md:px-8 py-24 text-center">
      <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
        Your account isn't authorized.
      </h1>
      <p className="text-stone-600 text-lg leading-relaxed mb-10">
        This admin is invite-only. If you should have access, ask the practice
        owner to send you an invite from the Users page.
      </p>
      <div className="flex justify-center gap-3">
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-stone-700 px-6 py-3 text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

To exercise: temporarily flip your own `staff_users.active` to false; visit `/admin/dashboard`; expect redirect to `/admin/access-denied` rendering this page. Restore.

- [ ] **Step 3: Commit**

```bash
git add app/admin/access-denied/page.tsx
git commit -m "feat(admin): access-denied page for non-allowlisted signed-in users"
```

### Task 2.5: Wire admin layout to surface role

**Files:**
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Read role server-side and pass to AdminNav**

Replace the `role` declaration in `app/admin/layout.tsx` with:

```tsx
import { getCurrentStaffUser } from '@/lib/supabase/queries';
// ... other imports unchanged

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentStaffUser();
  const role = me?.role ?? null;
  // ... rest unchanged
```

(Also change the function signature from `function` to `async function`.)

- [ ] **Step 2: Verify in preview**

Open `http://localhost:59159/admin/dashboard` as the owner — the Users tab appears in the sub-nav. As an editor (you can simulate by temporarily changing your role in the DB to `editor`), Users does not appear.

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(admin): layout reads current staff role; AdminNav shows Users for owners only"
```

### Task 2.6: Create users-list page

**Files:**
- Create: `app/admin/users/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listStaffUsers, getCurrentStaffUser } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const me = await getCurrentStaffUser();
  if (me?.role !== 'owner') redirect('/admin/dashboard');

  const users = await listStaffUsers();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Users</h1>
        <Link
          href="/admin/users/invite"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Invite user
        </Link>
      </div>

      <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {users.map((u) => (
          <li key={u.userId} className="px-5 py-4">
            <Link
              href={`/admin/users/${u.userId}`}
              className="flex items-center justify-between gap-4 group"
            >
              <div className="min-w-0">
                <p className="font-medium text-stone-900 group-hover:underline underline-offset-4">
                  {u.displayName}
                </p>
                <p className="text-sm text-stone-500">{u.email}</p>
                {u.doctorSlug && (
                  <p className="text-xs text-stone-500 mt-1">
                    Bound to doctor: <span className="font-mono">{u.doctorSlug}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full inline-block ${
                  u.role === 'owner'
                    ? 'bg-stone-900 text-stone-50'
                    : 'bg-stone-200 text-stone-700'
                }`}>
                  {u.role}
                </p>
                {!u.active && (
                  <p className="text-xs text-red-600 mt-1">Deactivated</p>
                )}
                {u.lastSignInAt && (
                  <p className="text-xs text-stone-500 mt-1">
                    Last seen{' '}
                    {new Date(u.lastSignInAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Visit `http://localhost:59159/admin/users` — expect a one-row list with the owner.

- [ ] **Step 3: Commit**

```bash
git add app/admin/users/page.tsx
git commit -m "feat(admin/users): list staff with role + last sign-in (owner only)"
```

### Task 2.7: Create user invite/update/deactivate actions

**Files:**
- Create: `app/admin/users/actions.ts`

- [ ] **Step 1: Write the actions**

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getCurrentStaffUser } from '@/lib/supabase/queries';

export interface UserActionResult {
  ok: boolean;
  error?: string;
}

async function requireOwner(): Promise<{ ok: true; userId: string } | UserActionResult> {
  const me = await getCurrentStaffUser();
  if (!me || me.role !== 'owner') return { ok: false, error: 'Forbidden.' };
  return { ok: true, userId: me.userId };
}

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  displayName: z.string().min(1, 'Name required.').max(120),
  role: z.enum(['owner', 'editor']),
  doctorSlug: z.string().optional().or(z.literal('')),
});

export async function inviteUser(formData: FormData): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const parsed = inviteSchema.safeParse({
    email: formData.get('email'),
    displayName: formData.get('displayName'),
    role: formData.get('role'),
    doctorSlug: formData.get('doctorSlug') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const admin = createServiceRoleClient();

  // Check whether the auth user already exists.
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list.users.find(
    (u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase(),
  );

  let userId: string;
  if (existing) {
    userId = existing.id;
  } else {
    const { data: invited, error: invErr } =
      await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
        data: { display_name: parsed.data.displayName, role: parsed.data.role },
      });
    if (invErr) return { ok: false, error: invErr.message };
    if (!invited.user) return { ok: false, error: 'Failed to create auth user.' };
    userId = invited.user.id;
  }

  const { error: insErr } = await admin.from('staff_users').upsert({
    user_id: userId,
    email: parsed.data.email,
    display_name: parsed.data.displayName,
    role: parsed.data.role,
    doctor_slug: parsed.data.doctorSlug || null,
    active: true,
    invited_by: auth.userId,
  }, { onConflict: 'user_id' });

  if (insErr) return { ok: false, error: insErr.message };

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

const updateSchema = z.object({
  displayName: z.string().min(1).max(120),
  role: z.enum(['owner', 'editor']),
  doctorSlug: z.string().optional().or(z.literal('')),
  active: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

export async function updateUser(
  userId: string,
  formData: FormData,
): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const parsed = updateSchema.safeParse({
    displayName: formData.get('displayName'),
    role: formData.get('role'),
    doctorSlug: formData.get('doctorSlug') ?? '',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const admin = createServiceRoleClient();

  // Safeguard: if demoting / deactivating self, ensure at least one active owner remains.
  if (userId === auth.userId) {
    const willStayOwnerAndActive =
      parsed.data.role === 'owner' && parsed.data.active;
    if (!willStayOwnerAndActive) {
      const { count } = await admin
        .from('staff_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('active', true)
        .neq('user_id', auth.userId);
      if ((count ?? 0) === 0) {
        return {
          ok: false,
          error: 'You are the last active owner. Promote another user first.',
        };
      }
    }
  }

  const { error } = await admin.from('staff_users').update({
    display_name: parsed.data.displayName,
    role: parsed.data.role,
    doctor_slug: parsed.data.doctorSlug || null,
    active: parsed.data.active,
  }).eq('user_id', userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true };
}

export async function deactivateUser(userId: string): Promise<UserActionResult> {
  const auth = await requireOwner();
  if (!('userId' in auth)) return auth;

  const admin = createServiceRoleClient();
  if (userId === auth.userId) {
    const { count } = await admin
      .from('staff_users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'owner')
      .eq('active', true)
      .neq('user_id', auth.userId);
    if ((count ?? 0) === 0) {
      return { ok: false, error: 'You are the last active owner.' };
    }
  }

  const { error } = await admin.from('staff_users')
    .update({ active: false }).eq('user_id', userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/users');
  return { ok: true };
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add app/admin/users/actions.ts
git commit -m "feat(admin/users): invite/update/deactivate server actions with last-owner safeguard"
```

### Task 2.8: Create invite-form page

**Files:**
- Create: `app/admin/users/invite/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { inviteUser, type UserActionResult } from '../actions';

export default function InviteUserPage() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<UserActionResult | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10">
        Invite a teammate
      </h1>

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
            defaultValue="editor"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          >
            <option value="editor">Editor (can edit all content)</option>
            <option value="owner">Owner (can also manage users)</option>
          </select>
        </Field>
        <Field label="Doctor binding (optional)" id="doctorSlug">
          <input
            id="doctorSlug"
            name="doctorSlug"
            placeholder="dr-angela-huang"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono"
          />
          <p className="mt-1 text-xs text-stone-500">
            If this user is one of the doctors, set their slug here so blog
            posts they create default to their byline.
          </p>
        </Field>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Sending…' : 'Send invite'}
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
```

- [ ] **Step 2: Verify**

Visit `http://localhost:59159/admin/users/invite`. Form renders. Submitting with a fake email should either send an invite (real Supabase call) or error cleanly. Test with a throwaway email; verify the new row appears in `staff_users`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/users/invite/page.tsx
git commit -m "feat(admin/users): invite form + Supabase magic-link invitation"
```

### Task 2.9: Create user edit page

**Files:**
- Create: `app/admin/users/[user_id]/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getStaffUserById } from '@/lib/supabase/queries';
import { UserEditor } from './user-editor';

export const metadata = {
  title: 'Edit user',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const user = await getStaffUserById(user_id);
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
        {user.displayName}
      </h1>
      <p className="text-stone-500 text-sm mb-10">{user.email}</p>
      <UserEditor user={user} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/users/[user_id]/page.tsx
git commit -m "feat(admin/users): edit-user route shell"
```

### Task 2.10: Create the user editor client component

**Files:**
- Create: `app/admin/users/[user_id]/user-editor.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="active" value="true" defaultChecked={user.active} className="accent-stone-900" />
          <span className="text-sm">Allow this user to sign in</span>
        </label>
        <input type="hidden" name="active" value="false" />
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
```

Note on the `active` hidden field: HTML form checkboxes submit the checked value or nothing. To always submit `active=true` or `active=false`, the hidden `<input type="hidden" name="active" value="false">` provides the default; the checkbox (when checked) overrides it. The Server Action's `formData.get('active')` returns whichever appears LAST. Order: hidden `false` first, checkbox `true` second.

- [ ] **Step 2: Verify**

Visit `/admin/users/<owner-user-id>`. Toggle role, save, verify the change in DB.

- [ ] **Step 3: Commit**

```bash
git add app/admin/users/[user_id]/user-editor.tsx
git commit -m "feat(admin/users): edit form — role, doctor binding, active, deactivate"
```

**Stage 2 ship checkpoint reached.** Multi-user auth in place. The owner can invite editors via magic link, edit their role/binding, deactivate. Middleware gates `/admin/*` on active membership.

---

## Stage 3 — Blog editor: swap textarea for Tiptap

**Ship checkpoint:** the blog editor at `/admin/posts/new` and `/admin/posts/[id]` uses the WYSIWYG component, supports image upload to the `blog-images/` bucket, and round-trips the 5 seeded posts without diff.

### Task 3.1: Add an image-upload Server Action for blog images

**Files:**
- Modify: `app/admin/posts/actions.ts`

- [ ] **Step 1: Append the action**

Append to `app/admin/posts/actions.ts`:

```ts
import { uploadToBucket } from '@/lib/supabase/storage';

export async function uploadBlogImage(file: File): Promise<string | null> {
  const r = await uploadToBucket('blog-images', file);
  return r.ok ? r.publicUrl ?? null : null;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add app/admin/posts/actions.ts
git commit -m "feat(admin/posts): uploadBlogImage server action wraps storage helper"
```

### Task 3.2: Swap textarea for RichTextEditor in the post editor

**Files:**
- Modify: `app/admin/posts/post-editor.tsx`

- [ ] **Step 1: Replace the body field with the editor**

In `app/admin/posts/post-editor.tsx`:

1. Add imports at the top:

```tsx
import { useState } from 'react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { uploadBlogImage } from './actions';
```

2. Inside `PostEditor`, after the existing `useState` declarations, add:

```tsx
const [body, setBody] = useState(post?.bodyMdx ?? '');
```

3. Replace the existing `<Field label="Body (Markdown)" ...>` block (the `<textarea>` for `bodyMdx`) with:

```tsx
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
```

The hidden `<input>` keeps the existing `formData.get('bodyMdx')` call in `createPost`/`updatePost` working unchanged.

- [ ] **Step 2: Verify with the seeded posts**

Visit `http://localhost:59159/admin/posts` (or whichever post-list path exists; otherwise jump straight to a seeded post via `/admin/posts/<id>` from the dashboard). Open one of the 5 seeded posts. Confirm the editor renders the content with proper formatting. Click "Save changes" without editing → no diff in DB content.

Open `/blog/<slug>` for the same post in another tab → renders identically to before.

- [ ] **Step 3: Test image upload**

In the editor toolbar, click the image icon. Pick a small jpeg/png. After upload, the image appears in the editor. Save the post; refresh; image is still there. Check Supabase Storage `blog-images/` bucket — the file is there.

- [ ] **Step 4: Commit**

```bash
git add app/admin/posts/post-editor.tsx
git commit -m "feat(admin/posts): replace textarea with Tiptap WYSIWYG + image upload"
```

### Task 3.3: Verify all 37 existing tests still pass

- [ ] **Step 1: Test**

Run: `pnpm test`

Expected: 37/37 pass.

**Stage 3 ship checkpoint reached.** Non-technical authors can now write blog posts visually. Markdown column unchanged. Public site rendering unchanged.

---

## Stage 4 — Inquiry inbox

**Ship checkpoint:** `/admin/inquiries` lists every appointment_request with filter chips; the detail page allows status toggle and internal-notes editing; CSV export works; the dashboard's "Recent appointment requests" links into the inbox.

### Task 4.1: Extend the AppointmentRequest schema with internal notes

**Files:**
- Modify: `content/schemas.ts`

- [ ] **Step 1: Add the `internalNotes` field**

In `content/schemas.ts`, modify the `AppointmentRequest` interface to add `internalNotes`:

```ts
export interface AppointmentRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredTime: AppointmentPreferredTime;
  notes: string | null;
  internalNotes: string | null;
  status: AppointmentStatus;
  createdAt: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: a TypeScript error pointing at `lib/supabase/queries.ts:listAppointmentRequests` (or any consumer that constructs an `AppointmentRequest` without the new field). This is intentional — we'll fix in the next task.

If there is no error (because `listAppointmentRequests` returns `any[]`), proceed.

- [ ] **Step 3: Commit**

```bash
git add content/schemas.ts
git commit -m "feat(schemas): AppointmentRequest.internalNotes field"
```

### Task 4.2: Add inquiry queries

**Files:**
- Modify: `lib/supabase/queries.ts`

- [ ] **Step 1: Replace `listAppointmentRequests` and add new helpers**

In `lib/supabase/queries.ts`, replace the existing `listAppointmentRequests` function and append two new ones:

```ts
import type { AppointmentRequest, AppointmentStatus } from '@/content/schemas';

function rowToInquiry(row: any): AppointmentRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    preferredTime: row.preferred_time,
    notes: row.notes,
    internalNotes: row.internal_notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function listAppointmentRequests(limit = 10): Promise<AppointmentRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointment_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(rowToInquiry);
}

export async function listAllAppointmentRequests(
  status?: AppointmentStatus | 'all',
): Promise<AppointmentRequest[]> {
  const supabase = await createClient();
  let q = supabase.from('appointment_requests').select('*').order('created_at', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data } = await q;
  return (data ?? []).map(rowToInquiry);
}

export async function getAppointmentRequest(id: string): Promise<AppointmentRequest | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointment_requests').select('*').eq('id', id).maybeSingle();
  return data ? rowToInquiry(data) : null;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/queries.ts
git commit -m "feat(supabase): typed inquiry queries (listAll, getById)"
```

### Task 4.3: Create inquiry server actions

**Files:**
- Create: `app/admin/inquiries/actions.ts`

- [ ] **Step 1: Write the actions**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface InquiryActionResult {
  ok: boolean;
  error?: string;
}

const statusSchema = z.enum(['new', 'contacted', 'closed']);

export async function updateInquiryStatus(
  id: string, status: string,
): Promise<InquiryActionResult> {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: 'Invalid status.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('appointment_requests')
    .update({ status: parsed.data })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

const notesSchema = z.string().max(4000);

export async function updateInquiryNotes(
  id: string, notes: string,
): Promise<InquiryActionResult> {
  const parsed = notesSchema.safeParse(notes);
  if (!parsed.success) return { ok: false, error: 'Notes too long.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('appointment_requests')
    .update({ internal_notes: parsed.data })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/inquiries/actions.ts
git commit -m "feat(admin/inquiries): updateStatus + updateInternalNotes actions"
```

### Task 4.4: Create the inquiries list page

**Files:**
- Create: `app/admin/inquiries/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import Link from 'next/link';
import { Download } from 'lucide-react';
import { listAllAppointmentRequests } from '@/lib/supabase/queries';
import type { AppointmentStatus } from '@/content/schemas';
import { cn } from '@/lib/cn';

export const metadata = {
  title: 'Inquiries',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const FILTERS: Array<{ key: AppointmentStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'closed', label: 'Closed' },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (FILTERS.find((f) => f.key === status)?.key ?? 'all') as
    AppointmentStatus | 'all';
  const inquiries = await listAllAppointmentRequests(filter);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Inquiries</h1>
        <Link
          href={`/admin/inquiries/export${filter !== 'all' ? `?status=${filter}` : ''}`}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-stone-700 px-4 py-2 text-sm font-medium hover:bg-stone-100 transition-colors"
        >
          <Download className="h-4 w-4" /> Export CSV
        </Link>
      </div>

      <nav className="flex gap-2 mb-8" aria-label="Filter inquiries">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === 'all' ? '/admin/inquiries' : `/admin/inquiries?status=${f.key}`}
              className={cn(
                'inline-flex items-center px-4 py-1.5 text-sm rounded-full border transition-colors',
                active
                  ? 'border-stone-900 bg-stone-900 text-stone-50'
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100',
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-stone-500 text-sm text-center">
          No inquiries{filter !== 'all' && ` with status “${filter}”`}.
        </div>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {inquiries.map((i) => (
            <li key={i.id} className="px-5 py-4">
              <Link
                href={`/admin/inquiries/${i.id}`}
                className="flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 group-hover:underline underline-offset-4">
                    {i.name}
                  </p>
                  <p className="text-sm text-stone-600 font-mono tabular-nums">
                    {i.phone}
                    {i.email && (
                      <>
                        <span className="text-stone-400"> · </span>
                        <span className="font-sans">{i.email}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    'text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full inline-block',
                    i.status === 'new'
                      ? 'bg-stone-900 text-stone-50'
                      : i.status === 'contacted'
                        ? 'bg-[var(--color-accent-200)] text-[var(--color-accent-900)]'
                        : 'bg-stone-200 text-stone-700',
                  )}>
                    {i.status}
                  </span>
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(i.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Visit `http://localhost:59159/admin/inquiries`. Empty state shows (no requests submitted yet). Submit a fake request from `/request-appointment` in another tab; refresh `/admin/inquiries`; row appears.

- [ ] **Step 3: Commit**

```bash
git add app/admin/inquiries/page.tsx
git commit -m "feat(admin/inquiries): list with filter chips + CSV export link"
```

### Task 4.5: Create the inquiry detail page

**Files:**
- Create: `app/admin/inquiries/[id]/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { getAppointmentRequest } from '@/lib/supabase/queries';
import { InquiryControls } from './inquiry-controls';

export const metadata = {
  title: 'Inquiry',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getAppointmentRequest(id);
  if (!inquiry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Inquiries
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">
        {inquiry.name}
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Submitted {new Date(inquiry.createdAt).toLocaleString('en-US', {
          dateStyle: 'long', timeStyle: 'short',
        })}
      </p>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 mb-8">
        <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-stone-900 hover:underline">
          <Phone className="h-4 w-4" /> <span className="font-mono tabular-nums">{inquiry.phone}</span>
        </a>
        {inquiry.email && (
          <a href={`mailto:${inquiry.email}`} className="flex items-center gap-3 text-stone-900 hover:underline">
            <Mail className="h-4 w-4" /> {inquiry.email}
          </a>
        )}
        <div className="text-sm text-stone-700">
          <span className="text-stone-500">Preferred time: </span>
          <span className="capitalize">{inquiry.preferredTime}</span>
        </div>
        {inquiry.notes && (
          <div className="pt-4 border-t border-stone-200">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-2">From the patient</p>
            <p className="text-stone-700 leading-relaxed whitespace-pre-line">{inquiry.notes}</p>
          </div>
        )}
      </div>

      <InquiryControls inquiry={inquiry} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/inquiries/[id]/page.tsx
git commit -m "feat(admin/inquiries): detail route shell + patient info card"
```

### Task 4.6: Create the inquiry controls client component

**Files:**
- Create: `app/admin/inquiries/[id]/inquiry-controls.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useState, useTransition } from 'react';
import type { AppointmentRequest, AppointmentStatus } from '@/content/schemas';
import { updateInquiryStatus, updateInquiryNotes } from '../actions';
import { cn } from '@/lib/cn';

const STATUSES: AppointmentStatus[] = ['new', 'contacted', 'closed'];

export function InquiryControls({ inquiry }: { inquiry: AppointmentRequest }) {
  const [status, setStatus] = useState<AppointmentStatus>(inquiry.status);
  const [notes, setNotes] = useState(inquiry.internalNotes ?? '');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [pending, startTransition] = useTransition();

  function handleStatusChange(next: AppointmentStatus) {
    setStatus(next);
    startTransition(async () => {
      const r = await updateInquiryStatus(inquiry.id, next);
      if (r.ok) setSavedAt(new Date());
    });
  }

  function handleNotesBlur() {
    if (notes === (inquiry.internalNotes ?? '')) return;
    startTransition(async () => {
      const r = await updateInquiryNotes(inquiry.id, notes);
      if (r.ok) setSavedAt(new Date());
    });
  }

  return (
    <>
      <section className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">Status</p>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={cn(
                'inline-flex items-center px-4 py-2 text-sm rounded-full border transition-colors capitalize',
                status === s
                  ? 'border-stone-900 bg-stone-900 text-stone-50'
                  : 'border-stone-300 text-stone-700 hover:bg-stone-100',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label htmlFor="internal_notes" className="block text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">
          Internal notes (only staff see this)
        </label>
        <textarea
          id="internal_notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={6}
          maxLength={4000}
          placeholder="Called 10:30am — left voicemail. Will retry tomorrow."
          className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y leading-relaxed"
        />
        <p className="mt-2 text-xs text-stone-500">
          {pending
            ? 'Saving…'
            : savedAt
              ? `Saved at ${savedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
              : 'Auto-saves on focus loss.'}
        </p>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Visit `/admin/inquiries/<some-id>` (use the row inserted earlier). Click status pills; reload — sticks. Type notes; click outside; reload — sticks.

- [ ] **Step 3: Commit**

```bash
git add app/admin/inquiries/[id]/inquiry-controls.tsx
git commit -m "feat(admin/inquiries): status pills + auto-save internal notes"
```

### Task 4.7: Create the CSV export route

**Files:**
- Create: `app/admin/inquiries/export/route.ts`

- [ ] **Step 1: Write the route handler**

```ts
import { listAllAppointmentRequests, getCurrentStaffUser } from '@/lib/supabase/queries';
import type { AppointmentStatus } from '@/content/schemas';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function csvEscape(value: string | null | undefined): string {
  if (value == null) return '';
  const needsQuote = /[",\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

export async function GET(request: Request) {
  const me = await getCurrentStaffUser();
  if (!me) return new NextResponse('Unauthorized', { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status') as AppointmentStatus | 'all' | null;
  const inquiries = await listAllAppointmentRequests(status ?? 'all');

  const header = [
    'created_at', 'name', 'phone', 'email', 'preferred_time',
    'status', 'notes', 'internal_notes',
  ].join(',');
  const rows = inquiries.map((i) => [
    csvEscape(i.createdAt), csvEscape(i.name), csvEscape(i.phone),
    csvEscape(i.email), csvEscape(i.preferredTime), csvEscape(i.status),
    csvEscape(i.notes), csvEscape(i.internalNotes),
  ].join(','));
  const body = [header, ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inquiries-${date}.csv"`,
    },
  });
}
```

- [ ] **Step 2: Verify**

Visit `/admin/inquiries/export` while signed in. Browser downloads `inquiries-YYYY-MM-DD.csv`. Open it — header row + your test inquiry. Visit `/admin/inquiries/export?status=new` — only `new` rows.

- [ ] **Step 3: Commit**

```bash
git add app/admin/inquiries/export/route.ts
git commit -m "feat(admin/inquiries): CSV export Route Handler with status filter"
```

### Task 4.8: Link the dashboard to the new inbox

**Files:**
- Modify: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Add "View all →" link to the requests section**

In `app/admin/dashboard/page.tsx`, find the existing heading:

```tsx
<h2 className="font-serif text-2xl text-stone-900">Recent appointment requests</h2>
```

and replace its wrapper `<div>` (the `flex items-center justify-between` div) with:

```tsx
<div className="flex items-center justify-between mb-6">
  <h2 className="font-serif text-2xl text-stone-900">Recent appointment requests</h2>
  <Link
    href="/admin/inquiries"
    className="text-sm text-stone-600 hover:text-stone-900"
  >
    View all →
  </Link>
</div>
```

- [ ] **Step 2: Verify**

Visit `/admin/dashboard`. "View all →" link appears next to the appointment-requests heading.

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard/page.tsx
git commit -m "feat(admin/dashboard): link 'Recent appointment requests' to the new inbox"
```

**Stage 4 ship checkpoint reached.** Full inquiry inbox: filter, status workflow, internal notes, CSV export.

---

## Stage 5 — Patient Forms

**Ship checkpoint:** `/patient-forms` renders the active forms; admin can upload/edit/reorder/deactivate; the old `/patient-forms → /contact` 301 is gone; nav surfaces are updated.

### Task 5.1: Drop the patient-forms 301 from the redirect map

**Files:**
- Modify: `content/redirects.ts`

- [ ] **Step 1: Remove the redirect rule**

In `content/redirects.ts`, delete the line:

```ts
{ from: '/patient-forms', to: '/contact', status: 301 },
```

Leave the adjacent `/contact-patientforms-html → /contact` 301 in place.

- [ ] **Step 2: Adjust the redirects test**

Open `content/__tests__/redirects.test.ts`. If a count or inverse check references `/patient-forms`, remove or adjust. (As of the current test, no direct reference; just running the test confirms.)

Add a new assertion at the end of the `describe('redirects', () => { ... })` block:

```ts
  test('patient-forms is no longer redirected to /contact', () => {
    const map = Object.fromEntries(
      redirects.filter((r) => r.status === 301).map((r) => [r.from, r.to]),
    );
    expect(map['/patient-forms']).toBeUndefined();
  });
```

- [ ] **Step 3: Run tests**

Run: `pnpm test`

Expected: all pass (the new test asserts the absence, existing tests are unaffected).

- [ ] **Step 4: Commit**

```bash
git add content/redirects.ts content/__tests__/redirects.test.ts
git commit -m "feat(redirects): drop /patient-forms 301; live page replaces it"
```

### Task 5.2: Add patient-form queries

**Files:**
- Modify: `lib/supabase/queries.ts`

- [ ] **Step 1: Append helpers**

```ts
export interface PatientForm {
  id: string;
  label: string;
  description: string | null;
  filePath: string;
  fileSizeBytes: number | null;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToPatientForm(row: any): PatientForm {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    filePath: row.file_path,
    fileSizeBytes: row.file_size_bytes,
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPatientForms(opts: { activeOnly?: boolean } = {}): Promise<PatientForm[]> {
  const supabase = await createClient();
  let q = supabase
    .from('patient_forms').select('*').order('display_order', { ascending: true });
  if (opts.activeOnly) q = q.eq('active', true);
  const { data } = await q;
  return (data ?? []).map(rowToPatientForm);
}

export async function getPatientForm(id: string): Promise<PatientForm | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('patient_forms').select('*').eq('id', id).maybeSingle();
  return data ? rowToPatientForm(data) : null;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/queries.ts
git commit -m "feat(supabase): listPatientForms + getPatientForm queries"
```

### Task 5.3: Create patient-form server actions

**Files:**
- Create: `app/admin/patient-forms/actions.ts`

- [ ] **Step 1: Write the actions**

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { uploadToBucket, deleteFromBucket } from '@/lib/supabase/storage';

export interface FormActionResult {
  ok: boolean;
  error?: string;
}

const inputSchema = z.object({
  label: z.string().min(1, 'Label required.').max(120),
  description: z.string().max(500).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

function revalidatePublic() {
  revalidatePath('/patient-forms');
  revalidatePath('/admin/patient-forms');
}

export async function createPatientForm(formData: FormData): Promise<FormActionResult> {
  const parsed = inputSchema.safeParse({
    label: formData.get('label'),
    description: formData.get('description') ?? '',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Please choose a PDF to upload.' };
  }

  const upload = await uploadToBucket('patient-forms', file);
  if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };

  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from('patient_forms').select('display_order')
    .order('display_order', { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase.from('patient_forms').insert({
    label: parsed.data.label,
    description: parsed.data.description || null,
    file_path: upload.path,
    file_size_bytes: file.size,
    display_order: nextOrder,
    active: parsed.data.active,
  }).select('id').single();

  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  redirect(`/admin/patient-forms/${data.id}`);
}

export async function updatePatientForm(
  id: string, formData: FormData,
): Promise<FormActionResult> {
  const parsed = inputSchema.safeParse({
    label: formData.get('label'),
    description: formData.get('description') ?? '',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }
  const file = formData.get('file');

  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    label: parsed.data.label,
    description: parsed.data.description || null,
    active: parsed.data.active,
  };

  // Optional replacement file.
  if (file instanceof File && file.size > 0) {
    const { data: existing } = await supabase
      .from('patient_forms').select('file_path').eq('id', id).maybeSingle();
    const upload = await uploadToBucket('patient-forms', file);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    updates.file_path = upload.path;
    updates.file_size_bytes = file.size;
    if (existing?.file_path && existing.file_path !== upload.path) {
      await deleteFromBucket('patient-forms', existing.file_path);
    }
  }

  const { error } = await supabase.from('patient_forms').update(updates).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePublic();
  return { ok: true };
}

export async function deletePatientForm(id: string): Promise<FormActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('patient_forms').select('file_path').eq('id', id).maybeSingle();
  const { error } = await supabase.from('patient_forms').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  if (existing?.file_path) await deleteFromBucket('patient-forms', existing.file_path);
  revalidatePublic();
  redirect('/admin/patient-forms');
}

export async function reorderPatientForm(
  id: string, direction: 'up' | 'down',
): Promise<FormActionResult> {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('patient_forms').select('id, display_order').eq('id', id).maybeSingle();
  if (!current) return { ok: false, error: 'Form not found.' };

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const order = direction === 'up' ? 'desc' : 'asc';
  const { data: neighbor } = await supabase
    .from('patient_forms')
    .select('id, display_order')
    .filter('display_order', cmp, current.display_order)
    .order('display_order', { ascending: order === 'asc' })
    .limit(1).maybeSingle();
  if (!neighbor) return { ok: true }; // already at edge

  // Swap orders.
  const { error: e1 } = await supabase.from('patient_forms')
    .update({ display_order: neighbor.display_order }).eq('id', current.id);
  const { error: e2 } = await supabase.from('patient_forms')
    .update({ display_order: current.display_order }).eq('id', neighbor.id);
  if (e1 || e2) return { ok: false, error: e1?.message ?? e2?.message ?? 'Swap failed.' };

  revalidatePublic();
  return { ok: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/patient-forms/actions.ts
git commit -m "feat(admin/patient-forms): CRUD + reorder server actions"
```

### Task 5.4: Create the patient-forms admin list page

**Files:**
- Create: `app/admin/patient-forms/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listPatientForms } from '@/lib/supabase/queries';
import { FormRow } from './form-row';

export const metadata = {
  title: 'Patient Forms',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PatientFormsAdminPage() {
  const forms = await listPatientForms();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Patient Forms</h1>
        <Link
          href="/admin/patient-forms/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Upload new
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-12 text-stone-500 text-sm text-center">
          No forms yet. Click "Upload new" to add the first PDF.
        </div>
      ) : (
        <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
          {forms.map((f, idx) => (
            <FormRow
              key={f.id}
              form={f}
              isFirst={idx === 0}
              isLast={idx === forms.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/patient-forms/page.tsx
git commit -m "feat(admin/patient-forms): list page with reorder + upload CTA"
```

### Task 5.5: Create the FormRow client component

**Files:**
- Create: `app/admin/patient-forms/form-row.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/patient-forms/form-row.tsx
git commit -m "feat(admin/patient-forms): list row with up/down reorder controls"
```

### Task 5.6: Create the form editor (shared new + edit)

**Files:**
- Create: `app/admin/patient-forms/form-editor.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { PatientForm } from '@/lib/supabase/queries';
import { createPatientForm, updatePatientForm, deletePatientForm, type FormActionResult } from './actions';

export function PatientFormEditor({ form }: { form?: PatientForm }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<FormActionResult | null>(null);

  async function handleDelete() {
    if (!form) return;
    if (!confirm('Delete this form permanently?')) return;
    setPending(true);
    await deletePatientForm(form.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-12">
      <Link
        href="/admin/patient-forms"
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Patient Forms
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10">
        {form ? 'Edit form' : 'Upload new form'}
      </h1>

      <form
        action={async (formData) => {
          setPending(true);
          setResult(null);
          const r = form
            ? await updatePatientForm(form.id, formData)
            : await createPatientForm(formData);
          setPending(false);
          if (r && !r.ok) setResult(r);
        }}
        encType="multipart/form-data"
        className="space-y-6"
      >
        <Field label="Label" id="label" required>
          <input
            id="label" name="label" type="text" required maxLength={120}
            defaultValue={form?.label}
            placeholder="Dental Patient Forms"
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors"
          />
        </Field>
        <Field label="Description (optional)" id="description">
          <textarea
            id="description" name="description" rows={2} maxLength={500}
            defaultValue={form?.description ?? ''}
            placeholder="For new patients, or to update medical history."
            className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors resize-y"
          />
        </Field>
        <Field label={form ? 'Replace PDF (optional)' : 'PDF file'} id="file" required={!form}>
          <input
            id="file" name="file" type="file" accept="application/pdf"
            required={!form}
            className="block w-full text-sm text-stone-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-stone-900 file:text-stone-50 hover:file:bg-stone-700"
          />
          <p className="mt-1 text-xs text-stone-500">PDF only, max 10 MB.</p>
          {form && (
            <p className="mt-2 text-xs text-stone-600">
              Current file: <span className="font-mono">{form.filePath}</span>
            </p>
          )}
        </Field>
        <fieldset className="flex items-center gap-4 pt-4 border-t border-stone-200">
          <legend className="sr-only">Visibility</legend>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="active" value="true"
              defaultChecked={form?.active !== false} className="accent-stone-900" />
            <span className="text-sm font-medium">Live</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="active" value="false"
              defaultChecked={form?.active === false} className="accent-stone-900" />
            <span className="text-sm">Hidden</span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3">
          {form && (
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
            {pending ? 'Saving…' : form ? 'Save changes' : 'Upload form'}
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
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/patient-forms/form-editor.tsx
git commit -m "feat(admin/patient-forms): shared new/edit form with PDF upload"
```

### Task 5.7: Create new + edit routes

**Files:**
- Create: `app/admin/patient-forms/new/page.tsx`
- Create: `app/admin/patient-forms/[id]/page.tsx`

- [ ] **Step 1: Write the new page**

```tsx
import { PatientFormEditor } from '../form-editor';

export const metadata = {
  title: 'Upload patient form',
  robots: { index: false, follow: false },
};

export default function NewPatientFormPage() {
  return <PatientFormEditor />;
}
```

- [ ] **Step 2: Write the edit page**

```tsx
import { notFound } from 'next/navigation';
import { getPatientForm } from '@/lib/supabase/queries';
import { PatientFormEditor } from '../form-editor';

export const metadata = {
  title: 'Edit patient form',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditPatientFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getPatientForm(id);
  if (!form) notFound();
  return <PatientFormEditor form={form} />;
}
```

- [ ] **Step 3: Verify the upload flow**

Visit `http://localhost:59159/admin/patient-forms/new`. Upload a small PDF (you can save the actual `DrBrienHsu-DentalForms-2019protected.pdf` locally from the original dentisthsu.com URL or use any small PDF for testing). Form persists; redirect to the edit page; PDF reachable via the public URL printed there.

- [ ] **Step 4: Commit**

```bash
git add app/admin/patient-forms/new/page.tsx app/admin/patient-forms/[id]/page.tsx
git commit -m "feat(admin/patient-forms): new + edit route shells"
```

### Task 5.8: Create the public `/patient-forms` page

**Files:**
- Create: `app/(marketing)/patient-forms/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import Link from 'next/link';
import { FileText, Download } from 'lucide-react';
import { listPatientForms } from '@/lib/supabase/queries';
import { publicUrlFor } from '@/lib/supabase/storage';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Patient Forms',
  description: `Download patient forms for ${practiceInfo.brandName}. Print, fill out, and bring to your visit.`,
};

export const revalidate = 60;

function formatBytes(n: number | null): string {
  if (!n) return '';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default async function PatientFormsPage() {
  const forms = await listPatientForms({ activeOnly: true });
  const cards = await Promise.all(
    forms.map(async (f) => ({
      ...f,
      url: await publicUrlFor('patient-forms', f.filePath),
    })),
  );

  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Before your visit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95]">
            Patient{' '}
            <span className="italic font-light">forms.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-700 text-lg leading-relaxed">
            Download, print, fill out, and bring to your appointment. Or fill
            them in on screen and bring the printed copy. If you'd rather not
            print, we'll have them ready for you in the office.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-8 py-16 md:py-24">
        {cards.length === 0 ? (
          <p className="text-stone-600 text-lg">
            Forms aren't available online right now. Please call us at{' '}
            <a href={`tel:${practiceInfo.phones[0]?.tel}`} className="underline">
              {practiceInfo.phones[0]?.number}
            </a>{' '}
            and we'll send them to you directly.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {cards.map((f) => (
              <li key={f.id} className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <FileText className="h-8 w-8 text-stone-400 shrink-0 mt-1" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-2xl text-stone-900 mb-2">{f.label}</h2>
                    {f.description && (
                      <p className="text-stone-600 text-sm leading-relaxed mb-4">{f.description}</p>
                    )}
                    <p className="text-xs text-stone-500 font-mono mb-5">
                      PDF · {formatBytes(f.fileSizeBytes)}
                    </p>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-5 py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 text-stone-600 text-sm">
          Trouble downloading?{' '}
          <Link href="/contact" className="underline hover:text-stone-900">
            Call or email us
          </Link>{' '}
          and we'll send them another way.
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify the public page**

Visit `http://localhost:59159/patient-forms`. If you uploaded a form in Task 5.7, it appears here. Click Download — opens the PDF. If no forms uploaded yet, the empty state with phone fallback shows.

- [ ] **Step 3: Add the route to the sitemap**

Open `app/sitemap.ts` and add `/patient-forms` to the static URL list. (Format: append `'/patient-forms'` next to existing routes like `/contact`.)

- [ ] **Step 4: Commit**

```bash
git add app/(marketing)/patient-forms/page.tsx app/sitemap.ts
git commit -m "feat(marketing): /patient-forms public page + sitemap entry"
```

### Task 5.9: Add Patient Forms to footer

**Files:**
- Modify: `components/site-footer.tsx`

- [ ] **Step 1: Add a link in the bottom nav row**

In `components/site-footer.tsx`, find the `<nav className="flex gap-5">` near the bottom and add as the third item (after Blog, before Financing):

```tsx
<Link
  href="/patient-forms"
  className="hover:text-[var(--color-accent-200)] transition-colors"
>
  Patient Forms
</Link>
```

- [ ] **Step 2: Verify**

Visit `/` and scroll to the footer; "Patient Forms" link is present.

- [ ] **Step 3: Commit**

```bash
git add components/site-footer.tsx
git commit -m "feat(footer): Patient Forms link in bottom nav row"
```

### Task 5.10: Add Patient Forms to mobile drawer

**Files:**
- Modify: `components/site-header.tsx`

- [ ] **Step 1: Append a mobile-drawer-only nav entry**

The desktop nav `NAV_ITEMS` array is shared between desktop and mobile. We want Patient Forms in mobile drawer ONLY (per spec §1a). The cleanest path: add a separate `MOBILE_EXTRA_ITEMS` constant and append it to the mobile drawer.

In `components/site-header.tsx`, near the top:

```tsx
const NAV_ITEMS = [
  { href: '/doctors', label: 'Doctors' },
  { href: '/technology', label: 'Technology' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const MOBILE_EXTRA_ITEMS = [
  { href: '/patient-forms', label: 'Patient Forms' },
];
```

Then in the mobile drawer's nav block, replace:

```tsx
{NAV_ITEMS.map((item) => { ... })}
```

with:

```tsx
{[...NAV_ITEMS, ...MOBILE_EXTRA_ITEMS].map((item) => { ... })}
```

- [ ] **Step 2: Verify**

Open `http://localhost:59159/` on a narrow viewport (resize browser). Tap hamburger; Patient Forms appears in the drawer. Resize to desktop; Patient Forms does NOT appear in the desktop nav.

- [ ] **Step 3: Commit**

```bash
git add components/site-header.tsx
git commit -m "feat(header): Patient Forms in mobile drawer only (per spec §1a)"
```

### Task 5.11: Add Patient Forms card to /contact

**Files:**
- Modify: `app/(marketing)/contact/page.tsx`

- [ ] **Step 1: Insert a card section**

Insert this section just before the closing `</>` of `ContactPage`'s JSX, after the existing three-column grid section:

```tsx
<section className="border-t border-stone-200 bg-stone-100/40">
  <div className="mx-auto max-w-7xl px-5 md:px-8 py-12 md:py-16">
    <div className="md:flex md:items-center md:justify-between gap-8 rounded-2xl border border-stone-200 bg-white p-6 md:p-10">
      <div className="md:max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">
          Before your visit
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3">
          Patient forms
        </h2>
        <p className="text-stone-600 leading-relaxed">
          Save time at the front desk. Download our dental and medical patient
          forms — fill them out at home and bring them to your appointment.
        </p>
      </div>
      <Link
        href="/patient-forms"
        className="mt-6 md:mt-0 inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-5 py-3 text-sm font-medium hover:bg-stone-700 transition-colors shrink-0"
      >
        Open patient forms →
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Visit `/contact`. Scroll past the three info columns; the new card appears with the CTA linking to `/patient-forms`.

- [ ] **Step 3: Commit**

```bash
git add app/(marketing)/contact/page.tsx
git commit -m "feat(contact): patient-forms call-out card (desktop discoverability)"
```

### Task 5.12: Surface forms on request-appointment success state

**Files:**
- Modify: `app/(marketing)/request-appointment/appointment-form.tsx`

- [ ] **Step 1: Add link to the success state**

In `app/(marketing)/request-appointment/appointment-form.tsx`, find the `result?.ok` success block and replace it with:

```tsx
if (result?.ok) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-10 text-center">
      <CheckCircle2 className="h-12 w-12 mx-auto text-stone-900 mb-6" aria-hidden="true" />
      <h2 className="font-serif text-3xl text-stone-900 mb-3">Request received.</h2>
      <p className="text-stone-600 max-w-md mx-auto mb-8">
        We'll call you back the same business day. If it's outside of office
        hours, we'll reach out first thing in the morning.
      </p>
      <div className="pt-6 border-t border-stone-200 max-w-md mx-auto">
        <p className="text-sm text-stone-600 mb-3">
          Before your visit, you can fill out paperwork in advance:
        </p>
        <a
          href="/patient-forms"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 underline underline-offset-4 hover:text-stone-700"
        >
          Open patient forms →
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Submit a test request at `/request-appointment`. Success state shows the new "Open patient forms →" link.

- [ ] **Step 3: Commit**

```bash
git add app/(marketing)/request-appointment/appointment-form.tsx
git commit -m "feat(request-appointment): surface /patient-forms link in success state"
```

**Stage 5 ship checkpoint reached.** Patient Forms feature is end-to-end: admin upload + edit + reorder + visibility toggle; public page lists active forms with download cards; nav surfaces (footer, mobile drawer, contact card, request-appointment success state) all link in.

---

## Stage 6 — Doctor CMS

**Ship checkpoint:** `/admin/doctors` allows full CRUD on doctor rows; portrait uploads work with focal-point selection; the 5 seed doctors retain their existing data on the public site; the home page + `/doctors` + `/doctors/[slug]` all read from Supabase.

### Task 6.1: Run seed-doctors

- [ ] **Step 1: Confirm prerequisites**

Run: `pnpm typecheck` — passes.

- [ ] **Step 2: Run the seed script**

Run: `pnpm tsx scripts/seed-doctors.ts`

Expected output: `Seeded 5 doctors.`

- [ ] **Step 3: Verify via MCP / SQL**

```sql
select slug, name, is_lead, display_order from doctors order by display_order;
```

Expected: 5 rows; `dr-brien-hsu` has `is_lead = true`; orders 0–4.

No commit — execution only.

### Task 6.2: Apply the blog_posts → doctors foreign key

**Files:**
- Create: `supabase/migrations/2026-05-19_create_blog_posts_doctor_fkey.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 2026-05-19 — blog_posts.author_doctor_slug FK → doctors.slug
-- Run AFTER scripts/seed-doctors.ts has populated doctors.

alter table public.blog_posts
  add constraint blog_posts_author_doctor_slug_fkey
  foreign key (author_doctor_slug) references public.doctors(slug)
  on delete set null on update cascade;
```

- [ ] **Step 2: Apply via Supabase MCP**

Name: `2026-05-19_create_blog_posts_doctor_fkey`.

If this fails with a constraint-violation error: confirm via `select distinct author_doctor_slug from blog_posts;` that all referenced slugs exist in `doctors`. Fix or null them out, then retry.

- [ ] **Step 3: Verify**

Try `update blog_posts set author_doctor_slug = 'no-such-doctor' where id = (select id from blog_posts limit 1);` — should error with FK violation. Then revert (no UPDATE actually happens).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/2026-05-19_create_blog_posts_doctor_fkey.sql
git commit -m "feat(db): blog_posts.author_doctor_slug → doctors.slug FK (ON DELETE SET NULL)"
```

### Task 6.3: Add doctor queries

**Files:**
- Modify: `lib/supabase/queries.ts`

- [ ] **Step 1: Append helpers**

Append to `lib/supabase/queries.ts`:

```ts
import type { Doctor, Image } from '@/content/schemas';
import { publicUrlFor } from './storage';

async function rowToDoctor(row: any): Promise<Doctor> {
  let portrait: Image;
  if (row.portrait_path) {
    const src = await publicUrlFor('doctor-portraits', row.portrait_path);
    portrait = {
      src,
      alt: row.portrait_alt ?? row.name,
      objectPosition: row.portrait_object_position ?? 'center center',
    };
  } else {
    // Fall back to the seed file's bundled portrait (public/images/doctors/…).
    portrait = {
      src: `/images/doctors/${row.slug}.webp`,
      alt: row.portrait_alt ?? row.name,
      objectPosition: row.portrait_object_position ?? 'center center',
    };
  }
  return {
    slug: row.slug,
    name: row.name,
    title: row.title,
    portrait,
    short: row.short,
    bio: row.bio,
    specialties: row.specialties ?? [],
    joinedYear: row.joined_year,
    isLead: row.is_lead,
  };
}

export async function listDoctors(opts: { activeOnly?: boolean } = { activeOnly: true }): Promise<Doctor[]> {
  const supabase = await createClient();
  let q = supabase
    .from('doctors')
    .select('*')
    .order('display_order', { ascending: true });
  if (opts.activeOnly !== false) q = q.eq('active', true);
  const { data } = await q;
  if (!data) return [];
  return Promise.all(data.map(rowToDoctor));
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('doctors').select('*').eq('slug', slug).maybeSingle();
  return data ? rowToDoctor(data) : null;
}

/**
 * Admin variant — includes the raw row fields not exposed in the public
 * Doctor type (display_order, active, raw portrait_path).
 */
export interface DoctorRow extends Doctor {
  id: string;
  displayOrder: number;
  active: boolean;
  portraitPath: string | null;
}

export async function listDoctorRows(): Promise<DoctorRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('doctors').select('*').order('display_order', { ascending: true });
  if (!data) return [];
  const docs = await Promise.all(data.map(async (row) => {
    const d = await rowToDoctor(row);
    return {
      ...d,
      id: row.id,
      displayOrder: row.display_order,
      active: row.active,
      portraitPath: row.portrait_path,
    };
  }));
  return docs;
}

export async function getDoctorRow(slug: string): Promise<DoctorRow | null> {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from('doctors').select('*').eq('slug', slug).maybeSingle();
  if (!row) return null;
  const d = await rowToDoctor(row);
  return {
    ...d,
    id: row.id,
    displayOrder: row.display_order,
    active: row.active,
    portraitPath: row.portrait_path,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/queries.ts
git commit -m "feat(supabase): doctor query layer (listDoctors, getDoctorBySlug, admin variants)"
```

### Task 6.4: Add a smoke test for `getDoctorBySlug`

**Files:**
- Create: `lib/__tests__/getDoctor.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test, vi } from 'vitest';

// Minimal smoke test — mocks the underlying Supabase client to ensure
// the row→Doctor mapping shape is correct. Full integration coverage
// happens via manual click-through of /doctors/<slug>.

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              slug: 'dr-brien-hsu',
              name: 'Dr. Brien Hsu',
              title: 'DDS, MS · Lead Clinician',
              portrait_path: null,
              portrait_alt: 'Dr. Brien Hsu',
              portrait_object_position: '30% center',
              short: 'Lead clinician since 1999.',
              bio: 'Long-form bio…',
              specialties: ['Orofacial pain', 'TMJ'],
              joined_year: 1999,
              is_lead: true,
              display_order: 0,
              active: true,
            },
            error: null,
          }),
        }),
      }),
      storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    }),
    storage: {
      from: () => ({ getPublicUrl: () => ({ data: { publicUrl: '' } }) }),
    },
  }),
}));

describe('getDoctorBySlug', () => {
  test('maps DB row to Doctor shape', async () => {
    const { getDoctorBySlug } = await import('../supabase/queries');
    const d = await getDoctorBySlug('dr-brien-hsu');
    expect(d).not.toBeNull();
    expect(d?.name).toBe('Dr. Brien Hsu');
    expect(d?.specialties).toContain('TMJ');
    expect(d?.isLead).toBe(true);
    expect(d?.portrait.alt).toBe('Dr. Brien Hsu');
    expect(d?.portrait.objectPosition).toBe('30% center');
  });
});
```

- [ ] **Step 2: Run the test**

Run: `pnpm vitest run lib/__tests__/getDoctor.test.ts`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/__tests__/getDoctor.test.ts
git commit -m "test(lib): smoke test for getDoctorBySlug row→Doctor mapping"
```

### Task 6.5: Switch the public doctor pages to read from Supabase

**Files:**
- Modify: `app/(marketing)/doctors/page.tsx`
- Modify: `app/(marketing)/doctors/[slug]/page.tsx`

- [ ] **Step 1: Edit the doctor index**

In `app/(marketing)/doctors/page.tsx`, replace:

```tsx
import { doctors } from '@/content/doctors';
```

with:

```tsx
import { listDoctors } from '@/lib/supabase/queries';
```

Change the component signature to async and fetch doctors at the top:

```tsx
export const revalidate = 60;

export default async function DoctorsPage() {
  const doctors = await listDoctors();
  // ... rest unchanged
```

Also dynamically derive the count in the heading. Replace:

```tsx
<h1 className="font-serif text-[clamp(3rem,9vw,8rem)] tracking-tighter text-stone-900 leading-[0.92] font-light">
  Five doctors,
  <br />
  <span className="italic">one office.</span>
</h1>
```

with:

```tsx
<h1 className="font-serif text-[clamp(3rem,9vw,8rem)] tracking-tighter text-stone-900 leading-[0.92] font-light">
  {numberWord(doctors.length)} doctors,
  <br />
  <span className="italic">one office.</span>
</h1>
```

Add helper at the bottom of the file (outside the component):

```tsx
function numberWord(n: number): string {
  const words: Record<number, string> = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  };
  return words[n] ?? String(n);
}
```

- [ ] **Step 2: Edit the doctor detail page**

In `app/(marketing)/doctors/[slug]/page.tsx`:

1. Replace the imports:

```tsx
import { getDoctorBySlug, listDoctors } from '@/lib/supabase/queries';
import ReactMarkdown from 'react-markdown';
```

2. Replace `generateStaticParams` with:

```tsx
export async function generateStaticParams() {
  const doctors = await listDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export const revalidate = 60;
export const dynamicParams = true;
```

3. Replace `const doctor = getDoctor(slug);` with `const doctor = await getDoctorBySlug(slug);`.

4. Replace the bio rendering block:

```tsx
<div className="space-y-6 text-stone-700 text-lg leading-[1.75] whitespace-pre-line">
  {doctor.bio}
</div>
```

with:

```tsx
<div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-[1.75]">
  <ReactMarkdown>{doctor.bio}</ReactMarkdown>
</div>
```

- [ ] **Step 3: Verify**

Visit `http://localhost:59159/doctors`. All 5 doctors render with portraits, names, titles. Heading reads "Five doctors, one office." Click each portrait — detail page renders the seed bio in markdown prose.

- [ ] **Step 4: Commit**

```bash
git add app/(marketing)/doctors/page.tsx app/(marketing)/doctors/[slug]/page.tsx
git commit -m "feat(marketing/doctors): switch to Supabase queries + ReactMarkdown bios"
```

### Task 6.6: Switch the home page doctor strip to Supabase

**Files:**
- Modify: `app/(marketing)/page.tsx`

- [ ] **Step 1: Replace the doctors import**

In `app/(marketing)/page.tsx`:

1. Replace:

```tsx
import { doctors } from '@/content/doctors';
```

with:

```tsx
import { listDoctors } from '@/lib/supabase/queries';
```

2. Make the `HomePage` function `async` and fetch:

```tsx
export const revalidate = 60;

export default async function HomePage() {
  const doctors = await listDoctors();
  const main = practiceInfo.phones[0]!;
  // ... rest unchanged
```

3. If the heading reads "Five doctors, one office.", change it to:

```tsx
<h2 className="font-serif text-4xl md:text-6xl tracking-tighter text-stone-900">
  {doctors.length === 5 ? 'Five' : doctors.length} doctors,{' '}
  <span className="italic font-light">one office.</span>
</h2>
```

(Or use the same `numberWord()` helper from Task 6.5; copy it inline here too.)

- [ ] **Step 2: Verify**

Open `/`. Home page still renders. Doctor strip shows the 5 real portraits.

- [ ] **Step 3: Commit**

```bash
git add app/(marketing)/page.tsx
git commit -m "feat(home): doctor strip reads from Supabase"
```

### Task 6.7: Update the blog post editor author dropdown

**Files:**
- Modify: `app/admin/posts/post-editor.tsx`
- Modify: `app/admin/posts/new/page.tsx`
- Modify: `app/admin/posts/[id]/page.tsx`

- [ ] **Step 1: Lift doctors fetch to the server pages**

The post-editor currently imports `doctors` directly from `content/doctors.ts`. Switch to server-fetched, pass via props.

In `app/admin/posts/post-editor.tsx`:

1. Replace the `import { doctors } from '@/content/doctors';` with nothing (delete it).

2. Update the props interface:

```tsx
interface PostEditorProps {
  post?: BlogPost;
  doctors: Array<{ slug: string; name: string }>;
}
```

3. Change the function signature: `export function PostEditor({ post, doctors }: PostEditorProps) { ... }`.

In `app/admin/posts/new/page.tsx`:

```tsx
import { PostEditor } from '../post-editor';
import { listDoctors } from '@/lib/supabase/queries';

export const metadata = {
  title: 'New post',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const doctors = await listDoctors();
  return <PostEditor doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))} />;
}
```

In `app/admin/posts/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/supabase/queries';
import { listDoctors } from '@/lib/supabase/queries';
import { PostEditor } from '../post-editor';

export const metadata = {
  title: 'Edit post',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, doctors] = await Promise.all([getPost(id), listDoctors()]);
  if (!post) notFound();
  return <PostEditor post={post} doctors={doctors.map((d) => ({ slug: d.slug, name: d.name }))} />;
}
```

- [ ] **Step 2: Verify**

Visit `/admin/posts/new` — author dropdown still works. Visit an existing post — dropdown populated, defaults to that post's author slug.

- [ ] **Step 3: Commit**

```bash
git add app/admin/posts/post-editor.tsx app/admin/posts/new/page.tsx app/admin/posts/\[id\]/page.tsx
git commit -m "feat(admin/posts): author dropdown reads doctors from Supabase via server prop"
```

### Task 6.8: Drop the blog renderer's import of content/doctors

**Files:**
- Modify: `app/(marketing)/blog/[slug]/page.tsx`

- [ ] **Step 1: Switch to async getDoctorBySlug**

In `app/(marketing)/blog/[slug]/page.tsx`:

Replace `import { getDoctor } from '@/content/doctors';` with `import { getDoctorBySlug } from '@/lib/supabase/queries';`.

Replace `const author = getDoctor(post.authorDoctorSlug);` with `const author = await getDoctorBySlug(post.authorDoctorSlug);`.

- [ ] **Step 2: Verify**

Visit `/blog`, click any seeded post → renders with author byline (Dr. Brien Hsu).

- [ ] **Step 3: Commit**

```bash
git add app/(marketing)/blog/[slug]/page.tsx
git commit -m "feat(blog): author resolution uses Supabase getDoctorBySlug"
```

### Task 6.9: Build the portrait focal-point picker

**Files:**
- Create: `app/admin/_components/portrait-focal-picker.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useRef, useState } from 'react';

interface PortraitFocalPickerProps {
  imageSrc: string;
  value: string; // e.g. "30% center" or "30% 50%"
  onChange: (objectPosition: string) => void;
}

function parsePosition(v: string): { x: number; y: number } {
  // Supports "X% Y%", "X%", "Xpx Ypx" (we standardize on %).
  const tokens = v.trim().split(/\s+/);
  const parsePct = (s: string | undefined, fallback: number): number => {
    if (!s) return fallback;
    if (s === 'center') return 50;
    if (s.endsWith('%')) return Math.max(0, Math.min(100, Number(s.slice(0, -1))));
    return fallback;
  };
  return { x: parsePct(tokens[0], 50), y: parsePct(tokens[1], 50) };
}

export function PortraitFocalPicker({ imageSrc, value, onChange }: PortraitFocalPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => parsePosition(value));

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const clamped = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
    setPos(clamped);
    onChange(`${clamped.x}% ${clamped.y}%`);
  }

  function reset() {
    setPos({ x: 50, y: 50 });
    onChange('center center');
  }

  return (
    <div>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative aspect-[3/4] max-w-xs rounded-lg overflow-hidden cursor-crosshair border-2 border-stone-300 bg-stone-100"
      >
        <img
          src={imageSrc}
          alt="Portrait focal-point preview"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-stone-900/60 shadow-lg pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span className="font-mono">{`${pos.x}% ${pos.y}%`}</span>
        <button
          type="button"
          onClick={reset}
          className="text-stone-700 hover:text-stone-900 underline underline-offset-2"
        >
          Reset to center
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/_components/portrait-focal-picker.tsx
git commit -m "feat(admin): portrait focal-point picker (click-to-set + reset)"
```

### Task 6.10: Doctor server actions

**Files:**
- Create: `app/admin/doctors/actions.ts`

- [ ] **Step 1: Write the actions**

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { uploadToBucket, deleteFromBucket } from '@/lib/supabase/storage';

export interface DoctorActionResult {
  ok: boolean;
  error?: string;
  slug?: string;
}

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const inputSchema = z.object({
  slug: z.string().min(1).max(120).regex(slugRe, 'Slug must be lowercase + hyphens.'),
  name: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  short: z.string().min(1).max(800),
  bio: z.string().min(1).max(20000),
  specialties: z.string().optional(),
  joinedYear: z.coerce.number().int().min(1900).max(2100),
  isLead: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  portraitAlt: z.string().max(300).optional(),
  portraitObjectPosition: z.string().max(40).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true'),
});

function parseSpecialties(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function revalidateAll(slug: string) {
  revalidateTag('doctors');
  revalidatePath('/doctors');
  revalidatePath(`/doctors/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin/doctors');
  revalidatePath(`/admin/doctors/${slug}`);
}

export async function createDoctor(formData: FormData): Promise<DoctorActionResult> {
  const parsed = inputSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    title: formData.get('title'),
    short: formData.get('short'),
    bio: formData.get('bio'),
    specialties: formData.get('specialties') ?? '',
    joinedYear: formData.get('joinedYear'),
    isLead: formData.get('isLead') ?? 'false',
    portraitAlt: formData.get('portraitAlt') ?? '',
    portraitObjectPosition: formData.get('portraitObjectPosition') ?? 'center center',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  let portraitPath: string | null = null;
  const file = formData.get('portrait');
  if (file instanceof File && file.size > 0) {
    const upload = await uploadToBucket('doctor-portraits', file, parsed.data.slug);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    portraitPath = upload.path;
  }

  const { data: maxRow } = await supabase.from('doctors')
    .select('display_order').order('display_order', { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  // Lead exclusivity: clear other rows first in a single Server Action call.
  if (parsed.data.isLead) {
    await supabase.from('doctors').update({ is_lead: false }).eq('is_lead', true);
  }

  const { error } = await supabase.from('doctors').insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    title: parsed.data.title,
    short: parsed.data.short,
    bio: parsed.data.bio,
    specialties: parseSpecialties(parsed.data.specialties),
    joined_year: parsed.data.joinedYear,
    is_lead: parsed.data.isLead ?? false,
    portrait_path: portraitPath,
    portrait_alt: parsed.data.portraitAlt ?? parsed.data.name,
    portrait_object_position: parsed.data.portraitObjectPosition ?? 'center center',
    display_order: nextOrder,
    active: parsed.data.active,
  });
  if (error) return { ok: false, error: error.message };

  revalidateAll(parsed.data.slug);
  redirect(`/admin/doctors/${parsed.data.slug}`);
}

export async function updateDoctor(
  slug: string, formData: FormData,
): Promise<DoctorActionResult> {
  const parsed = inputSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    title: formData.get('title'),
    short: formData.get('short'),
    bio: formData.get('bio'),
    specialties: formData.get('specialties') ?? '',
    joinedYear: formData.get('joinedYear'),
    isLead: formData.get('isLead') ?? 'false',
    portraitAlt: formData.get('portraitAlt') ?? '',
    portraitObjectPosition: formData.get('portraitObjectPosition') ?? 'center center',
    active: formData.get('active') ?? 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('doctors').select('portrait_path').eq('slug', slug).maybeSingle();

  const updates: Record<string, unknown> = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    title: parsed.data.title,
    short: parsed.data.short,
    bio: parsed.data.bio,
    specialties: parseSpecialties(parsed.data.specialties),
    joined_year: parsed.data.joinedYear,
    is_lead: parsed.data.isLead ?? false,
    portrait_alt: parsed.data.portraitAlt ?? parsed.data.name,
    portrait_object_position: parsed.data.portraitObjectPosition ?? 'center center',
    active: parsed.data.active,
  };

  const file = formData.get('portrait');
  if (file instanceof File && file.size > 0) {
    const upload = await uploadToBucket('doctor-portraits', file, parsed.data.slug);
    if (!upload.ok || !upload.path) return { ok: false, error: upload.error ?? 'Upload failed.' };
    updates.portrait_path = upload.path;
    if (existing?.portrait_path && existing.portrait_path !== upload.path) {
      await deleteFromBucket('doctor-portraits', existing.portrait_path);
    }
  }

  if (parsed.data.isLead) {
    await supabase.from('doctors').update({ is_lead: false })
      .eq('is_lead', true).neq('slug', slug);
  }

  const { error } = await supabase.from('doctors').update(updates).eq('slug', slug);
  if (error) return { ok: false, error: error.message };

  revalidateAll(parsed.data.slug);
  return { ok: true, slug: parsed.data.slug };
}

export async function deleteDoctor(slug: string): Promise<DoctorActionResult> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('doctors').select('portrait_path, is_lead').eq('slug', slug).maybeSingle();
  if (existing?.is_lead) {
    return { ok: false, error: 'Cannot delete the lead clinician. Set a new lead first.' };
  }
  // If any blog posts reference this slug, fail loud so we don't silently null out authors.
  const { count: postCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_doctor_slug', slug);
  if ((postCount ?? 0) > 0) {
    return {
      ok: false,
      error: `${postCount} blog post(s) reference this doctor as author. Deactivate instead, or reassign the posts first.`,
    };
  }
  const { error } = await supabase.from('doctors').delete().eq('slug', slug);
  if (error) return { ok: false, error: error.message };
  if (existing?.portrait_path) {
    await deleteFromBucket('doctor-portraits', existing.portrait_path);
  }
  revalidateAll(slug);
  redirect('/admin/doctors');
}

export async function reorderDoctor(
  slug: string, direction: 'up' | 'down',
): Promise<DoctorActionResult> {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('doctors').select('id, display_order, slug').eq('slug', slug).maybeSingle();
  if (!current) return { ok: false, error: 'Doctor not found.' };

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const order = direction === 'up' ? 'desc' : 'asc';
  const { data: neighbor } = await supabase
    .from('doctors')
    .select('id, display_order')
    .filter('display_order', cmp, current.display_order)
    .order('display_order', { ascending: order === 'asc' })
    .limit(1).maybeSingle();
  if (!neighbor) return { ok: true };

  await supabase.from('doctors')
    .update({ display_order: neighbor.display_order }).eq('id', current.id);
  await supabase.from('doctors')
    .update({ display_order: current.display_order }).eq('id', neighbor.id);

  revalidateAll(current.slug);
  return { ok: true };
}

export async function setLead(slug: string): Promise<DoctorActionResult> {
  const supabase = await createClient();
  await supabase.from('doctors').update({ is_lead: false }).eq('is_lead', true);
  const { error } = await supabase.from('doctors').update({ is_lead: true }).eq('slug', slug);
  if (error) return { ok: false, error: error.message };
  revalidateAll(slug);
  return { ok: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/doctors/actions.ts
git commit -m "feat(admin/doctors): CRUD + reorder + setLead + portrait upload actions"
```

### Task 6.11: Create the doctor editor (shared new + edit)

**Files:**
- Create: `app/admin/doctors/doctor-editor.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client';

import { useState } from 'react';
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
      <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10">
        {doctor ? doctor.name : 'New doctor'}
      </h1>

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
        encType="multipart/form-data"
        className="space-y-8"
      >
        <input type="hidden" name="bio" value={bio} />
        <input type="hidden" name="portraitObjectPosition" value={objectPosition} />

        <div className="grid md:grid-cols-2 gap-8">
          <Field label="Name" id="name" required>
            <input id="name" name="name" type="text" required maxLength={120}
              defaultValue={doctor?.name}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-serif" />
          </Field>
          <Field label="Slug" id="slug" required>
            <input id="slug" name="slug" type="text" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              defaultValue={doctor?.slug}
              className="w-full rounded-lg border-2 border-stone-300 px-4 py-3 text-base bg-white focus:border-stone-900 focus:outline-none transition-colors font-mono" />
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

        <fieldset className="flex items-center gap-6 pt-6 border-t border-stone-200">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isLead" value="true"
              defaultChecked={doctor?.isLead ?? false}
              className="accent-stone-900" />
            <span className="text-sm font-medium">Lead clinician</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" value="true"
              defaultChecked={doctor?.active !== false}
              className="accent-stone-900" />
            <span className="text-sm">Visible on site</span>
          </label>
          <input type="hidden" name="active" value="false" />
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
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/doctors/doctor-editor.tsx
git commit -m "feat(admin/doctors): editor with WYSIWYG bio + portrait upload + focal picker"
```

### Task 6.12: Create doctor list + new + edit pages

**Files:**
- Create: `app/admin/doctors/page.tsx`
- Create: `app/admin/doctors/new/page.tsx`
- Create: `app/admin/doctors/[slug]/page.tsx`
- Create: `app/admin/doctors/doctor-row.tsx`

- [ ] **Step 1: Write the list page**

```tsx
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listDoctorRows } from '@/lib/supabase/queries';
import { DoctorRowItem } from './doctor-row';

export const metadata = {
  title: 'Doctors',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DoctorsAdminPage() {
  const doctors = await listDoctorRows();

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900">Doctors</h1>
        <Link
          href="/admin/doctors/new"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-4 py-2 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add doctor
        </Link>
      </div>

      <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
        {doctors.map((d, idx) => (
          <DoctorRowItem
            key={d.id}
            doctor={d}
            isFirst={idx === 0}
            isLast={idx === doctors.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Write the row component**

```tsx
'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import type { DoctorRow } from '@/lib/supabase/queries';
import { reorderDoctor, setLead } from './actions';
import { cn } from '@/lib/cn';

export function DoctorRowItem({ doctor, isFirst, isLast }: {
  doctor: DoctorRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function move(direction: 'up' | 'down') {
    startTransition(async () => { await reorderDoctor(doctor.slug, direction); });
  }
  function promote() {
    if (doctor.isLead) return;
    startTransition(async () => { await setLead(doctor.slug); });
  }

  return (
    <li className="px-5 py-4 flex items-center gap-4">
      <div className="flex flex-col gap-0.5 shrink-0">
        <button type="button" onClick={() => move('up')} disabled={pending || isFirst}
          aria-label="Move up"
          className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30">
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => move('down')} disabled={pending || isLast}
          aria-label="Move down"
          className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-stone-100 disabled:opacity-30">
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <Link
        href={`/admin/doctors/${doctor.slug}`}
        className="flex-1 flex items-center gap-4 group min-w-0"
      >
        {/* Inline portrait thumbnail */}
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-stone-200 shrink-0">
          <img
            src={doctor.portrait.src}
            alt={doctor.portrait.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: doctor.portrait.objectPosition ?? 'center' }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-900 group-hover:underline underline-offset-4 truncate">
            {doctor.name}
          </p>
          <p className="text-sm text-stone-500 truncate">{doctor.title}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={promote}
        disabled={pending || doctor.isLead}
        title={doctor.isLead ? 'Already lead' : 'Promote to lead'}
        className={cn(
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
          doctor.isLead
            ? 'border-stone-900 bg-stone-900 text-stone-50'
            : 'border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50',
        )}
      >
        <Star className="h-3 w-3" /> {doctor.isLead ? 'Lead' : 'Promote'}
      </button>
      <span className={cn(
        'shrink-0 text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full',
        doctor.active ? 'bg-stone-200 text-stone-700' : 'bg-red-100 text-red-700',
      )}>
        {doctor.active ? 'Visible' : 'Hidden'}
      </span>
    </li>
  );
}
```

- [ ] **Step 3: Write the new + edit pages**

`app/admin/doctors/new/page.tsx`:

```tsx
import { DoctorEditor } from '../doctor-editor';

export const metadata = {
  title: 'New doctor',
  robots: { index: false, follow: false },
};

export default function NewDoctorPage() {
  return <DoctorEditor />;
}
```

`app/admin/doctors/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getDoctorRow } from '@/lib/supabase/queries';
import { DoctorEditor } from '../doctor-editor';

export const metadata = {
  title: 'Edit doctor',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorRow(slug);
  if (!doctor) notFound();
  return <DoctorEditor doctor={doctor} />;
}
```

- [ ] **Step 4: Verify the full flow**

Visit `http://localhost:59159/admin/doctors`. 5 rows, Dr. Hsu marked Lead. Click into Dr. Angela Huang → editor renders with all fields populated, bio shown in Tiptap. Make a trivial edit (e.g. add a space to bio); save; visit `/doctors/dr-angela-huang` → updated. Try reorder up/down; verify `/doctors` reflects.

Add a new test doctor: slug `test-doctor`, name "Test Doctor", upload any image, set lead = false. After save, visit `/doctors` → test doctor appears. Then delete via the editor.

- [ ] **Step 5: Commit**

```bash
git add app/admin/doctors/page.tsx app/admin/doctors/doctor-row.tsx app/admin/doctors/new/page.tsx app/admin/doctors/\[slug\]/page.tsx
git commit -m "feat(admin/doctors): list + reorder + promote + new + edit routes"
```

### Task 6.13: Final regression sweep

- [ ] **Step 1: Tests**

Run: `pnpm test`

Expected: all pass, including the new `getDoctor` smoke test.

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`

Expected: clean.

- [ ] **Step 3: Build**

Run: `pnpm build`

Expected: clean build.

- [ ] **Step 4: Public surface walkthrough**

Click through in the preview server:
- `/` — home renders, doctor strip shows 5 portraits
- `/doctors` — heading "Five doctors, one office.", 5 cards
- `/doctors/dr-brien-hsu` — cinematic header, markdown bio prose
- `/blog/<any seeded slug>` — renders with Dr. Hsu byline
- `/patient-forms` — uploaded forms (or empty state if none)
- `/contact` — patient-forms card visible
- `/request-appointment` — submit a test request → success state shows patient-forms link

- [ ] **Step 5: Admin walkthrough**

Sign in as owner:
- `/admin/dashboard` — recent inquiries + posts, "View all →" links
- `/admin/posts/<id>` — Tiptap editor, image upload works
- `/admin/inquiries` — filter chips, detail, status toggle, internal notes, CSV export
- `/admin/patient-forms` — list with reorder, new upload works
- `/admin/doctors` — list with reorder + promote
- `/admin/users` — only visible if you're an owner; invite flow works

**Stage 6 ship checkpoint reached.** Full feature delivery complete. All six PR scopes shipped; the public site is unchanged where it should be unchanged; the admin can now run the practice's content without engineering involvement.

---

## Decisions-log entry to append

After Stage 6 ships (or at the first stage if you're committing the design as one chunk), append this entry to [docs/superpowers/decisions.md](../decisions.md):

```markdown
## 2026-05-19 — Admin CMS scope expansion + multi-user auth + WYSIWYG editor

**Scope:** Admin/CMS surface area; P5 polish phase.

**Decision:** Extended the previously-locked "blog only" CMS scope ([decisions.md:18](decisions.md)) to also cover **patient forms**, the **appointment-request inbox**, and **doctor profiles**. Added **multi-user staff auth** with two roles (`owner`, `editor`) and an invite-only signup flow gated by a `staff_users` allowlist table. Replaced the plain Markdown textarea in the blog editor with a **Tiptap WYSIWYG editor** that round-trips to Markdown so the existing schema and renderer remain unchanged. Dropped the `/patient-forms → /contact` 301 redirect and restored `/patient-forms` as a real public page (discoverable via mobile drawer, footer, contact-page card, and the request-appointment success state — no desktop top-nav slot).

**Out of scope:** Online fillable patient forms; per-staff write restrictions; approval workflow; edit-history audit log; tables, code blocks, in-bio image upload in the editor; drag-and-drop reordering; blur-data-URL generation for admin-uploaded portraits.

**Reference:** [Design spec](specs/2026-05-19-admin-cms-expansion-design.md), [Implementation plan](../plans/2026-05-19-admin-cms-expansion.md)
```

---

## Self-review notes

Read these before starting Stage 1:

1. **Spec coverage:** Every section of the spec maps to at least one task. §4.1 doctors → Task 1.2 + Stage 6 tasks. §4.2 patient_forms → Task 1.3 + Stage 5. §4.3 staff_users → Task 1.4 + Stage 2. §4.4 internal_notes column → Task 1.5 + Task 4.1. §4.5 storage buckets → Task 1.6. §4.6 RLS — embedded in each create-table migration. §4.7 blog FK — Task 6.2. §5 routes — Stages 2 / 4 / 5 / 6 cover the new admin and public routes. §6 file structure — matches the structure declared at the top of this plan. §7 components — Task 1.10 (RichTextEditor) + Task 1.11 (AdminNav) + Task 6.9 (PortraitFocalPicker). §8 Server Actions — Task 2.7, 4.3, 5.3, 6.10. §9 middleware — Task 1.15 (restore) + Task 2.3 (membership + owner-guard). §10 env vars — Task 1.1. §11 migration sequencing — Stage 1 + 6.2 hold the order. §12 tests — Task 5.1 (redirects test adjustment) + Task 6.4 (smoke test). §13 decisions-log — drafted at the end of this plan. §15 acceptance criteria — Task 6.13 walkthrough covers all 12 criteria.

2. **Placeholder scan:** No "TBD" / "TODO" / "similar to Task N" / "add appropriate error handling" anywhere. Every code block is the actual implementation.

3. **Type consistency:** `Doctor`, `DoctorRow`, `BlogPost`, `AppointmentRequest`, `PatientForm`, `StaffUser`, `StaffRole`, `UploadBucket` — all defined in named tasks before any later task references them. `getDoctorBySlug` is consistent across Tasks 6.3, 6.4, 6.5, 6.8. `listDoctors` is consistent across Tasks 6.3, 6.5, 6.6, 6.7.

4. **Scope check:** The plan is large because the user explicitly scoped six independently-shippable features. Stages 2–6 do not share state and can be executed independently after Stage 1 — splitting into 6 plan files would add more navigation cost than it saves.

