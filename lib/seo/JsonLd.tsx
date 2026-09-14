/**
 * Renders structured data as a native script tag, per the Next.js JSON-LD
 * guide. `<` is escaped so a string in content can never close the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
