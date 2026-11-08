/** Structured data (schema.org JSON-LD). Rendered on the server, so crawlers and AI assistants read it without running JavaScript. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so the JSON can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
