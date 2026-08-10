import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { MyRouterContext } from '../main'
import Header from '../components/nav/Header'
import Toast from '../components/modals/Toast'
import { useToast } from '../hooks/useOverlayContext'


export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  loader: ({context}) => context.auth
})

function RootComponent() {
  const {toastMsg} = useToast();
  return (
    <div className="flex flex-col min-h-dvh w-dvw items-center">
      <Header /> 
      <Outlet />
      <Toast message={toastMsg}/>
    </div>
  )
}