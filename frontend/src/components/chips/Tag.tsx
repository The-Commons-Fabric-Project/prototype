import type { TagVariant } from "../../utils/types/variants";
import { PALETTE } from "../../utils/palette";
import type { CSSProperties } from "react";

const tagStyles = (color: TagVariant): CSSProperties => {
  const c = PALETTE[color];
  return {
    backgroundColor: c.tint,
    color: c.text,
    border: `1pt solid ${c.c1}`
  } // `bg-["${c.tint}"] text-[${c.text}] border-[${c.c1}]`;
};

// {
//   // solid: "bg-accent-soft text-ink border border-line",
//   // outline: "bg-white text-ink border border-muted",
// }

type TagProps = {
  variant: TagVariant;
  children: React.ReactElement[] | string;
} 

export default function Tag({ 
  variant = "purple",
  children,
}: TagProps) {
  return (
    <span 
      className={"inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-sans"}
      style = {tagStyles(variant)}
    >{children}</span>
  );
}