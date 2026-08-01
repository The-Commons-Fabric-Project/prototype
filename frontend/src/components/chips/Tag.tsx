import type { TagVariant } from "../../utils/types/variants";

const VARIANT_MAPS: Record<TagVariant, string> = {
  // NOTE: maybe someday we'll bring back colors?
  // yellow: "bg-status-highlight-soft",
  // blue: "bg-accent-primary-soft",
  // pink: "bg-status-danger-soft",
  // green: "bg-accent-secondary-soft",
  // grey: "bg-bg-status"
  solid: "bg-accent-soft text-ink border border-line",
  outline: "bg-white text-ink border border-muted",
}

type TagProps = {
  /** Tag color */
  variant: TagVariant;
  /** child elements; for tags, just the content */
  children: React.ReactElement[] | string;
} 

export default function Tag({ 
  variant = "solid",
  children,
}: TagProps) {
  return (
    <span 
      className={"inline-block px-2 py-1 rounded-[4px] text-[10.5px] font-semibold uppercase tracking-[0.06em] font-sans " + VARIANT_MAPS[variant]}
    >{children}</span>
  );
}