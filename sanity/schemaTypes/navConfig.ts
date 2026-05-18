import { defineField, defineType } from 'sanity'

export const navConfig = defineType({
  name: 'navConfig',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Nav Items',
      type: 'array',
      description: 'Drag rows to reorder. Uncheck "Visible" to hide from the nav bar.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({
              name: 'label_en',
              title: 'Label (English)',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label_ar',
              title: 'Label (Arabic)',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Path',
              type: 'string',
              description: 'No locale prefix. E.g. /quiz  or  /products?sort=newest',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight (golden badge style)',
              type: 'boolean',
              description: 'Use the special gold bordered button style (good for Quiz/AI links)',
              initialValue: false,
            }),
            defineField({
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'label_en',
              subtitle: 'href',
              visible: 'visible',
            },
            prepare({ title, subtitle, visible }) {
              return {
                title: `${visible === false ? '🙈 ' : ''}${title ?? '(untitled)'}`,
                subtitle,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation Config' }
    },
  },
})
