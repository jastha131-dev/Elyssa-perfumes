// sanity/schemaTypes/giftCardOrder.ts
import { defineField, defineType } from 'sanity'

export const giftCardOrder = defineType({
  name: 'giftCardOrder',
  title: 'Gift Card Order',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Gift Card Code', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'amountCents', title: 'Amount (cents)', type: 'number', validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'usd', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'stripeSessionId', title: 'Stripe Session ID', type: 'string' }),
    defineField({ name: 'recipientName', title: 'Recipient Name', type: 'string' }),
    defineField({ name: 'message', title: 'Personal Message', type: 'text', rows: 3 }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'code', subtitle: 'status', amount: 'amountCents' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: `${val.subtitle} · $${Math.round(val.amount / 100)}` }),
  },
})
