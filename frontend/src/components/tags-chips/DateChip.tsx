import { C } from "../../styles/colors";
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
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: large ? 64 : 52, height: large ? 64 : 52, borderRadius: 12,
      background: C.white, border: `1px solid ${C.line}`, flexShrink: 0,
    }}>
      <span style={{ fontSize: large ? 11 : 10, fontWeight: 700, color: C.amber, letterSpacing: 0.6 }}>{month}</span>
      <span style={{ fontSize: large ? 28 : 22, fontWeight: 600, color: C.ink, lineHeight: 1 }}>{day}</span>
    </div>
  );
}