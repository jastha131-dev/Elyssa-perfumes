# Contact Page Redesign — Light Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the contact page from dark charcoal palette to a warm light editorial style (cream/stone/white), remove all dark backgrounds, and add two new admin-managed fields (`showMap`, `mapEmbedUrl`) to the Sanity schema.

**Architecture:** Four sequential changes — extend the Sanity schema, update the TypeScript type + GROQ query, then do the full visual rewrite of `_client.tsx`. The component never needs a new file; the palette swap is self-contained inside the existing client component.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS (custom `camel`/`stone`/`charcoal` palette), Framer Motion, Sanity CMS (`contactPage` document type), TypeScript.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `sanity/schemaTypes/contactPage.ts` | Modify | Add `showMap` boolean + `mapEmbedUrl` url field |
| `lib/types.ts` | Modify | Add `showMap?: boolean` + `mapEmbedUrl?: string` to `ContactPageData` |
| `lib/sanity/queries.ts` | Modify | Add `showMap, mapEmbedUrl` to `getContactPageQuery` |
| `app/[locale]/contact/_client.tsx` | Modify | Full visual redesign — light palette throughout |

---

## Task 1: Extend Sanity Schema

**Files:**
- Modify: `sanity/schemaTypes/contactPage.ts`

- [ ] **Step 1: Add two fields inside the `fields` array, after `overlayOpacity`**

Open `sanity/schemaTypes/contactPage.ts`. After the `overlayOpacity` field definition (line ~26), add:

```ts
defineField({
  name: 'showMap',
  title: 'Show Map Section',
  type: 'boolean',
  initialValue: true,
  description: 'Toggle the map section visible/hidden on the contact page.',
}),
defineField({
  name: 'mapEmbedUrl',
  title: 'Map Embed URL',
  type: 'url',
  description: 'OpenStreetMap embed URL. Leave blank to use the default Dubai DIFC location.',
}),
```

- [ ] **Step 2: Verify the schema file compiles**

```bash
npx tsc --noEmit
```
Expected: no errors about `contactPage.ts`.

---

## Task 2: Update TypeScript Type

**Files:**
- Modify: `lib/types.ts` (around line 830 — `ContactPageData` interface)

- [ ] **Step 1: Add two optional fields to `ContactPageData`**

Find `export interface ContactPageData` and add after `openingHours`:

```ts
export interface ContactPageData {
  _id: string
  heading_en?: string
  heading_ar?: string
  subtext_en?: string
  subtext_ar?: string
  email?: string
  phone?: string
  address_en?: string
  address_ar?: string
  instagramUrl?: string
  whatsappNumber?: string
  heroImageUrl?: string
  heroImageAlt?: string
  overlayOpacity?: number
  openingHours?: Array<{ day: string; hours: string }>
  showMap?: boolean
  mapEmbedUrl?: string
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

## Task 3: Update GROQ Query

**Files:**
- Modify: `lib/sanity/queries.ts` (around line 581)

- [ ] **Step 1: Add new fields to `getContactPageQuery`**

Find `getContactPageQuery` and update to:

```ts
export const getContactPageQuery = `
  *[_type == "contactPage"][0] {
    _id, heading_en, heading_ar, subtext_en, subtext_ar,
    email, phone, address_en, address_ar, instagramUrl, whatsappNumber,
    "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    overlayOpacity, openingHours,
    showMap, mapEmbedUrl
  }
`
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit schema + type + query changes**

```bash
git add sanity/schemaTypes/contactPage.ts lib/types.ts lib/sanity/queries.ts
git commit -m "feat(contact): add showMap + mapEmbedUrl to schema, types, query"
```

---

## Task 4: Redesign `_client.tsx` — Hero Section

**Files:**
- Modify: `app/[locale]/contact/_client.tsx`

This task rewrites only the hero `<section>`. The rest of the file stays intact for now.

- [ ] **Step 1: Replace the entire hero `<section>` block**

Find the block starting with `{/* ═══════════════════════ DARK HERO ═══════════════════════ */}` and ending with `</section>` (before `{/* ═══════════════════════ MAIN SECTION`). Replace it with:

