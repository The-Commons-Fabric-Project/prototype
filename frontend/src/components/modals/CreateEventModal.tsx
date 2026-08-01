/** 
 * Create event modal (Org Admin only)
 */

import { useState } from "react";

import Modal, { ModalHeader } from "./Modal";
import Field from "../controls/Field";
import Button from "../controls/Button";
import Toggle from "../controls/Toggle";
import Summary from "../cards/Summary";

import type { Event } from "../../utils/types/events";
import { EMAIL_RE } from "../../utils/types/orgs";
import { fmtTime, fmtPlainDate } from "../../utils/datetime";
import { useToast } from "../../hooks/useOverlayContext";
import type { User } from "../../utils/types/users";

export type CreateEventFormData = Pick<Event,
  'title' | 'date' | 'time' | 'location' | 'description' | 
  'registrationRequired' | 'registrationLink' |
  'volunteersNeeded' | 'volunteerContact'
  >;

type EventFormErrors = Partial<CreateEventFormData>;

type CreateEventModalProps = {
  onClose: () => void,
  session: User,
  onCreate: (event: CreateEventFormData & { org: string }) => void,
}

export default function CreateEventModal({ 
  onClose, 
  session, // need to know the user who's creating the account for their org affiliation
  onCreate
}: CreateEventModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateEventFormData>({
    title: "", date: "", time: "", location: "", description: "",
    registrationRequired: false, registrationLink: "",
    volunteersNeeded: false, volunteerContact: "",
  });
  const [errors, setErrors] = useState<EventFormErrors>({});
  const { toast } = useToast();

  const setF = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e: Partial<CreateEventFormData> = {};
    if (!form.title?.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Event date is required.";
    if (!form.time) e.time = "Event time is required.";
    if (!form.location?.trim()) e.location = "Location is required.";
    if (form.registrationRequired && !form.registrationLink?.trim()) e.registrationLink = "Add the link people register through.";
    if (form.volunteersNeeded && !EMAIL_RE.test(form.volunteerContact as string)) e.volunteerContact = "Add a valid contact email for volunteers.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputStyle = (err: EventFormErrors[keyof EventFormErrors]) => `w-full px-[11px] py-[9px] rounded-md text-sm font-sans outline-none ${err ? 'border border-red-500' : 'border border-slate-300'} bg-white text-slate-900`;

  return (
    <Modal onClose={onClose} width={500}>
      <ModalHeader title="Create event" onClose={onClose}
        subtitle={`Hosting as ${session.username}`} />
      <div className="px-[18px] py-[24px]">
        {step === 1 ? (
          <>
            <Field label="Title" error={errors.title}>
              <input className={inputStyle(errors.title)} value={form.title}
                onChange={(e) => setF({ title: e.target.value })} placeholder="Event title" />
            </Field>
            <div className="flex gap-3">
              <div className="flex-1">
                <Field label="Event date" error={errors.date}>
                  <input type="date" className={inputStyle(errors.date)} value={form.date}
                    onChange={(e) => setF({ date: e.target.value })} />
                </Field>
              </div>
              <div className="flex-1">
                <Field label="Event time" error={errors.time}>
                  <input type="time" className={inputStyle(errors.time)} value={form.time}
                    onChange={(e) => setF({ time: e.target.value })} />
                </Field>
              </div>
            </div>
            <Field label="Location" error={errors.location}>
              <input className={inputStyle(errors.location)} value={form.location}
                onChange={(e) => setF({ location: e.target.value })} placeholder="e.g. RCH Room 2" />
            </Field>
            <Field label="Description (optional)">
              <textarea className={inputStyle(false)} value={form.description}
                onChange={(e) => setF({ description: e.target.value })} placeholder="What's happening?" />
            </Field>

            <Toggle label="Registration required?" hint="Members register on your platform of choice. (ex. Eventbrite, Meetup, etc)"
              checked={form.registrationRequired}
              onChange={(v) => setF({ registrationRequired: v, ...(v ? {} : { registrationLink: "" }) })} />
            {form.registrationRequired && (
              <Field label="Registration link" error={errors.registrationLink}>
                <input className={inputStyle(errors.registrationLink)} value={form.registrationLink}
                  onChange={(e) => setF({ registrationLink: e.target.value })} placeholder="https://…" />
              </Field>
            )}

            <Toggle label="Volunteers needed?" hint="Recruiting volunteers for this event."
              checked={form.volunteersNeeded}
              onChange={(v) => setF({ volunteersNeeded: v, ...(v ? {} : { volunteerContact: "" }) })} />
            {form.volunteersNeeded && (
              <Field label="Volunteer contact email" error={errors.volunteerContact}>
                <input className={inputStyle(errors.volunteerContact)} value={form.volunteerContact}
                  onChange={(e) => setF({ volunteerContact: e.target.value })} placeholder="staff@org.example" />
              </Field>
            )}

            <Button className="w-full mt-[4px]"
            // {{ width: "100%", marginTop: 4 }} 
            onClick={() => { if (validate()) setStep(2); }}>Continue</Button>
          </>
        ) : (
          <>
            <div className="bg-paper border border-line rounded-sm p-[16px] mb-[16px]"
            // {{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6, padding: 16, marginBottom: 16 }}
            >
              <Summary label="Title" value={form.title} />
              <Summary label="When" value={`${fmtPlainDate(form.date)} · ${fmtTime(form.time)}`} />
              <Summary label="Where" value={form.location as string} />
              <Summary label="Host" value={session.username} />
              <Summary label="Registration" value={form.registrationRequired ? form.registrationLink as string : "Not required"} />
              <Summary label="Volunteers" value={form.volunteersNeeded ? form.volunteerContact as string : "Not recruiting"} last />
            </div>
            <p className="text-[14px] font-[600] text-ink m-[0 0 14px]"
            // {{ fontSize: 14, fontWeight: 600, color: C.ink, margin: "0 0 14px" }}
            >Is this information correct?</p>
            <div className="flex gap-[10px]"
            // {{ display: "flex", gap: 10 }}
            >
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>No, edit</Button>
              <Button className="flex-1" onClick={() => {
                onCreate({ ...form, org: session.username });
                toast("Event created and confirmed.");
                onClose();
              }}>Yes, publish</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}