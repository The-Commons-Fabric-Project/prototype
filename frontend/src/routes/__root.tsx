import { 
  // createRootRoute, 
  createRootRouteWithContext, 
  Outlet, 
  useRouteContext} from '@tanstack/react-router';
import type { MyRouterContext } from '../main'
import Header from '../components/nav/Header'
import type { AuthState } from '../types/users'
import Toast from '../components/modals/Toast'
import useToast from '../hooks/useOverlayContext'


// export const Route = createRootRoute({
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    // const session = useRouteContext({ from: "__root__" })
    const {toastMsg} = useToast();
    return (
      <div className="flex flex-col min-h-dvh w-dvw items-center">
        <Header /> 
        <Outlet />
        <Toast message={toastMsg}/>
      </div>
    )
  },
  loader: ({context}) => context.auth
})
