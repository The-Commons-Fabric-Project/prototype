/**
 * Auth modals - create account
 */ 

import { useState } from "react";
import { EMAIL_RE } from "../../types/orgs";
import Toast from "./Toast";
import Modal from "./Modal";

type CreateAccountModalProps = {
  onClose: () => void;
  onCreate: () => void;
  toast: typeof Toast;
}

export default function CreateAccountModal({ 
  onClose, onCreate, toast 
}: CreateAccountModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    org: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Organization name is required.";
    if (!EMAIL_RE.test(formData.email)) e.email = "Enter a valid email address.";
    if (formData.password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Create account" onClose={onClose}
        subtitle={step === 1 ? "Register your organization to publish events." : "Confirm your details."} />
      <form method="post" action={} name="Create account">
        
      </form>
      <div className="p-[18px_24px_24px]">
        {step === 1 ? (
          <>
            <Field label="Organization name" error={errors.name}>
              <input className={`w-full px-[11px] py-[9px] rounded-md text-sm font-sans outline-none ${errors.name ? 'border border-red-500' : 'border border-slate-300'} bg-white text-slate-900`} value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Ottawa Civic Tech" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className={`w-full px-[11px] py-[9px] rounded-md text-sm font-sans outline-none ${errors.email ? 'border border-red-500' : 'border border-slate-300'} bg-white text-slate-900`} value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@org.example" />
            </Field>
            <Field label="Password" error={errors.password}>
              <input type="password" className={`w-full px-[11px] py-[9px] rounded-md text-sm font-sans outline-none ${errors.password ? 'border border-red-500' : 'border border-slate-300'} bg-white text-slate-900`} value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="At least 6 characters" />
            </Field>
            <Button className="w-full mt-1" onClick={() => { if (validate()) setStep(2); }}>Continue</Button>
          </>
        ) : (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-4">
              <Summary label="Organization" value={formData.name} />
              <Summary label="Email" value={formData.email} last />
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-[14px]">Is this information correct?</p>
            <div className="flex gap-2.5">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>No, edit</Button>
              <Button className="flex-1" onClick={() => {
                onCreate({ name: formData.name, email: formData.email, password: formData.password });
                toast("Account created — check your email to confirm.");
                onClose();
              }}>Yes, create</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
