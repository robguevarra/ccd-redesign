# Admin CMS Expansion — Patient Forms, Inquiry Inbox, Doctor CMS, Multi-User Auth, WYSIWYG Editor

**Date:** 2026-05-19
**Status:** Approved (brainstorm complete; awaiting user review of this spec)
**Phase:** P5 — admin/CMS surface area expansion
**Owner:** Rob Guevarra
**Predecessors:** [P2 spec §9 — Admin/CMS scope locked to blog-only](2026-05-05-dentisthsu-phase-2-ia-content-strategy.md); [admin-scope.md](../../ia/admin-scope.md); [decisions.md — "blog_posts only editable"](../decisions.md)

---

## 1. Why this exists

The locked P2 CMS scope was "blog only," with everything else (services, doctors, technology, reviews) deferred to v2 as code-versioned content. The dentist has since asked for three additional self-serve surfaces, and one foundational change the deferred scope did not anticipate:

1. **Patient Forms** — restore the page that existed at `dentisthsu.com/patient-forms/` (currently 301-redirected to `/contact`), and make the PDFs admin-uploadable so the practice can update them without engineering involvement.
2. **Inquiry Inbox** — turn the dashboard's read-only "latest 10 appointment requests" peek into a working inbox: filter, status workflow, internal notes, CSV export.
3. **Doctor pages CMS** — let the dentist add new doctors and edit existing ones (bio, portrait, focal point, specialties, order, lead-clinician flag) without a deploy.
4. **Multi-user staff auth** — five-doctor practice; single-account demo doesn't fit the v1 brief. Owner invites the rest of the staff via email.
5. **WYSIWYG editor** — non-technical doctors will not write Markdown. Replace the plain `<textarea>` in the blog editor with Tiptap, while keeping the Markdown column unchanged so the 5 seeded posts work without migration.

This spec expands the CMS to cover all three content surfaces, swaps the editor, and adds multi-user auth. It does not redesign existing admin UX — it extends it using the same patterns as the blog editor already shipped.

---

## 2. Decisions locked during brainstorming

| # | Decision | Choice |
|---|---|---|
| 1 | Patient Forms route | Restore `/patient-forms` as a real public page. Drop the `/patient-forms → /contact` 301 redirect. |
| 1a | Patient Forms nav placement | **No desktop top-nav slot** (existing nav already at 6-item density limit). Discoverability via: (i) mobile drawer, (ii) site footer, (iii) prominent card on `/contact`, (iv) post-submit confirmation on `/request-appointment`. |
| 2 | Patient Forms model | One row per PDF in a `patient_forms` table. PDFs in Supabase Storage. Admin uploads, reorders, deactivates. |
| 3 | Inquiry Inbox | Sortable list + detail view; status toggle (`new`/`contacted`/`closed`); internal notes field added to `appointment_requests`; CSV export route. Defer Kanban; defer email forwarding integration. |
| 4 | Doctor CMS storage model | **Supabase-only.** Public pages read from the `doctors` table. The existing TS file ([content/doctors.ts](../../../content/doctors.ts)) becomes the seed/fallback — its data is inserted once into Supabase via a one-shot script. The TS file stays on disk as typed reference. |
| 5 | Doctor portraits | Admin upload to Supabase Storage. Focal point selectable in the admin via a click-to-set picker over a 3:4 crop preview. |
| 6 | Doctor reorder | Up/down arrows on a `display_order` integer column. Defer drag-and-drop. |
| 7 | Blur-data-URL on admin-uploaded portraits | **Out.** Use a neutral gradient placeholder. Defer blur generation; the existing seeded portraits keep their pre-generated blur via the existing [content/doctors-blur.ts](../../../content/doctors-blur.ts). |
| 8 | Multi-user auth | Two roles: `owner` and `editor`. New `staff_users` table joined on Supabase Auth `user_id`. Sign-up closed; owner invites by email via `auth.admin.inviteUserByEmail`. |
| 9 | Editor | Tiptap (`@tiptap/react` + `@tiptap/starter-kit` + `tiptap-markdown`). Round-trips to Markdown so the existing `blog_posts.body_mdx` column + `react-markdown` renderer stay unchanged. |
| 10 | WYSIWYG scope | Toolbar: bold, italic, H2, H3, bullet list, numbered list, blockquote, link, optional image upload. Used for blog body and doctor bio. **Image button enabled for blog only** (writes to `blog-images/` bucket). Doctor bio stays text-only. |
| 11 | Patient Forms description field | Plain `<textarea>` for now (descriptions are 1–2 sentences). Adopt the rich-text editor only if the dentist asks. |
| 12 | Admin nav | New shared horizontal sub-nav slotted into `app/admin/layout.tsx`: **Dashboard · Posts · Doctors · Patient Forms · Inquiries · Users**. Active route highlighted. Users tab visible only to `owner` role. |
| 13 | Auth gate during exploration | Temporarily disabled in `proxy.ts` (see commented-out blocks). To be restored at the start of implementation, with the additional `staff_users` membership check layered in. |
| 14 | Decisions log | One entry, drafted in §13. |

