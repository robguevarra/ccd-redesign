/**
 * Route-segment layout for /dental and all descendants. Wraps children in
 * a data-lane="dental" div so the warm-stone accent palette resolves via
 * the cascade defined in app/globals.css.
 *
 * Server Component — no JS shipped. The `contents` class makes the wrapper
 * layout-transparent so existing grid/flex inside service pages is unaffected.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export default function DentalLaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lane="dental" className="contents">
      {children}
    </div>
  );
}
