import { EVENT_TAGS } from '../../types/events'
import type { EventTagKey } from '../../types/events'

type EventCardProps = {
  /** Month of the event as a string */
  month: string;
  /** Date of the event */
  day: number;
  /** Event title */
  title: string;
  /** Host organization (optional) */
  organization?: string;
  description?: string;
  time: string;
  location?: string;
  tags?: EventTagKey[];
  thumbnailUrl?: string;
  onClick?: () => void;
};

export default function EventCard({
  month,
  day,
  title,
  organization,
  description,
  time,
  location,
  tags = [],
  thumbnailUrl,
  onClick,
}: EventCardProps) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border border-sage-border bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(0,0,0,0.10)] cursor-pointer"
      style={{ transition: "transform .18s ease, box-shadow .18s ease" }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/10] bg-sage-light shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-sage-muted text-[12.5px] font-semibold font-['Public_Sans',sans-serif]"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(15, 110, 92, 0.04) 14px, rgba(15, 110, 92, 0.04) 28px)",
            }}
          >
            [thumbnail placeholder]
          </div>
        )}

        {/* EventTags */}
        {tags.length > 0 && (
          <div className="absolute top-[10px] left-[10px] flex gap-[6px] flex-wrap">
            {tags.map((key) => (
              <span
                key={key}
                className="inline-block py-[3px] px-[9px] rounded-full text-[10.5px] font-bold tracking-[0.8px] uppercase font-['Public_Sans',sans-serif]"
                style={{ background: EVENT_TAGS[key].background, color: EVENT_TAGS[key].color }}
              >
                {EVENT_TAGS[key].label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-[18px] flex flex-col gap-[10px] flex-1">
        {/* Date + title row */}
        <div className="flex gap-[14px] items-start">
          <div className="flex flex-col items-center justify-center size-[52px] rounded-xl bg-white border border-sage-border shrink-0">
            <span className="text-[10px] font-bold text-amber tracking-[0.6px] font-['Public_Sans',sans-serif]">
              {month.toUpperCase()}
            </span>
            <span className="font-['Fraunces',serif] text-[22px] font-semibold text-forest leading-none">
              {day}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-['Fraunces',serif] text-lg font-semibold text-forest m-0 leading-[1.2]">
              {title}
            </h3>
            <p className="text-[12.5px] text-teal font-semibold mt-1 mb-0 font-['Public_Sans',sans-serif]">
              {organization}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13.5px] text-sage-muted leading-[1.5] m-0 line-clamp-2 font-['Public_Sans',sans-serif]">
          {description}
        </p>

        {/* Footer */}
        <div className="flex gap-[14px] text-[12.5px] text-sage-muted border-t border-sage-border pt-[10px] mt-auto font-['Public_Sans',sans-serif]">
          <span>🕓 {time}</span>
          <span>📍 {location}</span>
        </div>
      </div>
    </div>
  );
}
