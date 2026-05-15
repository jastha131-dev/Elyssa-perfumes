import React from 'react'
import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name_en',
      title: 'Customer Name (English)',
      type: 'string',
      description: 'Full name or first name + last initial of the reviewer.',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'name_ar',
      title: 'اسم العميل (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'location_en',
      title: 'Location (English)',
      type: 'string',
      description: 'City, Country — e.g. "Dubai, UAE" or "New York, USA".',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'location_ar',
      title: 'الموقع (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Star rating from 1 (poor) to 5 (excellent).',
      options: {
        list: [
          { title: '★☆☆☆☆  1 — Poor', value: 1 },
          { title: '★★☆☆☆  2 — Fair', value: 2 },
          { title: '★★★☆☆  3 — Good', value: 3 },
          { title: '★★★★☆  4 — Very Good', value: 4 },
          { title: '★★★★★  5 — Excellent', value: 5 },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().integer().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'review_en',
      title: 'Review (English)',
      type: 'text',
      rows: 4,
      description: "The customer's review text.",
      validation: (Rule) => Rule.required().min(20).max(1000),
    }),
    defineField({
      name: 'review_ar',
      title: 'التقييم (Arabic)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'product',
      title: 'Reviewed Product',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Link this testimonial to a specific product (optional).',
    }),
    defineField({
      name: 'date',
      title: 'Review Date',
      type: 'date',
      description: 'The date the review was submitted or published.',
      options: {
        dateFormat: 'MMMM D, YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pin this testimonial to the homepage or featured section.',
      initialValue: false,
    }),
    defineField({
      name: 'avatar',
      title: 'Customer Avatar',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional profile photo of the customer.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
  ],

  orderings: [
    {
      title: 'Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Highest Rated',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {
      name: 'name_en',
      rating: 'rating',
      productName: 'product.name',
      featured: 'featured',
      media: 'avatar',
    },
    prepare(val: any) {
      const stars = val.rating ? '★'.repeat(val.rating) + '☆'.repeat(5 - val.rating) : ''
      return {
        title: `${val.featured ? '⭐ ' : ''}${val.name}`,
        subtitle: [stars, val.productName].filter(Boolean).join(' — '),
        media: val.media,
      }
    },
  } as any,
})
