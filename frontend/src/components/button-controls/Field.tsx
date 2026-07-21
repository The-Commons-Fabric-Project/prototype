type FieldProps = {
  /** label for the form field */
  label: string,
  /** error message to display */
  error?: string,
  children: React.ReactElement,
}

/** text input field used in forms, e.g. login username and password */
export default function Field({ 
  label, 
  error, 
  children,
}: FieldProps) {
  return (
    <label className="block mb-14">
      <span className="block text-ink text-xs font-semibold mb-6" style={{ display: "block", marginBottom: 6 }}>{label}</span>
      {children}
      {error && <span className="text-danger font-medium text-xs" style={{ display: "block", marginTop: 5, }}>{error}</span>}
    </label>
  );
}