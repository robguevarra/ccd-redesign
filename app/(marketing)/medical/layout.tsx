/**
 * Route-segment layout for /medical and all descendants. Wraps children in
 * a data-lane="medical" div so the teal accent palette resolves via the
 * cascade defined in app/globals.css.
 *
 * Server Component — no JS shipped. The `contents` class makes the wrapper
 * layout-transparent so existing grid/flex inside service pages is unaffected.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export default function MedicalLaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lane="medical" className="contents">
      {children}
    </div>
  );
}
