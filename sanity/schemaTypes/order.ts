import { defineField, defineType, defineArrayMember } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'user', title: 'User', type: 'reference', to: [{ type: 'user' }] }),
    defineField({ name: 'stripeSessionId', title: 'Stripe Session ID', type: 'string', readOnly: true }),
    defineField({ name: 'stripePaymentIntentId', title: 'Stripe Payment Intent', type: 'string', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'productId', type: 'string', title: 'Product ID' }),
            defineField({ name: 'productName', type: 'string', title: 'Product Name' }),
            defineField({ name: 'imageUrl', type: 'url', title: 'Image URL' }),
            defineField({ name: 'quantity', type: 'number', title: 'Quantity' }),
            defineField({ name: 'ml', type: 'number', title: 'Volume (ml)' }),
            defineField({ name: 'price', type: 'number', title: 'Unit Price' }),
          ],
          preview: { select: { title: 'productName', subtitle: 'quantity' } },
        }),
      ],
    }),
    defineField({ name: 'subtotal', title: 'Subtotal', type: 'number' }),
    defineField({ name: 'discount', title: 'Discount', type: 'number' }),
    defineField({ name: 'shipping', title: 'Shipping', type: 'number' }),
    defineField({ name: 'total', title: 'Total', type: 'number' }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'usd' }),
    defineField({ name: 'shippingAddress', title: 'Shipping Address', type: 'text', rows: 4 }),
    defineField({ name: 'trackingNumber', title: 'Tracking Number', type: 'string' }),
    defineField({ name: 'trackingUrl', title: 'Tracking URL', type: 'url' }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 2 }),
    defineField({ name: 'placedAt', title: 'Placed At', type: 'datetime' }),
  ],
  orderings: [{ title: 'Newest', name: 'placedAtDesc', by: [{ field: 'placedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'stripeSessionId', subtitle: 'status', total: 'total' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title?.slice(-8) ?? 'Order', subtitle: `${val.subtitle} · $${val.total ?? 0}` }),
  },
})
