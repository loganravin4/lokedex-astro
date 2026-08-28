/**
 * One-time backfill: tags every existing experience doc with its `category`.
 *
 * Run from the `lokedex/` folder:
 *   npx sanity exec scripts/setExperienceCategories.ts --with-user-token
 *
 * Only the `category` field is set. Every other field is left untouched.
 * A full snapshot of these docs lives in backups/experiences-2026-08-27.json.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const CATEGORIES: Record<string, 'work' | 'campus'> = {
  // Work Experience
  '95e76a3a-2fc4-4199-bf1c-e85f6a653cfd': 'work', // MORSE Corp
  '14037673-04da-480a-9255-d461ed269e76': 'work', // Trinity Life Sciences
  '6bc2fba3-7875-4114-ada5-66010983588b': 'work', // CampusGTM
  '1a4fde85-54c0-49cf-8543-a6c9f69f0720': 'work', // NExT Consulting
  'f0a17967-e04b-4049-a991-787afdbb1b73': 'work', // Khoury - Database Design TA
  '393af513-6042-4b89-9409-84e3eb044dd4': 'work', // Khoury - CS TA
  '3825e2e8-e788-4300-a683-64fc7bb3be0c': 'work', // The Anonymously Yours Foundation

  // Campus & Clubs
  '557efb52-3ae4-41c1-aaea-d99ace5ced48': 'campus', // Generate Product Development Studio
  '5bd17ec3-5ea8-4e69-abda-cb28eaaf8d3c': 'campus', // Forge Product Development Lab
  '74c38226-d5c4-425f-a4a0-6a6c4c7945d4': 'campus', // Student Government Association
  '7b7ff8d7-e62b-44bc-8655-4144205fce20': 'campus', // Northeastern Robotics
  'aec4c4ae-abfa-4c0a-a3c8-8fe2733f8667': 'campus', // Oasis at Northeastern
}

async function run() {
  const ids = Object.keys(CATEGORIES)

  // Any doc with unsaved Studio edits also has a draft that needs the same tag.
  const draftIds: string[] = await client.fetch('*[_id in $ids]._id', {
    ids: ids.map((id) => `drafts.${id}`),
  })

  const transaction = client.transaction()
  for (const id of [...ids, ...draftIds]) {
    const category = CATEGORIES[id.replace('drafts.', '')]
    transaction.patch(id, (patch) => patch.set({category}))
    console.log(`${category.padEnd(6)}  ${id}`)
  }

  await transaction.commit()
  console.log(`\nTagged ${ids.length} experiences (+${draftIds.length} drafts).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
