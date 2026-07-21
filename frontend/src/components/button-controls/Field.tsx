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
    <label className="block mb-6">
      <span className="block text-ink text-xs font-semibold mb-2">{label}</span>
      {children}
      {error && <span className="text-danger font-medium text-xs">{error}</span>}
    </label>
  );
}