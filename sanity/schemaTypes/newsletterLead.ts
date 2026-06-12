import { defineField, defineType } from 'sanity'

export const newsletterLead = defineType({
  name: 'newsletterLead',
  title: 'Newsletter Leads',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      description: 'en or ar — captured from URL at submission time',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'nationality' },
  },
})
