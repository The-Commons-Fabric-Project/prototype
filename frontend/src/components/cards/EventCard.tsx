type Tag = {
  label: string;
  color: string;
  background: string;
};

type EventCardProps = {
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
}: EventCardProps) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[rgb(216,226,222)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/10] bg-[rgb(227,240,236)] shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[rgb(107,124,119)] text-[12.5px] font-semibold font-['Public_Sans',sans-serif]"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(15, 110, 92, 0.04) 14px, rgba(15, 110, 92, 0.04) 28px)",
            }}
          >
            [thumbnail placeholder]
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-[10px] left-[10px] flex gap-[6px] flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-block py-[3px] px-[9px] rounded-full text-[10.5px] font-bold tracking-[0.8px] uppercase font-['Public_Sans',sans-serif]"
                style={{ background: tag.background, color: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-[18px] flex flex-col gap-[10px] flex-1">
        {/* Date + title row */}
        <div className="flex gap-[14px] items-start">
          <div className="flex flex-col items-center justify-center size-[52px] rounded-xl bg-white border border-[rgb(216,226,222)] shrink-0">
            <span className="text-[10px] font-bold text-[rgb(200,133,43)] tracking-[0.6px] font-['Public_Sans',sans-serif]">
              {month.toUpperCase()}
            </span>
            <span className="font-['Fraunces',serif] text-[22px] font-semibold text-[rgb(28,43,39)] leading-none">
              {day}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-['Fraunces',serif] text-lg font-semibold text-[rgb(28,43,39)] m-0 leading-[1.2]">
              {title}
            </h3>
            <p className="text-[12.5px] text-[rgb(15,110,92)] font-semibold mt-1 mb-0 font-['Public_Sans',sans-serif]">
              {organization}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13.5px] text-[rgb(107,124,119)] leading-[1.5] m-0 line-clamp-2 font-['Public_Sans',sans-serif]">
          {description}
        </p>

        {/* Footer */}
        <div className="flex gap-[14px] text-[12.5px] text-[rgb(107,124,119)] border-t border-[rgb(216,226,222)] pt-[10px] mt-auto font-['Public_Sans',sans-serif]">
          <span>🕓 {time}</span>
          <span>📍 {location}</span>
        </div>
      </div>
    </div>
  );
}
