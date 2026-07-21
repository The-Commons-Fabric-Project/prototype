import type { TagVariant } from "../../types/variants";

const VARIANT_MAPS: Record<TagVariant, string> = {
  yellow: "bg-status-highlight-soft",
  blue: "bg-accent-primary-soft",
  pink: "bg-status-danger-soft",
  green: "bg-accent-secondary-soft",
  grey: "bg-bg-status"
}

type TagProps = {
  /** Tag color */
  variant: TagVariant;
  /** label */
  label: string;
  /** child elements; for tags, just the content */
  children?: React.ReactElement[];
}

export default function Tag({ 
  variant = "yellow",
  label = "Category",
  children,
}: TagProps) {
  return (
    <span 
      className={"px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.8px] uppercase font-sans " + VARIANT_MAPS[variant]}
    >{label} {children}</span>
  );
}