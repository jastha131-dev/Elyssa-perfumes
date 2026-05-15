import { defineField, defineType, defineArrayMember } from 'sanity'

export const trustBarSection = defineType({
  name: 'trustBarSection',
  title: 'Trust Bar',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'items',
      title: 'Trust Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string', title: 'Value', description: 'e.g. "100%"' }),
            defineField({ name: 'label', type: 'string', title: 'Label', description: 'e.g. "Authentic"' }),
            defineField({ name: 'icon', type: 'string', title: 'Icon', description: 'emoji or lucide icon name' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: {},
    prepare: () => ({ title: 'Trust Bar', subtitle: 'trustBarSection' }),
  },
})
