import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_ACCOUNT, SEED_EVENTS, SEED_ORGS } from "./data";
import { GLOBAL_CSS, S, T } from "./tokens";
import { AboutView } from "./components/AboutView";
import { CalendarPanel, SpanToggle } from "./components/CalendarPanel";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { CreateEventModal } from "./components/CreateEventModal";
import { DirectoryView } from "./components/DirectoryView";
import { EventCardGrid } from "./components/EventCardGrid";
import { EventDetailModal } from "./components/EventDetailModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { OrgFilterDropdown } from "./components/OrgFilterDropdown";
import { OrgProfileView } from "./components/OrgProfileView";
import type {
  Account,
  AppView,
  CalendarEvent,
  CalendarSpan,
  CommonsFabricCalendarProps,
  EventsView,
  ModalKind,
} from "./types";

const ALL_ORG_IDS = SEED_ORGS.map((o) => o.id);

/**
 * Commons Fabric community calendar.
 *
 * Single stateful root: view routing, the event store, the session, and modal
 * state all live here and flow down as props. In a real app, replace the seed
 * arrays with data fetching and the local session with your auth provider.
 */
export function CommonsFabricCalendar({
  accentColor = T.color.accent,
  calendarMaxEventsPerDay = 3,
  showCalendarLegend = true,
}: CommonsFabricCalendarProps) {
  const [view, setView] = useState<AppView>("landing");
  const [eventsView, setEventsView] = useState<EventsView>("grid");
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [accounts, setAccounts] = useState<Account[]>([DEMO_ACCOUNT]);
  const [session, setSession] = useState<Account | null>(null);
  const [activeOrgId, setActiveOrgId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const [appliedOrgIds, setAppliedOrgIds] = useState<number[]>(ALL_ORG_IDS);
  const [range, setRange] = useState({ start: "", end: "" });

  // Calendar anchor. The prototype opens on June 2026 to line up with seed data.
  const [anchor, setAnchor] = useState({ year: 2026, month: 5, day: 20 });
  const [span, setSpan] = useState<CalendarSpan>("month");

  const toastTimer = useRef<number>();
  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const orgNames = useMemo(
    () => SEED_ORGS.filter((o) => appliedOrgIds.includes(o.id)).map((o) => o.name),
    [appliedOrgIds],
  );

  /** Org filter applies to every view; the date range applies to the card grid only. */
  const filteredEvents = useMemo(() => events.filter((e) => orgNames.includes(e.org)), [events, orgNames]);

  const gridEvents = useMemo(
    () =>
      filteredEvents
        .filter((e) => (!range.start || e.date >= range.start) && (!range.end || e.date <= range.end))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [filteredEvents, range],
  );

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  /** ‹ › steps by the active span: one day, one week, or one month. */
  const shiftCalendar = (direction: -1 | 1) => {
    setAnchor((a) => {
      if (span === "month") {
        let month = a.month + direction;
        let year = a.year;
        if (month < 0) { month = 11; year--; }
        if (month > 11) { month = 0; year++; }
        return { year, month, day: Math.min(a.day, new Date(year, month + 1, 0).getDate()) };
      }
      const step = span === "week" ? 7 : 1;
      const d = new Date(a.year, a.month, a.day + direction * step);
      return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
    });
  };

  return (
    <div style={S.page}>
      <style>{GLOBAL_CSS}</style>

      <Header
        view={view}
        accentColor={accentColor}
        sessionName={session?.name ?? null}
        onNavigate={setView}
        onLogin={() => setModal("login")}
        onCreateAccount={() => setModal("createAccount")}
        onLogout={() => {
          setSession(null);
          showToast("Logged out.");
        }}
      />

      <main style={S.shell}>
        {view === "landing" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={S.h1}>What's happening at the Hub</h1>
              <p style={S.lede}>One shared place to discover and share events across the Rideau Community Hub network.</p>

              <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "inline-flex", background: T.color.surface, border: `1px solid ${T.color.line}`, borderRadius: T.radius.pill, padding: 3 }}>
                  {(["grid", "calendar"] as EventsView[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setEventsView(v)}
                      style={{
                        border: "none",
                        cursor: "pointer",
                        fontFamily: T.font,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        padding: "7px 16px",
                        borderRadius: T.radius.pill,
                        background: eventsView === v ? accentColor : "transparent",
                        color: eventsView === v ? "#fff" : T.color.body,
                      }}
                    >
                      {v === "grid" ? "Card grid" : "Calendar"}
                    </button>
                  ))}
                </div>

                {session && (
                  <button onClick={() => setModal("createEvent")} style={S.btnPrimary(accentColor)}>
                    + Create an event
                  </button>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
                  <OrgFilterDropdown
                    accentColor={accentColor}
                    appliedOrgIds={appliedOrgIds}
                    onApply={(ids) => {
                      setAppliedOrgIds(ids);
                      showToast("Organization filter applied.");
                    }}
                  />
                  {eventsView === "calendar" && (
                    <SpanToggle span={span} accentColor={accentColor} onChange={setSpan} />
                  )}
                </div>
              </div>
            </div>

            {eventsView === "grid" ? (
              <>
                <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "12px 14px", marginBottom: 18 }}>
                  <span style={S.eyebrow}>FILTER BY DATE</span>
                  {(["start", "end"] as const).map((key) => (
                    <label key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: T.color.body, textTransform: "uppercase" }}>
                      {key === "start" ? "From" : "To"}
                      <input
                        type="date"
                        value={range[key]}
                        onChange={(e) => setRange({ ...range, [key]: e.target.value })}
                        style={{ ...S.input, width: "auto", padding: "7px 9px" }}
                      />
                    </label>
                  ))}
                  {(range.start || range.end) && (
                    <button onClick={() => setRange({ start: "", end: "" })} style={{ ...S.btnSecondary, padding: "7px 12px" }}>
                      Clear
                    </button>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 11.5, color: T.color.muted }}>
                    {`${gridEvents.length} ${gridEvents.length === 1 ? "event" : "events"}`}
                  </span>
                </div>
                <EventCardGrid events={gridEvents} onSelect={setSelectedEventId} />
              </>
            ) : (
              <CalendarPanel
                events={filteredEvents}
                span={span}
                year={anchor.year}
                month={anchor.month}
                day={anchor.day}
                maxPerDay={calendarMaxEventsPerDay}
                showLegend={showCalendarLegend}
                onShift={shiftCalendar}
                onSelect={setSelectedEventId}
              />
            )}
          </>
        )}

        {view === "directory" && (
          <DirectoryView
            onOpenProfile={(id) => {
              setActiveOrgId(id);
              setView("profile");
            }}
          />
        )}

        {view === "profile" && activeOrgId !== null && (
          <OrgProfileView
            orgId={activeOrgId}
            events={events}
            onBack={() => {
              setActiveOrgId(null);
              setView("directory");
            }}
            onSelect={setSelectedEventId}
          />
        )}

        {view === "about" && <AboutView />}
      </main>

      <Footer onNavigate={setView} />

      {modal === "createAccount" && (
        <CreateAccountModal
          accentColor={accentColor}
          onClose={() => setModal(null)}
          onCreate={(account) => {
            setAccounts([...accounts, account]);
            showToast("Account created — check your email to confirm.");
            setModal(null);
          }}
        />
      )}

      {modal === "login" && (
        <LoginModal
          accentColor={accentColor}
          accounts={accounts}
          onClose={() => setModal(null)}
          onToast={showToast}
          onAuthenticated={(account) => {
            setSession(account);
            showToast(`Welcome back, ${account.name}`);
            setModal(null);
          }}
        />
      )}

      {modal === "createEvent" && session && (
        <CreateEventModal
          accentColor={accentColor}
          hostName={session.name}
          onClose={() => setModal(null)}
          onPublish={(created) => {
            setEvents([...created, ...events]);
            showToast(created.length > 1 ? `${created.length} occurrences created and confirmed.` : "Event created and confirmed.");
            setModal(null);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} accentColor={accentColor} onClose={() => setSelectedEventId(null)} />
      )}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}

export default CommonsFabricCalendar;
