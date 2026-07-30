import { useState, useRef, createContext, type RefObject, useContext } from "react";

type OverlayState = {
  modal: any,
  toast: { toastMsg: string, toastTimer: any, toast: (msg: string) => void},
}

const OverlayContext = createContext<OverlayState | undefined>(undefined); //({ toastMsg, toastTimer, toast })

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(0) as RefObject<NodeJS.Timeout | number > ;

  const toast = (msg: string) => {
    console.log(`Updating toast: "${msg}"`);
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  };

  return (
    <OverlayContext.Provider value={{ 
      toast: { toastMsg, toastTimer, toast },
      modal: ""
      }}>
      {children}
    </OverlayContext.Provider>
  )
}

export default function useToast() {
 const context = useContext(OverlayContext);
 
  if (context === undefined) {
    throw new Error('useToast must be used within an OverlayProvider')
  }
  // else { console.log(`toast message is set to: ${context.toast.toastMsg}`)};

  return context.toast
}