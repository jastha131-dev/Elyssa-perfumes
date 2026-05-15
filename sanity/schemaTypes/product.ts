import React from 'react'
import { defineField, defineType, defineArrayMember } from 'sanity'

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
