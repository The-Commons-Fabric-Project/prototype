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
    <div className="px-3 bg-paper rounded-lg flex flex-col items-center justify-center outline-1 outline-line -outline-offset-1"
    style={{
      width: large ? 64 : 52, height: large ? 64 : 52
    }}
   >
      <span className="justify-start text-ink text-xs font-semibold font-sans uppercase tracking-wide"
      >{month}</span>
      <span className="text-primary font-sans text-xl font-semibold leading-md"
      // style={{ fontSize: large ? 28 : 22}}
      >{day}</span>
    </div>
  );
}
