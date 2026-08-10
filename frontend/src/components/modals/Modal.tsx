import { useEffect } from "react";
import type { ReactNode } from "react";

export type ModalProps = {
  children: ReactNode,
  onClose: () => void,
  width?: number,
}

/** Modal shell with header and blank contents. */
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
      className="fixed inset-0 z-100 flex items-center justify-center p-5 bg-black/45 backdrop-blur-xs animate-fade"
    >
      <div
        role="dialog" aria-modal="true"
        className={`w-full max-w-[${width}px] max-h-[88vh] overflow-y-auto bg-white rounded-md border border-gray-200 shadow-[0_16px_40px_rgba(0,0,0,0.2)] animate-pop`}
      >
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
    <div className="relative border-b border-gray-200 pt-5 px-6 pb-4">
      <button onClick={onClose} aria-label="Close"    
        className="cf-press absolute top-4 right-4 w-7 h-7 rounded-md border border-gray-200 bg-white cursor-pointer text-gray-500 text-[16px] leading-none flex items-center justify-center"
      >×</button>
      <h2 
        className="font-bold text-[20px] text-slate-900 m-0 pr-8">{title}</h2>
      {subtitle && 
      <p 
        className="mt-1 text-xs text-slate-500 font-sans">{subtitle}</p>}
    </div>
  );
}
