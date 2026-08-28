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
            // Untagged docs fall into "Work Experience" so nothing can go missing.
            orderableDocumentListDeskItem({
              type: 'experience',
              id: 'experience-work',
              title: 'Work Experience',
              filter: '(!defined(category) || category != "campus")',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'experience',
              id: 'experience-campus',
              title: 'Campus & Clubs',
              filter: 'category == "campus"',
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
