/**
 * Submits the site's indexable URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Google does not participate, but Bing's index feeds Microsoft Copilot, so this
 * shortens the path from deploy to AI-answer visibility.
 *
 * Run manually after a deploy: `npm run indexnow`. Deliberately not part of the
 * build — pinging on every preview/branch build would be noise.
 */

import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const KEY = 'b79f0b562083517e9e6921e54bc02957'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const { indexableRoutes, canonicalFor, SITE_URL } = await import(
  join(root, 'dist-ssr', 'entry-server.js')
).catch(() => {
  throw new Error('dist-ssr not found — run `npm run build` first.')
})

const host = new URL(SITE_URL).host
const urlList = indexableRoutes().map((r) => canonicalFor(r.path))

// Verify the key file is actually reachable before submitting; IndexNow rejects
// the whole batch if it can't fetch it, and the failure mode is otherwise silent.
const keyUrl = `${SITE_URL}/${KEY}.txt`
const keyRes = await fetch(keyUrl)
const keyBody = keyRes.ok ? (await keyRes.text()).trim() : ''

if (keyBody !== KEY) {
  console.error(`✗ Key file at ${keyUrl} is missing or does not contain the key.`)
  console.error(`  status=${keyRes.status} body="${keyBody.slice(0, 64)}"`)
  console.error('  Deploy first, then re-run.')
  process.exit(1)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: KEY, keyLocation: keyUrl, urlList }),
})

// IndexNow returns 200 (accepted) or 202 (accepted, key validation pending).
if (res.status === 200 || res.status === 202) {
  console.log(`✓ Submitted ${urlList.length} URLs to IndexNow (HTTP ${res.status})`)
  urlList.forEach((u) => console.log(`    ${u}`))
} else {
  console.error(`✗ IndexNow rejected the submission: HTTP ${res.status}`)
  console.error(await res.text())
  process.exit(1)
}
