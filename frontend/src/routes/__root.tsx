import { 
  // createRootRoute, 
  createRootRouteWithContext, 
  Outlet, 
  useRouteContext} from '@tanstack/react-router'
import Header from '../components/nav/Header'
import type { AuthState } from '../types/users'

// ref: https://tanstack.com/router/v1/docs/how-to/setup-authentication#1-set-up-router-context

interface MyRouterContext {
  auth: AuthState,
  modal: string
}

// export const Route = createRootRoute({
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    // const session = useRouteContext({ from: "__root__" })
    return (
      <div className="flex flex-col min-h-dvh w-dvw items-center">
        <Header /> 
        <Outlet />
      </div>
    )
  },
  loader: ({context}) => context.auth
})
