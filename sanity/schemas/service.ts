import { defineType, defineField } from 'sanity'

export const serviceSchema = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier (e.g., "mower", "leaf", "water")',
    }),
    defineField({
      name: 'tabOrder',
      title: 'Display Order',
      type: 'number',
    }),
    defineField({
      name: 'pricingTable',
      title: 'Pricing Table',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'tier', title: 'Tier Name', type: 'string' },
            { name: 'price', title: 'Price', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'link', title: 'Link', type: 'string' },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'tabOrderAsc',
      by: [{ field: 'tabOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'heroImage',
    },
  },
})
