# Asset Inventory

**Generated:** 2026-05-05
**Source data:** [`source/image-index.json`](../../source/image-index.json) (612 records · 221 unique source URLs)
**Verdict logic:** master spec [§5 photography direction](../superpowers/specs/2026-05-05-dentisthsu-redesign-master-spec.md#5-visual--motion-direction)

---

## Summary

| Verdict | Unique URLs | What this means |
|---|---:|---|
| **Use** | ~1 | Image is a faithful representation of the practice or doctor and quality-acceptable as-is. |
| **Regrade** | ~106 | Image content is good (real clinic, doctor, equipment), but resolution / color / cropping needs work before reuse. |
| **Replace** | ~114 | Image is theme decoration, generic stock, blogger widget chrome, or too small/low-quality to salvage. |
| **Total** | **221** | (out of 612 records — 391 duplicates from blogger widget icons appearing on every blog post page) |

**Note on heuristic vs. final verdicts:** the counts above come from automated heuristics that classify by URL pattern, dimensions, and file size. **The "Use" bucket is almost certainly larger than 1** — the heuristic only matches images whose filenames literally contain `brien`/`drhsu`/`hsu-dds`. Real doctor portraits, clinic photos, and team headshots will reclassify upward during manual curation in P3.

## Strategic findings

### 1. Two-thirds of the image footprint is third-party widget chrome

The top 5 most-frequently-referenced images on the site are all from `resources.blogblog.com` (Google Blogger):

| Count | URL |
|---:|---|
| 42× | `https://resources.blogblog.com/img/icon_feed12.png` (RSS icon) |
| 28× | `https://resources.blogblog.com/img/widgets/arrow_dropdown.gif` |
| 19× | `https://www.blogger.com/img/blogger_logo_round_35.png` |
| 14× | `https://resources.blogblog.com/img/widgets/subscribe-yahoo.png` |
| 14× | `https://resources.blogblog.com/img/widgets/subscribe-netvibes.png` |

These confirm the audit's IA finding: the personal blog content is hosted on a Blogger subdomain and pulls in Google's blogger widget assets across every post page. **Disposition:** delete entirely; not reusable in the new build.

### 2. The strongest existing photography lives on the legacy `2017.dentisthsu.com` subdomain

Sample regrade-bucket images:

| Source URL | Dimensions | Bytes | Notes |
|---|---|---:|---|
| `http://2017.dentisthsu.com/aboutus/data1/images/check-out-area-hallway.jpg` | 700×465 | 47KB | Real reception/checkout interior shot |
| `http://2017.dentisthsu.com/aboutus/data1/images/check-out.jpg` | 700×465 | 58KB | Counter detail |
| `http://2017.dentisthsu.com/aboutus/data1/images/exterior.jpg` | 800×533 | 112KB | Building exterior |

**Finding:** the practice has actual interior photography, but it lives on a stale subdomain at small dimensions (700–800px wide, 50–100KB). For SOTY-tier reuse we'd need 2× resolution (1600px+) at print quality — likely requires a **fresh photo session post-signing** (master spec §5 photography direction option E). The existing photos can be regraded for placeholder use during the pitch.

### 3. The dentist's portrait exists at low resolution

Heuristically classified as the only "Use" candidate:

- `https://dentisthsu.com/wp-content/uploads/2014/07/brien-on-tooth-205x330.png` — 205×330, 30KB, alt "brien on tooth"

This is a 12-year-old portrait at thumbnail dimensions. **For the pitch:** acceptable as a placeholder; for v2: we need a fresh editorial-quality shot.

### 4. Service-page imagery is repurposed clinical photography from 2017

Sample replace-bucket images from service pages:

| Source URL | Dimensions | Notes |
|---|---|---|
| `http://2017.dentisthsu.com/images/amalgam-1.jpg` | 400×207 | Clinical before-state photo |
| `http://2017.dentisthsu.com/images/amalgam-2.jpg` | 400×199 | Clinical after-state photo |

These are dental "before/after" photos at small sizes. Useful as evidence on a dedicated case-study page; not appropriate as decorative imagery on service overview pages. **Disposition:** retain in a `/portfolio` namespace per master spec §5; not used decoratively.

### 5. WordPress theme decoration polluting the inventory

Images from `/wp-content/plugins/revslider/...`, `/wp-content/themes/.../images/...` are theme/plugin chrome (slider arrows, decorative dividers, background patterns). All Replace.

---

## Verdict bucket samples (representative — not exhaustive)

### Use (1 record heuristically; expect manual curation to grow this to 8–15)

- `brien-on-tooth-205x330.png` — Dr. Brien portrait. Use as placeholder; reshoot in v2.

**Manual-curation candidates** (to upgrade from "regrade" → "use" after eyeballing):
- Office exterior shot (`exterior.jpg`)
- Doctor team group photos (search image-index.json for `our-team`, `doctors-dr-*` page records)
- 3Shape Trios / iCAT CBCT equipment photos referenced from `2019-10-3-shape-html`, `i-cat-flx-3d-cone-beam-computed-tomography-cbct-system`

### Regrade (~106 records — real but needs work)

Predominantly:
- `2017.dentisthsu.com/aboutus/data1/images/*` — clinic interiors, exteriors, equipment (700–800px, 50–120KB each)
- Service-page hero imagery from the legacy subdomain
- Doctor headshots scattered across `doctors-dr-*` pages
- Equipment photos (CBCT scanner, Trios scanner, dental microscopes)

**Disposition:** the originals can be color-graded and used at small sizes during the pitch; v2 reshoots at 2× resolution.

### Replace (~114 records — discard)

Predominantly:
- Blogger widget icons (RSS feeds, share buttons, dropdowns)
- WordPress theme/plugin chrome (slider arrows, decorative widgets)
- Tracking pixels (35×35 PNGs from blogspot)
- Tiny "before/after" thumbnails at <400px width
- Stock smiles and generic dental clipart

---

## Manual curation needed

This automated pass produced a starting point. Before P3 begins, a human pass through `source/image-index.json` is needed to:

1. **Reclassify the "use" bucket up** — likely 8–15 candidate images that the heuristic missed (any image where filename contains a doctor's name or context page is a doctor bio).
2. **Audit the 2017.dentisthsu.com subdomain photography** — decide which interior shots are worth regrading.
3. **Identify equipment/technology photography** — CBCT, Trios scanner, microscopes, etc. — for the "technology adoption" content track surfaced in the audit.
4. **Drop any image still pointing at the parallel WordPress installations** (`2017.dentisthsu.com`, `www.familyblog.dentisthsu.com`, `www.blog.dentisthsu.com`) — these subdomains will be 301-redirected away in v2.

Estimate: 30–45 minutes of manual review against the live site + image previews; produces a final curated list of ~25–40 images we'd actually consider reusing.

---

## Tooling note

Verdicts above were generated via inline `jq` heuristics against `source/image-index.json`. For programmatic re-runs after manual curation, the project's `scripts/p1-discovery/` toolchain can be extended with an `08-classify-images.ts` step in v2.

g.