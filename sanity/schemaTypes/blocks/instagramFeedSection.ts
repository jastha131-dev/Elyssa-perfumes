import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const instagramFeedSection = defineType({
  name: 'instagramFeedSection',
  title: 'Instagram Feed',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'handle', title: 'Instagram Handle', type: 'string', description: 'Display label shown in the header, e.g. @luxeparfum' }),
    defineField({ name: 'profileUrl', title: 'Instagram Profile URL', type: 'url', description: 'Full link that opens when a visitor clicks any photo, e.g. https://instagram.com/luxeparfum' }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })] }),
            defineField({ name: 'caption_en', title: 'Caption (English)', type: 'string' }),
            defineField({ name: 'caption_ar', title: 'التعليق (Arabic)', type: 'string' }),
            defineField({ name: 'link', title: 'Link URL', type: 'url' }),
          ],
          preview: { select: { media: 'image', title: 'caption_en' } },
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [{ title: '3 Columns', value: 3 }, { title: '4 Columns', value: 4 }, { title: '6 Columns', value: 6 }] },
      initialValue: 4,
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
      title: val.title || getSectionLabel('instagramFeedSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('instagramFeedSection'),
    }),
  },
})
