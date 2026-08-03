import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import Button from '../components/controls/Button';
import EventCardGrid from '../components/views/EventCardGrid'
import { CalendarView } from '../components/views/Calendar'
import { useAuth } from '../hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import { useOrgLookup } from '../hooks/useOrganizations'
import { useModal } from '../hooks/useOverlayContext';
import CreateEventModal from '../components/modals/CreateEventModal';
import EventDetailModal from '../components/modals/EventDetailModal';
import { monthBounds } from '../utils/datetime';
import type { Event } from '../utils/types/events';

function Index() {
  const [view, setView] = useState<'cards' | 'calendar'>('cards')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // A window per view, deliberately not shared.
  //
  // The two views ask different questions - the grid filters an open-ended list
  // between two dates, the calendar always shows exactly one month - so a single
  // window would make each one's navigation overwrite the other's filter. They
  // are held here rather than inside the views so that toggling between them,
  // which unmounts one, does not throw its window away.
  //
  // The grid starts unbounded: "" is read by the API as "from now" and
  // "no end". The calendar starts on the month it is about to display, so its
  // first request is already scoped to what is on screen.
  const [gridStart, setGridStart] = useState("");
  const [gridEnd, setGridEnd] = useState("");
  const [calendarWindow, setCalendarWindow] = useState(() => monthBounds(new Date()));

  // Only the visible view's window is fetched. Toggling swaps the query key, and
  // the other view's events are usually still cached from last time.
  const activeWindow = view === 'cards'
    ? { startDate: gridStart, endDate: gridEnd }
    : { startDate: calendarWindow.start, endDate: calendarWindow.end };

  const { data: events, isLoading, error } = useEvents(activeWindow);
  const orgName = useOrgLookup();

  const { user } = useAuth();
  const { modal, setModal } = useModal();

  // TODO: add routes for individual events, follow https://www.notanumber.in/blog/render-modal-on-a-route-with-the-parent-in-background-in-tanstack-router

  return (
    <div className="flex flex-col items-start justify-start w-full max-w-260 pt-9 px-6 pb-20">
      <h1 className="font-display text-ink font-semibold" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>What's happening at the Hub</h1>
      <p className="font-display text-muted">
        One shared place to discover and share events across the Rideau Community Hub network.
      </p>

      <div className="w-full flex centered justify-between items-center mt-6">
      <div className="inline-flex bg-white border border-line p-1.25 rounded-md">
        <button
          onClick={() => setView('cards')}
          className={`text-[13px] rounded-lg font-semibold px-4 py-1.75 capitalize transition-colors cursor-pointer border-0 ${view === 'cards' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
        >
          Card grid
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`text-[13px] rounded-lg font-semibold px-4 py-1.75 capitalize transition-colors cursor-pointer border-0 ${view === 'calendar' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
        >
          Calendar
        </button>
        </div>

        {/* If signed in, display create event button */}
        {user && (
          <Button onClick={() => setModal("create_event")}>+ Create an event</Button>
        )}
      </div>

      <div className="w-full pt-6">
        {error ? (
          <div className="text-muted">Could not load events. {error.message}</div>
        ) : isLoading ? (
          <div className="text-muted">Loading events…</div>
        ) : view === 'cards' ? (
          <EventCardGrid
            events={events ?? []}
            onSelect={setSelectedEvent}
            orgName={orgName}
            rangeStart={gridStart} rangeEnd={gridEnd}
            setRangeStart={setGridStart} setRangeEnd={setGridEnd}
          />
        ) : (
          <CalendarView
            events={events ?? []}
            onSelect={setSelectedEvent}
            rangeStart={calendarWindow.start}
            onWindowChange={(start, end) => setCalendarWindow({ start, end })}
          />
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          orgName={orgName(selectedEvent.organizationId)}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* the create event flow is meaningless without a signed-in user */}
      {user && modal === "create_event" && (
        <CreateEventModal
          onClose={() => setModal(undefined)}
          session={user}
          onCreate={() => console.log("created event")}
        />
      )}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
