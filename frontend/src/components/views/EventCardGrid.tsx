import { useMemo, useState } from 'react'
import type { Event } from '../../utils/types/events'
import EventCard from '../cards/EventCard'
import FilterBar from '../nav/FilterBar';

type EventCardGridProps = {
  events: Event[];
  onSelect: (selected: Event) => void;
};

export default function EventCardGrid({ events, onSelect }: EventCardGridProps) {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const gridEvents = useMemo(() => {
    return events.filter((e) => {
      if (rangeStart && e.date < rangeStart) return false;
      if (rangeEnd && e.date > rangeEnd) return false;
      return true;
    }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, rangeStart, rangeEnd]);

  return (
    <>
    <FilterBar matches={gridEvents.length}
      rangeStart={rangeStart} rangeEnd={rangeEnd}
      setRangeStart={setRangeStart} setRangeEnd={setRangeEnd}
    />
      { gridEvents.length === 0 ? (
        <div>No events match the filter criteria.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] my-4.5 gap-4.5 w-full">
          {gridEvents.map((event, i) => (
            <EventCard
              event={event}
              onClick={() => onSelect(event)}
              idx={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
