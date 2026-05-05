# Phase 2 — IA + Content Strategy Implementation Plan

**Goal:** Land all P2 deliverables on disk: 5 IA markdown docs (`docs/ia/`), 3 typed code files (`content/`), all type-checked clean against `tsconfig.json`.

**Architecture:** Pure documentation + typed configuration. No runtime code. Schemas live in `content/schemas.ts` as TypeScript types only — they don't get implemented as Supabase tables until P4. Redirects live in `content/redirects.ts` as a typed array — they don't get wired into `vercel.ts` until P4.

**Tech Stack:** TypeScript 5 strict (already configured) · Markdown for IA docs · `tsconfig.json` already includes `scripts/**/*.ts`; we'll extend it to include `content/**/*.ts`.

**Spec:** [docs/superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md](../specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md)

---

## Task 1: Extend tsconfig + create `content/` directory

- [ ] Modify `tsconfig.json` `include` to add `content/**/*.ts`
- [ ] `mkdir -p content`
- [ ] Verify `pnpm exec tsc --noEmit` still passes (no `content/` files yet, but include glob now matches the directory)

## Task 2: `content/schemas.ts` — TypeScript types

- [ ] Write `content/schemas.ts` with: `ServiceCategory`, `Service`, `Doctor`, `BlogPost`, `Review`, `AppointmentRequest`, `PracticeInfo`, `MediaAsset` per [P2 spec §6](../specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#typescript-type-definitions).
- [ ] `pnpm exec tsc --noEmit` clean.

## Task 3: `content/practice-info.ts` — populated singleton

- [ ] Write `content/practice-info.ts` exporting a `practiceInfo: PracticeInfo` const.
- [ ] Use real curated facts: brand "Comfort Care Dental", legal "Brien Hsu, DDS", address `11458 Kenyon Way, Rancho Cucamonga, CA` (zip TBD; placeholder), 3 phones, 4 social links (Facebook, Yelp, Twitter `@drbrienhsu`), `email: null` (audit finding — no public email).
- [ ] Hours: standard dental practice hours as best guess (Mon–Fri 8–5, Sat 8–1, Sun closed); flag for confirmation in dentist-questions.
- [ ] `pnpm exec tsc --noEmit` clean.

## Task 4: `content/redirects.ts` — typed redirect array

- [ ] Write `content/redirects.ts` exporting `redirects: Redirect[]` per P2 spec §8.
- [ ] Define inline type `Redirect = { from: string | RegExp; to: string; status: 301 | 410 }`.
- [ ] Encode the ~40 redirect rules from the spec table.
- [ ] `pnpm exec tsc --noEmit` clean.

## Task 5: `docs/ia/sitemap.md`

- [ ] Mirror P2 spec §3 with the 17 marketing routes + 4 admin routes
- [ ] Plus IA changes table (old → new with rationale)

## Task 6: `docs/ia/services-taxonomy.md`

- [ ] 4-category taxonomy with all ~20 services and slugs
- [ ] Note signature service (TMJ) flag

## Task 7: `docs/ia/page-templates.md`

- [ ] 6-template inventory + variants per spec §5

## Task 8: `docs/ia/redirects.md`

- [ ] Human-readable mirror of `content/redirects.ts`
- [ ] Same data; markdown-friendly format with the table from spec §8

## Task 9: `docs/ia/admin-scope.md`

- [ ] CMS scope decision per spec §9

## Task 10: Acceptance + decisions log + CLAUDE.md update

- [ ] Walk spec §11 acceptance checklist
- [ ] Append decisions log entry "P2 deliverables shipped"
- [ ] Update CLAUDE.md state table
- [ ] Final commit
