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
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      initialValue: '(810) 309-9528',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
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
      name: 'hoursOfOperation',
      title: 'Hours of Operation',
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
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
})
