import { type Event, needsVolunteers, requiresRegistration } from '../../api/events'
import { fmtTime, toDateKey, toTimeKey } from '../../utils/datetime';

import InlineDate from '../chips/InlineDate';
import Tag from '../chips/Tag';
import Icon from '../../assets/Icons';
import { paletteForID } from '../../utils/palette';

type EventCardProps = {
  event: Event;
  /**
   * Resolved by the parent with useOrgLookup, so this stays presentational and
   * usable from Storybook without a QueryClientProvider.
   */
  orgName?: string;
  onClick: () => void;
  idx: number;
};

export default function EventCard({ event, orgName, onClick, idx }: EventCardProps) {
  const pal = paletteForID(event.organizationId);
  return (
    <div onClick={onClick} className={`cf-card-hover bg-white border border-slate-200 rounded-lg cursor-pointer flex flex-row p-4.5 gap-2.5 animate-[cf-stagger_0.35s_ease_both]`} style={{ animationDelay: `${idx * 0.04}s` }}>

      <span style={{ width: 3, alignSelf: "stretch", flexShrink: 0, background: `linear-gradient(180deg,${pal.c1},${pal.c2})` }} />


      <div className="min-w-0 flex flex-1 flex-col gap-2">
        {(requiresRegistration(event) || needsVolunteers(event)) && (
          <div className="flex flex-wrap gap-1.5">
            {requiresRegistration(event) && <Tag variant="blue">Registration</Tag>}
            {needsVolunteers(event) && <Tag variant="orange">Volunteers wanted</Tag>}
          </div>
        )}
      
        <InlineDate date={toDateKey(event.startsAt)} className="block text-[12.5px] font-bold text-slate-500 mb-[4px] tracking-[0.3px]" />
        <h3 className="font-sans text-[17px] font-bold text-slate-900 m-0 leading-tight">{event.title}</h3>
        <p className="text-[12.5px] text-slate-500 font-semibold mt-[4px] mb-0">{orgName}</p>
      

      {event.description && <p className="text-[13.5px] text-slate-500 leading-normal m-0 line-clamp-2">{event.description}</p>}

      {/* Time left, location right-aligned in the same row */}
      <div className="flex items-center justify-between gap-[12px] text-[12.5px] text-slate-500 border-t border-slate-200 pt-2.5 mt-auto">
        <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={14} /> {fmtTime(toTimeKey(event.startsAt))}</span>
        <span className="inline-flex items-center gap-1.5 text-right min-w-0">
          <Icon name="pin" size={14} /> <span className="overflow-hidden text-ellipsis whitespace-nowrap">{event.location}</span>
        </span>
      </div>
      </div>
    </div>
  );
}