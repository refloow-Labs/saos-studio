import { renderToString } from 'react-dom/server'
import App from './App'

// Re-exported so the build scripts can read route metadata and structured data
// from the same compiled bundle they render with — no duplicated config.
export * from './lib/seo'
export { schemaFor } from './lib/schema'

/**
 * Server entry for the build-time prerender. Not wrapped in StrictMode — the
 * double-render it forces is a client-side development aid and would only
 * double the work here.
 */
export function render(pathname: string): string {
  return renderToString(<App pathname={pathname} />)
}
