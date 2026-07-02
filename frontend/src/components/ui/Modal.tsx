import { useEffect } from "react";
import type { ReactElement } from "react";

type ModalProps = {
  children: ReactElement[],
  onClose: () => void,
  width: number,
}

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
      style={{
        position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20, background: "rgba(28,43,39,0.42)",
        backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", animation: "cf-fade .18s ease",
      }}
    >
      <div
        role="dialog" aria-modal="true"
        className="bg-paper border border-solid border-line"
        style={{
          width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto",
          borderRadius: 18, 
          boxShadow: "0 24px 60px rgba(28,43,39,0.28)", animation: "cf-pop .2s cubic-bezier(.2,.8,.3,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

type ModalHeaderProps = {
  title: string,
  onClose: () => void,
  subtitle: string,
}

export function ModalHeader({ title, onClose, subtitle }: ModalHeaderProps) {
  return (
    <div style={{ padding: "20px 24px 0", position: "relative" }}>
      <button onClick={onClose} aria-label="Close"    
        className="cf-press absolute bg-white text-muted border-solid border-line" 
        style={{
        position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 8,
        cursor: "pointer", fontSize: 16, lineHeight: 1,
      }}>×</button>
      <h2 
        className="text-ink"
        style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, margin: 0, paddingRight: 32 }}>{title}</h2>
      {subtitle && 
      <p 
        className="text-muted"
        style={{ fontSize: 13, margin: "6px 0 0", fontFamily: "'Public Sans', sans-serif" }}>{subtitle}</p>}
    </div>
  );
}
