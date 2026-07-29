import { useState } from 'react';
import Modal, { ModalHeader, type ModalHeaderProps } from './Modal';
import LoginForm from './LoginForm';
import { useAuth } from '../../auth';

/** Pop-up re: Log in button, prompts user for name/email and password */
// TODO: make styles/structure match EventDescription, the other existing modal ATM
export default function LoginModal({ 
  onClose, 
}) {
  const auth = useAuth();
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined}); // login | password | email
  const [error, setError] = useState("");
  
  const updateHeader = (e: Partial<ModalHeaderProps>) => { setHeader({...e}) }

  const onSubmit = ({ username, password }: any) => {
    auth.login(username, password);
  }

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title={header.title} onClose={onClose}
        subtitle={header.subtitle} />
      <div>      
        { error ? `${error}` : ""}
      </div>
      <LoginForm 
        updateParent={updateHeader}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
