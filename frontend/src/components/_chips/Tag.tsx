import type { TagVariant } from "../../utils/types/variants";
import { COLOR_CLASSES } from "../../utils/palette";

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
      className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider font-sans ${COLOR_CLASSES[variant].chip}`}
    >{children}</span>
  );
}
