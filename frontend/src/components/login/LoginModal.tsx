import { useState } from 'react';
import Modal, { ModalHeader } from '../ui/Modal';
import LoginForm from './LoginForm';

/** Pop-up re: Log in button, prompts user for name/email and password */
// TODO: make styles/structure match EventDescription, the other existing modal ATM
export default function LoginModal({ onClose, accounts, onLogin, toast }) {
  const [mode, setMode] = useState("login"); // login | password | email
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const doLogin = () => {
    const acct = accounts.find((a) => a.email === creds.email && a.password === creds.password);
    if (!acct) { setErr("Email or password not recognized."); return; }
    onLogin(acct);
    toast(`Welcome back, ${acct.name}`);
    onClose();
  };

  // register new user
  if (mode !== "login") {
    const isPw = mode === "password";
    return (
      <Modal onClose={onClose} width={420}>
        <ModalHeader title={isPw ? "Change password" : "Change email"} onClose={onClose}
          subtitle={isPw ? undefined : "We'll send a confirmation link to the new address."} />
        <LoginForm 
          doLogin={doLogin}
          setErr={setErr}
          setMode={setMode}
        />
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title="Log in" onClose={onClose} />
      <LoginForm 
          doLogin={doLogin}
          setErr={setErr}
          setMode={setMode}
        />
    </Modal>
  );
}
