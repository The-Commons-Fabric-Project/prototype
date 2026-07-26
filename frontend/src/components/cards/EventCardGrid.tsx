import { useState } from 'react'
import type { Event } from '../../types/events'
import EventCard from './EventCard'
import EventDescription from '../modals/EventDescription'

// FIXME: component has been swapped out?

type EventsGridProps = {
  events: Event[];
};

export default function EventsGrid({ events }: EventsGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px] w-full">
        {events.map((event, i) => (
          <EventCard
            event={event}
            onClick={() => setSelectedEvent(event)}
            idx={i}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventDescription
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
