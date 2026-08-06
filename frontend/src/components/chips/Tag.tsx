import type { TagVariant } from "../../utils/types/variants";

const VARIANT_MAPS: Record<TagVariant, string> = {
  solid: "bg-accent-soft text-ink border border-line",
  outline: "bg-white text-ink border border-muted",
}

type TagProps = {
  variant: TagVariant;
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