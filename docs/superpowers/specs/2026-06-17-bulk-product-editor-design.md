# Bulk Product Editor — Design Spec
**Date:** 2026-06-17
**Status:** Approved

---

## Overview

A Sanity Studio plugin that gives admins a dedicated workspace for selecting multiple products and applying batch operations — price changes, flag toggles, tag management, badge edits, and status changes — without opening each product individually.

---

## Location & Access

- Registered as a Sanity Studio **tool** (sidebar tab) via `definePlugin` + `defineTool`
- Icon: `Layers` (Lucide / Sanity's icon set)
- Label: **"Bulk Editor"**
- Auth: uses Studio's own `useClient({ apiVersion })` — no new tokens, no new routes
- Registration: imported in `sanity.config.ts` alongside existing plugins

---

## File Structure

```
sanity/plugins/bulkEditor/
  index.tsx           — definePlugin() + defineTool() registration
  BulkEditorTool.tsx  — root component; owns filter state + selection state
  ProductTable.tsx    — checkbox table (thumbnail, name, price, status, tags)
  FilterBar.tsx       — search + category + status + tags filters
  BulkActionPanel.tsx — collapsible sections for all op types + Apply button
  useProducts.ts      — GROQ fetch via useClient(), returns products + refetch()
  useBulkMutate.ts    — batched patch logic; returns { apply, loading, result }
  types.ts            — shared ProductRow type (slim fields only)
```

---

## Data Fetch

GROQ query in `useProducts.ts`:

```groq
*[_type == "product"] | order(name_en asc) {
  _id, name_en, name_ar, slug, price, compareAtPrice,
  volume, status, new, bestSeller, inStock, tags,
  badgeText_en, badgeText_ar, badgeColor,
  "category": category->{ name_en, slug },
  "thumb": images[0].asset->url
}
```

`refetch()` re-runs the query after every successful mutation batch.

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Bulk Editor                          12 selected  [×]   │
├─────────────────────────────────────────────────────────┤
│  [🔍 Search name...]  [Category ▾]  [Status ▾]  [Tags ▾]│
├──┬──────────────────────────────────────────────────────┤
│☑ │ NAME              PRICE    STATUS    TAGS     NEW/BS  │
├──┼──────────────────────────────────────────────────────┤
│☐ │ 🖼 Imperial Saffron  $120   active   oud,wood   NEW   │
│☑ │ 🖼 Iris Poudré        $90   active   floral          │
│☑ │ 🖼 Black Amber        $140  draft    oud        BS    │
├──┴──────────────────────────────────────────────────────┤
│  ▼ BULK ACTIONS (12 selected)                           │
│  ┌─ Price ──────────────────────────────────────────┐   │
│  │  [% ▾] [+10] Apply to base price + all volumes   │   │
│  │  compareAt: [Set markup %] [Clear sale]           │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ Flags ──────────────────────────────────────────┐   │
│  │  New [ON][OFF][—]  BestSeller [ON][OFF][—]        │   │
│  │  InStock [ON][OFF][—]   Status [active ▾]         │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ Tags ───────────────────────────────────────────┐   │
│  │  [+ Add tags...]  [- Remove tags...]              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ Badge ──────────────────────────────────────────┐   │
│  └──────────────────────────────────────────────────┘   │
│                          [Apply to 12 products →]       │
└─────────────────────────────────────────────────────────┘
```

**Selection:**
- Header checkbox = select/deselect all filtered results
- `[×]` clears selection
- Selected count shown in header

**Pagination:** 50 products per page; filters run client-side on fetched set (products rarely exceed a few hundred).

---

## Filter Bar

| Control | Filters on |
|---|---|
| Search input | `name_en` contains (case-insensitive) |
| Category dropdown | `category.slug` exact match |
| Status dropdown | `status` exact match |
| Tags multi-select | product has ALL selected tags |

---

## Bulk Operations

All operations are additive — only fields with explicit values get patched. `[—]` (leave unchanged) = field skipped.

### Price
| Op | Behaviour |
|---|---|
| % increase | `price * (1 + pct/100)`, same factor on every `volume[i].price` |
| % decrease | `price * (1 - pct/100)`, same factor on volumes |
| Flat +/- | `price ± amount`, same delta on volumes |
| Set compareAt | `compareAtPrice = price * (1 + markup/100)` — creates sale display |
| Clear sale | `unset(['compareAtPrice'])` |

Prices rounded to 2 decimal places.

### Flags
| Field | Values |
|---|---|
| `new` | true / false / skip |
| `bestSeller` | true / false / skip |
| `inStock` | true / false / skip |
| `status` | active / draft / archived / skip |

### Tags
- **Add:** append tags not already present (client-side dedup check)
- **Remove:** `unset` array items matching tag value

### Badge
- `badgeText_en`, `badgeText_ar` — set string or skip if blank
- `badgeColor` — dropdown: gold / black / red / green / blue / pink / skip

---

## Mutation Logic (`useBulkMutate.ts`)

```ts
Promise.allSettled(
  selectedProducts.map(product => {
    const patch = client.patch(product._id)

    if (ops.pricePct !== undefined) {
      const f = 1 + ops.pricePct / 100
      patch.set({ price: round(product.price * f) })
      product.volume?.forEach((v, i) =>
        patch.set({ [`volume[${i}].price`]: round(v.price * f) })
      )
    }
    // ... flat price, compareAt, flags, tags, badge, status

    return patch.commit()
  })
)
```

---

## Post-Apply Behaviour

1. `Promise.allSettled` captures fulfilled vs rejected per product
2. Toast: `"12 products updated"` or `"8 updated, 4 failed — retry?"`
3. Selection cleared
4. `refetch()` re-runs GROQ query — table reflects live data
5. Filter state preserved

---

## Error Handling

- Individual patch failures don't abort the batch (`Promise.allSettled`)
- Failed products shown in toast with retry option (re-runs the same op on failed IDs only)
- Network errors: toast with full error message

---

## Out of Scope

- Undo / history (Sanity has its own document history)
- Bulk image upload
- Bulk delete
- CSV import/export
