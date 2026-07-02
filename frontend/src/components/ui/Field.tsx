type FieldProps = {
  label: string,
  error: string,
  children: React.ReactElement,
}

export default function Field({ 
  label, 
  error, 
  children,
}: FieldProps) {
  return (
    <label className="block mb-14">
      <span className="block text-ink text-xs font-semibold mb-6" style={{ display: "block", marginBottom: 6, fontFamily: "'Public Sans', sans-serif" }}>{label}</span>
      {children}
      {error && <span style={{ display: "block", marginTop: 5, fontSize: 12, color: C.danger, fontWeight: 500 }}>{error}</span>}
    </label>
  );
}

export const inputStyle = (err: React.ErrorInfo) => ({
  width: "100%", padding: "10px 12px", borderRadius: 9, fontSize: 14,
  border: `1px solid ${err ? C.danger : C.line}`, background: C.white, color: C.ink,
  fontFamily: "'Public Sans', sans-serif", outline: "none",
});