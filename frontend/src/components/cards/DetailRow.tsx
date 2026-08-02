import type { ReactElement } from "react";
import Icon from "../../assets/Icons";

type DetailRowProps = {
  icon: ReturnType<typeof Icon>,
  text: string | undefined | ReactElement
}

export default function DetailRow({ icon, text }: DetailRowProps) {
  return (
    <div className="flex gap-2.5 align-items-start text-[14px] text-ink leading-[1.45]">
      <span className="text-muted mt-px" 
      >{icon}</span><span>{text}</span>
    </div>
  );
}