import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Lokedex',

  projectId: 'lu0ab98o',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'experience',
              title: 'Experiences',
              S,
              context,
            }),
            ...S.documentTypeListItems().filter(
              (item) => !['project', 'experience'].includes(item.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