---

## 3. Architecture overview

Three new domain tables, one altered table, three new storage buckets, six new admin routes, one new public route. All follow the existing blog-posts pattern — Supabase + RLS + Server Action mutations + `revalidatePath`/`revalidateTag` for ISR.

```
                          Supabase (existing project)
                         ┌──────────────────────────────────────┐
                         │ blog_posts            [exists]       │
                         │ appointment_requests  [+ column]     │
                         │ doctors               [NEW]          │
                         │ patient_forms         [NEW]          │
                         │ staff_users           [NEW]          │
                         │ Storage: doctor-portraits/  [NEW]    │
                         │ Storage: patient-forms/     [NEW]    │
                         │ Storage: blog-images/       [NEW]    │
                         └──────────────────────────────────────┘
                                       ▲
                                       │
   ┌──────────────────────────┐    Server Actions   ┌─────────────────────┐
   │ /admin (gated by         │ ◀────────────────▶  │ /(marketing)        │
   │  middleware + staff      │                     │  /patient-forms NEW │
   │  membership check)       │                     │  /doctors/[slug]    │
   │  /dashboard              │ ──revalidate───────▶│  /doctors           │
   │  /posts/*    [exists]    │                     │  /                  │
   │  /inquiries  NEW         │                     │  /blog/[slug]       │
   │  /doctors/*  NEW         │                     │                     │
   │  /patient-forms  NEW     │                     │                     │
   │  /users/*    NEW (owner) │                     │                     │
   └──────────────────────────┘                     └─────────────────────┘
```

No new vendors. No new runtimes. All work happens inside the existing Next.js + Supabase + Vercel stack.

---

## 4. Data model

### 4.1 New table: `doctors`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK DEFAULT `gen_random_uuid()` | |
| `slug` | text | UNIQUE NOT NULL | Matches existing slug convention; the 5 seeded doctors keep their slugs |
| `name` | text | NOT NULL | |
| `title` | text | NOT NULL | E.g. "DDS, MS · Lead Clinician" |
| `portrait_path` | text | NULL | Supabase Storage key inside `doctor-portraits` bucket |
| `portrait_alt` | text | NOT NULL DEFAULT '' | |
| `portrait_object_position` | text | NOT NULL DEFAULT 'center center' | CSS object-position value |
| `short` | text | NOT NULL | 1-paragraph blurb for `/doctors` index |
| `bio` | text | NOT NULL | Markdown; rendered by `react-markdown` |
| `specialties` | text[] | NOT NULL DEFAULT '{}' | |
| `joined_year` | int | NOT NULL | |
| `is_lead` | bool | NOT NULL DEFAULT false | At most one row may be true; enforced by partial unique index |
| `display_order` | int | NOT NULL DEFAULT 0 | Ascending; for `/doctors` index + home strip |
| `active` | bool | NOT NULL DEFAULT true | Hide without deleting |
| `created_at` | timestamptz | NOT NULL DEFAULT `now()` | |
| `updated_at` | timestamptz | NOT NULL DEFAULT `now()` | Maintained by trigger |

Indexes:
- `CREATE UNIQUE INDEX doctors_one_lead ON doctors (is_lead) WHERE is_lead = true;`
- `CREATE INDEX doctors_display_order ON doctors (display_order, slug);`

### 4.2 New table: `patient_forms`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK DEFAULT `gen_random_uuid()` | |
| `label` | text | NOT NULL | E.g. "Dental Patient Forms" |
| `description` | text | NULL | 1–2 sentence helper copy |
| `file_path` | text | NOT NULL | Supabase Storage key inside `patient-forms` bucket |
| `file_size_bytes` | int | NULL | For display ("2.1 MB PDF") |
| `display_order` | int | NOT NULL DEFAULT 0 | |
| `active` | bool | NOT NULL DEFAULT true | |
| `created_at` | timestamptz | NOT NULL DEFAULT `now()` | |
| `updated_at` | timestamptz | NOT NULL DEFAULT `now()` | |

