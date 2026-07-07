import { C } from "../../types/colors";

type FieldProps = {
  label: string,
  error: string,
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
      <span className="block text-ink text-xs font-semibold mb-6" style={{ display: "block", marginBottom: 6, fontFamily: "'Public Sans', sans-serif" }}>{label}</span>
      {children}
      {error && <span className="" style={{ display: "block", marginTop: 5, fontSize: 12, color: C.danger, fontWeight: 500 }}>{error}</span>}
    </label>
  );
}