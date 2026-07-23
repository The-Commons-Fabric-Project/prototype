import { fmtDateChip } from "../../utils/datetime";

type DateChipProps = {
  date: string;
  large: boolean;
}

export default function DateChip({ 
  date, 
  large 
}: DateChipProps) {
  const { month, day } = fmtDateChip(date);

  return (
    <div className="px-3 py-2 bg-bg-surface rounded-lg flex flex-col items-center justify-center outline-1 outline-border-default -outline-offset-1"
     style={{
      width: large ? 64 : 52, height: large ? 64 : 52
    }}
   >
      <span className="justify-start text-text-link text-xs font-semibold font-sans uppercase tracking-wide"
      >{month}</span>
      <span className="text-text-primary font-sans text-xl font-semibold"
      style={{ fontSize: large ? 28 : 22}}>{day}</span>
    </div>
  );
}
