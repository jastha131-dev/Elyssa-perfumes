import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name_en',
      title: 'Category Name (English)',
      type: 'string',
      description: 'Display name shown to customers (e.g. "Men", "Women", "Unisex", "Gift Sets").',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'name_ar',
      title: 'اسم التصنيف (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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
      title: 'Description (English)',
      type: 'text',
      rows: 3,
      description: 'A short description of this category used on collection pages and SEO.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'description_ar',
      title: 'الوصف (Arabic)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Hero or thumbnail image representing this category.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO.',
          validation: (Rule) => Rule.required().max(120),
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in navigation and category listings.',
      validation: (Rule) => Rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'subcategories',
      title: 'Subcategories',
      type: 'array',
      description: 'Optional subcategories nested under this category (e.g. Men → Oud, Woody, Fresh).',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name_en', direction: 'asc' }],
    },
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {
      title: 'name_en',
      subtitle: 'description_en',
      media: 'image',
      order: 'order',
    },
    prepare(val: any) {
      return {
        title: val.title,
        subtitle: val.subtitle
          ? val.subtitle.slice(0, 60) + (val.subtitle.length > 60 ? '…' : '')
          : `Order: ${val.order}`,
        media: val.media,
      }
    },
  } as any,
})
