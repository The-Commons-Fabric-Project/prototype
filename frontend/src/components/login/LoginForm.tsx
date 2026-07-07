import { C, inputStyle } from "../../types/colors";
import { useState } from "react";
import Button from "../ui/Button";
import Field from "../ui/Field";

export default function LoginForm({
  setMode,
  doLogin
}) {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  
  return (
    <div style={{ padding: "18px 24px 24px" }}>
      <div style={{ background: C.accentSoft, borderRadius: 9, padding: "9px 12px", marginBottom: 16, fontSize: 12.5, color: C.accent }}>
        Demo hint: use <strong>hi@ottawacivictech.example</strong> / <strong>demo123</strong>
      </div>
      <Field label="Email" error={err ? " " : ""}>
        <input style={inputStyle(!!err)} value={creds.email}
          onChange={(e) => { setCreds({ ...creds, email: e.target.value }); setErr(""); }} placeholder="you@org.example" />
      </Field>
      <Field label="Password" error={err}>
        <input type="password" style={inputStyle(!!err)} value={creds.password}
          onChange={(e) => { setCreds({ ...creds, password: e.target.value }); setErr(""); }} placeholder="Your password" />
      </Field>
      <Button style={{ width: "100%" }} onClick={doLogin}>Log in</Button>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 16 }}>
        <button onClick={() => setMode("password")} 
          // style={linkBtn}
        >Change password</button>
        <button onClick={() => setMode("email")} 
          // style={linkBtn}
        >Change email</button>
      </div>
    </div>
  );
}