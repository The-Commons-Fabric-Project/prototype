/** HACK This entire file is stupid and should be refactored away */

export const C = {
  accent: "#F2A541",
  accentSoft: "#E3F0EC",
  ink: "#1C2B27",
  muted: "#6B7C77",
  line: "#D8E2DE",
  paper: "#F6F4EE",
  amber: "#C8852B",
  white: "#FFFFFF",
  danger: "#B23A48",
};

// export const base = {
//   //  fontFamily: "'Public Sans', sans-serif", 
//    fontWeight: 600, fontSize: 14,
//    padding: "10px 18px", borderRadius: 10, cursor: "pointer", border: "1px solid transparent",
//    lineHeight: 1.1, letterSpacing: 0.1,
// };

export const inputStyle = (err: React.ErrorInfo) => ({
  width: "100%", padding: "10px 12px", borderRadius: 9, fontSize: 14,
  border: `1px solid ${err ? C.danger : C.line}`, background: C.white, color: C.ink,
  // fontFamily: "'Public Sans', sans-serif", 
  outline: "none",
});

export const linkBtn = { 
  background: "none", border: "none", color: C.muted, fontSize: 12.5, cursor: "pointer", 
  // fontFamily: "'Public Sans', sans-serif", 
  textDecoration: "underline", padding: 0 };
