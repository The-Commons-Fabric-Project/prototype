import { useState } from 'react';
import Modal, { ModalHeader, type ModalHeaderProps } from './Modal';
import LoginForm from './LoginForm';
// import { useAuth } from '../../hooks/useAuth';

/** Pop-up re: Log in button, prompts user for name/email and password */
// TODO: refactor modals to be consistent
export default function LoginModal({ 
  onClose, 
}) {
  // const auth = useAuth();
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined}); // login | password | email
  // const [error, setError] = useState("");
  
  const updateHeader = (e: Partial<ModalHeaderProps>) => { 
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
