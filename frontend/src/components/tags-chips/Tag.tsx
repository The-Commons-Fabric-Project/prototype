enum TagVariant {
  YELLOW,
  BLUE,
  PINK,
  GREEN, 
  GREY
}

const VARIANT_MAPS: Record<TagVariant, string> = {
  [TagVariant.YELLOW]: "bg-status-highlight-soft",
  [TagVariant.BLUE]: "bg-accent-primary-soft",
  [TagVariant.PINK]: "bg-status-danger-soft",
  [TagVariant.GREEN]: "bg-accent-secondary-soft",
  [TagVariant.GREY]: "bg-bg-status"
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
  variant = TagVariant.YELLOW,
  label = "Category",
  children,
}: TagProps) {
  return (
    <span 
      className={"px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-[0.8px] uppercase font-sans " + VARIANT_MAPS[variant]}
    >{label} {children}</span>
  );
}