/**
 * Build-time prerender.
 *
 * Takes the client build's `dist/index.html` as the template — it already
 * carries the correct hashed asset links — renders each route through the SSR
 * bundle, and writes real HTML files with per-route head tags and JSON-LD.
 *
 * Before this existed the site shipped a 1.7KB empty shell to every crawler.
 *
 * Run after `vite build` and `vite build --ssr`. See package.json.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const templatePath = join(distDir, 'index.html')

const {
  render,
  routes,
  canonicalFor,
  schemaFor,
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  OG_IMAGE,
} = await import(join(root, 'dist-ssr', 'entry-server.js'))

const ROOT_DIV = '<div id="root"></div>'
const HEAD_OPEN = '<!--seo-head-->'
const HEAD_CLOSE = '<!--/seo-head-->'

/** Escape a string for use inside a double-quoted HTML attribute. */
function attr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Escape text destined for an element's body. */
function text(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * JSON-LD sits in a <script> block, where the only sequence that can break out
 * is a literal `</script`. Escaping `<` covers it without mangling the JSON.
 */
function jsonLd(json) {
  return json.replace(/</g, '\\u003c')
}

function headFor(route) {
  const canonical = canonicalFor(route.path)
  const ogImage = `${SITE_URL}${OG_IMAGE}`
  const tags = [
    `<title>${text(route.title)}</title>`,
    `<meta name="description" content="${attr(route.description)}" />`,
    `<link rel="canonical" href="${attr(canonical)}" />`,
    route.noindex
      ? `<meta name="robots" content="noindex,follow" />`
      : `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />`,

    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${attr(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${attr(SITE_LOCALE)}" />`,
    `<meta property="og:title" content="${attr(route.title)}" />`,
    `<meta property="og:description" content="${attr(route.description)}" />`,
    `<meta property="og:url" content="${attr(canonical)}" />`,
    `<meta property="og:image" content="${attr(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${attr(SITE_NAME)}" />`,

    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(route.title)}" />`,
    `<meta name="twitter:description" content="${attr(route.description)}" />`,
    `<meta name="twitter:image" content="${attr(ogImage)}" />`,

    `<script type="application/ld+json">${jsonLd(
      schemaFor(route.path, route.title, route.description),
    )}</script>`,
  ]
  return tags.join('\n    ')
}

const template = await readFile(templatePath, 'utf8')

if (!template.includes(ROOT_DIV)) {
  throw new Error(`Prerender template is missing ${ROOT_DIV} — cannot inject markup.`)
}
if (!template.includes(HEAD_OPEN) || !template.includes(HEAD_CLOSE)) {
  throw new Error(
    `Prerender template is missing the ${HEAD_OPEN} … ${HEAD_CLOSE} markers — cannot inject head tags.`,
  )
}

for (const route of routes) {
  const markup = render(route.path)

  if (!markup.trim()) {
    throw new Error(`Prerender produced empty markup for ${route.path}.`)
  }

  // Function replacements throughout: rendered markup and metadata can contain
  // `$&`, `$'` and friends, which a string replacement would interpret.
  const html = template
    .replace(
      /<!--seo-head-->[\s\S]*?<!--\/seo-head-->/,
      () => `${HEAD_OPEN}\n    ${headFor(route)}\n    ${HEAD_CLOSE}`,
    )
    .replace(ROOT_DIV, () => `<div id="root">${markup}</div>`)

  const outPath = join(distDir, route.file)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')

  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1)
  console.log(`  prerendered ${route.path.padEnd(10)} → dist/${route.file} (${kb} KB)`)
}

console.log(`✓ Prerendered ${routes.length} routes`)
