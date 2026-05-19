import { describe, expect, test, vi } from 'vitest';

// Minimal smoke test — mocks the underlying Supabase client to ensure
// the row→Doctor mapping shape is correct. Full integration coverage
// happens via manual click-through of /doctors/<slug>.

// These Next.js / server-only stubs must come before the module under test.
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }));

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
