import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { loadLocale } from '@/content'
import { stripLocale } from '@/i18n/locale'

await loadLocale(stripLocale(location.pathname).locale)

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages hydrate; the admin shell (empty root) renders fresh.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
