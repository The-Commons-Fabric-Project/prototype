import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { AuthProvider, useAuth } from './hooks/useAuth'
import { routeTree } from './routeTree.gen'

import './styles/index.css'
import { OverlayProvider } from './hooks/useOverlayContext'

import type { AuthState } from './types/users'

// const router = createRouter({ routeTree })

// ref: https://tanstack.com/router/v1/docs/how-to/setup-authentication#1-set-up-router-context

export interface MyRouterContext {
  auth: AuthState,
  overlay?: any, // FIXME: narrow type
  modal?: string
}

// combines https://tanstack.com/router/v1/docs/how-to/setup-authentication#2-configure-router (step 2) and step 3 because they have separate router.tsx and App.tsx files
const router = createRouter({
  routeTree,
  context: {
    // auth will be passed down from App component
    auth: undefined!,
    overlay: undefined!,
    modal: "",
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider 
    router={router} 
    context={{ auth }} 
  />
}

function App() {
  return (
    <AuthProvider>
      <OverlayProvider>
        <InnerApp />
      </OverlayProvider>
    </AuthProvider>
  )
}

// also reference Tanstack's example repo for the authenticated app code https://github.com/TanStack/router/blob/main/examples/react/authenticated-routes/src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)