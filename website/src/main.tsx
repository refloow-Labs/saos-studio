import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// The markup is prerendered at build time (see scripts/prerender.mjs), so this
// hydrates the existing DOM rather than creating it from scratch.
hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
