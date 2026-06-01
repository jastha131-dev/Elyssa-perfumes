import { defineField, defineType, defineArrayMember } from 'sanity'

export const promotion = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'conditions', title: 'Conditions' },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Promotion Name', type: 'string', group: 'basics', description: 'Internal name for this promotion.', validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', group: 'basics', initialValue: true }),
    defineField({ name: 'code', title: 'Coupon Code', type: 'string', group: 'basics', description: 'Customer-entered code. Leave blank for automatic promotions.', validation: (Rule) => Rule.uppercase().max(30) }),
    defineField({
      name: 'type',
      title: 'Discount Type',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Percentage Off', value: 'percentage' },
          { title: 'Fixed Amount Off', value: 'fixed' },
          { title: 'Free Shipping', value: 'free_shipping' },
          { title: 'Buy X Get Y Free', value: 'buy_x_get_y' },
          { title: 'Tiered (Spend X get Y% off)', value: 'tiered' },
          { title: 'Free Gift (threshold)', value: 'free_gift' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'discountValue', title: 'Discount Value', type: 'number', group: 'basics', description: 'For percentage: 0–100. For fixed: dollar amount.' }),
    defineField({
      name: 'tiers',
      title: 'Discount Tiers',
      type: 'array',
      group: 'basics',
      description: 'For Tiered type. Add spend thresholds and their discount percentages.',
      hidden: ({ parent }) => parent?.type !== 'tiered',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'minSpend', title: 'Minimum Spend ($)', type: 'number', validation: (Rule) => Rule.required().min(0) }),
            defineField({ name: 'discountPercent', title: 'Discount (%)', type: 'number', validation: (Rule) => Rule.required().min(1).max(100) }),
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', description: 'e.g. "Spend $200, get 15% off"' }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string' }),
          ],
          preview: {
            select: { title: 'label_en', subtitle: 'minSpend' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title || `$${val.minSpend}+ threshold`, subtitle: `Min spend: $${val.minSpend}` }),
          },
        }),
      ],
    }),
    defineField({ name: 'buyQuantity', title: 'Buy Quantity (X)', type: 'number', group: 'basics', hidden: ({ parent }) => parent?.type !== 'buy_x_get_y', description: 'Number of items customer must buy.' }),
    defineField({ name: 'getQuantity', title: 'Get Quantity (Y)', type: 'number', group: 'basics', hidden: ({ parent }) => parent?.type !== 'buy_x_get_y', description: 'Number of free items customer gets.' }),

    // Conditions
    defineField({ name: 'minOrderValue', title: 'Minimum Order Value ($)', type: 'number', group: 'conditions', description: 'Cart subtotal must meet this threshold.', validation: (Rule) => Rule.min(0) }),
    defineField({ name: 'minQuantity', title: 'Minimum Items in Cart', type: 'number', group: 'conditions', validation: (Rule) => Rule.min(1).integer() }),
    defineField({ name: 'validFrom', title: 'Valid From', type: 'datetime', group: 'conditions' }),
    defineField({ name: 'validUntil', title: 'Valid Until', type: 'datetime', group: 'conditions' }),
    defineField({ name: 'usageLimit', title: 'Usage Limit', type: 'number', group: 'conditions', description: 'Maximum times this promotion can be applied (not enforced client-side).', validation: (Rule) => Rule.min(1).integer() }),
    defineField({ name: 'onePerCustomer', title: 'One Per Customer', type: 'boolean', group: 'conditions', initialValue: false }),
    defineField({
      name: 'applicableProducts',
      title: 'Applicable Products (leave empty for all)',
      type: 'array',
      group: 'conditions',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),

    // Display
    defineField({ name: 'label_en', title: 'Promo Label (English)', type: 'string', group: 'display', description: 'Shown in cart. e.g. "20% off — Summer Sale"', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string', group: 'display', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'badgeText_en', title: 'Badge Text (English)', type: 'string', group: 'display', description: 'Short badge shown on cart. e.g. "SUMMER20"', validation: (Rule) => Rule.max(20) }),
    defineField({ name: 'badgeText_ar', title: 'نص الشارة (Arabic)', type: 'string', group: 'display', validation: (Rule) => Rule.max(20) }),
    defineField({ name: 'cartMessage_en', title: 'Cart Progress Message (English)', type: 'string', group: 'display', description: 'e.g. "Add $30 more for free shipping!"', validation: (Rule) => Rule.max(150) }),
    defineField({ name: 'cartMessage_ar', title: 'رسالة سلة التسوق (Arabic)', type: 'string', group: 'display', validation: (Rule) => Rule.max(150) }),
    defineField({ name: 'freeShippingThreshold', title: 'Free Shipping Threshold ($)', type: 'number', group: 'display', description: 'Show a progress bar toward free shipping at this amount. Set here for display only.' }),
  ],
  preview: {
    select: { title: 'name', isActive: 'isActive', type: 'type', code: 'code' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title,
      subtitle: `${val.isActive ? '🟢' : '🔴'} ${val.type}${val.code ? ` · CODE: ${val.code}` : ' · Auto'}`,
    }),
  },
})
