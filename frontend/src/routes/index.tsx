import { createFileRoute } from '@tanstack/react-router'

import { DemoCalendar } from '../components/calendar/Calendar'

function Index() {
  return (
    <div className="flex flex-col min-h-screen h-dvh w-dvw items-center justify-center">
      <h1 className="text-2xl font-semibold">Commons Fabric</h1>
      <div className="w-dvw max-w-4xl h-dvh mx-auto">
        <DemoCalendar />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
