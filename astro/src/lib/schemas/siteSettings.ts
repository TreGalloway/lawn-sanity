import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      initialValue: 'MI Premier Lawn Care, L.L.C',
    }),
    defineField({
      name: 'owner',
      title: 'Owner Name',
      type: 'string',
      initialValue: 'Ronald K. Warren',
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      initialValue: '2959 Mallory Street, Flint, Michigan 48504',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      initialValue: '(810) 309-9528',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      initialValue: 'mipremierlawcare@gmail.com',
    }),
    defineField({
      name: 'founded',
      title: 'Founded',
      type: 'string',
      initialValue: 'January 2026',
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Flint', 'Flint Township', 'Flushing', 'Burton', 'Grand Blanc'],
    }),
    defineField({
      name: 'hoursOfOperation',
      title: 'Hours of Operation',
      type: 'string',
      initialValue: 'Monday-Thursday: 8:00 AM - 4:00 PM',
    }),
    defineField({
      name: 'yardbookUrl',
      title: 'Yardbook URL (Booking Link)',
      type: 'url',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
    }),
    defineField({
      name: 'quoteButtonText',
      title: 'Quote Button Text',
      type: 'string',
      initialValue: 'Get a Free Quote',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'URL', type: 'string' },
          ],
        },
      ],
      initialValue: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact', href: '/contact' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
})