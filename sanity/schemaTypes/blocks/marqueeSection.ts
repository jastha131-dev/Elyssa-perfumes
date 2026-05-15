import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const marqueeSection = defineType({
  name: 'marqueeSection',
  title: 'Marquee Strip',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'text',
      title: 'Marquee Text',
      type: 'string',
      description: 'Text that scrolls. Separate items with  •  (bullet).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'speed',
      title: 'Scroll Speed (seconds)',
      type: 'number',
      description: 'Duration of one full scroll. Lower = faster.',
      initialValue: 30,
      validation: (Rule) => Rule.min(5).max(120),
    }),
  ],
  preview: {
    select: {
      title: 'text',
      isVisible: 'isVisible',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('marqueeSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('marqueeSection'),
    }),
  },
})
