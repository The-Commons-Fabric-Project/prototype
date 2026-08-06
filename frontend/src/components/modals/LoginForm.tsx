import { useEffect, useState } from "react";
import Button from "../controls/Button";
import Field from "../controls/Field";
import type { TextInputVariant as InputVariant } from "../../utils/types/variants";
import type { ModalHeaderProps } from "./Modal";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useOverlayContext";

function inputStyle (err: boolean): InputVariant {
  return `${err ? "error" : "default"}`;
}

/**
 * Separate from the modal so /login can be navigated to directly.
 *
 * TODO: probably three separate forms; changing credentials may belong in a user
 * profile instead.
 */
export type LoginFormHeader = Pick<ModalHeaderProps, "title" | "subtitle">;

export type LoginFormProps = {
  onClose: () => void,
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // login rejects on a bad password so callers can react to it; this one reads
    // the outcome off `status` in the effect below, so the rejection is expected
    // and swallowed here. Without the catch it surfaces as an unhandled rejection.
    void auth.login(creds.email, creds.password).catch(() => {});
  }

  // handle when auth service successfully verifies the user
  useEffect(() => {
    // console.log("Login form effect!");
    switch (status) {
      case 'success': {
        toast(`Welcome back, ${auth.user?.fullname}`);
        onClose();
        return;
      } case 'fail': {
        // The API's own wording - "Email or password is incorrect." - rather than
        // a generic string, so a server that is down reads differently from a
        // password that is wrong.
        setErr(auth.error || "Authentication failed");
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
      {/* A seeded account from backend/prisma/seed/dev-organizations-seed.json - these
          are real credentials against a seeded dev database, not a mock. Run
          `npm run db:seed -w backend` if they do not work. */}
      <div className="bg-accent-primary-soft text-shadow-text-primary rounded-md text-xs font-normal tracking-[0.8px] px-3 py-2 mb-4">
        Demo hint: use <strong>jordan.lefebvre@ottawacivictech.example</strong> / <strong>devpassword123</strong>
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