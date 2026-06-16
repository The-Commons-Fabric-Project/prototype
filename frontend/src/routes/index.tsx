import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import EventCardGrid from '../components/cards/EventCardGrid'
import { DemoCalendar } from '../components/calendar/Calendar'

const EXAMPLE_EVENTS = [
  {
    id: 1,
    month: "JUN",
    day: 16,
    title: "Newcomer Welcome Morning",
    organization: "Rideau-Rockcliffe Community Resource Centre",
    description: "A relaxed drop-in for newcomers to the neighbourhood. Meet settlement workers, learn what programs are running this summer, and connect with other families over coffee.",
    time: "10:00 AM",
    location: "RCH Room 1",
    tags: [{ label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" }],
  },
  {
    id: 2,
    month: "JUN",
    day: 18,
    title: "Commons Fabric Meetup",
    organization: "Ottawa Civic Tech",
    description: "Monthly working session for the Commons Fabric project. Newcomers welcome — we'll walk through the calendar prototype and pick up open tasks together.",
    time: "6:00 PM",
    location: "RCH Room 2",
    tags: [{ label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" }],
  },
  {
    id: 3,
    month: "JUN",
    day: 19,
    title: "Age-Friendly Ottawa Town Hall",
    organization: "Council on Aging of Ottawa",
    description: "An open conversation about making Ottawa more age-friendly. Bring your ideas on transit, housing, and connection — your input shapes this year's advocacy priorities.",
    time: "1:30 PM",
    location: "RCH Main Hall",
    tags: [{ label: "Registration", color: "rgb(15, 110, 92)", background: "rgb(227, 240, 236)" }],
  },
  {
    id: 4,
    month: "JUN",
    day: 20,
    title: "Odawa Annual Powwow (Day 1)",
    organization: "Odawa Native Friendship Centre",
    description: "Day one of our annual powwow — a celebration of culture, dance, and community. Grand entry at noon, followed by drumming, dancing, craft and food vendors. All are welcome.",
    time: "11:00 AM",
    location: "RCH Grounds",
    tags: [{ label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" }],
  },
  {
    id: 5,
    month: "JUN",
    day: 21,
    title: "Odawa Annual Powwow (Day 2)",
    organization: "Odawa Native Friendship Centre",
    description: "Day two of our annual powwow, closing on National Indigenous Peoples Day. Grand entry at noon, special performances, honour songs, and a community feast to close the weekend.",
    time: "11:00 AM",
    location: "RCH Grounds",
    tags: [{ label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" }],
  },
  {
    id: 6,
    month: "JUN",
    day: 23,
    title: "Poverty & Policy Briefing",
    organization: "Social Planning Council of Ottawa",
    description: "A lunchtime briefing on the latest local data around income, housing, and food security, with time for discussion on where research can drive change.",
    time: "12:00 PM",
    location: "RCH Room 2",
    tags: [{ label: "Registration", color: "rgb(15, 110, 92)", background: "rgb(227, 240, 236)" }],
  },
  {
    id: 7,
    month: "JUN",
    day: 26,
    title: "Family Maker Lab: Circuits",
    organization: "STEAMakers Guild",
    description: "Hands-on electronics for curious makers aged 8 and up. Build a working circuit you can take home — no experience needed, just bring your curiosity.",
    time: "3:30 PM",
    location: "RCH Workshop",
    tags: [
      { label: "Registration", color: "rgb(15, 110, 92)", background: "rgb(227, 240, 236)" },
      { label: "Volunteers wanted", color: "rgb(200, 133, 43)", background: "rgba(200, 133, 43, 0.14)" },
    ],
  },
]

function Index() {
  const [view, setView] = useState<'cards' | 'calendar'>('cards')

  return (
    <div className="flex flex-col items-start justify-start w-full max-w-[1040px] pt-[36px] px-[24px] pb-[80px]">
      <h1 className="font-fraunces text-forest font-semibold" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>What's happening at the Hub</h1>
      <p className="font-fraunces text-sage-muted">
        One shared place to discover and share events across the Rideau Community Hub network.
      </p>

      <div className="inline-flex mt-6 bg-white border border-sage-border p-[3px]" style={{ borderRadius: '10px' }}>
        <button
          onClick={() => setView('cards')}
          className={`text-[13px] font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'cards' ? 'bg-teal text-white' : 'bg-transparent text-sage-muted'}`}
          style={{ borderRadius: '8px' }}
        >
          Card grid
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`text-[13px] font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'calendar' ? 'bg-teal text-white' : 'bg-transparent text-sage-muted'}`}
          style={{ borderRadius: '8px' }}
        >
          Calendar
        </button>
      </div>

      <div className="w-full pt-10">
        {view === 'cards' ? (
          <EventCardGrid events={EXAMPLE_EVENTS} />
        ) : (
          <DemoCalendar />
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
