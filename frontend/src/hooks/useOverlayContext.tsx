import { useState, useRef, createContext, type RefObject, useContext, type Dispatch, type SetStateAction } from "react";

import LoginModal from "../components/modals/LoginModal";
import CreateAccountModal from "../components/modals/CreateAccountModal";
import EventDetailModal from "../components/modals/EventDetailModal";
import CreateEventModal from "../components/modals/CreateEventModal";

// any new modals added, just add them here
const Modals = {
  login: LoginModal,
  create_account: CreateAccountModal,
  event_detail: EventDetailModal,
  create_event: CreateEventModal,
}

type ModalOption = keyof typeof Modals | undefined;

type ToastTimer = RefObject<ReturnType<typeof setTimeout> | undefined>;

type OverlayState = {
  modal: { modal: ModalOption, setModal: Dispatch<SetStateAction<ModalOption>> },
  toast: { toastMsg: string, toastTimer: ToastTimer, toast: (msg: string) => void},
}

const OverlayContext = createContext<OverlayState | undefined>(undefined); //({ toastMsg, toastTimer, toast })

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [toastMsg, setToastMsg] = useState("");
  const [modal, setModal] = useState<ModalOption>(undefined);
  const toastTimer: ToastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = (msg: string) => {
    console.log(`Updating toast: "${msg}"`);
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  };

  return (
    <OverlayContext.Provider value={{ 
      toast: { toastMsg, toastTimer, toast },
      modal: { modal, setModal }
      }}>
      {children}
    </OverlayContext.Provider>
  )
}

export function useToast() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useToast must be used within an OverlayProvider')
  }
  // else { console.log(`toast message is set to: ${context.toast.toastMsg}`)};
  return context.toast
}

export function useModal() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useModal must be used within an OverlayProvider');
  }
  return context.modal;
}