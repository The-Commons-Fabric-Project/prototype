import { C } from "../../styles/colors";

type ButtonProps = {
  /** Variations on button styling */
  variant: string;
  /** Label for the button, used for accessibility and default display text unless otherwise specified */
  label: string;
  /** custom display text for the button if not using the label */
  displayText?: string;
  /** what do when button */
  onClick: () => void;
  children?: React.ReactElement[];
};

// TODO: refactor this w/ CSS
const variants = {
  primary: { background: C.accent, color: C.white, borderColor: C.accent },
  ghost: { background: "transparent", color: C.accent, borderColor: C.line },
  subtle: { background: C.accentSoft, color: C.accent, borderColor: "transparent" },
  danger: { background: "transparent", color: C.danger, borderColor: "rgba(178,58,72,0.3)"},
  link: { background: "none", border: "none", color: C.muted, fontSize: 12.5, cursor: "pointer", 
  // fontFamily: "'Public Sans', sans-serif", 
  textDecoration: "underline", padding: 0 },
};

/** Generic button component */
export default function Button({ 
  variant = "primary",
  label,
  displayText,
  onClick,
  children,
 }: ButtonProps) {
  return (
    <button 
      aria-label={label}
      onClick={onClick}
      style={{...variants[variant]}}
      className="cf-press font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-line text-white leading-[1.1] tracking-[0.1px]"
    >
      {displayText ? displayText : label}
      {children}
    </button>
  );
}