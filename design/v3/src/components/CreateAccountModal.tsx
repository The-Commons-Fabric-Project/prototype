import { useState } from "react";
import { S, T } from "../tokens";
import { EMAIL_RE } from "../utils";
import { Field, ModalShell, SummaryRow } from "./ModalShell";
import type { Account } from "../types";

interface Props {
  accentColor: string;
  onClose: () => void;
  onCreate: (account: Account) => void;
}

/**
 * Two-step create-account flow: fill, then confirm. Validation runs on
 * Continue; errors color the field border #F50A1E and print below it.
 */
export function CreateAccountModal({ accentColor, onClose, onCreate }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const border = (key: string) => (errors[key] ? T.color.danger : T.color.line);

  const onContinue = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Organization name is required.";
    if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address.";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (!Object.keys(errs).length) setStep(2);
  };

  return (
    <ModalShell
      maxWidth={440}
      title="Create account"
      subtitle={step === 1 ? "Register your organization to publish events." : "Confirm your details."}
      onClose={onClose}
    >
      {step === 1 ? (
        <>
          <Field label="Organization name" error={errors.name}>
            <input value={form.name} onChange={set("name")} placeholder="e.g. Ottawa Civic Tech" style={{ ...S.input, borderColor: border("name") }} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input value={form.email} onChange={set("email")} placeholder="you@org.example" style={{ ...S.input, borderColor: border("email") }} />
          </Field>
          <Field label="Password" error={errors.password}>
            <input type="password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" style={{ ...S.input, borderColor: border("password") }} />
          </Field>
          <button onClick={onContinue} style={{ ...S.btnPrimary(accentColor), width: "100%", padding: 10 }}>
            Continue
          </button>
        </>
      ) : (
        <>
          <div style={{ background: T.color.surfaceAlt, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <SummaryRow label="Organization" value={form.name} first />
            <SummaryRow label="Email" value={form.email} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.color.ink, margin: "0 0 14px" }}>Is this information correct?</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ ...S.btnSecondary, flex: 1, color: T.color.ink, borderColor: T.color.ink, padding: 9, fontSize: 12 }}>
              No, edit
            </button>
            <button onClick={() => onCreate(form)} style={{ ...S.btnPrimary(accentColor), flex: 1, padding: 9 }}>
              Yes, create
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}
