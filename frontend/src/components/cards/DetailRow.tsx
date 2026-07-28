import type { ReactElement } from "react";
import Icon from "../../assets/Icons";

type DetailRowProps = {
  icon: ReturnType<typeof Icon>,
  text: string | undefined | ReactElement
}

export default function DetailRow({ icon, text }: DetailRowProps) {
  return (
    <div className="flex gap-[10px] align-items-start text-[14px] text-ink leading-[1.45]" 
    // style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: C.ink, lineHeight: 1.45 }}
    >
      <span className="text-muted mt-[1px]" 
      // style={{ flexShrink: 0, color: C.muted, marginTop: 1 }}
      >{icon}</span><span>{text}</span>
    </div>
  );
}