import type { Org } from "../../api/organizations"
import { classesForID } from "../../utils/palette";
import { orgInitials } from "../../utils/stringcheck";

/**
 * LegendBar component
 * 
 * displays color-coded legend for the calendar
 */

interface LegendBarProps {
  visible: Pick<Org, "id" | "name">[];
  /** in case we add interactivity when user clicks on the legend */
  onSelect: (target: Org) => void;
}

export function LegendBar({ visible }: LegendBarProps) {
  return (
    <div className={`flex flex-wrap gap-3.5 mt-3 pt-2.5 border-t border-line`}>
      {visible.map(o => {
        const color = classesForID(o.id);
        return (
          <span key={o.id} className="inline-flex items-center gap-1.25 text-[9.5px] text-body">
            <span className={`${color.railX} h-1.25 w-3.5`}></span>
            {orgInitials(o.name)}
          </span>
        );
      })}
    </div>
  )
}