### 4.3 New table: `staff_users`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | uuid | PK, FK → `auth.users(id)` ON DELETE CASCADE | One row per allowlisted Supabase auth user |
| `email` | text | NOT NULL | Mirrored from `auth.users` |
| `display_name` | text | NOT NULL | E.g. "Dr. Brien Hsu" |
| `role` | text | NOT NULL CHECK (role IN ('owner', 'editor')) | Owner can manage users; editor cannot |
| `doctor_slug` | text | NULL, FK → `doctors(slug)` ON DELETE SET NULL | If bound, blog editor defaults author dropdown to this slug |
| `active` | bool | NOT NULL DEFAULT true | Deactivate preserves authorship; full delete cascades |
| `invited_by` | uuid | NULL, FK → `auth.users(id)` | Lightweight audit trail |
| `created_at` | timestamptz | NOT NULL DEFAULT `now()` | |

For "last signed in" display in `/admin/users`, join with `auth.users.last_sign_in_at` at read time. Avoids duplicating state and keeps `staff_users` minimal.

Seed: one row for the engagement owner using `SEED_OWNER_EMAIL` env var (see §10).

### 4.4 Altered table: `appointment_requests`

```sql
ALTER TABLE appointment_requests
  ADD COLUMN internal_notes text;
```

`status` (`new` | `contacted` | `closed`) already exists. The `AppointmentRequest` TypeScript type in [content/schemas.ts:137](../../../content/schemas.ts) already includes the status enum; no schema-side change needed there beyond surfacing `internalNotes` once the column lands.

### 4.5 Storage buckets

| Bucket | Public read | Authenticated write | Allowlist | Max size |
|---|---|---|---|---|
| `doctor-portraits` | yes | yes | image/jpeg, image/png, image/webp | 5 MB |
| `patient-forms` | yes | yes | application/pdf | 10 MB |
| `blog-images` | yes | yes | image/jpeg, image/png, image/webp | 8 MB |

All three buckets enforce allowlists via RLS policies on `storage.objects`, mirroring the existing `media_assets` bucket pattern. Upload helpers in `lib/supabase/storage.ts` re-validate client-side to fail fast.

### 4.6 RLS policies

Following the pattern already used for `blog_posts` and `appointment_requests`:

| Table | Anon read | Anon insert | Authenticated read | Authenticated full CRUD |
|---|---|---|---|---|
| `doctors` | `active=true` only | — | all rows | yes |
| `patient_forms` | `active=true` only | — | all rows | yes |
| `appointment_requests` | — | yes (existing) | yes | yes (existing) |
| `staff_users` | — | — | own row only | owners only (enforced by Server Actions; RLS optional belt) |

Owner-only enforcement for `staff_users` writes is done in Server Actions, not RLS — this avoids needing a `current_user_role()` SQL function and keeps the authorization logic in one place (TypeScript).

### 4.7 Foreign-key relationship: blog posts → doctors

During Step 6 of the implementation order (Doctor CMS), add:

```sql
ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_author_doctor_slug_fkey
  FOREIGN KEY (author_doctor_slug) REFERENCES doctors(slug)
  ON DELETE SET NULL ON UPDATE CASCADE;
```

Set NULL on delete so deleting a doctor does not cascade-delete their authored posts. The public renderer in [app/(marketing)/blog/[slug]/page.tsx:32](../../../app/(marketing)/blog/[slug]/page.tsx) already handles a missing author by simply omitting the byline.

The current `blog_posts.author_doctor_slug` is a free-text column. The migration is safe because the seeded posts all reference `dr-brien-hsu`, which exists in the seeded doctors data.

---

## 5. Routes

### 5.1 New admin routes (gated)

```
/admin/inquiries                 List + filter by status, CSV export link
/admin/inquiries/[id]            Detail + status toggle + internal notes textarea
/admin/inquiries/export          Route Handler that streams a CSV (Content-Disposition: attachment)
/admin/doctors                   List with up/down reorder + lead-clinician toggle
/admin/doctors/new               New doctor form
/admin/doctors/[slug]            Edit doctor (includes portrait upload + focal picker)
/admin/patient-forms             List with up/down reorder + "Upload new" CTA
/admin/patient-forms/[id]        Edit label/description/replace file
/admin/users                     List staff (owner-only)
/admin/users/invite              Invite form (owner-only)
/admin/users/[user_id]           Edit role / doctor binding / deactivate (owner-only)
/admin/access-denied             Friendly "your account isn't authorized" page
```

