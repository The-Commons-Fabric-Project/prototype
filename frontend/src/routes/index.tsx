import { createFileRoute } from '@tanstack/react-router'

import { DemoCalendar } from '../components/calendar/Calendar'

function Index() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Commons Fabric</h1>
      <DemoCalendar />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
