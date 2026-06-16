import { createFileRoute } from '@tanstack/react-router'

import EventCard from '../components/cards/EventCard'

function Index() {
  return (
    <div className="bg-cream flex flex-col min-h-screen h-dvh w-dvw items-center justify-center">
      <h1 className="text-2xl font-semibold">Commons Fabric</h1>
      <div className="w-full max-w-sm mx-auto">
        <EventCard
          month="JUN"
          day={16}
          title="Newcomer Welcome Morning"
          organization="Rideau-Rockcliffe Community Resource Centre"
          description="A relaxed drop-in for newcomers to the neighbourhood. Meet settlement workers, learn what programs are running this summer, and connect with other families over coffee."
          time="10:00 AM"
          location="RCH Room 1"
          tags={[{ label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" }]}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
