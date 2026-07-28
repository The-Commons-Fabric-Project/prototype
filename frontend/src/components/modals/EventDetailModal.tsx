import type { Event } from '../../types/events'
import { fmtDateChip, fmtPlainDate, fmtTime } from '../../utils/datetime';
import DetailRow from '../cards/DetailRow';
import Icon from '../../assets/Icons';
import Modal, { ModalHeader } from './Modal';
import Button from '../controls/Button';

type EventDetailModalProps = {
  /** event details */
  event: Event;
  /** callback */
  onClose: () => void;
  toast: () => void;
};

/** Pop-up with event details when clicked */
export default function EventDetailModal({ 
  event, onClose, toast
}: EventDetailModalProps) {
  return (
    <Modal onClose={onClose} width={520}>
      <ModalHeader 
        title={event.title} 
        onClose={onClose}
        subtitle={event.org} />
      <div className="px-6 pt-6 pb-6">
        {event.description && <p className="text-[14.5px] text-slate-900 leading-[1.6] mb-4">{event.description}</p>}
        <div className="flex flex-col gap-[10px] mb-[18px] border-t border-slate-200 pt-4">
          <DetailRow 
            icon={<Icon name="calendar" size={15} />}  
            text={fmtPlainDate(event.date)} /> 
          <DetailRow 
            icon={<Icon name="clock" size={15} />} 
            text={fmtTime(event.time)} />
          <DetailRow 
            icon={<Icon name="pin" size={15} />} 
            text={event.location} />
          <DetailRow 
            icon={<Icon name="ticket" size={15} />} 
            text={
              event.registrationRequired ? (
                <>Registration required — <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" onClick={(e) => { if (!event.registrationLink) e.preventDefault(); }} className="text-slate-900 font-semibold underline break-all">{event.registrationLink || "link to come"}</a></>
              ) : "No registration required — just show up"
            } />
          {event.volunteersNeeded && (
            <DetailRow icon={<Icon name="user" size={15}/>} text={<>Volunteers wanted — <a href={
              // FIXME: event properties doesn't have volunteerContact
              `mailto:${event.volunteerContact}`} className="text-slate-900 font-semibold underline">{event.volunteerContact}</a></>} />
          )}
          {event.registrationRequired && (
            <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer"
              onClick={(e) => { if (!event.registrationLink) e.preventDefault(); 
                // FIXME: fix toast pop-ups
              toast("Opening registration…"); }}
              className="no-underline">
                {/* FIXME: button doesn't work */}
              <Button className="w-full">Register on host's site ↗</Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
