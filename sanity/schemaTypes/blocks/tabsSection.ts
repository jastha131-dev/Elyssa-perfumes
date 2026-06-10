import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const tabsSection = defineType({
  name: 'tabsSection',
  title: 'Tabs Section',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string' }),
            defineField({ name: 'label_en', title: 'Tab Label (English)', type: 'string' }),
            defineField({ name: 'label_ar', title: 'التبويب (Arabic)', type: 'string' }),
            defineField({ name: 'content_en', title: 'Content (English)', type: 'array', of: [{ type: 'block' }] }),
            defineField({ name: 'content_ar', title: 'المحتوى (Arabic)', type: 'array', of: [{ type: 'block' }] }),
          ],
          preview: { select: { title: 'label_en', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('tabsSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('tabsSection'),
    }),
  },
})
