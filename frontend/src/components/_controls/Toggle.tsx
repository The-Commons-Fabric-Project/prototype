type ToggleProps = {
  /** label */
  label: string,
  /** tool tip for what this is toggling */
  hint?: string,
  /** toggle state */
  checked: boolean,
  /** callback for change */
  onChange: (checked: boolean) => void,
}

export default function Toggle({ 
  label, 
  hint, 
  checked, 
  onChange 
}: ToggleProps) {
  return (
    <div 
      className="flex rounded-md justify-between align-start mb-[14px] px-[12px] py-[14px]">
      <div>
        <span className="text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="text-xs text-muted" style={{ display: "block", marginTop: 2 }}>{hint}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative rounded-full ${checked ? "bg-accent border-ink" : "bg-line border-muted"} w-12 h-7 p-0.75 mt-[1px] cursor-pointer`}>
        <span className={`bg-white rounded-full size-5 absolute top-1 left-1 ${checked ? "translate-x-5" : ""}`}
        style={{ 
          transition: "translate 0.18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" 
        }} />
      </button>
    </div>
  );
}
