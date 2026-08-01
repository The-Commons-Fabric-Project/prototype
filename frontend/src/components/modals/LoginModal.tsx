import { useState } from 'react';
import Modal, { ModalHeader } from './Modal';
import LoginForm, { type LoginFormHeader } from './LoginForm';
// import { useAuth } from '../../hooks/useAuth';

export type LoginModalProps = {
  onClose: () => void,
}

/** Pop-up re: Log in button, prompts user for name/email and password */
// TODO: refactor modals to be consistent
export default function LoginModal({
  onClose,
}: LoginModalProps) {
  // const auth = useAuth();
  const [header, setHeader] = useState<LoginFormHeader>({title: "Log in", subtitle: undefined}); // login | password | email
  // const [error, setError] = useState("");

  const updateHeader = (e: LoginFormHeader) => {
    setHeader({...e})
  }

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title={header.title} onClose={onClose}
        subtitle={header.subtitle} />
      <div>      
      </div>
      <LoginForm 
        onChangeMode={updateHeader}
        onClose={onClose}
      />
    </Modal>
  );
}
