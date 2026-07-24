import type { ReactElement } from "react";

type SummaryProps {
  label: string | ReactElement;
  value: string | number | ReactElement;
  last: boolean;
}

export default function Summary({ label, value, last }) {
  return (
    <div className={`flex justify-between gap-4 ${last ? "" : "border-b border-slate-200 pb-2 mb-2"}`}>
      <span className="text-[12.5px] font-semibold text-slate-500">{label}</span>
      <span className="text-[13.5px] font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}