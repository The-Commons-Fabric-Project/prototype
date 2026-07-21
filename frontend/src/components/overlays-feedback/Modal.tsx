import { useEffect } from "react";
import type { ReactElement } from "react";

export type ModalProps = {
  children: ReactElement[],
  onClose: () => void,
  width: number,
}

// this was copied from Claude's TSX, need to reconcile with the existing EventDescription component

/** Modal shell with header and blank contents. 
 * 
 * TODO: fix the close button
*/
export default function Modal({ 
  children, 
  onClose, 
  width = 460 
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{
        background: 'rgba(65, 65, 66, 0.42)'
      //   position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center",
      //   justifyContent: "center", padding: 20, background: "rgba(28,43,39,0.42)",
      //   backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", animation: "cf-fade .18s ease",
      }}
    >
      <div
        role="dialog" aria-modal="true"
        className="bg-paper border border-solid border-line"
        // TODO: merge these styles with className
        style={{
          width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto",
          borderRadius: 18, 
          boxShadow: "0 24px 60px rgba(28,43,39,0.28)", animation: "cf-pop .2s cubic-bezier(.2,.8,.3,1)",
        }}
      >
        {/* Close button */}
        <button
          aria-label="Close"
          className="cf-press absolute top-4 right-4 z-10 w-[30px] h-[30px] rounded-[8px] border border-line bg-white cursor-pointer text-muted text-[16px] flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export type ModalHeaderProps = {
  title: string,
  onClose: () => void,
  subtitle: string | undefined,
}

export function ModalHeader({ title, onClose, subtitle }: ModalHeaderProps) {
  return (
    // TODO: convert style w className
    <div style={{ padding: "20px 24px 0", position: "relative" }}>
      <button onClick={onClose} aria-label="Close"    
        className="cf-press absolute bg-white text-muted border-solid border-line" 
        style={{
        position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 8,
        cursor: "pointer", fontSize: 16, lineHeight: 1,
      }}>×</button>
      <h2 
        className="text-ink"
        // TODO: merge style w className
        style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, margin: 0, paddingRight: 32 }}>{title}</h2>
      {subtitle && 
      <p 
        className="text-muted"
        // TODO: merge style w className
        style={{ fontSize: 13, margin: "6px 0 0", fontFamily: "'Public Sans', sans-serif" }}>{subtitle}</p>}
    </div>
  );
}
