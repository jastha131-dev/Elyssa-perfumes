import { defineType, defineField } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({ name: 'question_en', title: 'Question (EN)', type: 'string', validation: R => R.required() }),
    defineField({ name: 'question_ar', title: 'Question (AR)', type: 'string' }),
    defineField({ name: 'answer_en', title: 'Answer (EN)', type: 'text', validation: R => R.required() }),
    defineField({ name: 'answer_ar', title: 'Answer (AR)', type: 'text' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Shipping', 'Returns', 'Products', 'Orders', 'General'] },
      initialValue: 'General',
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Category then Order', name: 'categoryOrder', by: [{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question_en', subtitle: 'category' } },
})
