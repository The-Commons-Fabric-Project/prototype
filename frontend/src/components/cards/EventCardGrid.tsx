import { useState } from 'react'
import type { Event } from '../../utils/types/events'
import EventCard from './EventCard'
import EventDetailModal from '../modals/EventDetailModal'

type EventsGridProps = {
  events: Event[];
};

export default function EventsGrid({ events }: EventsGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4.5 w-full">
        {events.map((event, i) => (
          <EventCard
            event={event}
            onClick={() => setSelectedEvent(event)}
            idx={i}
          />
        ))}
      </div>
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
