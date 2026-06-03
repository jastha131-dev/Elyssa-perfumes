import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const videoWithTextSection = defineType({
  name: 'videoWithTextSection',
  title: 'Video with Text',
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
    defineField({ name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow (English)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'eyebrow_ar', title: 'العنوان الصغير (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'body_en', title: 'Body Text (English)', type: 'text', rows: 4, validation: (Rule) => Rule.max(600) }),
    defineField({ name: 'body_ar', title: 'النص (Arabic)', type: 'text', rows: 4, validation: (Rule) => Rule.max(600) }),
    defineField({
      name: 'videoPosition',
      title: 'Video Position',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Right', value: 'right' }], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      options: { list: [{ title: 'White', value: 'white' }, { title: 'Cream', value: 'cream' }, { title: 'Black', value: 'black' }], layout: 'radio' },
      initialValue: 'white',
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
  ],
  preview: {
    select: { title: 'headline_en', isVisible: 'isVisible', image: 'posterImage' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('videoWithTextSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('videoWithTextSection'),
    }),
  },
})
