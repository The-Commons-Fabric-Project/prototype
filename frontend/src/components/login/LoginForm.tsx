import { useState } from "react";
import Button from "../button-controls/Button";
import Field from "../button-controls/Field";

import type { TextInputVariant as InputVariant } from "../../types/variants";

function inputStyle (err: React.ErrorInfo | boolean): InputVariant {
  return `${err ? "error" : "default"}`;
}

export default function LoginForm({
  accounts, // this is just a placeholder for auth
  onLogin,
  onClose,
  updateParent,
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
  
  const baseInputStyles = "px-3 py-2 border border-bg-subtle rounded-md w-full";

  // user is changing either password or username
  if (mode !== "login") {
    const isPw = mode === "password";
    updateParent({title: (isPw? "Change password" : "Change email"), subtitle: (isPw ? undefined : "We'll send a confirmation link to the new address.")});
    return (
      <div className="py-2 px-6"
      // style={{ padding: "18px 24px 24px" }}
      >
        <Field label={isPw ? "New password" : "New email"}>
          <input 
            type={isPw ? "password" : "text"} 
            className={`${baseInputStyles} ${inputStyle(false)}`}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)} placeholder={isPw ? "At least 6 characters" : "you@org.example"} />
        </Field>
        <div className="flex gap-2.5">
          <Button variant="ghost" styles="flex-1"
          onClick={() => { setMode("login"); setNewVal(""); }} label="Back"/>
          <Button styles="flex-1" onClick={() => {
            toast(isPw ? "Password updated." : "Confirmation email sent.");
            setMode("login"); setNewVal("");
          }} label="Save"/>
        </div>
      </div>
    )
  }

  // default return: user logging in
  updateParent({ title: "Log in", subtitle: undefined});
  return (
    <div className="py-2 px-6">
      <div className="bg-accent-primary-soft text-shadow-text-primary rounded-md text-xs font-normal tracking-[0.8px] px-3 py-2 mb-4"
      >
        Demo hint: use <strong>hi@ottawacivictech.example</strong> / <strong>demo123</strong>
      </div>
      <Field label="Email" error={err ? " " : ""}>
        <input className={`${baseInputStyles} ${inputStyle(!!err)}`}
          value={creds.email}
          onChange={(e) => { setCreds({ ...creds, email: e.target.value }); setErr(""); }} placeholder="you@org.example" />
      </Field>
      <Field label="Password" error={err}>
        <input type="password" className={`${baseInputStyles} ${inputStyle(!!err)}`} value={creds.password}
          onChange={(e) => { setCreds({ ...creds, password: e.target.value }); setErr(""); }} placeholder="Your password" />
      </Field>
      <Button onClick={doLogin} label="Log in"/>
      <div className="flex justify-center gap-4.5 mt-4">
        <Button onClick={() => setMode("password")} 
        variant="link" label="Change password"/>
        <Button onClick={() => setMode("email")} 
        variant="link" label="Change email"/>
      </div>
    </div>
  );
}