Owner-only routes (`/admin/users/*`) are double-gated: middleware blocks non-owners, and the Server Actions re-check role at the top of each function.

### 5.2 New public route

```
/patient-forms                   List of active patient_forms rows as download cards
```

### 5.3 Modified existing routes

| File | Change |
|---|---|
| [app/(marketing)/doctors/page.tsx](../../../app/(marketing)/doctors/page.tsx) | Read from Supabase via `listDoctors()`. ISR via `revalidateTag('doctors')`. |
| [app/(marketing)/doctors/[slug]/page.tsx](../../../app/(marketing)/doctors/[slug]/page.tsx) | Read from Supabase via `getDoctorBySlug(slug)`. Remove `generateStaticParams`; add `export const revalidate = 60` + `dynamicParams = true` (same pattern as blog). |
| [app/(marketing)/page.tsx](../../../app/(marketing)/page.tsx) | Home's doctor strip queries Supabase. Pluralize the heading dynamically: `${count} doctors, one office.` |
| [components/site-header.tsx](../../../components/site-header.tsx) | Add "Patient Forms" to the **mobile drawer only**. Desktop top nav is already at the 6-item density limit; do not add a 7th slot. |
| [components/site-footer.tsx](../../../components/site-footer.tsx) | Add "Patient Forms" link in the bottom nav row. |
| [app/(marketing)/contact/page.tsx](../../../app/(marketing)/contact/page.tsx) | Add a prominent "Patient Forms" card linking to `/patient-forms`. This is the primary desktop discoverability path. Two lines max: label + 1-sentence helper. |
| [app/(marketing)/request-appointment/page.tsx](../../../app/(marketing)/request-appointment/page.tsx) | After successful submission, surface a "Before your visit, please fill out these forms →" link to `/patient-forms` on the success state. Optional polish; bundle with the patient-forms PR. |
| [content/redirects.ts](../../../content/redirects.ts) | Remove the `{ from: '/patient-forms', to: '/contact', status: 301 }` rule. |
| [app/admin/layout.tsx](../../../app/admin/layout.tsx) | Slot the new `<AdminNav />` component below the header bar. |
| [app/admin/posts/post-editor.tsx](../../../app/admin/posts/post-editor.tsx) | Replace the body textarea with `<RichTextEditor allowImages />`. |
| [proxy.ts](../../../proxy.ts) | Restore auth gate; add `staff_users` membership check; add `/admin/users/*` owner-role check. |

### 5.4 Sitemap updates

[docs/ia/sitemap.md](../../ia/sitemap.md) gets one new public route (`/patient-forms`) and six new admin routes. [app/sitemap.ts](../../../app/sitemap.ts) gets `/patient-forms` added to its URL list (admin routes stay excluded as today).

---

## 6. File structure (new files)

```
app/admin/
├── _components/
│   ├── admin-nav.tsx                       NEW shared horizontal sub-nav
│   └── portrait-focal-picker.tsx           NEW click-to-set focal-point control
├── inquiries/
│   ├── page.tsx
│   ├── actions.ts                          updateStatus, updateInternalNotes
│   ├── inquiry-row.tsx                     client component, status toggle
│   ├── export/route.ts                     CSV streaming Route Handler (Content-Disposition: attachment)
│   └── [id]/page.tsx
├── doctors/
│   ├── page.tsx                            list + reorder
│   ├── actions.ts                          createDoctor, updateDoctor, deleteDoctor,
│   │                                       reorderDoctor, setLead, uploadPortrait
│   ├── doctor-editor.tsx                   shared form (new + edit), client
│   ├── new/page.tsx
│   └── [slug]/page.tsx                     edit
├── patient-forms/
│   ├── page.tsx
│   ├── actions.ts                          createForm, updateForm, deleteForm,
│   │                                       reorderForm, uploadFile
│   ├── form-editor.tsx
│   └── [id]/page.tsx
├── users/
│   ├── page.tsx                            owner-only
│   ├── actions.ts                          inviteUser, updateUser, deactivateUser
│   ├── invite/page.tsx
│   └── [user_id]/page.tsx
└── access-denied/page.tsx                  shown when authenticated but no staff_users row

app/(marketing)/patient-forms/
└── page.tsx                                public download list

components/admin/
└── rich-text-editor.tsx                    Tiptap component, shared across blog & doctor

lib/supabase/
├── queries.ts                              ADD listDoctors, getDoctorBySlug,
│                                           listPatientForms, getAppointmentRequest,
│                                           listAppointmentRequestsAll, listStaffUsers,
│                                           getStaffUser
├── storage.ts                              NEW upload + signed-URL helpers
└── service-role.ts                         NEW server-only client using service role key

scripts/
├── seed-doctors.ts                         NEW one-shot: insert content/doctors.ts rows
│                                           into Supabase doctors table iff empty
└── seed-owner.ts                           NEW one-shot: insert SEED_OWNER_EMAIL as owner
                                            into staff_users iff table empty

supabase/migrations/                        NEW (if not present); house all migration SQL
├── 2026-05-19_create_doctors.sql
├── 2026-05-19_create_patient_forms.sql
├── 2026-05-19_create_staff_users.sql
├── 2026-05-19_alter_appointment_requests_add_internal_notes.sql
├── 2026-05-19_create_storage_buckets.sql
└── 2026-05-19_create_blog_posts_doctor_fkey.sql  (sequenced after seed-doctors runs)
```

