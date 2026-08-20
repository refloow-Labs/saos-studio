/**
 * Writes dist/sitemap.xml from the route table in src/lib/seo.ts.
 *
 * Only indexable routes are listed. The /work/* demo pages are deliberately
 * absent: they carry `noindex`, and advertising a noindexed URL in a sitemap is
 * a contradictory signal.
 */

import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const { indexableRoutes, canonicalFor } = await import(
  join(root, 'dist-ssr', 'entry-server.js')
)

const lastmod = new Date().toISOString().slice(0, 10)

const entries = indexableRoutes()
  .map((route) => {
    const parts = [
      `    <loc>${canonicalFor(route.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
    ]
    if (route.changefreq) parts.push(`    <changefreq>${route.changefreq}</changefreq>`)
    if (route.priority) parts.push(`    <priority>${route.priority}</priority>`)
    return `  <url>\n${parts.join('\n')}\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`

await writeFile(join(root, 'dist', 'sitemap.xml'), xml, 'utf8')
console.log(`✓ Wrote dist/sitemap.xml (${indexableRoutes().length} URLs)`)
