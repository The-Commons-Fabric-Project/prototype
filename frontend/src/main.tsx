import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { AuthProvider, useAuth } from './auth'
import { routeTree } from './routeTree.gen'

import './styles/index.css'

// const router = createRouter({ routeTree })

// combines https://tanstack.com/router/v1/docs/how-to/setup-authentication#2-configure-router (step 2) and step 3 because they have separate router.tsx and App.tsx files
const router = createRouter({
  routeTree,
  context: {
    // auth will be passed down from App component
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

// also reference Tanstack's example repo for the authenticated app code https://github.com/TanStack/router/blob/main/examples/react/authenticated-routes/src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)