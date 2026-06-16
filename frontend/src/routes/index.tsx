import { createFileRoute } from '@tanstack/react-router'

import EventCard from '../components/cards/EventCard'

function Index() {
  return (
    <div className="bg-cream flex flex-col min-h-screen h-dvh w-dvw items-center ">
      <div className="flex flex-col items-start justify-start w-full max-w-[1040px] pt-[36px] px-[24px] pb-[80px]">
        <h1 className="font-fraunces text-forest font-semibold" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>What's happening at the Hub</h1>
        <p className="font-fraunces text-sage-muted">
          One shared place to discover and share events across the Rideau Community Hub network.
        </p>
        <div className="w-full max-w-sm">
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
      
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
