import { createRootRoute, Outlet } from '@tanstack/react-router'
import Header from '../components/layout/Header'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-dvh w-dvw items-center">
      <Header />
      <Outlet />
    </div>
  ),
})
