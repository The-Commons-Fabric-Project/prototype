type FieldProps = {
  /** label for the form field */
  label: string,
  /** error message to display */
  error?: string,
  /** children elements, needs some kind of input HTML element */
  children: React.ReactElement | string,
}

/** text input field used in forms, e.g. login username and password */
export default function Field({ 
  label, 
  error, 
  children,
}: FieldProps) {
  return (
    <label className="block mb-3.5">
      <span className="block text-[12.5px] font-semibold text-ink mb-1.5 font-sans">{label}</span>
      {children}
      {error && <span className="text-danger font-medium text-xs">{error}</span>}
    </label>
  );
}