import { useMemo, type Dispatch, type SetStateAction } from 'react'
import type { Event } from '../../utils/types/events'
import EventCard from '../cards/EventCard'
import FilterBar from '../nav/FilterBar';

type EventCardGridProps = {
  events: Event[];
  onSelect: (selected: Event) => void;
  /** Resolves an event's organizationId to a name. See hooks/useOrganizations.ts. */
  orgName: (organizationId: number) => string | undefined;
  /**
   * The grid's own fetch window, owned by routes/index.tsx. Separate from the
   * calendar's, which tracks a month independently of this filter.
   */
  rangeStart: string;
  rangeEnd: string;
  setRangeStart: Dispatch<SetStateAction<string>>;
  setRangeEnd: Dispatch<SetStateAction<string>>;
};

export default function EventCardGrid({
  events,
  onSelect,
  orgName,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
}: EventCardGridProps) {
  // Only sorted, not filtered. The date range is now the server's query, and
  // re-applying it here would fight it: the API returns events whose interval
  // *overlaps* the window, so an event that started before rangeStart but is
  // still running belongs in the results - and a client-side `startsAt <
  // rangeStart` test would throw exactly those away.
  const gridEvents = useMemo(
    () => [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [events],
  );

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
              key={event.id}
              event={event}
              orgName={orgName(event.organizationId)}
              onClick={() => onSelect(event)}
              idx={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
