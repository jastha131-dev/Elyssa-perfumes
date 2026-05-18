import { defineField, defineType } from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Featured Collections',
  type: 'document',
  description: 'Collection tiles shown on the products page (e.g. New Arrivals, Best Sellers, Gift Sets).',
  fields: [
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'title_ar',
      title: 'العنوان (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title_en',
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Tile Background Image',
      type: 'image',
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
    defineField({
      name: 'filterParam',
      title: 'Filter URL Parameter',
      type: 'string',
      description: 'URL query string for this collection. Examples: "sort=newest", "sort=best_selling", "category=gift-sets"',
    }),
    defineField({
      name: 'showInTiles',
      title: 'Show in Category Tiles',
      type: 'boolean',
      description: 'Display this collection in the products page tile row.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 99,
      validation: (Rule) => Rule.integer().min(0),
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
    },
    prepare(val: any) {
      return {
        title: val.title,
        subtitle: val.subtitle ? `Filter: ?${val.subtitle}` : 'No filter set',
        media: val.media,
      }
    },
  } as any,
})
