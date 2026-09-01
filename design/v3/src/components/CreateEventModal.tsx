import { useState } from "react";
import { S, T } from "../tokens";
import { DOW, DOW_FULL, EMAIL_RE, FREQ_LABEL, fmtPlainDate, fmtTime, occurrenceDates, parseDate, toIso } from "../utils";
import { Field, ModalShell, SummaryRow, Toggle, ToggleRow } from "./ModalShell";
import type { CalendarEvent, CreateEventForm, RepeatFrequency } from "../types";

const INITIAL: CreateEventForm = {
  title: "",
  date: "",
  time: "",
  endDate: "",
  endTime: "",
  location: "",
  description: "",
  recurring: false,
  frequency: "weekly",
  repeatDays: [],
  repeatUntil: "",
  registrationRequired: false,
  registrationLink: "",
  volunteersNeeded: false,
  volunteerContact: "",
};

interface Props {
  accentColor: string;
  hostName: string;
  onClose: () => void;
  /** Receives every generated occurrence of the series, already dated. */
  onPublish: (events: CalendarEvent[]) => void;
}

/**
 * Two-step create-event flow.
 *
 * Start/end date and time sit in one bordered "When" group laid out as a
 * 44px / 1fr / 1fr grid, so adding an end pair costs one row instead of four
 * stacked fields. The Repeats toggle lives in the same group and reveals
 * frequency, a day-of-week picker (hidden for monthly), and an until date.
 */
