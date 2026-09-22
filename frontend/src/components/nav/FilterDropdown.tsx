/**
 * FilterDropdown component - currently used to filter calendar events by organization, written so that a dropdown menu of filters could be repurposed for another data type
 */

interface FilterDropdownProps {
  /** IDs of options (organizations) to view */
  appliedIds: number[];
  /** callback to update changes in checked options */
  onApply: (ids: number[]) => void;
}

export function FilterDropdown({ appliedIds, onApply }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number[]>(appliedIds);
}