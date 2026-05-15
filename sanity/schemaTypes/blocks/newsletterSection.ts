import { defineField, defineType } from 'sanity'

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'buttonLabel', title: 'Button Label', type: 'string', initialValue: 'Subscribe', validation: (Rule) => Rule.max(40) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'bgImage' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title ?? 'Newsletter', subtitle: 'newsletterSection', media: val.media }),
  },
})
