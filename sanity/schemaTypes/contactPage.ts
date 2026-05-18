import { defineType, defineField } from 'sanity'

const _contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading_en', title: 'Heading (EN)', type: 'string', initialValue: 'Get in Touch' }),
    defineField({ name: 'heading_ar', title: 'Heading (AR)', type: 'string' }),
    defineField({ name: 'subtext_en', title: 'Subtext (EN)', type: 'text' }),
    defineField({ name: 'subtext_ar', title: 'Subtext (AR)', type: 'text' }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address_en', title: 'Address (EN)', type: 'text' }),
    defineField({ name: 'address_ar', title: 'Address (AR)', type: 'text' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contactPage = Object.assign(_contactPage, { __experimental_actions: ['update', 'publish'] } as any)
