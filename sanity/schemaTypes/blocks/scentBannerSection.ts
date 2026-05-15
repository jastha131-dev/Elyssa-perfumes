import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const scentBannerSection = defineType({
  name: 'scentBannerSection',
  title: 'Scent Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string', description: 'e.g. "Explore by Note"', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', description: 'Use \\n to split into lines.', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'highlightWord', title: 'Highlighted Word(s)', type: 'string', description: 'Italic gold portion of headline, e.g. "A Story"', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'subtext', title: 'Body Text', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
  ],
  preview: {
    select: {
      title: 'headline',
      isVisible: 'isVisible',
      image: 'bgImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('scentBannerSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('scentBannerSection'),
    }),
  },
})
