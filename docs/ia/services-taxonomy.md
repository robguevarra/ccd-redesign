# Services Taxonomy

**Date:** 2026-05-05
**Source:** [P2 spec §4](../superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md#4-service-taxonomy-locked)

Four categories. URL prefix is always `/services/<slug>` regardless of category — category is a filter/group on the overview page, not a URL prefix.

## Categories

### General Dentistry (12 services)

| Slug | Display name |
|---|---|
| `cleaning` | Professional Cleaning |
| `composite-fillings` | Composite Fillings |
| `amalgam-fillings` | Amalgam Fillings (legacy; surfaced as historical reference) |
| `crowns-caps` | Crowns & Caps |
| `fixed-bridges` | Fixed Bridges |
| `dentures` | Dentures & Partial Dentures |
| `root-canal-therapy` | Root Canal Therapy |
| `oral-hygiene` | Oral Hygiene |
| `tooth-extractions` | Tooth Extractions |
| `sedation-dentistry` | Sedation Dentistry |
| `children-oral-healthcare` | Children's Oral Healthcare |
| `periodontal-treatment` | Periodontal Treatment |

### Cosmetic (2 services)

| Slug | Display name |
|---|---|
| `porcelain-veneers` | Porcelain Veneers |
| `teeth-whitening` | Teeth Whitening (incl. deep bleaching) |

### Specialty (4 services)

| Slug | Display name | Notes |
|---|---|---|
| `tmj` | TMJ Treatment | ⭐ Wow-zone signature service |
| `sleep-apnea` | Sleep Apnea Treatment | |
| `oral-pathology` | Oral Pathology | |
| `orofacial-pain` | Orofacial Pain | |

### Orthodontics (2 services)

| Slug | Display name |
|---|---|
| `orthodontics` | Traditional Orthodontics |
| `removable-orthodontics` | Removable Orthodontics |

## Total

**~20 unique services.** Each gets a `content/services/<slug>.mdx` file in P4. The `tmj` service flips the `signature: true` flag in its MDX frontmatter, which causes the rendering layer to use the long-scroll case-study template variant.

## Why these categories

The dentist's existing site mixes services without clear category structure. P1 audit found:

- 12+ "service" URLs in two parallel taxonomies (`/services/<slug>` + `/services-<slug>-html`)
- `section-dental` and `section-medical` URLs that hint at an old dental-vs-medical split
- TMJ + sleep apnea + orofacial pain treated as services even though they're medically-adjacent

The 4-category structure above is the cleanest mapping that:
- Honors the dental/medical practice scope
- Separates routine general dentistry from cosmetic from specialty/medical
- Promotes orthodontics as its own category (sufficient depth of services to warrant it)
- Surfaces the TMJ signature without making it look like a medical-only practice

## v2 candidates (not in pitch scope)

- `dental-implants` (placeholder slug exists in redirects; build out fully in v2)
- `invisalign` (separate from removable-orthodontics in some practice positions; folded for now)
- Pediatric specialty page (currently `children-oral-healthcare` under General Dentistry)
