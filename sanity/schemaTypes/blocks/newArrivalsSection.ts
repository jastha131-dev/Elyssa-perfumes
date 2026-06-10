import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const newArrivalsSection = defineType({
  name: 'newArrivalsSection',
  title: 'New Arrivals',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string' }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string' }),
    defineField({
      name: 'limit',
      title: 'Max Products',
      type: 'number',
      description: 'Maximum number of new products to show (up to 12).',
      initialValue: 8,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Grid', value: 'grid' }, { title: 'Carousel', value: 'carousel' }], layout: 'radio' },
      initialValue: 'grid',
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
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
      title: val.title || getSectionLabel('newArrivalsSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('newArrivalsSection'),
    }),
  },
})
