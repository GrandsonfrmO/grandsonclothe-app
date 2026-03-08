import { SchemaOrg } from '@/lib/schema'

interface SchemaScriptProps {
  schema: SchemaOrg
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
