import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const browseCategoriesSection = defineType({
  name: 'browseCategoriesSection',
  title: 'Browse by Category',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Strip Label (English)', type: 'string', description: 'Small label above tiles. e.g. "Browse by category"', initialValue: 'Browse by category', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'title_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Select categories to show as tiles.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (Rule) => Rule.max(10).unique(),
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      description: 'Select collections to show as tiles (shown after categories).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'collection' }] })],
      validation: (Rule) => Rule.max(10).unique(),
    }),
    defineField({ name: 'showAllTile', title: 'Show "All Perfumes" tile', type: 'boolean', initialValue: true, description: 'Adds a dark "All Perfumes" tile at the start.' }),
    defineField({
      name: 'bgColor',
      title: 'Strip Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Warm Cream', value: '#EDE8E0' },
          { title: 'White', value: '#FFFFFF' },
          { title: 'Stone', value: '#F5F0E8' },
          { title: 'Dark', value: '#1A1916' },
        ],
        layout: 'radio',
      },
      initialValue: '#EDE8E0',
    }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('browseCategoriesSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('browseCategoriesSection'),
    }),
  },
})
