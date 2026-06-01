import { defineField, defineType } from 'sanity'

export const announcementBar = defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({ name: 'isEnabled', title: 'Enabled', type: 'boolean', initialValue: false }),
    defineField({ name: 'text_en', title: 'Text (English)', type: 'string', validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'text_ar', title: 'النص (Arabic)', type: 'string', validation: (Rule) => Rule.max(200) }),
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Black', value: 'black' },
          { title: 'Cream', value: 'cream' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'gold',
    }),
    defineField({
      name: 'customBgColor',
      title: 'Custom Background Color (Hex)',
      type: 'string',
      description: 'Only used when Background Color is set to Custom.',
      hidden: ({ parent }) => parent?.bgColor !== 'custom',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: { list: [{ title: 'Light (white)', value: 'light' }, { title: 'Dark (black)', value: 'dark' }], layout: 'radio' },
      initialValue: 'dark',
    }),
    defineField({ name: 'link', title: 'Link URL', type: 'url' }),
    defineField({ name: 'linkLabel_en', title: 'Link Label (English)', type: 'string', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'linkLabel_ar', title: 'نص الرابط (Arabic)', type: 'string', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'dismissible', title: 'Dismissible (show × button)', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'text_en', isEnabled: 'isEnabled' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || 'Announcement Bar',
      subtitle: val.isEnabled ? '🟢 Active' : '🔴 Disabled',
    }),
  },
})