```tsx
{/* ═══════════════════════ LIGHT HERO ═══════════════════════ */}
<section className="bg-stone-50 pt-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid items-stretch lg:grid-cols-2">

      {/* Left — text + contact cards */}
      <div className="flex flex-col justify-center py-16 lg:pr-16">

        {/* Eyebrow */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-camel-500"
        >
          Contact
        </motion.p>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.08}
          className="max-w-lg font-display text-5xl font-light leading-tight text-charcoal-900 md:text-6xl"
        >
          {heading}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.18}
          className="mt-6 max-w-md text-sm font-light leading-relaxed text-charcoal-500"
        >
          {subtext}
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.26}
          className="mt-10 flex items-center gap-4"
        >
          <div className="h-px w-10 bg-camel-500/50" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-camel-500/50">
            Luxe Parfum · Est. 2010
          </span>
        </motion.div>

        {/* Contact cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">

          {/* Email */}
          <motion.a
            href={`mailto:${email}`}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
            className="group flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:border-camel-200 hover:shadow-md"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-camel-50 transition-colors duration-300 group-hover:bg-camel-100">
              <Mail className="h-4 w-4 text-camel-500" />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">Email</p>
              <p className="text-xs font-light text-charcoal-700 transition-colors duration-300 group-hover:text-camel-600">
                {email}
              </p>
            </div>
          </motion.a>

          {/* Phone */}
          <motion.a
            href={`tel:${phone.replace(/\s/g, '')}`}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="group flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:border-camel-200 hover:shadow-md"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-camel-50 transition-colors duration-300 group-hover:bg-camel-100">
              <Phone className="h-4 w-4 text-camel-500" />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">Phone</p>
              <p className="text-xs font-light text-charcoal-700 transition-colors duration-300 group-hover:text-camel-600">
                {phone}
              </p>
            </div>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : 'https://wa.me/971400000000'}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.48}
            className="group flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:border-camel-200 hover:shadow-md"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-camel-50 transition-colors duration-300 group-hover:bg-camel-100">
              <MessageCircle className="h-4 w-4 text-camel-500" />
            </div>
            <div>
              <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">WhatsApp</p>
              <p className="text-xs font-light text-charcoal-700 transition-colors duration-300 group-hover:text-camel-600">
                Message us directly
              </p>
            </div>
          </motion.a>

        </div>
      </div>

      {/* Right — hero image */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="relative hidden min-h-[480px] lg:block"
      >
        <Image
          src={data?.heroImageUrl || '/images/categories/I1.webp'}
          alt={data?.heroImageAlt ?? heading}
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />
        {/* Subtle left-edge fade so text column doesn't clash */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/50 via-transparent to-transparent" />
      </motion.div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

## Task 5: Redesign Form + Sidebar Section

**Files:**
- Modify: `app/[locale]/contact/_client.tsx`

- [ ] **Step 1: Update the form section background and submit button**

Find `<section className="bg-white">` (the main section containing the form). It stays `bg-white`. Inside:

1. Find the submit `<button>` with `className="inline-flex items-center gap-3 bg-charcoal-950 px-10 py-3.5 ..."` and replace the className with:

```tsx
className="inline-flex items-center gap-3 rounded-lg bg-camel-600 px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-camel-700 disabled:cursor-not-allowed disabled:opacity-60"
```

2. Find the two sidebar cards (`border border-charcoal-100 bg-charcoal-50`) for address and hours and replace both className strings with:

```tsx
className="rounded-xl border border-stone-200 bg-stone-50 px-7 py-8"
```

3. Find the Instagram social link with `className="group inline-flex items-center gap-3 border border-charcoal-200 ..."` and replace with:

```tsx
className="group inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal-700 shadow-sm transition-all duration-300 hover:border-camel-300 hover:text-camel-600 hover:shadow-md"
```

4. Find the WhatsApp social link with the same dark border class and apply the same replacement as step 3.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

## Task 6: Redesign Map Section + Wire `showMap`/`mapEmbedUrl`

**Files:**
- Modify: `app/[locale]/contact/_client.tsx`

- [ ] **Step 1: Extract `showMap` and `mapEmbedUrl` from data near top of component (after `openingHours` block)**

Add these two lines after the `openingHours` resolution:

```tsx
const showMap = (data as any)?.showMap !== false
const mapEmbedUrl = (data as any)?.mapEmbedUrl || 'https://www.openstreetmap.org/export/embed.html?bbox=55.2720%2C25.2020%2C55.3020%2C25.2180&layer=mapnik&marker=25.2097%2C55.2870'
```

- [ ] **Step 2: Replace the entire map `<section>` block**

Find `{/* ═══════════════════════ MAP ═══════════════════════ */}` and replace the whole section (including the bottom strip section that follows) with:

```tsx
{/* ═══════════════════════ MAP ═══════════════════════ */}
{showMap && (
  <section className="relative h-[420px] w-full overflow-hidden border-t border-stone-200">

    {/* Location label — top-left */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
      className="absolute left-6 top-6 z-10 rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-md sm:left-10 sm:top-10"
    >
      <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.45em] text-camel-500">
        Find Us
      </p>
      <p className="text-sm font-light text-charcoal-900">Dubai International Financial Centre</p>
      <p className="text-[11px] font-light text-charcoal-500">Dubai, United Arab Emirates</p>
    </motion.div>

    {/* Map iframe */}
    <iframe
      title="Luxe Parfum location"
      src={mapEmbedUrl}
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      aria-label="Map showing Luxe Parfum office location"
    />

    {/* Directions link — bottom-right */}
    <a
      href="https://www.openstreetmap.org/?mlat=25.2097&mlon=55.2870#map=16/25.2097/55.2870"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-camel-600 shadow-md transition-colors duration-200 hover:border-camel-300 hover:text-camel-700 sm:bottom-10 sm:right-10"
    >
      <MapPin className="h-3 w-3" />
      Get Directions
    </a>

  </section>
)}
```

Note: the old bottom strip (`bg-charcoal-950`) is intentionally not included — it's removed.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit all `_client.tsx` changes**

```bash
git add app/[locale]/contact/_client.tsx
git commit -m "feat(contact): light editorial redesign — cream/stone palette, no dark backgrounds"
```

---

## Task 7: Visual Verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open contact page and verify**

Open `http://localhost:3000/contact` and check:
- Hero background is warm cream (`bg-stone-50`), NOT dark
- Hero image appears on right column (desktop)
- Contact cards (Email/Phone/WhatsApp) are white with rounded corners and camel icon circles
- Form submit button is amber/camel colour, not black
- Address and Hours sidebar cards are `bg-stone-50` with light border
- Social links are white with light border
- Map section has white overlay labels (not dark)
- No `bg-charcoal-950` visible anywhere on the page
- Map section is togglable via `showMap` field in Sanity

- [ ] **Step 3: Final build check**

```bash
npm run build
```
Expected: builds without errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(contact): complete light editorial redesign with admin map controls"
```
