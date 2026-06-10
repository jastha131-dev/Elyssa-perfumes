import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const countdownTimerSection = defineType({
  name: 'countdownTimerSection',
  title: 'Countdown Timer',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string' }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2 }),
    defineField({ name: 'subtext_ar', title: 'النص (Arabic)', type: 'text', rows: 2 }),
    defineField({ name: 'endDate', title: 'End Date & Time', type: 'datetime' }),
    defineField({ name: 'expiredText_en', title: 'Expired Message (English)', type: 'string', description: 'Shown after countdown ends.' }),
    defineField({ name: 'expiredText_ar', title: 'رسالة الانتهاء (Arabic)', type: 'string' }),
    defineField({
      name: 'bgImage',
      title: 'Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: [{ title: 'Minimal', value: 'minimal' }, { title: 'Card', value: 'card' }, { title: 'Full Bleed', value: 'full-bleed' }], layout: 'radio' },
      initialValue: 'minimal',
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
    select: { title: 'headline_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('countdownTimerSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('countdownTimerSection'),
    }),
  },
})
