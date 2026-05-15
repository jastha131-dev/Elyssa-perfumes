import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'
import { StudioLogo } from './sanity/components/StudioLogo'

export default defineConfig({
  name: 'default',
  title: 'Luxe Parfum',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
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
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
})