Existing [content/doctors.ts](../../../content/doctors.ts) is **kept**, in service of the seed script and as typed reference. Its export shape stays the same; downstream consumers stop reading it once Step 6 of the implementation order lands.

---

## 7. Components and contracts

### 7.1 `<AdminNav />`

Horizontal pill rail. Tabs: **Dashboard · Posts · Doctors · Patient Forms · Inquiries · Users**. Active route highlighted via `usePathname()` match. Users tab rendered conditionally based on the current user's role (passed from the server layout). ~30–40 lines.

### 7.2 `<RichTextEditor />`

```ts
interface RichTextEditorProps {
  value: string;                    // markdown
  onChange: (md: string) => void;
  placeholder?: string;
  allowImages?: boolean;            // defaults false
  minHeight?: number;               // px; defaults 320
}
```

Uses `useEditor()` from `@tiptap/react` with `StarterKit` and the `tiptap-markdown` extension. The Markdown serializer is the source of truth for storage: `editor.storage.markdown.getMarkdown()` is called on every transaction and passed to `onChange`. Initial content is loaded via `editor.commands.setContent(value)` once on mount, which `tiptap-markdown` parses back into the editor state.

Toolbar buttons:
- Bold (`Ctrl+B`)
- Italic (`Ctrl+I`)
- Heading 2 / Heading 3
- Bullet list / Numbered list
- Blockquote
- Link (small popover prompt for URL)
- Image (only when `allowImages` — opens file picker, uploads via `lib/supabase/storage.ts` to `blog-images/`, inserts `![alt](publicUrl)` node)

Styling: matches the existing form-input visual (`border-2 border-stone-300`, focus ring at `border-stone-900`, prose-stone for the content area). Reduced-motion accommodation: no animations on focus.

### 7.3 `<PortraitFocalPicker />`

Renders the uploaded portrait at 3:4 aspect ratio in a preview box. A draggable / clickable dot represents the focal point; clicking anywhere on the image sets the dot to that location and writes back to a parent `onChange(objectPosition: string)`. Reads/writes the standard CSS `object-position` value (e.g. `"30% 50%"`).

---

## 8. Server Actions (high-level contracts)

All Server Actions live alongside their route's `page.tsx` as `actions.ts`. All return `{ ok: boolean; error?: string; ... }`. All validate with zod. All call `revalidatePath`/`revalidateTag` for affected public surfaces.

### 8.1 Doctors

| Action | Purpose | Revalidates |
|---|---|---|
| `createDoctor(formData)` | New row + optional portrait upload | `revalidateTag('doctors')`, `revalidatePath('/doctors')`, `revalidatePath('/')` |
| `updateDoctor(slug, formData)` | Edit row + optional portrait replace | Same as above + `revalidatePath('/doctors/' + slug)` |
| `deleteDoctor(slug)` | Soft delete (sets `active=false`); hard-delete only when no `blog_posts.author_doctor_slug` references | Same |
| `reorderDoctor(slug, direction)` | Swap `display_order` with neighbor | Same |
| `setLead(slug)` | Single transaction: clear `is_lead` on all rows, set on target | Same |

### 8.2 Patient Forms

