import { useState } from 'react';
import Modal, { ModalHeader, type ModalHeaderProps } from '../overlays-feedback/Modal';
import LoginForm from './LoginForm';

/** Pop-up re: Log in button, prompts user for name/email and password */
// TODO: make styles/structure match EventDescription, the other existing modal ATM
export default function LoginModal({ 
  onClose, 
}) {
  const [header, setHeader] = useState({title: "Log in", subtitle: undefined}); // login | password | email
  
  const updateHeader = (e: Partial<ModalHeaderProps>) => { setHeader({...e}) }

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title={header.title} onClose={onClose}
        subtitle={header.subtitle} />
      <LoginForm 
        updateParent={updateHeader}
        onClose={onClose}
      />
    </Modal>
  );
}
