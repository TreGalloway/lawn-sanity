import { defineType, defineField } from 'sanity'

export const pageSchema = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'hero',
          title: 'Hero Block',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'backgroundImage', title: 'Background Image', type: 'image' },
            { name: 'ctaText', title: 'CTA Button Text', type: 'string' },
            { name: 'ctaLink', title: 'CTA Button Link', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'serviceGrid',
          title: 'Service Grid',
          fields: [
            {
              name: 'services',
              title: 'Select Services',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'service' }] }],
            },
          ],
        },
        {
          type: 'object',
          name: 'ctaBanner',
          title: 'CTA Banner',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'buttonText', title: 'Button Text', type: 'string' },
            { name: 'buttonLink', title: 'Button Link', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'gallery',
          title: 'Gallery Section',
          fields: [
            {
              name: 'items',
              title: 'Gallery Items',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'galleryItem' }] }],
            },
          ],
        },
        {
          type: 'object',
          name: 'serviceAreas',
          title: 'Service Areas',
          fields: [
            {
              name: 'areas',
              title: 'Select Areas',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'serviceArea' }] }],
            },
          ],
        },
        {
          type: 'object',
          name: 'richText',
          title: 'Rich Text',
          fields: [
            { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
          ],
        },
        {
          type: 'object',
          name: 'contactForm',
          title: 'Contact Form',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
