import { defineField, defineType } from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'passwordHash', title: 'Password Hash', type: 'string', readOnly: true, description: 'bcrypt hash — never edit manually' }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: [{ title: 'Customer', value: 'customer' }, { title: 'Admin', value: 'admin' }], layout: 'radio' },
      initialValue: 'customer',
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: val.subtitle }),
  },
})
