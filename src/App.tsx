import { RouterProvider } from 'react-router'
import { router } from './routes'
import { CatalogProvider } from './data/CatalogContext'
import PublicDataProvider from './data/PublicDataContext'

export default function App() {
  return <PublicDataProvider><CatalogProvider><RouterProvider router={router} /></CatalogProvider></PublicDataProvider>
}
