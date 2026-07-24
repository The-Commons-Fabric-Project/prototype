import type { ButtonVariant } from "../../types/variants";

// reference: https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/#testing-badge-component
const VARIANT_MAPS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white border-accent",
  ghost: "bg-white text-ink border-line",
  subtle: "bg-accentSoft text-ink border-line",
  danger: "bg-white text-danger border-line",
  link: "bg-transparent text-bg-subtle underline"
}

type ButtonProps = {
  /** Variations on button styling */
  variant?: ButtonVariant;
  /** Label for the button, used for accessibility and default display text unless otherwise specified */
  label: string;
  /** what do when button */
  onClick: () => void;
  /** child elements; for a button, usually just the display text */
  children?: React.ReactElement[] | string;
  /** additional Tailwind classes to pass to button element*/
  className?: string;
};

/** Generic button component */
export default function Button({ 
  variant = "primary",
  label,
  onClick,
  children,
  className,
  ...props
 }: ButtonProps) {
  const baseClasses = "font-sans font-semibold text-sm py-2.5 px-4 rounded-md cursor-pointer border border-transparent leading-tight";
  const classes = `${baseClasses} ${VARIANT_MAPS[variant]} ${className || ''}`
  return (
    <button 
      aria-label={label}
      onClick={onClick}
      className={`${classes} cf-press`}
      {...props}
    >
      {label} {children}
    </button>
  );
}