type ButtonProps = {
  /** Label for the button, used for accessibility and default display text unless otherwise specified */
  label: string;
  /** custom display text for the button if not using the label */
  displayText?: string;
  /** what do when button */
  onClick: () => void;
};
 
// # collecting all instances of <button> element across existing components

// ../layout/Header.tsx auth buttons
{/* <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-line bg-transparent text-primary leading-[1.1] tracking-[0.1px]">
    Log in
  </button>
  <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-primary bg-primary text-white leading-[1.1] tracking-[0.1px]">
    Create account
  </button> */}

// ../popup/EventDescription.tsx close button
{/* <button
    aria-label="Close"
    className="cf-press absolute top-4 right-4 z-10 w-[30px] h-[30px] rounded-[8px] border border-line bg-white cursor-pointer text-muted text-[16px] flex items-center justify-center"
    onClick={onClose}
  >
    ×
  </button> */}

// ../../routes/index.tsx view toggle buttons
{/* <button
    onClick={() => setView('cards')}
    className={`text-[13px] rounded-[8px] font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'cards' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
  >
    Card grid
  </button>
  <button
    onClick={() => setView('calendar')}
    className={`text-[13px] rounded-[8px] font-semibold px-4 py-[7px] capitalize transition-colors cursor-pointer border-0 ${view === 'calendar' ? 'bg-primary text-white' : 'bg-transparent text-muted'}`}
  >
    Calendar
  </button> */}

// # This was CSS variables from Claude single TSX file

/* 
const base = {
   fontFamily: "'Public Sans', sans-serif", fontWeight: 600, fontSize: 14,
   padding: "10px 18px", borderRadius: 10, cursor: "pointer", border: "1px solid transparent",
   lineHeight: 1.1, letterSpacing: 0.1,
};
const variants = {
   primary: { background: C.accent, color: C.white, borderColor: C.accent },
   ghost: { background: "transparent", color: C.accent, borderColor: C.line },
   subtle: { background: C.accentSoft, color: C.accent, borderColor: "transparent" },
   danger: { background: "transparent", color: C.danger, borderColor: "rgba(178,58,72,0.3)"},
};
*/

/** Generic button component */
export default function Button({ 
  label,
  displayText,
  onClick,
 }: ButtonProps) {
  return (
    <button 
      aria-label={label}
      onClick={onClick}
      className="cf-press font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-line bg-primary text-white leading-[1.1] tracking-[0.1px]"
    >
      {displayText ? displayText : label}
    </button>
  );
}