| Action | Purpose | Revalidates |
|---|---|---|
| `createPatientForm(formData)` | New row + required PDF upload | `revalidatePath('/patient-forms')` |
| `updatePatientForm(id, formData)` | Edit label/description, optional file replace | Same |
| `deletePatientForm(id)` | Hard delete row + storage object | Same |
| `reorderPatientForm(id, direction)` | Swap `display_order` with neighbor | Same |

### 8.3 Inquiries

| Action | Purpose | Revalidates |
|---|---|---|
| `updateInquiryStatus(id, status)` | Change status | `revalidatePath('/admin/inquiries')`, `revalidatePath('/admin/inquiries/' + id)`, `revalidatePath('/admin/dashboard')` |
| `updateInquiryNotes(id, notes)` | Auto-save internal notes on blur | Same |

CSV export is a Route Handler at `/admin/inquiries/export`, not a Server Action. Reads `?status=` query param, streams CSV via `Response` with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="inquiries-YYYY-MM-DD.csv"`. Same auth gate as the rest of `/admin/*`.

### 8.4 Users (owner-only)

| Action | Purpose | Notes |
|---|---|---|
| `inviteUser(formData)` | Call `supabase.auth.admin.inviteUserByEmail()` using service-role client; on success insert `staff_users` row with the metadata | Service-role key never reaches client |
| `updateUser(user_id, formData)` | Update role, display_name, doctor_slug binding | Owner-self cannot change own role to non-owner if they are the last owner (safeguard) |
| `deactivateUser(user_id)` | Set `staff_users.active=false`; do not delete from `auth.users` so the audit trail survives | Cannot deactivate self if last active owner |

Role checks at the top of each owner-only action:
```ts
const me = await getCurrentStaffUser();
if (!me || me.role !== 'owner') return { ok: false, error: 'Forbidden.' };
```

---

## 9. Middleware

The auth gate currently commented out in [proxy.ts:42-63](../../../proxy.ts) is restored. Two additions on top:

1. **Membership check.** After `supabase.auth.getUser()`, look up `staff_users` for that `user.id`. If the user is authenticated but no `staff_users` row exists, or `active=false`: redirect to `/admin/access-denied`.
2. **Owner-only path guard.** If the path starts with `/admin/users` and the user's `role !== 'owner'`: redirect to `/admin/dashboard`.

The lookup is one round-trip per request to `staff_users` by `user_id`. Indexed by primary key — negligible overhead. We do not cache this in the JWT to keep deactivation immediate.

---

## 10. Environment variables

Add to `.env.local` and `.env.example`:

| Var | Where | Why |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local`, Vercel (Production + Preview) — **server only** | Required for `auth.admin.inviteUserByEmail`. Imported only from files starting with `'server-only'` directive. |
| `SEED_OWNER_EMAIL` | `.env.local` only | One-time use by `scripts/seed-owner.ts` to bootstrap the first `owner` row. |

`SUPABASE_SERVICE_ROLE_KEY` is **not** prefixed with `NEXT_PUBLIC_` and must not be referenced from any file inside `components/` or any client component. Convention: only `lib/supabase/service-role.ts` reads it, and that file starts with `import 'server-only';`.

---

## 11. Migration sequencing

The migrations have one ordering constraint: the `blog_posts → doctors` foreign key in `2026-05-19_create_blog_posts_doctor_fkey.sql` requires both the `doctors` table to exist **and** to contain a row with `slug = 'dr-brien-hsu'`. Order:

1. `2026-05-19_create_doctors.sql`
2. `2026-05-19_create_patient_forms.sql`
3. `2026-05-19_create_staff_users.sql`
4. `2026-05-19_alter_appointment_requests_add_internal_notes.sql`
5. `2026-05-19_create_storage_buckets.sql`
6. Run `scripts/seed-doctors.ts` (inserts the 5 rows)
7. Run `scripts/seed-owner.ts` (inserts engagement owner as `owner`)
8. `2026-05-19_create_blog_posts_doctor_fkey.sql` (after seed so the constraint is satisfiable)

In Supabase Studio this is "run migrations 1–5, run the two seed scripts via `tsx`, then run migration 6." All migration files are idempotent (`IF NOT EXISTS`) so re-runs are safe.

---

## 12. Tests

The existing Vitest suite has 37 tests including content invariants in `content/__tests__/doctors.test.ts` that read directly from the TS array. With the doctor-CMS migration, the source of truth moves to Supabase. Test changes:

| File | Change |
|---|---|
| `content/__tests__/doctors.test.ts` | Keep — the invariants (5 doctors, no Serena, slugs valid, etc.) still hold for the **seed data** in `content/doctors.ts`. The seed data is what gets inserted on first run. |
| `lib/__tests__/getDoctor.test.ts` (NEW) | Smoke test that `getDoctor(slug)` returns the right shape. Mock the Supabase client. |
| `content/__tests__/redirects.test.ts` | Adjust expected count (one fewer rule — the `/patient-forms → /contact` entry is removed). |
| `content/__tests__/practice-info.test.ts` | No change. |

Acceptance: 37 → ~38 tests passing after the doctor-CMS step lands.

---

## 13. Decisions log entry (to commit alongside this spec)

> **2026-05-19 — Admin CMS scope expansion + multi-user auth + WYSIWYG editor**
>
> **Scope:** Admin/CMS surface area; P5 polish phase.
>
> **Decision:** Extend the previously-locked "blog only" CMS scope ([decisions.md:18](decisions.md#L18)) to also cover **patient forms**, the **appointment-request inbox**, and **doctor profiles**. Add **multi-user staff auth** with two roles (`owner`, `editor`) and an invite-only signup flow gated by a `staff_users` allowlist table. Replace the plain Markdown textarea in the blog editor with a **Tiptap WYSIWYG editor** that round-trips to Markdown so the existing schema and renderer remain unchanged. Drop the existing `/patient-forms → /contact` 301 redirect and restore `/patient-forms` as a real public page.
>
> **Rationale:**
> - The dentist (non-technical) and his associates will all use the CMS; WYSIWYG removes Markdown as a literacy requirement.
> - The practice has 5 doctors and clinical staff; the single-account demo no longer fits even the v1 brief.
> - Patient-form PDFs are updated infrequently but visibly — moving them from WordPress media to admin-managed Supabase Storage closes a real workflow gap.
> - Inquiry inbox is the smallest of the four additions and the most directly tied to the practice's day-to-day workflow.
>
> **Out of scope (deferred):**
> - Online fillable patient forms (PDF up/download only)
> - Per-staff write restrictions (e.g. "Dr. Huang can only edit her own bio")
> - Approval / review-before-publish workflow
> - Edit history / audit log beyond the lightweight `invited_by` field
> - Tables, code blocks, in-bio image upload in the editor
> - Drag-and-drop reordering (use up/down arrows)
> - Blur-data-URL generation for admin-uploaded portraits
>
> **Reference:** [Design spec](specs/2026-05-19-admin-cms-expansion-design.md)

---

## 14. Implementation order

Six PRs, each independently shippable. The implementation plan (writing-plans next step) will break each into tasks.

1. **Foundation** — Run all migrations (steps 1–5 of §11). Create Storage buckets. Build `lib/supabase/storage.ts`, `lib/supabase/service-role.ts`, `components/admin/rich-text-editor.tsx`, `app/admin/_components/admin-nav.tsx`. Write `scripts/seed-doctors.ts` and `scripts/seed-owner.ts` (do not run yet — sequencing matters). Restore the auth gate in `proxy.ts`.
2. **Multi-user staff auth** — Run `seed-owner.ts`. Implement `/admin/users/*` routes + Server Actions + middleware membership check + access-denied page. Owner-only enforcement.
3. **Blog editor upgrade (Tiptap)** — Swap the textarea on `post-editor.tsx`. Wire image upload via `lib/supabase/storage.ts` to `blog-images/` bucket. Verify the 5 seeded posts still render correctly on `/blog/<slug>` after edit + re-save round-trip.
4. **Inquiry inbox** — `/admin/inquiries/*` routes + Server Actions. CSV export Route Handler. Dashboard inquiry teaser updated to link to the full inbox.
5. **Patient Forms** — Public `/patient-forms` page + admin CRUD. Drop the redirect entry. Add nav links in header + footer.
6. **Doctor CMS (heaviest)** — Run `seed-doctors.ts`. Run the `blog_posts → doctors` FK migration. Implement `/admin/doctors/*` + Server Actions including portrait upload + focal picker + lead toggle + reorder. Switch `content/doctors.ts` consumers to `lib/supabase/queries.ts`. Async-aware caller updates (home, doctor index, doctor detail, post editor author dropdown). Switch doctor bio rendering from `whitespace-pre-line` to `<ReactMarkdown>`. Update Vitest tests.

---

## 15. Acceptance criteria

The spec is delivered when, on the live Vercel deployment:

1. **Auth gate is restored.** Anonymous visits to `/admin/dashboard` redirect to `/admin/login`.
2. **Owner can invite an editor.** Engagement owner logs in, opens `/admin/users/invite`, enters another email, that user receives an email, clicks the magic link, lands on `/admin/dashboard`, and can edit a blog post.
3. **Owner can promote a user to owner.** And cannot demote themselves below owner if they are the last active owner.
4. **Blog editor is WYSIWYG.** Bolding, italicizing, headings, links work via toolbar. Output round-trips as Markdown (stored unchanged in `blog_posts.body_mdx`). The 5 seeded posts open in the editor and re-save without diff.
5. **Blog editor supports image upload.** Pasting from clipboard or clicking the image button uploads to `blog-images/` and inserts a Markdown image node referencing the public URL.
6. **`/patient-forms` is live and renders the Dental + Medical PDFs** (seeded by the dentist via the admin during the demo, or pre-seeded with the original WordPress PDFs as placeholders).
7. **Patient Forms admin** allows upload, replace, reorder, and deactivate. Public page updates within 10 seconds (ISR revalidation).
8. **`/admin/inquiries` lists all `appointment_requests`** with filter chips for `new`/`contacted`/`closed`. Detail view allows status toggle and internal-notes edit. CSV export works.
9. **`/admin/doctors` allows full CRUD on doctor rows.** A new doctor added via the admin appears on `/doctors` and home page within 10 seconds. Portrait upload + focal point UI works. Lead-clinician toggle is exclusive (one row at a time).
10. **The 5 seeded doctors retain their existing portraits** (pulled from `public/images/doctors/`), specialties, bios, and slugs after the seed script runs. Public `/doctors` and `/doctors/[slug]` render identically to today's behavior.
11. **All existing Vitest tests pass** + the new `getDoctor` smoke test + the `redirects.test.ts` count adjustment.
12. **No regressions on the public site.** Lighthouse mobile ≥ 90 on `/`, `/doctors`, `/dental`, `/medical/tmj`, `/blog`, `/patient-forms`. (Down from the 95 master-spec target only because dynamic ISR pages may dip; verify and address before the pitch.)

---

## 16. Out of scope (locked)

- Online fillable patient forms (PDF up/download only)
- HIPAA-compliant patient data handling — no PHI in the inquiry inbox; existing form already collects only name/phone/email/notes
- Per-staff write restrictions ("Dr. Huang can only edit her own bio")
- Approval / review-before-publish workflow
- Edit history / audit log beyond the `invited_by` column
- Tables, code blocks, in-bio image upload in the editor
- Drag-and-drop reordering (up/down arrows only)
- Blur-data-URL generation for admin-uploaded portraits (existing seeded portraits keep their pre-generated blurs)
- Custom theming / CSS-variable control from inside the editor
- Edit-collision warnings / soft locks when two users open the same record
- Real-time WebSocket subscriptions to admin tables (page revalidations are sufficient)
- Resend / email integration on appointment-request submissions (still a v2 item per [HANDOFF.md §12](../../../HANDOFF.md))

---

## 17. Open questions (low-stakes, defaulted)

These are flagged but defaulted to keep the spec actionable. Mark them in the implementation plan if a stakeholder weighs in.

1. **Patient-form file labels** — should they be free text, or pulled from a fixed enum (Dental / Medical / Records Release / Insurance)? **Default: free text** with a placeholder showing the dentist's two original labels.
2. **CSV export columns** — bare essentials (name, phone, email, status, created_at, notes) or include internal_notes too? **Default: include internal_notes**, since it's the dentist's own data.
3. **Doctor portrait crop UI** — should the focal picker offer a "reset to center" button? **Default: yes**, dead-simple addition.
4. **Image upload from inside the Tiptap editor** — pasted images: should they be auto-uploaded, or pop a confirm dialog? **Default: auto-upload on paste**, with a small toast confirming.
5. **Inquiry status default** — when a request is created, status starts at `new`. When an admin opens the detail view, should it auto-advance to `contacted`? **Default: no** — admins must explicitly toggle.

---

*Author: Claude (Opus 4.7) + Rob Guevarra.
Predecessor scope decisions: [decisions.md](../decisions.md). Master spec: [2026-05-05-dentisthsu-redesign-master-spec.md](2026-05-05-dentisthsu-redesign-master-spec.md). P2 admin scope: [admin-scope.md](../../ia/admin-scope.md).*
