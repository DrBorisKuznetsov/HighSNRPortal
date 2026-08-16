import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from './router.jsx'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root')
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

const normalizePathname = (pathname) => (
  !pathname || pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
)
const prerenderPath = rootElement.dataset.prerenderPath
const canHydrate = rootElement.hasChildNodes()
  && normalizePathname(prerenderPath) === normalizePathname(window.location.pathname)

if (canHydrate) {
  hydrateRoot(rootElement, app)
} else {
  rootElement.replaceChildren()
  createRoot(rootElement).render(app)
}
