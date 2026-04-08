'use client';

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { serviceSchema } from './schemas/service'
import { serviceAreaSchema } from './schemas/serviceArea'
import { galleryItemSchema } from './schemas/galleryItem'
import { siteSettingsSchema } from './schemas/siteSettings'
import { pageSchema } from './schemas/page'

const config = defineConfig({
  name: 'mipremierlawncare',
  title: 'MI Premier Lawn Care',
  projectId: 'u4dmbqdq',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('serviceArea').title('Service Areas'),
            S.documentTypeListItem('galleryItem').title('Gallery'),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [
      serviceSchema,
      serviceAreaSchema,
      galleryItemSchema,
      siteSettingsSchema,
      pageSchema,
    ],
  },
})

export default config;
