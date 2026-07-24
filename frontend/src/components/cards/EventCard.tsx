import type { Event } from '../../types/events'
import { fmtTime } from '../../utils/datetime';

import InlineDate from '../chips/InlineDate';
import Tag from '../chips/Tag';
import Icon from '../../assets/Icons';

/** Event props now live in the event type */
type EventCardProps = {
  event: Event;
  onClick: (args:any) => void;
  idx: number;
  // /** Month of the event as a string */
  // month: string;
  // /** Date of the event */
  // day: number;
  // /** Event title */
  // title: string;
  // /** Host organization (optional) */
  // organization?: string;
  // description?: string;
  // time: string;
  // location?: string;
  // /** array of tags for the event */
  // tags?: EventTagKey[];
  // thumbnailUrl?: string;
  // onClick?: () => void;
};
// ===========================================================================
// Event card
// ===========================================================================
export default function EventCard({ event, onClick, idx }: EventCardProps) {
  return (
    <div onClick={onClick} className={`cf-card-hover bg-white border border-slate-200 rounded-[8px] cursor-pointer flex flex-col p-[18px] gap-[10px] animate-[cf-stagger_0.35s_ease_both]`} style={{ animationDelay: `${idx * 0.04}s` }}>
      {/* Tags now live inside the card (no image) */}
      {(event.registrationRequired || event.volunteersNeeded) && (
        <div className="flex flex-wrap gap-1.5">
          {event.registrationRequired && <Tag variant="solid">Registration</Tag>}
          {event.volunteersNeeded && <Tag variant="outline">Volunteers wanted</Tag>}
        </div>
      )}

      <div className="min-w-0">
        <InlineDate date={event.date} className="block text-[12.5px] font-bold text-slate-500 mb-[4px] tracking-[0.3px]" />
        <h3 className="font-sans text-[17px] font-bold text-slate-900 m-0 leading-[1.25]">{event.title}</h3>
        <p className="text-[12.5px] text-slate-500 font-semibold mt-[4px] mb-0">{event.org}</p>
      </div>

      {event.description && <p className="text-[13.5px] text-slate-500 leading-[1.5] m-0 line-clamp-2">{event.description}</p>}

      {/* Time left, location right-aligned in the same row */}
      <div className="flex items-center justify-between gap-[12px] text-[12.5px] text-slate-500 border-t border-slate-200 pt-[10px] mt-auto">
        <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={14} /> {fmtTime(event.time)}</span>
        <span className="inline-flex items-center gap-1.5 text-right min-w-0">
          <Icon name="pin" size={14} /> <span className="overflow-hidden text-ellipsis whitespace-nowrap">{event.location}</span>
        </span>
      </div>
    </div>
  );
}