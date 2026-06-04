import { defineField, defineType, defineArrayMember } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Metadata' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title_en', title: 'Title (English)', type: 'string', group: 'content', validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', group: 'content', validation: (Rule) => Rule.max(120) }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title_en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Guide', value: 'Guide' },
          { title: 'Education', value: 'Education' },
          { title: 'Behind the Scenes', value: 'Behind the Scenes' },
          { title: 'Inspiration', value: 'Inspiration' },
          { title: 'News', value: 'News' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({ name: 'excerpt_en', title: 'Excerpt (English)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'excerpt_ar', title: 'المقتطف (Arabic)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.max(120) })],
    }),
    defineField({
      name: 'body_en',
      title: 'Body (English)',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        }),
        defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt' }), defineField({ name: 'caption', type: 'string', title: 'Caption' })] }),
      ],
    }),
    defineField({
      name: 'body_ar',
      title: 'المحتوى (Arabic)',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
      ],
    }),
    defineField({ name: 'readTime', title: 'Read Time', type: 'string', group: 'meta', description: 'e.g. 5 min read', validation: (Rule) => Rule.max(20) }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', group: 'meta' }),
    defineField({ name: 'featured', title: 'Featured Article', type: 'boolean', group: 'meta', initialValue: false }),
    defineField({ name: 'seoTitle_en', title: 'SEO Title (English)', type: 'string', group: 'seo', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'seoTitle_ar', title: 'عنوان SEO (Arabic)', type: 'string', group: 'seo', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'seoDescription_en', title: 'SEO Description (English)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_ar', title: 'وصف SEO (Arabic)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
  ],
  orderings: [{ title: 'Newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title_en', subtitle: 'category', media: 'coverImage' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: val.subtitle, media: val.media }),
  },
})