export function CreateEventModal({ accentColor, hostName, onClose, onPublish }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CreateEventForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patch = (next: Partial<CreateEventForm>) => setForm({ ...form, ...next });
  const border = (key: string) => (errors[key] ? T.color.danger : T.color.line);

  const toggleRecurring = () => {
    // Preselect the start date's weekday so the rule is valid by default.
    const days = !form.recurring && form.repeatDays.length === 0 && form.date
      ? [parseDate(form.date).getDay()]
      : form.repeatDays;
    patch({ recurring: !form.recurring, repeatDays: days });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.date) errs.date = "Event date is required.";
    if (!form.time) errs.time = "Event time is required.";
    if (!form.endTime) errs.when = "Add an end time.";
    else {
      const endDate = form.endDate || form.date;
      if (form.date && (endDate < form.date || (endDate === form.date && form.endTime <= form.time))) {
        errs.when = "The event must end after it starts.";
      }
    }
    if (form.recurring) {
      if (form.frequency !== "monthly" && form.repeatDays.length === 0) errs.recurrence = "Pick at least one day of the week.";
      else if (!form.repeatUntil) errs.recurrence = "Choose the date the repeat ends.";
      else if (form.date && form.repeatUntil <= form.date) errs.recurrence = "The repeat must end after the first event.";
    }
    if (!form.location.trim()) errs.location = "Location is required.";
    if (form.registrationRequired && !form.registrationLink.trim()) errs.registrationLink = "Add the link people register through.";
    if (form.volunteersNeeded && !EMAIL_RE.test(form.volunteerContact)) errs.volunteerContact = "Add a valid contact email for volunteers.";
    setErrors(errs);
    if (!Object.keys(errs).length) setStep(2);
  };

  const publish = () => {
    const dates = occurrenceDates(form);
    const dayShift = form.endDate && form.endDate !== form.date
      ? Math.round((parseDate(form.endDate).getTime() - parseDate(form.date).getTime()) / 86400000)
      : 0;
    const seriesId = Date.now();
    onPublish(
      dates.map((date, i) => {
        const end = parseDate(date);
        end.setDate(end.getDate() + dayShift);
        return { ...form, id: seriesId + i, org: hostName, date, endDate: toIso(end), seriesId, isRepeat: form.recurring };
      }),
    );
  };

  const endDate = form.endDate || form.date;
  const summaryWhen = form.date && form.time
    ? `${fmtPlainDate(form.date)} · ${fmtTime(form.time)}${form.endTime ? (endDate !== form.date ? ` – ${fmtPlainDate(endDate)} · ` : " – ") + fmtTime(form.endTime) : ""}`
    : "";

  const dayNames = [...form.repeatDays].sort((a, b) => a - b).map((i) => DOW_FULL[i]);
  const recurrenceSummary =
    `Repeats every ${FREQ_LABEL[form.frequency]}` +
    (form.frequency !== "monthly" && dayNames.length ? ` on ${dayNames.join(", ")}` : "") +
    (form.repeatUntil ? `, until ${fmtPlainDate(form.repeatUntil)}.` : ".");

  const cellLabel = { fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: T.color.muted, textTransform: "uppercase" } as const;
  const cellInput = { ...S.input, padding: "8px 10px" };

  return (
    <ModalShell title="Create event" subtitle={`Hosting as ${hostName}`} onClose={onClose}>
      {step === 1 ? (
        <>
          <Field label="Title" error={errors.title}>
            <input value={form.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Event title" style={{ ...S.input, borderColor: border("title") }} />
          </Field>

          <div style={{ border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: "12px 13px", marginBottom: 14, background: T.color.field }}>
            <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", gap: "8px 10px", alignItems: "center" }}>
              <span style={cellLabel}>Starts</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => patch({ date: e.target.value, endDate: form.endDate || e.target.value })}
                style={{ ...cellInput, borderColor: border("date") }}
              />
              <input type="time" value={form.time} onChange={(e) => patch({ time: e.target.value })} style={{ ...cellInput, borderColor: border("time") }} />

              <span style={cellLabel}>Ends</span>
              <input type="date" value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} style={{ ...cellInput, borderColor: border("when") }} />
              <input type="time" value={form.endTime} onChange={(e) => patch({ endTime: e.target.value })} style={{ ...cellInput, borderColor: border("when") }} />
            </div>
            {errors.when && <span style={{ ...S.error, marginTop: 8 }}>{errors.when}</span>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 12, paddingTop: 11, borderTop: `1px solid ${T.color.line}` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.color.ink }}>Repeats?</span>
              <Toggle on={form.recurring} accentColor={accentColor} onChange={toggleRecurring} />
            </div>

            {form.recurring && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, alignItems: "center" }}>
                  <span style={cellLabel}>Every</span>
                  <select value={form.frequency} onChange={(e) => patch({ frequency: e.target.value as RepeatFrequency })} style={{ ...cellInput, cursor: "pointer" }}>
                    <option value="weekly">Week</option>
                    <option value="biweekly">Two weeks</option>
                    <option value="monthly">Month (same date)</option>
                  </select>
                </label>

                {form.frequency !== "monthly" && (
                  <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, alignItems: "start" }}>
                    <span style={{ ...cellLabel, paddingTop: 7 }}>On</span>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {DOW.map((label, i) => {
                        const on = form.repeatDays.includes(i);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() =>
                              patch({ repeatDays: on ? form.repeatDays.filter((d) => d !== i) : [...form.repeatDays, i] })
                            }
                            style={{
                              width: 32,
                              height: 30,
                              borderRadius: T.radius.md,
                              cursor: "pointer",
                              fontFamily: T.font,
                              fontSize: 10,
                              fontWeight: 700,
                              background: on ? accentColor : T.color.field,
                              color: on ? "#FFFFFF" : T.color.body,
                              border: `1px solid ${on ? accentColor : T.color.line}`,
                            }}
                          >
                            {label[0] + label[1].toLowerCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <label style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, alignItems: "center" }}>
                  <span style={cellLabel}>Until</span>
                  <input type="date" value={form.repeatUntil} onChange={(e) => patch({ repeatUntil: e.target.value })} style={{ ...cellInput, borderColor: border("recurrence") }} />
                </label>

                {errors.recurrence && <span style={S.error}>{errors.recurrence}</span>}
                <p style={{ fontSize: 10.5, color: T.color.muted, margin: 0, lineHeight: 1.45 }}>{recurrenceSummary}</p>
              </div>
            )}
          </div>

          <Field label="Location" error={errors.location}>
            <input value={form.location} onChange={(e) => patch({ location: e.target.value })} placeholder="e.g. RCH Room 2" style={{ ...S.input, borderColor: border("location") }} />
          </Field>

          <Field label="Description (optional)">
            <textarea
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="What's happening?"
              style={{ ...S.input, minHeight: 76, resize: "vertical" }}
            />
          </Field>

          <ToggleRow
            title="Registration required?"
            hint="Members register on your platform of choice. (ex. Eventbrite, Meetup, etc)"
            on={form.registrationRequired}
            accentColor={accentColor}
            onChange={() => patch({ registrationRequired: !form.registrationRequired, registrationLink: form.registrationRequired ? "" : form.registrationLink })}
          />
          {form.registrationRequired && (
            <Field label="Registration link" error={errors.registrationLink}>
              <input value={form.registrationLink} onChange={(e) => patch({ registrationLink: e.target.value })} placeholder="https://…" style={{ ...S.input, borderColor: border("registrationLink") }} />
            </Field>
          )}

          <ToggleRow
            title="Volunteers needed?"
            hint="Recruiting volunteers for this event."
            on={form.volunteersNeeded}
            accentColor={accentColor}
            onChange={() => patch({ volunteersNeeded: !form.volunteersNeeded, volunteerContact: form.volunteersNeeded ? "" : form.volunteerContact })}
          />
          {form.volunteersNeeded && (
            <Field label="Volunteer contact email" error={errors.volunteerContact}>
              <input value={form.volunteerContact} onChange={(e) => patch({ volunteerContact: e.target.value })} placeholder="staff@org.example" style={{ ...S.input, borderColor: border("volunteerContact") }} />
            </Field>
          )}

          <button onClick={validate} style={{ ...S.btnPrimary(accentColor), width: "100%", padding: 10, marginTop: 4 }}>
            Continue
          </button>
        </>
      ) : (
        <>
          <div style={{ background: T.color.surfaceAlt, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <SummaryRow label="Title" value={form.title} first />
            <SummaryRow label="When" value={summaryWhen} />
            <SummaryRow label="Repeats" value={form.recurring ? recurrenceSummary.replace(/^Repeats /, "").replace(/\.$/, "") : "Does not repeat"} />
            <SummaryRow label="Where" value={form.location} />
            <SummaryRow label="Host" value={hostName} />
            <SummaryRow label="Registration" value={form.registrationRequired ? form.registrationLink : "Not required"} />
            <SummaryRow label="Volunteers" value={form.volunteersNeeded ? form.volunteerContact : "Not recruiting"} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.color.ink, margin: "0 0 14px" }}>Is this information correct?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ ...S.btnSecondary, flex: 1, color: T.color.ink, borderColor: T.color.ink, padding: 9, fontSize: 12 }}>
              No, edit
            </button>
            <button onClick={publish} style={{ ...S.btnPrimary(accentColor), flex: 1, padding: 9 }}>
              Yes, publish
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
