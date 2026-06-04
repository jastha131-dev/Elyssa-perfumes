// sanity/schemaTypes/author.ts
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'name_ar',
      title: 'الاسم (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name_en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role_en',
      title: 'Role (English)',
      type: 'string',
      description: 'e.g. Fragrance Writer',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'role_ar',
      title: 'الدور (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'bio_en',
      title: 'Bio (English)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'bio_ar',
      title: 'السيرة الذاتية (Arabic)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.max(120) }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name_en', subtitle: 'role_en', media: 'photo' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: val.subtitle, media: val.media }),
  },
})
