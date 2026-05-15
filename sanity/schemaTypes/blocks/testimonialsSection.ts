import { defineField, defineType, defineArrayMember } from 'sanity'

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Testimonials', subtitle: 'testimonialsSection' }),
  },
})
