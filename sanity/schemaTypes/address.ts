import { defineField, defineType } from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'document',
  fields: [
    defineField({ name: 'user', title: 'User', type: 'reference', to: [{ type: 'user' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Home, Work', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'firstName', title: 'First Name', type: 'string', validation: (Rule) => Rule.required().max(80) }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string', validation: (Rule) => Rule.required().max(80) }),
    defineField({ name: 'address1', title: 'Address Line 1', type: 'string', validation: (Rule) => Rule.required().max(200) }),
    defineField({ name: 'address2', title: 'Address Line 2', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: 'state', title: 'State / Emirate', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'AE', validation: (Rule) => Rule.required() }),
    defineField({ name: 'postalCode', title: 'Postal Code', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'isDefault', title: 'Default Address', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'firstName', subtitle: 'city' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: `${val.title}`, subtitle: val.subtitle }),
  },
})
