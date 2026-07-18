import { C } from "../../styles/colors";

export default function Tag({ 
  children, 
  tone = "soft" 
}) {
  const tones = {
    "soft": { background: C.accentSoft, color: C.accent },
    "amber": { background: "rgba(200,133,43,0.14)", color: C.amber },
  };
  return (
    <span style={{
      display: "inline-block", padding: "3px 9px", borderRadius: 999, fontSize: 10.5,
      fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
      fontFamily: "'Public Sans', sans-serif", ...tones[tone],
    }}>{children}</span>
  );
}