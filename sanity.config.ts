import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { assist } from '@sanity/assist'
import { schemaTypes } from './sanity/schemaTypes'
import { StudioLogo } from './sanity/components/StudioLogo'
import { translateToArabicAction } from './sanity/actions/translateToArabic'
import { aiFillAction } from './sanity/actions/aiFill'

export default defineConfig({
  name: 'default',
  title: 'Luxe Parfum',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    assist(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev) => [...prev, translateToArabicAction, aiFillAction],
  },
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
})
