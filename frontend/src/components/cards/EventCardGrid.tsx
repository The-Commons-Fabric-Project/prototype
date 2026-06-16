import EventCard from './EventCard'

type Tag = {
  label: string;
  color: string;
  background: string;
};

type EventCardData = {
  id: string | number;
  month: string;
  day: number;
  title: string;
  organization: string;
  description: string;
  time: string;
  location: string;
  tags?: Tag[];
  thumbnailUrl?: string;
};

type EventCardGridProps = {
  events: EventCardData[];
};

export default function EventCardGrid({ events }: EventCardGridProps) {
  return (
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
        />
      ))}
    </div>
  );
}
