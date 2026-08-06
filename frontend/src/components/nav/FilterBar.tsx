import { type ChangeEventHandler, type Dispatch, type SetStateAction } from "react"
import Button from "../controls/Button";

type FilterBarProps = {
  matches: number,
  rangeStart: string,
  rangeEnd: string,
  setRangeStart: Dispatch<SetStateAction<string>>,
  setRangeEnd: Dispatch<SetStateAction<string>>,
}

type DatePickerProps = {
  label: string,
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>
}

function DatePicker({label, value, onChange}: DatePickerProps) { return (
  <div className="px-3">
    <label className="text-xs text-muted inline-flex gap-2 items-center">
      {label}
      <input type="date" 
        onChange={onChange} value={value}
        className="border border-line p-1 rounded-sm"
      />
    </label>
  </div>
)}


/** Component: filter a list of events between a start date and end date */
export default function FilterBar({
  matches,
  rangeStart, setRangeStart,
  rangeEnd, setRangeEnd,
}: FilterBarProps) {
  return (
    <div className="w-full flex flex-wrap gap-2 border border-line rounded-sm p-3 items-center justify-stretch">
      <h2 className="text-sm text-ink font-bold">FILTER BY DATE</h2>
      
      {/* start date picker */}
      <DatePicker 
        label="From"
        value={rangeStart}
        onChange={(e) => setRangeStart(e.target.value)}
      />

      {/* end date picker */}
      <DatePicker 
        label="to"
        value={rangeEnd}
        onChange={(e) => setRangeEnd(e.target.value)}
      />

      {/* if either date picker is set, show "Clear" button */}
      {(rangeStart || rangeEnd) && (
        <Button 
          label="Clear"
          className="p-0.5 text-xs"
          onClick={() => { setRangeStart(""); setRangeEnd(""); }}
        />
      )}

      {/* display num matches */}
      <div className="inline-flex text-xs text-muted grow justify-end">{matches} matches</div>
    </div>
  )
}