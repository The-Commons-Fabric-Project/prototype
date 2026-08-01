import { useEffect, useState } from "react";
import Button from "../controls/Button";
import Field from "../controls/Field";
import type { TextInputVariant as InputVariant } from "../../utils/types/variants";
import type { ModalHeaderProps } from "./Modal";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useOverlayContext";

function inputStyle (err: React.ErrorInfo | boolean): InputVariant {
  return `${err ? "error" : "default"}`;
}

/** 
 * 
 * HACK: I (S) decided to separate the form from the modal so that the user could directly navigate to the URL /login but IDK if that's even useful...
 * 
 * TODO: this should probably be three separate forms? changing credentials could also be located in user profile (out of scope)
 */
export type LoginFormHeader = Pick<ModalHeaderProps, "title" | "subtitle">;

export type LoginFormProps = {
  /** called once the user is authenticated (or dismisses the form) */
  onClose: () => void,
  /** lets the parent update its heading as the form switches modes */
  onChangeMode: (header: LoginFormHeader) => void,
}

export default function LoginForm({
  onClose,
  onChangeMode,
}: LoginFormProps) {
  // state
  const [mode, setMode] = useState("login"); // login | password | email
  /** @state login form data */
  const [creds, setCreds] = useState({ email: "", password: "" });
  /** @state user specified value to update new email or new password */
  const [newVal, setNewVal] = useState("");
  const [err, setErr] = useState("");

  // context
  const { toast } = useToast();
  const auth = useAuth(); 
  const { status } = auth;

  // event handlers and effects
  const handleSubmit = (e: any) => {
    e.preventDefault();
    auth.login(creds.email, creds.password);
  } 

  // handle when auth service successfully verifies the user
  useEffect(() => {
    // console.log("Login form effect!");
    switch (status) {
      case 'success': {
        toast(`Welcome back, ${auth.user?.username}`);
        onClose();
        return;
      } case 'fail': {
        setErr("Authentication failed");
        return;
      } case 'pending': {
        setErr("Logging in...");
        return;
      }
    }
  }, [status])

  const baseInputStyles = "px-3 py-2 border border-bg-subtle rounded-md w-full";

  // user is changing either password or username
  if (mode !== "login") {
    const isPw = mode === "password";
    // onChangeMode({title: (isPw? "Change password" : "Change email"), subtitle: (isPw ? undefined : "We'll send a confirmation link to the new address.")});
    return (
      <form onSubmit={handleSubmit} className="py-2 px-6">
        <Field label={isPw ? "New password" : "New email"}>
          <input 
            type={isPw ? "password" : "text"} 
            className={`${baseInputStyles} ${inputStyle(false)}`}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)} placeholder={isPw ? "At least 6 characters" : "you@org.example"} />
        </Field>
        <div className="flex gap-2.5">
          <Button variant="ghost" className="flex-1"
          onClick={() => { 
            setMode("login"); 
            setNewVal(""); 
            onChangeMode({ title: "Log in", subtitle: undefined});
          }} label="Back"/>
          <Button className="flex-1" type="submit"
            onClick={() => {
            toast(isPw ? "Password updated." : "Confirmation email sent.");
            setMode("login"); setNewVal("");
            onChangeMode({ title: "Log in", subtitle: undefined});
          }} label="Save"/>
        </div>
      </form>
    )
  }

  // default return: user logging in
  // onChangeMode({ title: "Log in", subtitle: undefined});
  return (
    <form onSubmit={handleSubmit} className="py-2 px-6">
      <div className="bg-accent-primary-soft text-shadow-text-primary rounded-md text-xs font-normal tracking-[0.8px] px-3 py-2 mb-4">
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
      <Button type="submit" onClick={() => {
        // auth.login(creds.email, creds.password);
        // onSubmit({ username: creds.email, password: creds.password});
      }} label="Log in"/>
      <div className="flex justify-center gap-4.5 mt-4">
        <Button onClick={() => {
          setMode("password");
          onChangeMode({title: "Change password", subtitle: undefined});
        }} 
        variant="link" label="Change password"/>
        <Button onClick={() => {
          setMode("email");
          onChangeMode({title: "Change email", subtitle: "We'll send a confirmation link to the new address."});
        }} 
        variant="link" label="Change email"/>
      </div>
    </form>
  );
}