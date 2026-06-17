import type { Event } from '../../types/events'

type EventDescriptionProps = {
  event: Event;
  onClose: () => void;
};

export default function EventDescription({ event, onClose }: EventDescriptionProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{ background: 'rgba(65, 65, 66, 0.42)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-[520px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          aria-label="Close"
          className="cf-press absolute top-4 right-4 z-10 w-[30px] h-[30px] rounded-[8px] border border-line bg-white cursor-pointer text-muted text-[16px] flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-0 flex gap-4 items-start">
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white border border-line shrink-0">
            <span className="text-[11px] font-bold text-secondary tracking-[0.6px] font-body">
              {event.month.toUpperCase()}
            </span>
            <span className="font-display text-[28px] font-semibold text-ink leading-none">
              {event.day}
            </span>
          </div>

          <div className="pr-7">
            <h2 className="font-display text-[24px] font-semibold text-ink m-0 leading-[1.15]">
              {event.title}
            </h2>
            {event.organization && (
              <p className="text-[13.5px] text-primary font-semibold mt-[6px] mb-0 font-body">
                {event.organization}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-[18px] pb-6">
          {event.description && (
            <p className="text-[14.5px] text-ink leading-[1.6] m-0 mb-4 font-body">
              {event.description}
            </p>
          )}

          <div className="flex flex-col gap-2 mb-[18px]">
            <div className="flex gap-[10px] items-start text-[14px] text-muted leading-[1.45] font-body">
              <span className="text-[15px] shrink-0">🕓</span>
              <span>{event.time}</span>
            </div>

            {event.location && (
              <div className="flex gap-[10px] items-start text-[14px] text-muted leading-[1.45] font-body">
                <span className="text-[15px] shrink-0">📍</span>
                <span>{event.location}</span>
              </div>
            )}

            {(event.registrationInfo || !event.registerUrl) && (
              <div className="flex gap-[10px] items-start text-[14px] text-muted leading-[1.45] font-body">
                <span className="text-[15px] shrink-0">🎟️</span>
                <span>{event.registrationInfo ?? 'No registration required — just show up'}</span>
              </div>
            )}
          </div>

          {event.registerUrl && (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cf-press inline-block bg-primary text-white text-[13.5px] font-semibold font-body px-5 py-[10px] rounded-[10px] no-underline"
            >
              Register for this event
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
