import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../components/SectionMediaIcon'

export const collection = defineType({
  name: 'collection',
  title: 'Featured Collections',
  type: 'document',
  description: 'Collection pages with hero, smart/manual product filters, SEO, and page builder sections.',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'products', title: 'Products' },
    { name: 'seo', title: 'SEO' },
    { name: 'pageBuilder', title: 'Page Builder' },
  ],

  fields: [
    // ─── Core Identity ────────────────────────────────────────────────────────
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'title_ar',
      title: 'العنوان (Arabic)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title_en',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Tile Image (existing) ────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Tile Background Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Background image shown on the collection tile.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Full-width hero image shown at the top of the collection page.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'headline_en',
      title: 'Hero Headline (English)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'headline_ar',
      title: 'العنوان الرئيسي (Arabic)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subtext_en',
      title: 'Hero Subtext (English)',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'subtext_ar',
      title: 'النص الفرعي (Arabic)',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button (Primary)',
      type: 'ctaButton',
      group: 'content',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'CTA Button (Secondary)',
      type: 'ctaButton',
      group: 'content',
    }),
    defineField({
      name: 'ctaTertiary',
      title: 'CTA Button (Third)',
      type: 'ctaButton',
      group: 'content',
    }),

    // ─── Display Settings ─────────────────────────────────────────────────────
    defineField({
      name: 'filterParam',
      title: 'Filter URL Parameter',
      type: 'string',
      group: 'content',
      description: 'URL query string for this collection. Examples: "sort=newest", "sort=best_selling", "category=gift-sets"',
    }),
    defineField({
      name: 'showInTiles',
      title: 'Show in Category Tiles',
      type: 'boolean',
      group: 'content',
      description: 'Display this collection in the products page tile row.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers appear first.',
      initialValue: 99,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'content',
      description: 'Inactive collections are hidden from the storefront.',
      initialValue: true,
    }),
    defineField({
      name: 'scheduledPublishAt',
      title: 'Scheduled Publish At',
      type: 'datetime',
      group: 'content',
      description: 'Optional: date/time when this collection goes live.',
    }),

    // ─── Products ─────────────────────────────────────────────────────────────
    defineField({
      name: 'filterType',
      title: 'Filter Type',
      type: 'string',
      group: 'products',
      options: {
        list: [
          { title: 'Manual — hand-pick products', value: 'manual' },
          { title: 'Smart — rule-based filters',  value: 'smart'  },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'manualProducts',
      title: 'Manual Products',
      type: 'array',
      group: 'products',
      description: 'Shown when Filter Type is "manual". Drag to reorder.',
      hidden: ({ document }) => (document as { filterType?: string })?.filterType !== 'manual',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
        }),
      ],
    }),
    defineField({
      name: 'smartFilters',
      title: 'Smart Filters',
      type: 'object',
      group: 'products',
      description: 'Shown when Filter Type is "smart". Products matching ALL active rules are included.',
      hidden: ({ document }) => (document as { filterType?: string })?.filterType !== 'smart',
      fields: [
        defineField({
          name: 'fragranceFamilies',
          title: 'Fragrance Families',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          options: {
            list: [
              { title: 'Woody',     value: 'Woody'     },
              { title: 'Floral',    value: 'Floral'    },
              { title: 'Citrus',    value: 'Citrus'    },
              { title: 'Oriental',  value: 'Oriental'  },
              { title: 'Fresh',     value: 'Fresh'     },
              { title: 'Aquatic',   value: 'Aquatic'   },
              { title: 'Gourmand',  value: 'Gourmand'  },
            ],
          },
        }),
        defineField({
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          description: 'Products must have at least one of these tags.',
        }),
        defineField({
          name: 'priceMin',
          title: 'Min Price',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: 'priceMax',
          title: 'Max Price',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: 'featured',
          title: 'Featured Only',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'bestSeller',
          title: 'Best Sellers Only',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'new',
          title: 'New Arrivals Only',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'defaultSort',
      title: 'Default Sort',
      type: 'string',
      group: 'products',
      options: {
        list: [
          { title: 'Newest First',     value: '_createdAt_desc' },
          { title: 'Price: Low → High', value: 'price_asc'      },
          { title: 'Price: High → Low', value: 'price_desc'     },
          { title: 'Name A → Z',       value: 'name_asc'        },
        ],
        layout: 'radio',
      },
      initialValue: '_createdAt_desc',
    }),

    // ─── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle_en',
      title: 'SEO Title (English)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoTitle_ar',
      title: 'عنوان SEO (Arabic)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription_en',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription_ar',
      title: 'وصف SEO (Arabic)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),

    // ─── Page Builder ─────────────────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'pageBuilder',
      description: 'Add, reorder, and toggle visibility of collection page sections.',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'customBannerSection' }),
        defineArrayMember({ type: 'featuredProductsSection' }),
        defineArrayMember({ type: 'bestSellersSection' }),
        defineArrayMember({ type: 'categoriesSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'scentBannerSection' }),
        defineArrayMember({ type: 'brandStorySection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'trustBarSection' }),
        // Phase 1
        defineArrayMember({ type: 'videoBannerSection' }),
        defineArrayMember({ type: 'newArrivalsSection' }),
        defineArrayMember({ type: 'collectionsGridSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'imageWithTextSection' }),
        defineArrayMember({ type: 'videoWithTextSection' }),
        defineArrayMember({ type: 'instagramFeedSection' }),
        defineArrayMember({ type: 'countdownTimerSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'multiColumnSection' }),
        // Phase 2
        defineArrayMember({ type: 'beforeAfterSection' }),
        defineArrayMember({ type: 'comparisonTableSection' }),
        defineArrayMember({ type: 'tabsSection' }),
        defineArrayMember({ type: 'upsellSection' }),
      ],
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'filterParam',
      media: 'image',
      filterType: 'filterType',
      isActive: 'isActive',
    },
    prepare(val: any) {
      const activeLabel = val.isActive === false ? ' [inactive]' : ''
      const filterLabel = val.filterType ? ` · ${val.filterType}` : ''
      return {
        title: `${val.title}${activeLabel}`,
        subtitle: val.subtitle
          ? `Filter: ?${val.subtitle}${filterLabel}`
          : `No filter set${filterLabel}`,
        media: val.media,
      }
    },
  } as any,
})
