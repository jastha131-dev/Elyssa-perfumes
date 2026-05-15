import { defineField, defineType } from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label_en',
      title: 'Button Label (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'label_ar',
      title: 'التصنيف (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'Relative path (e.g. /products) or absolute URL.',
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary — gold filled', value: 'primary' },
          { title: 'Secondary — outlined gold', value: 'secondary' },
          { title: 'Ghost — transparent', value: 'ghost' },
          { title: 'Outline — cream border', value: 'outline' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label_en', subtitle: 'style' },
  },
})
