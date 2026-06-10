import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const categoryTilesSection = defineType({
  name: 'categoryTilesSection',
  title: 'Category Tiles Strip',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', description: 'Optional label shown above tiles (e.g. "Browse by category")' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({
      name: 'tiles',
      title: 'Tiles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string' }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
            }),
            defineField({ name: 'href', title: 'Link URL', type: 'string', description: 'URL to navigate to when tile is clicked (e.g. /products?category=women)' }),
          ],
          preview: {
            select: { title: 'label_en', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'bgColor',
      title: 'Strip Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Warm Cream', value: '#EDE8E0' },
          { title: 'White', value: '#FFFFFF' },
          { title: 'Stone', value: '#F5F0E8' },
          { title: 'Dark', value: '#1A1916' },
        ],
        layout: 'radio',
      },
      initialValue: '#EDE8E0',
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
      title: val.title || getSectionLabel('categoryTilesSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('categoryTilesSection'),
    }),
  },
})
