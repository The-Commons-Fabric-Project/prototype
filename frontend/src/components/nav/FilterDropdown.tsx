/**
 * FilterDropdown component - currently used to filter calendar events by organization, written so that a dropdown menu of filters could be repurposed for another data type
 */

import { useState } from "react";

import { COLOR_ORDER, NUMCOLORS } from "../../utils/palette";
import Button from "../controls/Button";

interface FilterDropdownProps {
  /** IDs of options (organizations) to view */
  appliedIds: number[];
  /** total number of options */
  total: number;
  /** callback to update changes in checked options */
  onApply: (ids: number[]) => void;
}

const ALL_STRIPE = "linear-gradient(90deg,#10C662,#4C6DC5,#6F49E0,#E2526C,#E67539,#F8E056)";
//`bg-linear-[90deg,${COLOR_ORDER.map(c => `${c}-c1`)}]`


function selectedStripe(ids: number[]): string {
  let stripe = "linear-gradient(90deg";
  for (const i of ids) {
    stripe += `,var(color-${COLOR_ORDER[ids[i]]}-c1)`
  }
  return stripe + ")";
}

export function FilterDropdown({ appliedIds, total, onApply }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number[]>(appliedIds);

  const allSelected = appliedIds.length === total;

  const toggle = () => {
    if (!open) setPending(appliedIds);
    setOpen(!open);
  }

  return (
    <Button 
      label="filter dropdown"
      variant="secondary" onClick={toggle} 
      className={`text-ink border-${open ? "ink" : "line"} inline-flex items-center gap-2`}
    >
      <span className={"h-1 w-3 rounded-xs"}
      style = {{background: `${allSelected ? ALL_STRIPE : selectedStripe(appliedIds)}`}}/>
      {allSelected ? "All organizations" : `${appliedIds.length} of ${total} orgs`}
      <span className="text-muted text-[9px]">
        {open ? "▲" : "▼"}
      </span>
    </Button>
  )
}