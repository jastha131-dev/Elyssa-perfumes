import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const videoBannerSection = defineType({
  name: 'videoBannerSection',
  title: 'Video Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
    defineField({ name: 'muxPlaybackId', title: 'Mux Playback ID', type: 'string' }),
    defineField({ name: 'videoFile', title: 'Upload Video File (MP4/WebM)', type: 'file', description: 'Upload a video directly. Takes priority over Video URL / Mux.', options: { accept: 'video/mp4,video/webm,video/quicktime' } }),
    defineField({
      name: 'posterImage',
      title: 'Poster / Fallback Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'subtext_ar', title: 'النص (Arabic)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'overlayOpacity', title: 'Overlay Opacity (%)', type: 'number', initialValue: 40, validation: (Rule) => Rule.min(0).max(100) }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Fullscreen', value: 'fullscreen' }, { title: 'Split (text + video)', value: 'split' }], layout: 'radio' },
      initialValue: 'fullscreen',
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({ name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: true }),
    defineField({ name: 'muted', title: 'Muted', type: 'boolean', initialValue: true }),
    defineField({ name: 'loop', title: 'Loop', type: 'boolean', initialValue: true }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'headline_en', isVisible: 'isVisible', image: 'posterImage' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('videoBannerSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('videoBannerSection'),
    }),
  },
})
