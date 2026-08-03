import type { Event } from '../../utils/types/events'
import { needsVolunteers, requiresRegistration } from '../../utils/types/events';
import { fmtPlainDate, fmtTime, toDateKey, toTimeKey } from '../../utils/datetime';
import DetailRow from '../chips/DetailRow';
import Icon from '../../assets/Icons';
import Modal, { ModalHeader } from './Modal';
import Button from '../controls/Button';
import { useToast } from '../../hooks/useOverlayContext';

type EventDetailModalProps = {
  /** event details */
  event: Event;
  /** The publishing organization's name, resolved by the parent via useOrgLookup. */
  orgName?: string;
  /** callback */
  onClose: () => void;
};

/** Pop-up with event details when clicked */
export default function EventDetailModal({ 
  event, orgName, onClose
}: EventDetailModalProps) {
  const { toast } = useToast();

  return (
    <Modal onClose={onClose} width={520}>
      <ModalHeader 
        title={event.title} 
        onClose={onClose}
        subtitle={orgName} />
      <div className="px-6 pt-6 pb-6">
        {event.description && <p className="text-[14.5px] text-slate-900 leading-[1.6] mb-4">{event.description}</p>}
        <div className="flex flex-col gap-2.5 mb-4.5 border-t border-slate-200 pt-4">
          <DetailRow 
            icon={<Icon name="calendar" size={15} />}  
            text={fmtPlainDate(toDateKey(event.startsAt))} /> 
          <DetailRow 
            icon={<Icon name="clock" size={15} />} 
            text={fmtTime(toTimeKey(event.startsAt))} />
          <DetailRow 
            icon={<Icon name="pin" size={15} />} 
            text={event.location ?? "Location to come"} />
          <DetailRow 
            icon={<Icon name="ticket" size={15} />} 
            text={
              requiresRegistration(event) ? (
                <>Registration required — <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" onClick={(e) => { if (!event.registrationLink) e.preventDefault(); }} className="text-slate-900 font-semibold underline break-all">{event.registrationLink || "link to come"}</a></>
              ) : "No registration required — just show up"
            } />
          {needsVolunteers(event) && (
            <DetailRow icon={<Icon name="user" size={15}/>} text={<>Volunteers wanted — <a href={
              // [x] FIXME: event properties doesn't have volunteerContact
              `mailto:${event.volunteerContact}`} className="text-slate-900 font-semibold underline">{event.volunteerContact}</a></>} />
          )}
          {requiresRegistration(event) && (
            <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer"
              onClick={(e) => { if (!event.registrationLink) e.preventDefault(); 
                // [x] FIXME: fix toast pop-ups
              toast("Opening registration…"); }}
              className="no-underline">
                {/* TODO: add real functionality*/}
              <Button className="w-full" onClick={() => {}}>Register on host's site ↗</Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
