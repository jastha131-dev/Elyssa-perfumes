import { defineType, defineField, defineArrayMember } from 'sanity'

const _contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading_en', title: 'Heading (EN)', type: 'string', initialValue: 'Get in Touch' }),
    defineField({ name: 'heading_ar', title: 'Heading (AR)', type: 'string' }),
    defineField({ name: 'subtext_en', title: 'Subtext (EN)', type: 'text' }),
    defineField({ name: 'subtext_ar', title: 'Subtext (AR)', type: 'text' }),
    defineField({ name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })] }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address_en', title: 'Address (EN)', type: 'text' }),
    defineField({ name: 'address_ar', title: 'Address (AR)', type: 'text' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' }),
    defineField({
      name: 'overlayOpacity',
      title: 'Hero Overlay Darkness (0–100)',
      type: 'number',
      description: 'Controls how dark the hero background overlay is. Lower = more visible image. Default: 55',
      initialValue: 55,
      validation: (R) => R.min(0).max(100),
    }),
    defineField({
      name: 'showMap',
      title: 'Show Map Section',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle the map section visible/hidden on the contact page.',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      type: 'url',
      description: 'OpenStreetMap embed URL. Leave blank to use the default Dubai DIFC location.',
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      description: 'Rows shown in the "Operating Hours" card on the contact page.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'day', title: 'Day / Range', type: 'string' }),
            defineField({ name: 'hours', title: 'Hours', type: 'string' }),
          ],
          preview: { select: { title: 'day', subtitle: 'hours' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contactPage = Object.assign(_contactPage, { __experimental_actions: ['update', 'publish'] } as any)
