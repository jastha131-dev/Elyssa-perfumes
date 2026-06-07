import { defineField, defineType } from 'sanity'

export const productReview = defineType({
  name: 'productReview',
  title: 'Product Review',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'name', title: 'Customer Name', type: 'string', validation: (R) => R.required().max(80) }),
    defineField({ name: 'email', title: 'Email', type: 'string', description: 'Not shown publicly.' }),
    defineField({ name: 'location', title: 'Location', type: 'string', validation: (R) => R.max(60) }),
    defineField({ name: 'rating', title: 'Overall Rating (1–5)', type: 'number', validation: (R) => R.required().min(1).max(5), initialValue: 5 }),
    defineField({ name: 'title', title: 'Review Title', type: 'string', validation: (R) => R.max(120) }),
    defineField({ name: 'body', title: 'Review', type: 'text', rows: 4, validation: (R) => R.required().max(1000) }),
    // Attribute ratings (1–5) — power the rating bars
    defineField({ name: 'ratingScent', title: 'Scent (1–5)', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'ratingLongevity', title: 'Longevity (1–5)', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'ratingValue', title: 'Value for Money (1–5)', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'verified', title: 'Verified Purchase', type: 'boolean', initialValue: false }),
    defineField({ name: 'approved', title: 'Approved (visible on site)', type: 'boolean', initialValue: true }),
    defineField({ name: 'createdAt', title: 'Submitted At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', rating: 'rating', product: 'product.name_en', approved: 'approved' },
    prepare: ({ title, rating, product, approved }) => ({
      title: `${title} — ${'★'.repeat(rating ?? 5)}`,
      subtitle: `${product ?? 'Product'}${approved ? '' : ' · ⏳ pending'}`,
    }),
  },
})
