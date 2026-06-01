import React from 'react'
import { defineField, defineType, defineArrayMember } from 'sanity'
import { AiFillInput } from '../components/AiFillInput'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Information', default: true },
    { name: 'fragrance', title: 'Fragrance Details' },
    { name: 'pricing', title: 'Pricing & Stock' },
    { name: 'media', title: 'Media' },
    { name: 'merchandising', title: 'Merchandising' },
    { name: 'reviews', title: 'Reviews' },
    { name: 'content', title: 'Additional Content' },
    { name: 'pageBuilder', title: 'Page Sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Basic Information ────────────────────────────────────────────────────
    defineField({
      name: 'name_en',
      title: 'Product Name (English)',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'name_ar',
      title: 'اسم المنتج (Arabic)',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name_en',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description_en',
      title: 'Short Description (English)',
      type: 'text',
      group: 'basic',
      rows: 4,
      description: 'A brief description shown on product cards and meta tags.',
      validation: (Rule) => Rule.required().min(20).max(500),
      components: {
        input: AiFillInput,
      },
    }),
    defineField({
      name: 'description_ar',
      title: 'وصف قصير (Arabic)',
      type: 'text',
      group: 'basic',
      rows: 4,
      description: 'A brief description shown on product cards and meta tags.',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'story_en',
      title: 'Brand Story / Long Description (English)',
      type: 'array',
      group: 'basic',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
                  }),
                  defineField({
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'story_ar',
      title: 'قصة العلامة (Arabic)',
      type: 'array',
      group: 'basic',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
                  }),
                  defineField({
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'concentration',
      title: 'Concentration',
      type: 'string',
      group: 'basic',
      description: 'The concentration of fragrance oil (determines intensity and longevity).',
      options: {
        list: [
          { title: 'Eau de Cologne (EDC) — 2–4%', value: 'Eau de Cologne' },
          { title: 'Eau de Toilette (EDT) — 5–15%', value: 'Eau de Toilette' },
          { title: 'Eau de Parfum (EDP) — 15–20%', value: 'Eau de Parfum' },
          { title: 'EDP Intense — 20–25%', value: 'EDP Intense' },
          { title: 'Extrait de Parfum — 25–40%', value: 'Extrait de Parfum' },
          { title: 'Parfum Oil — 15–30% (oil-based)', value: 'Parfum Oil' },
        ],
        layout: 'radio',
      },
      initialValue: 'Eau de Parfum',
    }),
    defineField({
      name: 'productSku',
      title: 'Product SKU',
      type: 'string',
      group: 'basic',
      description: 'Master SKU for this product. Individual size SKUs are set in Volumes & Prices.',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'barcode',
      title: 'Barcode (EAN / UPC)',
      type: 'string',
      group: 'basic',
      description: 'EAN-13 or UPC-A barcode for this product.',
      validation: (Rule) => Rule.max(50),
    }),

    // ─── Fragrance Details ────────────────────────────────────────────────────
    defineField({
      name: 'fragranceFamily',
      title: 'Fragrance Family',
      type: 'string',
      group: 'fragrance',
      options: {
        list: [
          { title: 'Woody', value: 'Woody' },
          { title: 'Floral', value: 'Floral' },
          { title: 'Citrus', value: 'Citrus' },
          { title: 'Oriental', value: 'Oriental' },
          { title: 'Fresh', value: 'Fresh' },
          { title: 'Aquatic', value: 'Aquatic' },
          { title: 'Gourmand', value: 'Gourmand' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topNotes_en',
      title: 'Top Notes (English)',
      type: 'array',
      group: 'fragrance',
      description: 'The initial impression of the fragrance (first 15–30 minutes).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: 'topNotes_ar',
      title: 'النوتات الرأسية (Arabic)',
      type: 'array',
      group: 'fragrance',
      description: 'The initial impression of the fragrance (first 15–30 minutes).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'middleNotes_en',
      title: 'Middle / Heart Notes (English)',
      type: 'array',
      group: 'fragrance',
      description: 'The core character of the fragrance (30 minutes – 2 hours).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: 'middleNotes_ar',
      title: 'النوتات القلبية (Arabic)',
      type: 'array',
      group: 'fragrance',
      description: 'The core character of the fragrance (30 minutes – 2 hours).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'baseNotes_en',
      title: 'Base Notes (English)',
      type: 'array',
      group: 'fragrance',
      description: 'The lingering finish of the fragrance (2+ hours).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.min(1).max(8),
    }),
    defineField({
      name: 'baseNotes_ar',
      title: 'النوتات القاعدية (Arabic)',
      type: 'array',
      group: 'fragrance',
      description: 'The lingering finish of the fragrance (2+ hours).',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'intensity',
      title: 'Intensity',
      type: 'string',
      group: 'fragrance',
      description: 'Overall potency of the scent.',
      options: {
        list: [
          { title: 'Light', value: 'Light' },
          { title: 'Moderate', value: 'Moderate' },
          { title: 'Strong', value: 'Strong' },
          { title: 'Intense', value: 'Intense' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sillage',
      title: 'Sillage (Projection)',
      type: 'string',
      group: 'fragrance',
      description: 'How far the scent projects from the wearer.',
      options: {
        list: [
          { title: 'Intimate', value: 'Intimate' },
          { title: 'Moderate', value: 'Moderate' },
          { title: 'Strong', value: 'Strong' },
          { title: 'Enormous', value: 'Enormous' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longevity',
      title: 'Longevity',
      type: 'string',
      group: 'fragrance',
      description: 'How long the fragrance lasts on skin.',
      options: {
        list: [
          { title: 'Poor (< 1 hr)', value: 'Poor' },
          { title: 'Weak (1–2 hrs)', value: 'Weak' },
          { title: 'Moderate (2–4 hrs)', value: 'Moderate' },
          { title: 'Long (4–8 hrs)', value: 'Long' },
          { title: 'Very Long (8+ hrs)', value: 'Very Long' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Pricing & Stock ──────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Base Price (USD)',
      type: 'number',
      group: 'pricing',
      description: 'Default display price. Use the Volumes array for size-specific pricing.',
      validation: (Rule) => Rule.required().positive().precision(2),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-At Price (USD)',
      type: 'number',
      group: 'pricing',
      description: 'Original / strikethrough price. Leave empty if no discount.',
      validation: (Rule) =>
        Rule.positive()
          .precision(2)
          .custom((compareAt, context) => {
            const price = (context.document as { price?: number })?.price
            if (compareAt !== undefined && price !== undefined && compareAt <= price) {
              return 'Compare-at price must be greater than the base price.'
            }
            return true
          }),
    }),
    defineField({
      name: 'volume',
      title: 'Volumes & Prices',
      type: 'array',
      group: 'pricing',
      description: 'Add one entry per bottle size.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'volumeOption',
          title: 'Volume Option',
          fields: [
            defineField({
              name: 'ml',
              title: 'Volume (ml)',
              type: 'number',
              validation: (Rule) => Rule.required().positive().integer(),
            }),
            defineField({
              name: 'price',
              title: 'Price (USD)',
              type: 'number',
              validation: (Rule) => Rule.required().positive().precision(2),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              description: 'Stock-keeping unit for this size variant.',
            }),
            defineField({
              name: 'isSample',
              title: 'Sample Size',
              type: 'boolean',
              description: 'Mark this as a sample/discovery size.',
              initialValue: false,
            }),
            defineField({
              name: 'stockQty',
              title: 'Stock Qty (this size)',
              type: 'number',
              description: 'Optional per-size stock. Overrides product-level stock when set.',
              validation: (Rule) => Rule.min(0).integer(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      group: 'pricing',
      description: 'Total units in stock across all sizes.',
      validation: (Rule) => Rule.required().min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: 'stockStatus',
      title: 'Stock Status Override',
      type: 'string',
      group: 'pricing',
      description: 'Override the automatic stock status derived from Stock Quantity.',
      options: {
        list: [
          { title: 'Auto (derived from quantity)', value: 'auto' },
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Low Stock', value: 'low_stock' },
          { title: 'Out of Stock', value: 'out_of_stock' },
          { title: 'Pre-order / Backorder', value: 'backorder' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),

    // ─── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      group: 'media',
      description: 'First image is used as the primary thumbnail.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for screen readers and SEO.',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption displayed beneath the image.',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'videos',
      title: 'Product Videos',
      type: 'array',
      group: 'media',
      description: 'Videos shown in the product gallery (supports direct URL or Mux).',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
            defineField({ name: 'muxPlaybackId', title: 'Mux Playback ID', type: 'string' }),
            defineField({ name: 'caption_en', title: 'Caption (English)', type: 'string', validation: (Rule) => Rule.max(120) }),
            defineField({ name: 'caption_ar', title: 'التعليق (Arabic)', type: 'string', validation: (Rule) => Rule.max(120) }),
            defineField({ name: 'posterImage', title: 'Poster Image', type: 'image', options: { hotspot: true } }),
          ],
          preview: { select: { title: 'caption_en', subtitle: 'videoUrl' } },
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),

    // ─── Merchandising ────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'merchandising',
      description: 'Show this product in the homepage featured section.',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Best Seller',
      type: 'boolean',
      group: 'merchandising',
      description: 'Displays a "Best Seller" badge on the product card.',
      initialValue: false,
    }),
    defineField({
      name: 'new',
      title: 'New Arrival',
      type: 'boolean',
      group: 'merchandising',
      description: 'Displays a "New" badge on the product card.',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'merchandising',
      description: 'Free-form tags for filtering and search (e.g. "unisex", "oud", "summer").',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'layeringProducts',
      title: 'Pairs / Layers Well With',
      type: 'array',
      group: 'merchandising',
      description: 'Products that complement or layer well with this fragrance (max 3).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: 'frequentlyBoughtTogether',
      title: 'Frequently Bought Together',
      type: 'array',
      group: 'merchandising',
      description: 'Products often purchased alongside this one (max 3).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      group: 'merchandising',
      description: 'Controls visibility on the storefront.',
      options: {
        list: [
          { title: 'Active — visible on store', value: 'active' },
          { title: 'Draft — hidden from store', value: 'draft' },
          { title: 'Archived — discontinued', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'scheduledPublishAt',
      title: 'Scheduled Publish Date',
      type: 'datetime',
      group: 'merchandising',
      description: 'Product becomes visible on the store at this date/time. Only applies when status is "Draft".',
    }),
    defineField({
      name: 'bundleProducts',
      title: 'Bundle — Included Products',
      type: 'array',
      group: 'merchandising',
      description: 'If this product is a bundle, list the included products here.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }], validation: (Rule) => Rule.required() }),
            defineField({ name: 'quantity', title: 'Quantity', type: 'number', initialValue: 1, validation: (Rule) => Rule.required().min(1).integer() }),
          ],
          preview: {
            select: { title: 'product.name_en', subtitle: 'quantity' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title, subtitle: `Qty: ${val.quantity ?? 1}` }),
          },
        }),
      ],
      validation: (Rule) => Rule.max(10),
    }),

    // ─── Reviews ──────────────────────────────────────────────────────────────
    defineField({
      name: 'reviews',
      title: 'Customer Reviews',
      group: 'reviews',
      type: 'array',
      description: 'Manually curated customer reviews shown on the product page.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Customer Name', type: 'string', validation: (Rule) => Rule.required().max(80) }),
            defineField({ name: 'location', title: 'Location', type: 'string', validation: (Rule) => Rule.max(60) }),
            defineField({ name: 'rating', title: 'Rating (1–5)', type: 'number', validation: (Rule) => Rule.required().min(1).max(5).integer(), initialValue: 5 }),
            defineField({ name: 'review_en', title: 'Review (English)', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(500) }),
            defineField({ name: 'review_ar', title: 'المراجعة (Arabic)', type: 'text', rows: 3, validation: (Rule) => Rule.max(500) }),
            defineField({ name: 'date', title: 'Review Date', type: 'date' }),
            defineField({ name: 'verified', title: 'Verified Purchase', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'rating' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({
              title: val.title,
              subtitle: `${'★'.repeat(val.rating ?? 5)} ${val.rating ?? 5}/5`,
            }),
          },
        }),
      ],
    }),

    // ─── Additional Content ───────────────────────────────────────────────────
    defineField({
      name: 'ingredients',
      title: 'Ingredients / INCI List',
      group: 'content',
      type: 'text',
      rows: 5,
      description: 'Full ingredient list (INCI). Shown in accordion on product page.',
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'shippingText_en',
      title: 'Shipping & Returns (English)',
      group: 'content',
      type: 'array',
      description: 'Custom shipping/returns text for this product. Falls back to site default if empty.',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'shippingText_ar',
      title: 'الشحن والإرجاع (Arabic)',
      group: 'content',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ─── Page Builder ─────────────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Page Sections',
      group: 'pageBuilder',
      type: 'array',
      description: 'Add optional sections below the product detail (banners, FAQs, testimonials, etc.).',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'customBannerSection' }),
        defineArrayMember({ type: 'videoBannerSection' }),
        defineArrayMember({ type: 'imageWithTextSection' }),
        defineArrayMember({ type: 'videoWithTextSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'multiColumnSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'instagramFeedSection' }),
        defineArrayMember({ type: 'countdownTimerSection' }),
        defineArrayMember({ type: 'beforeAfterSection' }),
        defineArrayMember({ type: 'comparisonTableSection' }),
        defineArrayMember({ type: 'tabsSection' }),
        defineArrayMember({ type: 'upsellSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'trustBarSection' }),
        defineArrayMember({ type: 'brandStorySection' }),
      ],
    }),

    // ─── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle_en',
      title: 'SEO Title (English)',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title> tag. Recommended 50–60 characters.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoTitle_ar',
      title: 'عنوان SEO (Arabic)',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title> tag. Recommended 50–60 characters.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription_en',
      title: 'SEO Meta Description (English)',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Shown in search engine results. Recommended 150–160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription_ar',
      title: 'وصف SEO (Arabic)',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Shown in search engine results. Recommended 150–160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {
      title: 'name_en',
      subtitle: 'fragranceFamily',
      media: 'images.0',
    },
    prepare(val: any) {
      return {
        title: val.title,
        subtitle: val.subtitle ? `Fragrance Family: ${val.subtitle}` : 'No fragrance family set',
        media: val.media,
      }
    },
  } as any,
})
