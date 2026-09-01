import { useState } from "react";
import { S, T } from "../tokens";
import { Field, ModalShell } from "./ModalShell";
import type { Account } from "../types";

interface Props {
  accentColor: string;
  accounts: Account[];
  onClose: () => void;
  onAuthenticated: (account: Account) => void;
  onToast: (message: string) => void;
}

type Mode = "login" | "password" | "email";

/**
 * Login modal, plus two secondary modes (change password / change email) that
 * replace the panel body rather than opening a second modal. The change flows
 * are UI-only in the prototype — wire them to the real endpoints.
 */
export function LoginModal({ accentColor, accounts, onClose, onAuthenticated, onToast }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [newValue, setNewValue] = useState("");

  const border = error ? T.color.danger : T.color.line;

  const submit = () => {
    const account = accounts.find((a) => a.email === creds.email && a.password === creds.password);
    if (!account) {
      setError("Email or password not recognized.");
      return;
    }
    onAuthenticated(account);
  };

  if (mode !== "login") {
    const isPassword = mode === "password";
    return (
      <ModalShell
        maxWidth={400}
        title={isPassword ? "Change password" : "Change email"}
        subtitle={isPassword ? undefined : "We'll send a confirmation link to the new address."}
        onClose={onClose}
      >
        <Field label={isPassword ? "New password" : "New email"}>
          <input
            type={isPassword ? "password" : "text"}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={isPassword ? "At least 6 characters" : "you@org.example"}
            style={S.input}
          />
        </Field>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setMode("login")} style={{ ...S.btnSecondary, flex: 1, color: T.color.ink, borderColor: T.color.ink, padding: 9, fontSize: 12 }}>
            Back
          </button>
          <button
            onClick={() => {
              onToast(isPassword ? "Password updated." : "Confirmation email sent.");
              setMode("login");
              setNewValue("");
            }}
            style={{ ...S.btnPrimary(accentColor), flex: 1, padding: 9 }}
          >
            Save
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell maxWidth={400} title="Log in" onClose={onClose}>
      {/* Prototype-only affordance — remove before shipping. */}
      <div style={{ background: T.color.surfaceAlt, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: "9px 12px", marginBottom: 16, fontSize: 11.5, color: T.color.ink }}>
        Demo hint: use <strong>hi@ottawacivictech.example</strong> / <strong>demo123</strong>
      </div>

      <Field label="Email">
        <input
          value={creds.email}
          onChange={(e) => {
            setCreds({ ...creds, email: e.target.value });
            setError("");
          }}
          placeholder="you@org.example"
          style={{ ...S.input, borderColor: border }}
        />
      </Field>
      <Field label="Password" error={error}>
        <input
          type="password"
          value={creds.password}
          onChange={(e) => {
            setCreds({ ...creds, password: e.target.value });
            setError("");
          }}
          placeholder="Your password"
          style={{ ...S.input, borderColor: border }}
        />
      </Field>

      <button onClick={submit} style={{ ...S.btnPrimary(accentColor), width: "100%", padding: 10 }}>
        Log in
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 16 }}>
        {(["password", "email"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setNewValue("");
            }}
            style={{ background: "none", border: "none", color: T.color.body, fontSize: 11.5, cursor: "pointer", textDecoration: "underline", padding: 0, fontFamily: T.font }}
          >
            {m === "password" ? "Change password" : "Change email"}
          </button>
        ))}
      </div>
    </ModalShell>
  );
}
