import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import EventCardGrid from '../components/cards/EventCardGrid'
import { Calendar } from '../components/calendar/Calendar'
import { EXAMPLE_EVENTS } from '../data/events'

function Index() {
  const [view, setView] = useState<'cards' | 'calendar'>('cards')

  // TODO: add routes for individual events, follow https://www.notanumber.in/blog/render-modal-on-a-route-with-the-parent-in-background-in-tanstack-router

  return (
    <div className="flex flex-col items-start justify-start w-full max-w-[1040px] pt-[36px] px-[24px] pb-[80px]">
      <h1 className="font-display text-ink font-semibold" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>What's happening at the Hub</h1>
      <p className="font-display text-muted">
        One shared place to discover and share events across the Rideau Community Hub network.
      </p>

      <div className="inline-flex mt-6 bg-white border border-line p-[5px] rounded-[10px]">
        <button
          onClick={() => setView('cards')}
          className={`text-[13px] rounded-lg font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'cards' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
        >
          Card grid
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`text-[13px] rounded-lg font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'calendar' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
        >
          Calendar
        </button>
      </div>

      <div className="w-full pt-6">
        {view === 'cards' ? (
          <EventCardGrid events={EXAMPLE_EVENTS} />
        ) : (
          <Calendar events={EXAMPLE_EVENTS} />
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
