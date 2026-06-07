import { defineField, defineType } from 'sanity'

export const productQuestion = defineType({
  name: 'productQuestion',
  title: 'Product Question (Q&A)',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'name', title: 'Asked By', type: 'string', validation: (R) => R.required().max(80) }),
    defineField({ name: 'email', title: 'Email', type: 'string', description: 'Not shown publicly.' }),
    defineField({ name: 'question', title: 'Question', type: 'text', rows: 3, validation: (R) => R.required().max(600) }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, description: 'Reply shown publicly under the question.' }),
    defineField({ name: 'approved', title: 'Approved (visible on site)', type: 'boolean', initialValue: true }),
    defineField({ name: 'createdAt', title: 'Submitted At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'question', product: 'product.name_en', answered: 'answer', approved: 'approved' },
    prepare: ({ title, product, answered, approved }) => ({
      title: title ?? 'Question',
      subtitle: `${product ?? 'Product'}${answered ? ' · ✓ answered' : ' · ❓ unanswered'}${approved ? '' : ' · ⏳ pending'}`,
    }),
  },
})
