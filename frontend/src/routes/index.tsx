import { createFileRoute } from '@tanstack/react-router'

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Common Fabric</h1>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
