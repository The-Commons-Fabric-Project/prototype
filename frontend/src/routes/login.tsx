import { createFileRoute } from '@tanstack/react-router'

function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-semibold">Login</h1>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
