import { C } from "../../styles/colors";

export default function Toggle({ 
  label, 
  hint, 
  checked, 
  onChange 
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, padding: "12px 14px", background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 14 }}>
      <div>
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: "'Public Sans', sans-serif" }}>{label}</span>
        {hint && <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{hint}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="cf-press" style={{
        flexShrink: 0, width: 44, height: 25, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
        background: checked ? C.accent : C.line, transition: "background .18s ease", marginTop: 1,
      }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 22 : 3, width: 19, height: 19, borderRadius: "50%", background: C.white, transition: "left .18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}
