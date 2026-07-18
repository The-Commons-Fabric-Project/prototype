import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Org } from '../types/orgs'
import type { Event } from '../types/events'
import { SEED_ORGS } from '../mocks/orgs'
import { EXAMPLE_EVENTS } from '../mocks/events'
import EventDescription from '../components/overlays-feedback/EventDescription'

export const Route = createFileRoute('/directory')({
  component: Directory,
})

function LogoPlaceholder({ size = 72 }: { size?: number }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center text-muted font-semibold font-body leading-[1.2] tracking-[0.2px]"
      style={{
        width: size,
        height: size,
        borderRadius: size <= 80 ? 12 : 16,
        background: 'rgb(231, 238, 247)',
        border: '1px dashed rgb(224, 228, 235)',
        fontSize: Math.max(8.5, size * 0.12),
      }}
    >
      [logo]
    </div>
  )
}

function OrgTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block py-[3px] px-[9px] rounded-full text-[10.5px] font-bold tracking-[0.8px] uppercase bg-surface text-primary font-body">
      {children}
    </span>
  )
}

function OrgCard({ org, onClick, idx }: { org: Org; onClick: () => void; idx: number }) {
  return (
    <div
      onClick={onClick}
      className="flex gap-[18px] items-start bg-white border border-line rounded-2xl p-5 cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(65,65,66,0.10)] active:scale-[0.99]"
      style={{
        transition: 'transform .18s ease, box-shadow .18s ease',
        animation: `cf-stagger .4s ease ${idx * 0.05}s both`,
      }}
    >
      <LogoPlaceholder size={72} />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 flex-wrap mb-[10px]">
          {org.tags.map((t) => <OrgTag key={t}>{t}</OrgTag>)}
        </div>
        <h3 className="font-display text-[19px] font-semibold text-ink m-0 mb-[6px] leading-[1.2]">
          {org.name}
        </h3>
        <p className="text-[13.5px] text-muted leading-[1.5] m-0 font-body">
          {org.blurb}
        </p>
      </div>
    </div>
  )
}

function EventRow({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex gap-[14px] items-center bg-white border border-line rounded-xl p-[14px] cursor-pointer hover:shadow-[0_4px_12px_rgba(65,65,66,0.08)] active:scale-[0.99]"
      style={{ transition: 'box-shadow .18s ease, transform .08s ease' }}
    >
      <div className="flex flex-col items-center justify-center w-[52px] h-[52px] rounded-xl bg-white border border-line shrink-0">
        <span className="text-[10px] font-bold text-secondary tracking-[0.6px] font-body">
          {event.month}
        </span>
        <span className="font-display text-[22px] font-semibold text-ink leading-none">
          {event.day}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-[16px] font-semibold text-ink m-0 leading-[1.2]">
          {event.title}
        </h4>
        <p className="text-[12.5px] text-muted m-0 mt-1 font-body">
          {event.time} · {event.location}
        </p>
      </div>
    </div>
  )
}

function ProfileView({
  org,
  onBack,
  onSelectEvent,
}: {
  org: Org
  onBack: () => void
  onSelectEvent: (e: Event) => void
}) {
  const orgEvents = EXAMPLE_EVENTS.filter((e) => e.organization === org.name)

  return (
    <div style={{ animation: 'cf-fade .3s ease' }}>
      <button
        onClick={onBack}
        className="bg-transparent border-0 text-primary font-semibold text-[14px] cursor-pointer p-0 mb-[18px] block font-body"
        style={{ transition: 'color .15s ease' }}
      >
        ‹ Back to directory
      </button>

      {/* Org header card */}
      <div className="bg-white border border-line rounded-2xl p-7 mb-6 flex gap-6 items-start flex-wrap">
        <LogoPlaceholder size={104} />
        <div className="flex-1 min-w-[260px]">
          <div className="flex gap-2 flex-wrap mb-3">
            {org.tags.map((t) => <OrgTag key={t}>{t}</OrgTag>)}
          </div>
          <h1 className="font-display text-[30px] font-semibold text-ink m-0 mb-3 leading-[1.15]">
            {org.name}
          </h1>
          <p className="text-[15px] text-ink leading-[1.6] m-0 mb-[18px] max-w-[640px] font-body">
            {org.blurb}
          </p>
          <div className="flex gap-6 flex-wrap text-[13.5px] text-muted font-body">
            <span>
              ✉️{' '}
              <a href={`mailto:${org.contact}`} className="text-primary no-underline hover:underline">
                {org.contact}
              </a>
            </span>
            <span>
              🔗{' '}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-primary no-underline hover:underline"
              >
                {org.website}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <h2 className="font-display text-[22px] font-semibold text-ink m-0 mb-[14px]">
        Upcoming events
      </h2>
      {orgEvents.length === 0 ? (
        <div className="bg-surface rounded-xl p-6 text-center text-muted text-[14px] font-body">
          No upcoming events from this organization yet.
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {orgEvents.map((e) => (
            <EventRow key={e.id} event={e} onClick={() => onSelectEvent(e)} />
          ))}
        </div>
      )}
    </div>
  )
}

function Directory() {
  const [activeOrg, setActiveOrg] = useState<Org | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const openProfile = (org: Org) => {
    setActiveOrg(org)
    window.scrollTo(0, 0)
  }

  const closeProfile = () => {
    setActiveOrg(null)
    window.scrollTo(0, 0)
  }

  return (
    <div className="w-full max-w-[1040px] pt-9 px-6 pb-20">
      {activeOrg ? (
        <ProfileView
          org={activeOrg}
          onBack={closeProfile}
          onSelectEvent={setSelectedEvent}
        />
      ) : (
        <>
          <h1
            className="font-display text-ink font-semibold m-0"
            style={{ fontSize: 'clamp(30px, 5vw, 44px)' }}
          >
            Organizations on the Hub
          </h1>
          <p className="font-display text-muted mt-2 mb-0">
            Browse member organizations of the Rideau Community Hub network.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            {SEED_ORGS.map((org, i) => (
              <OrgCard key={org.id} org={org} idx={i} onClick={() => openProfile(org)} />
            ))}
          </div>
        </>
      )}

      {selectedEvent && (
        <EventDescription event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
