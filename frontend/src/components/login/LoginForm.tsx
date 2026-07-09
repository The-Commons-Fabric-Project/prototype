import { C, inputStyle } from "../../styles/colors";
import { useState } from "react";
import Button from "../ui/Button";
import Field from "../ui/Field";

export default function LoginForm({
  accounts, // this is just a placeholder for auth
  onLogin,
  onClose,
  updateParent = () => {},
  toast
}) {
  const [mode, setMode] = useState("login"); // login | password | email
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [newVal, setNewVal] = useState("");

  const doLogin = () => {
    const acct = accounts.find((a) => a.email === creds.email && a.password === creds.password);
    if (!acct) { setErr("Email or password not recognized."); return; }
    onLogin(acct);
    toast(`Welcome back, ${acct.name}`);
    onClose();
  };
  
  // user is changing either password or username
  if (mode !== "login") {
    const isPw = mode === "password";
    updateParent({title: (isPw? "Change password" : "Change email"), subtitle: (isPw ? undefined : "We'll send a confirmation link to the new address.")});
    return (
      <div style={{ padding: "18px 24px 24px" }}>
          <Field label={isPw ? "New password" : "New email"}>
            <input type={isPw ? "password" : "text"} style={inputStyle(false)} value={newVal}
              onChange={(e) => setNewVal(e.target.value)} placeholder={isPw ? "At least 6 characters" : "you@org.example"} />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" style={{ flex: 1 }} onClick={() => { setMode("login"); setNewVal(""); }}>Back</Button>
            <Button style={{ flex: 1 }} onClick={() => {
              toast(isPw ? "Password updated." : "Confirmation email sent.");
              setMode("login"); setNewVal("");
            }}>Save</Button>
          </div>
        </div>
    )
  }

  updateParent({ title: "Log in", subtitle: undefined});
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
      <Button onClick={doLogin}>Log in</Button>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 16 }}>
        <Button onClick={() => setMode("password")} 
        variant="link"
        >Change password</Button>
        <Button onClick={() => setMode("email")} 
        variant="link"
        >Change email</Button>
      </div>
    </div>
  );
}