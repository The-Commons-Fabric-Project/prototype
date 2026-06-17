import { createFileRoute } from '@tanstack/react-router'

function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper">
      <h1 className="font-display text-2xl font-semibold text-ink">Login</h1>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
