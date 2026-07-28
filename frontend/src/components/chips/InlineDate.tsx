import { fmtMonthDate, fmtPlainDate } from "../../utils/datetime";

export interface InlineDateProps {
  date: string;
  /** classes to pass to child element */
  className: string;
}

/** Inline, screen-reader-friendly date: shows "June 16", announces the full date. */
export default function InlineDate({ date, className }: InlineDateProps) {
  return (
    <span aria-label={fmtPlainDate(date)} className={className}>{fmtMonthDate(date)}</span>
  );
}
