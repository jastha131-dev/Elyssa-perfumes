import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich Text',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'content_en', title: 'Content (English)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'content_ar', title: 'المحتوى (Arabic)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: { list: [{ title: 'Narrow', value: 'narrow' }, { title: 'Normal', value: 'normal' }, { title: 'Wide', value: 'wide' }], layout: 'radio' },
      initialValue: 'normal',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Center', value: 'center' }], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: getSectionLabel('richTextSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('richTextSection'),
    }),
  },
})
