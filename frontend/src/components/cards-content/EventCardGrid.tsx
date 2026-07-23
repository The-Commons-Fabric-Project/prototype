import { useState } from 'react'
import type { Event } from '../../types/events'
import EventCard from './EventCard'
import EventDescription from '../overlays-feedback/EventDescription'

type EventCardGridProps = {
  events: Event[];
};

export default function EventCardGrid({ events }: EventCardGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px] w-full">
        {events.map((event) => (
          <EventCard
            key={event.id}
            month={event.month}
            day={event.day}
            title={event.title}
            organization={event.organization}
            description={event.description}
            time={event.time}
            location={event.location}
            tags={event.tags}
            thumbnailUrl={event.thumbnailUrl}
            onClick={() => setSelectedEvent(event)}
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
