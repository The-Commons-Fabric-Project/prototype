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
      className="outline-border-default rounded-md" 
      style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", 
        gap: 1, padding: "12px 14px", 
        // border: `1px solid ${C.line}`, 
        marginBottom: 14 }}
    >
      <div>
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        {hint && <span className="text-xs text-text-muted-muted" style={{ display: "block", marginTop: 2 }}>{hint}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative cf-press rounded-full border-accent-soft bg-${checked ? "accent-primary" : "bg-subtle"} w-12 h-7 p-0.75`} style={{
        cursor: "pointer",
        // background: checked ? C.accent : C.line, 
        transition: "background .18s ease", marginTop: 1,
      }}>
        <span className={`bg-bg-surface rounded-full size-5 absolute top-1 left-1 ${checked ? "translate-x-5" : ""}`}
        style={{ 
          transition: "translate 0.18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" 
        }} />
      </button>
    </div>
  );
}
